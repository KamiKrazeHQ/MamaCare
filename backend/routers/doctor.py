from datetime import datetime
import hashlib
import json
import os
import re
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["Doctor"])

DOCTOR_DISCLAIMER = (
    "Educational assistant only. This is not a diagnosis, treatment plan, or prescription. "
    "If you feel unsafe, contact emergency services now."
)

DOCTOR_WHEN_TO_SEE = (
    "Seek urgent care now for trouble breathing, chest pain, heavy bleeding, "
    "severe abdominal pain, high fever, fainting, seizure, thoughts of self-harm, "
    "or decreased fetal movement."
)

DOCTOR_RED_FLAG_RULES: dict[str, list[str]] = {
    "trouble_breathing": ["trouble breathing", "can't breathe", "shortness of breath"],
    "chest_pain": ["chest pain", "pressure in chest"],
    "heavy_bleeding": ["heavy bleeding", "soaking pads", "passing large clots"],
    "severe_pain": ["severe abdominal pain", "severe pain", "worst pain"],
    "neurologic": ["seizure", "fainted", "fainting", "passed out", "confused"],
    "mental_health_crisis": ["suicidal", "want to die", "harm myself", "hurt myself"],
    "pregnancy_urgent": ["decreased fetal movement", "water broke", "preterm labor"],
}

DOCTOR_DIAGNOSIS_TERMS = [
    "diagnose",
    "diagnosis",
    "what disease",
    "do i have",
    "what condition",
    "is this cancer",
    "is it serious",
]

DOCTOR_PRESCRIBE_TERMS = [
    "prescribe",
    "prescription",
    "dosage",
    "dose",
    "mg",
    "milligram",
    "how many pills",
    "antibiotic",
    "medication should i take",
]

DOCTOR_AUDIT_LOGS: list[dict[str, Any]] = []
MAX_DOCTOR_AUDIT_LOGS = 200


class DoctorTriage(BaseModel):
    is_emergency: bool = Field(..., description="User says this is an emergency")
    is_pregnant_or_postpartum: bool = Field(..., description="User is pregnant or postpartum")
    has_severe_symptoms: bool = Field(..., description="User reports severe symptoms right now")


class DoctorChatRequest(BaseModel):
    message: str = Field(..., min_length=2, max_length=1200)
    triage: DoctorTriage


def _contains_any(text: str, keywords: list[str]) -> bool:
    return any(keyword in text for keyword in keywords)


def _doctor_red_flags(message: str, triage: DoctorTriage) -> list[str]:
    flags: set[str] = set()
    text = message.lower()

    if triage.is_emergency:
        flags.add("intake_emergency")
    if triage.has_severe_symptoms:
        flags.add("intake_severe_symptoms")

    for label, keywords in DOCTOR_RED_FLAG_RULES.items():
        if _contains_any(text, keywords):
            flags.add(label)
    return sorted(flags)


def _doctor_policy_flags(message: str) -> list[str]:
    text = re.sub(r"\s+", " ", message.lower()).strip()
    flags: set[str] = set()
    if _contains_any(text, DOCTOR_DIAGNOSIS_TERMS):
        flags.add("diagnosis_request")
    if _contains_any(text, DOCTOR_PRESCRIBE_TERMS):
        flags.add("prescription_or_dosage_request")
    return sorted(flags)


def _doctor_audit_log(message: str, triage: DoctorTriage, action: str, flags: list[str]) -> None:
    digest = hashlib.sha256(message.strip().lower().encode("utf-8")).hexdigest()[:16]
    DOCTOR_AUDIT_LOGS.append(
        {
            "timestamp": datetime.utcnow().isoformat(),
            "message_hash": digest,
            "message_length": len(message),
            "action": action,
            "flags": flags,
            "triage": triage.model_dump(),
        }
    )
    if len(DOCTOR_AUDIT_LOGS) > MAX_DOCTOR_AUDIT_LOGS:
        del DOCTOR_AUDIT_LOGS[: len(DOCTOR_AUDIT_LOGS) - MAX_DOCTOR_AUDIT_LOGS]


