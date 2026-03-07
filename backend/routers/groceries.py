# routers/groceries.py
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

router = APIRouter(prefix="/api", tags=["Groceries & Foods"])


# ── Olostep helpers (shared with jobs but self-contained here) ─────────────────

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


# ── Constants ──────────────────────────────────────────────────────────────────

PRENATAL_BENEFIT_MAP = {
    "spinach": "Iron & Folate",
    "kale": "Iron & Calcium",
    "blueberr": "Antioxidants",
    "salmon": "Omega-3 & Protein",
    "avocado": "Healthy Fats & Folate",
    "greek yogurt": "Calcium & Protein",
    "yogurt": "Calcium & Probiotics",
    "lentil": "Iron & Fiber",
    "egg": "Choline & Protein",
    "sweet potato": "Beta-Carotene & Vitamin A",
    "almond": "Vitamin E & Magnesium",
    "walnut": "Omega-3 Fatty Acids",
    "chia": "Omega-3 & Fiber",
    "ginger": "Nausea Relief",
    "chamomile": "Relaxation & Sleep",
    "prenatal": "Complete Prenatal Nutrition",
    "folic": "Neural Tube Support",
    "iron": "Iron Supplementation",
    "dha": "Brain Development",
    "quinoa": "Complete Protein",
    "oat": "Fiber & Iron",
}

CATEGORY_EMOJIS = {
    "Produce": "P",
    "Dairy": "D",
    "Protein": "R",
    "Seafood": "S",
    "Pantry": "Y",
    "Supplements": "V",
    "Beverages": "B",
    "Snacks": "N",
    "Frozen": "F",
    "Bakery": "K",
    "Other": "G",
}

DEFAULT_GROCERY_SEARCHES = [
    "organic spinach prenatal",
    "prenatal vitamins dha",
    "wild salmon fresh",
    "organic blueberries",
    "greek yogurt full fat",
    "avocado organic",
    "free range eggs",
    "sweet potato organic",
    "almond butter natural",
    "chamomile tea caffeine free",
]

DEFAULT_FOOD_SEARCHES = [
    "healthy breakfast for pregnancy",
    "high protein snacks",
    "prenatal meal prep",
    "whole grain lunch options",
    "low mercury seafood",
    "iron rich foods",
    "folate rich foods",
    "calcium rich foods",
]

MEAL_TYPE_KEYWORDS = {
    "Breakfast": ["breakfast", "oat", "cereal", "yogurt", "egg"],
    "Lunch": ["lunch", "sandwich", "salad", "wrap", "quinoa"],
    "Dinner": ["dinner", "salmon", "chicken", "rice", "pasta"],
    "Snack": ["snack", "bar", "nuts", "crackers", "fruit"],
    "Drink": ["tea", "milk", "juice", "smoothie", "water"],
}


# ── Helpers ────────────────────────────────────────────────────────────────────

def _run_grocery_olostep(
    api_key: str,
    search_queries: list[str],
    max_items: int,
    near_location: str = "Chicago, IL",
) -> list[dict]:
    query_text = ", ".join(search_queries)
    schema = {
        "groceries": [
            {
                "name": "string",
                "price": "string",
                "unit_size": "string",
                "category": "string",
                "store": "string",
                "image_url": "string",
                "rating": "number",
                "description": "string",
                "brand": "string",
            }
        ]
    }
    payload = {
        "model": "search-1",
        "task": (
            "Find grocery products sold in the United States that match these searches: "
            f"{query_text}. Prioritize stores and listings near {near_location}. "
            f"Return up to {max_items} products with name, price, unit_size, "
            "category, store, image_url, rating, description, and brand."
        ),
        "json_format": schema,
        "json": schema,
    }
    result = _olostep_post("answers", payload, api_key)
    return _extract_olostep_json_content(result, "groceries")[:max_items]


def clean_grocery(raw: dict, index: int) -> dict:
    name = str(raw.get("name") or raw.get("product_name") or "Unknown Item")
    price = raw.get("price") or raw.get("current_price") or "N/A"
    unit = str(raw.get("unit_size") or raw.get("weight") or "")
    category = str(raw.get("category") or raw.get("department") or "Other")
    store = str(raw.get("store") or raw.get("retailer") or "Instacart")
    image = str(raw.get("image_url") or raw.get("thumbnail") or "")
    rating = raw.get("rating") or raw.get("average_rating") or 0.0

    name_lower = name.lower()
    benefit = "Nutritious Choice"
    for keyword, ben in PRENATAL_BENEFIT_MAP.items():
        if keyword in name_lower:
            benefit = ben
            break

    if isinstance(price, (int, float)):
        formatted_price = f"${price:.2f}"
    else:
        formatted_price = str(price)
        if formatted_price != "N/A" and not formatted_price.startswith("$"):
            formatted_price = f"${formatted_price}"

    emoji = CATEGORY_EMOJIS["Other"]
    for cat_key, em in CATEGORY_EMOJIS.items():
        if cat_key.lower() in category.lower():
            emoji = em
            break

    try:
        parsed_rating = round(float(rating), 1) if rating else 4.5
    except (TypeError, ValueError):
        parsed_rating = 4.5

    return {
        "id": index + 1,
        "name": name,
        "category": category,
        "price": formatted_price,
        "unit": unit,
        "benefit": benefit,
        "emoji": emoji,
        "store": store,
        "rating": parsed_rating,
        "image": image,
        "scraped_at": datetime.utcnow().isoformat(),
    }


