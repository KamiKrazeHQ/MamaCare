# routers/jobs.py
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

router = APIRouter(prefix="/api", tags=["Jobs"])


# ── Olostep helpers ────────────────────────────────────────────────────────────

def get_olostep_api_key() -> str:
    token = (
        os.getenv("OLOSTEP_API_KEY", "").strip()
        or os.getenv("OLASTEP_API_KEY", "").strip()
    )
    if not token:
        raise HTTPException(
            status_code=503,
            detail="OLOSTEP_API_KEY not set. Add it to your .env file.",
        )
    return token


def _olostep_post(path: str, payload: dict, api_key: str) -> dict:
    base_url = os.getenv("OLOSTEP_BASE_URL", "https://api.olostep.com/v1").rstrip("/")
    url = f"{base_url}/{path.lstrip('/')}"
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        url=url,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urlopen(request, timeout=90) as response:
            response_body = response.read().decode("utf-8")
            return json.loads(response_body) if response_body else {}
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(
            status_code=502,
            detail=f"Olostep request failed ({exc.code}): {detail}",
        ) from exc
    except URLError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Olostep request failed: {exc}",
        ) from exc


def _extract_olostep_json_content(result: dict, key: str) -> list[dict]:
    payload = result
    if isinstance(result.get("result"), dict):
        payload = result["result"]

    content = payload.get("json_content") or payload.get("json")
    parsed = None
    if isinstance(content, str):
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            parsed = None
    elif isinstance(content, dict):
        parsed = content

    if isinstance(parsed, dict) and isinstance(parsed.get(key), list):
        return [item for item in parsed[key] if isinstance(item, dict)]
    if isinstance(payload.get(key), list):
        return [item for item in payload[key] if isinstance(item, dict)]
    return []


def _humanise_date(raw_date: str) -> str:
    """Convert ISO date string to 'X days ago' style."""
    if not raw_date or raw_date == "Recently":
        return "Recently"
    try:
        posted = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
        delta = datetime.utcnow() - posted.replace(tzinfo=None)
        days = delta.days
        if days == 0:
            return "Today"
        if days == 1:
            return "Yesterday"
        return f"{days} days ago"
    except Exception:
        return raw_date


# ── Job constants ──────────────────────────────────────────────────────────────

MOTHER_FRIENDLY_KEYWORDS = [
    "remote",
    "flexible",
    "part-time",
    "part time",
    "work from home",
    "async",
    "asynchronous",
    "family",
    "maternity",
    "parental",
    "contract",
    "freelance",
    "home-based",
]


# ── Job helpers ────────────────────────────────────────────────────────────────

def clean_job(raw: dict, index: int) -> dict:
    title = (
        raw.get("title")
        or raw.get("job_title")
        or raw.get("positionName")
        or raw.get("position")
        or "Untitled Role"
    )
    company = (
        raw.get("company_name")
        or raw.get("companyName")
        or raw.get("employer")
        or "Unknown Company"
    )
    location = (
        raw.get("location")
        or raw.get("job_location")
        or raw.get("locationsText")
        or "Remote"
    )
    description = str(raw.get("description") or raw.get("job_description") or "")
    salary = raw.get("salary") or raw.get("salary_range") or raw.get("salaryText") or "Competitive"
    posted_at = raw.get("posted_at") or raw.get("date_posted") or raw.get("postedAt") or "Recently"
    apply_link = (
        raw.get("apply_link")
        or raw.get("job_url")
        or raw.get("jobUrl")
        or raw.get("url")
        or "#"
    )

    title = str(title or "Untitled Role")
    company = str(company or "Unknown Company")
    location = str(location or "Remote")

    job_type = "Full-time"
    desc_lower = description.lower()
    if "part-time" in desc_lower or "part time" in desc_lower:
        job_type = "Part-time"
    elif "contract" in desc_lower:
        job_type = "Contract"
    elif "freelance" in desc_lower:
        job_type = "Freelance"

    tags = []
    combined = f"{title} {description} {location}".lower()
    tag_map = {
        "Remote": ["remote", "work from home", "wfh"],
        "Flexible Hours": ["flexible", "your own schedule", "set your hours"],
        "Part-time": ["part-time", "part time"],
        "Async": ["async", "asynchronous"],
        "Family Leave": ["maternity", "parental leave", "family leave"],
        "Contract": ["contract"],
        "Freelance": ["freelance"],
    }
    for tag, keywords in tag_map.items():
        if any(kw in combined for kw in keywords):
            tags.append(tag)

    short_desc = (description[:200] + "...") if len(description) > 200 else description

    return {
        "id": index + 1,
        "title": title,
        "company": company,
        "location": location,
        "description": short_desc,
        "salary": salary if salary else "Competitive",
        "type": job_type,
        "tags": tags if tags else ["Remote"],
        "posted": _humanise_date(str(posted_at)),
        "apply_link": apply_link,
        "logo": "JOB",
        "scraped_at": datetime.utcnow().isoformat(),
    }


def _run_jobs_olostep(api_key: str, keyword: str, max_items: int) -> tuple[list[dict], str]:
    schema = {
        "jobs": [
            {
                "title": "string",
                "company_name": "string",
                "location": "string",
                "description": "string",
                "salary": "string",
                "posted_at": "string",
                "apply_link": "string",
                "job_type": "string",
            }
        ]
    }
    payload = {
        "model": "search-1",
        "task": (
            "Find recent United States job listings for this query: "
            f"'{keyword}'. Return up to {max_items} jobs with title, company_name, "
            "location, description, salary, posted_at, apply_link, and job_type."
        ),
        "json_format": schema,
        "json": schema,
    }
    result = _olostep_post("answers", payload, api_key)
    jobs = _extract_olostep_json_content(result, "jobs")[:max_items]
    return jobs, "Olostep answers/search-1"


# ── Route ──────────────────────────────────────────────────────────────────────

@router.get("/jobs")
def get_jobs(
    keyword: str = Query(default="remote flexible jobs for mothers", description="Job search keyword"),
    max_items: int = Query(default=20, ge=1, le=100, description="Max jobs to return"),
    filter_tag: Optional[str] = Query(default=None, description="Filter by tag e.g. Remote, Part-time"),
):
    api_key = get_olostep_api_key()
    raw_items, actor_used = _run_jobs_olostep(api_key, keyword, max_items)
    cleaned = [clean_job(item, i) for i, item in enumerate(raw_items)]

    if filter_tag:
        cleaned = [job for job in cleaned if filter_tag in job["tags"]]

    return {
        "count": len(cleaned),
        "keyword": keyword,
        "jobs": cleaned,
        "source": actor_used,
        "fetched_at": datetime.utcnow().isoformat(),
    }