def _fallback_doctor_answer() -> str:
    return (
        "I can share general pregnancy health education. "
        "For personal diagnosis, treatment, or medication decisions, please speak to a licensed clinician."
    )


def _llm_doctor_answer(message: str, triage: DoctorTriage) -> str:
    api_key = (
        os.getenv("OPENROUTER_API_KEY", "").strip()
        or os.getenv("OPENAI_API_KEY", "").strip()
    )
    if not api_key:
        return _fallback_doctor_answer()

    model = (
        os.getenv("OPENROUTER_MODEL", "").strip()
        or os.getenv("OPENAI_MODEL", "").strip()
        or "openai/gpt-4o-mini"
    )
    app_url = os.getenv("OPENROUTER_APP_URL", "http://localhost:5173").strip()
    app_name = os.getenv("OPENROUTER_APP_NAME", "forHer").strip()
    system_prompt = (
        "You are an educational women's health assistant for pregnancy/postpartum users. "
        "Rules: no diagnosis, no treatment plans, no prescribing, no dosage advice. "
        "Use short plain language (<=120 words). "
        "Provide only general education and add one short 'when to contact a doctor' line."
    )
    user_prompt = (
        f"Triage: emergency={triage.is_emergency}, pregnant_or_postpartum={triage.is_pregnant_or_postpartum}, "
        f"severe_symptoms={triage.has_severe_symptoms}\n"
        f"Question: {message}"
    )
    payload = {
        "model": model,
        "temperature": 0.2,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }

    request = Request(
        url="https://openrouter.ai/api/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "HTTP-Referer": app_url,
            "X-Title": app_name,
        },
    )
    try:
        with urlopen(request, timeout=60) as response:
            raw = response.read().decode("utf-8")
            parsed = json.loads(raw) if raw else {}
            answer = (
                parsed.get("choices", [{}])[0]
                .get("message", {})
                .get("content", "")
                .strip()
            )
            return answer or _fallback_doctor_answer()
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(
            status_code=502,
            detail=f"OpenRouter request failed ({exc.code}): {detail}",
        ) from exc
    except URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"OpenRouter request failed: {exc}",
        ) from exc


@router.post("/doctor/chat")
def doctor_chat(payload: DoctorChatRequest):
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    red_flags = _doctor_red_flags(message, payload.triage)
    if red_flags:
        _doctor_audit_log(message, payload.triage, "escalated", red_flags)
        return {
            "answer": (
                "Based on what you shared, please seek in-person care now. "
                "If this is urgent or life-threatening, call 911 or go to the ER."
            ),
            "escalate_now": True,
            "risk_flags": red_flags,
            "when_to_see_doctor": DOCTOR_WHEN_TO_SEE,
            "disclaimer": DOCTOR_DISCLAIMER,
            "timestamp": datetime.utcnow().isoformat(),
        }

    policy_flags = _doctor_policy_flags(message)
    if policy_flags:
        _doctor_audit_log(message, payload.triage, "refused", policy_flags)
        return {
            "answer": (
                "I can only provide general health education and safety guidance. "
                "I cannot diagnose conditions, prescribe medication, or give dosing instructions. "
                "Please contact your clinician for personalized medical advice."
            ),
            "escalate_now": False,
            "risk_flags": policy_flags,
            "when_to_see_doctor": DOCTOR_WHEN_TO_SEE,
            "disclaimer": DOCTOR_DISCLAIMER,
            "timestamp": datetime.utcnow().isoformat(),
        }

    answer = _llm_doctor_answer(message, payload.triage)
    _doctor_audit_log(message, payload.triage, "answered", [])
    return {
        "answer": answer,
        "escalate_now": False,
        "risk_flags": [],
        "when_to_see_doctor": DOCTOR_WHEN_TO_SEE,
        "disclaimer": DOCTOR_DISCLAIMER,
        "timestamp": datetime.utcnow().isoformat(),
    }