def clean_food(raw: dict, index: int) -> dict:
    name = str(raw.get("name") or raw.get("product_name") or "Unknown Food")
    category = str(raw.get("category") or raw.get("department") or "Other")
    store = str(raw.get("store") or raw.get("retailer") or "Instacart")
    unit = str(raw.get("unit_size") or raw.get("weight") or "")
    description = str(raw.get("description") or raw.get("brand") or "")
    rating_raw = raw.get("rating") or raw.get("average_rating") or 0.0
    price_raw = raw.get("price") or raw.get("current_price") or "N/A"

    if isinstance(price_raw, (int, float)):
        price = f"${price_raw:.2f}"
    else:
        price = str(price_raw)
        if price and price != "N/A" and not price.startswith("$"):
            price = f"${price}"

    name_lower = name.lower()
    meal_type = "Any"
    for label, keywords in MEAL_TYPE_KEYWORDS.items():
        if any(keyword in name_lower for keyword in keywords):
            meal_type = label
            break

    benefit = "Balanced Nutrition"
    for keyword, ben in PRENATAL_BENEFIT_MAP.items():
        if keyword in name_lower:
            benefit = ben
            break

    emoji = CATEGORY_EMOJIS["Other"]
    for cat_key, em in CATEGORY_EMOJIS.items():
        if cat_key.lower() in category.lower():
            emoji = em
            break

    # ── bug fix: was floating outside the function in app.py ──
    try:
        parsed_rating = round(float(rating_raw), 1) if rating_raw else 4.5
    except (TypeError, ValueError):
        parsed_rating = 4.5

    return {
        "id": index + 1,
        "name": name,
        "category": category,
        "meal_type": meal_type,
        "price": price or "N/A",
        "unit": unit,
        "benefit": benefit,
        "store": store,
        "rating": parsed_rating,
        "description": description,
        "emoji": emoji,
        "scraped_at": datetime.utcnow().isoformat(),
    }


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.get("/groceries")
def get_groceries(
    keyword: Optional[str] = Query(default=None, description="Optional search keyword"),
    category: Optional[str] = Query(default=None, description="Filter by category e.g. Produce"),
    max_items: int = Query(default=24, ge=1, le=100),
):
    api_key = get_olostep_api_key()
    near_location = os.getenv("GROCERY_NEAR_LOCATION", "Chicago, IL").strip() or "Chicago, IL"
    searches = [keyword.strip()] if keyword and keyword.strip() else DEFAULT_GROCERY_SEARCHES[:5]
    raw_items = _run_grocery_olostep(api_key, searches, max_items, near_location=near_location)
    cleaned = [clean_grocery(item, i) for i, item in enumerate(raw_items)]

    if category:
        cleaned = [item for item in cleaned if category.lower() in item["category"].lower()]

    return {
        "count": len(cleaned),
        "keyword": keyword or "",
        "groceries": cleaned,
        "source": "Olostep answers/search-1",
        "fetched_at": datetime.utcnow().isoformat(),
    }


@router.get("/foods")
def get_foods(
    keyword: str = Query(default="healthy pregnancy foods", description="Food search keyword"),
    max_items: int = Query(default=24, ge=1, le=100),
    meal_type: Optional[str] = Query(default=None, description="Optional filter e.g. Breakfast, Snack"),
):
    api_key = get_olostep_api_key()
    near_location = os.getenv("GROCERY_NEAR_LOCATION", "Chicago, IL").strip() or "Chicago, IL"
    searches = [keyword.strip()] if keyword.strip() else DEFAULT_FOOD_SEARCHES[:5]
    raw_items = _run_grocery_olostep(api_key, searches, max_items, near_location=near_location)
    cleaned = [clean_food(item, i) for i, item in enumerate(raw_items)]

    if meal_type:
        cleaned = [item for item in cleaned if item["meal_type"].lower() == meal_type.lower()]

    return {
        "count": len(cleaned),
        "keyword": keyword,
        "foods": cleaned,
        "source": "Olostep answers/search-1",
        "fetched_at": datetime.utcnow().isoformat(),
    }