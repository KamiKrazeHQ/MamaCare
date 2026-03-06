"""
forHER Backend — FastAPI + Apify Integration
============================================
Run:
    pip install fastapi uvicorn apify-client python-dotenv
    uvicorn app:app --reload --port 8000

Endpoints:
    GET /api/jobs       → Scraped remote/flexible jobs from Google Jobs via Apify
    GET /api/groceries  → Prenatal grocery essentials scraped via Apify
    GET /api/health     → Health check
"""

import os
import json
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from apify_client import ApifyClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="forHER API",
    description="Backend for the forHER pregnancy support platform",
    version="1.0.0",
)

# ── CORS — allow React dev server ──────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── APIFY CLIENT ───────────────────────────────────────────────────────────
APIFY_TOKEN = os.getenv("APIFY_API_TOKEN", "")   # Set in your .env file

def get_apify_client() -> ApifyClient:
    if not APIFY_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="APIFY_API_TOKEN not set. Add it to your .env file.",
        )
    return ApifyClient(APIFY_TOKEN)


# ── JOB DATA CLEANER ───────────────────────────────────────────────────────
MOTHER_FRIENDLY_KEYWORDS = [
    "remote", "flexible", "part-time", "part time", "work from home",
    "async", "asynchronous", "family", "maternity", "parental",
    "contract", "freelance", "home-based",
]

def clean_job(raw: dict, index: int) -> dict:
    """
    Normalise a raw Google Jobs Apify result into a clean card-ready dict.
    Filters to surface only mother-friendly attributes.
    """
    title       = raw.get("title") or raw.get("job_title", "Untitled Role")
    company     = raw.get("company_name") or raw.get("employer", "Unknown Company")
    location    = raw.get("location") or raw.get("job_location", "Remote")
    description = raw.get("description") or raw.get("job_description", "")
    salary      = raw.get("salary") or raw.get("salary_range", "Competitive")
    posted_at   = raw.get("posted_at") or raw.get("date_posted", "Recently")
    apply_link  = raw.get("apply_link") or raw.get("job_url", "#")

    # Determine job type from title/description
    job_type = "Full-time"
    desc_lower = description.lower()
    if "part-time" in desc_lower or "part time" in desc_lower:
        job_type = "Part-time"
    elif "contract" in desc_lower:
        job_type = "Contract"
    elif "freelance" in desc_lower:
        job_type = "Freelance"

    # Build mother-friendly tags from description & title
    tags = []
    combined = f"{title} {description} {location}".lower()
    tag_map = {
        "Remote":         ["remote", "work from home", "wfh"],
        "Flexible Hours": ["flexible", "your own schedule", "set your hours"],
        "Part-time":      ["part-time", "part time"],
        "Async":          ["async", "asynchronous"],
        "Family Leave":   ["maternity", "parental leave", "family leave"],
        "Contract":       ["contract"],
        "Freelance":      ["freelance"],
    }
    for tag, keywords in tag_map.items():
        if any(kw in combined for kw in keywords):
            tags.append(tag)

    # Truncate description to 200 chars for the card
    short_desc = (description[:200] + "…") if len(description) > 200 else description

    return {
        "id":          index + 1,
        "title":       title,
        "company":     company,
        "location":    location,
        "description": short_desc,
        "salary":      salary if salary else "Competitive",
        "type":        job_type,
        "tags":        tags if tags else ["Remote"],
        "posted":      _humanise_date(posted_at),
        "apply_link":  apply_link,
        "logo":        "💼",   # Replace with company logo URL if Apify returns one
        "scraped_at":  datetime.utcnow().isoformat(),
    }


def _humanise_date(raw_date: str) -> str:
    """Convert ISO date string to 'X days ago' style."""
    if not raw_date or raw_date == "Recently":
        return "Recently"
    try:
        posted = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
        delta  = datetime.utcnow() - posted.replace(tzinfo=None)
        days   = delta.days
        if days == 0:
            return "Today"
        elif days == 1:
            return "Yesterday"
        else:
            return f"{days} days ago"
    except Exception:
        return raw_date


# ── GROCERY DATA CLEANER ───────────────────────────────────────────────────
PRENATAL_BENEFIT_MAP = {
    "spinach":       "Iron & Folate",
    "kale":          "Iron & Calcium",
    "blueberr":      "Antioxidants",
    "salmon":        "Omega-3 & Protein",
    "avocado":       "Healthy Fats & Folate",
    "greek yogurt":  "Calcium & Protein",
    "yogurt":        "Calcium & Probiotics",
    "lentil":        "Iron & Fiber",
    "egg":           "Choline & Protein",
    "sweet potato":  "Beta-Carotene & Vitamin A",
    "almond":        "Vitamin E & Magnesium",
    "walnut":        "Omega-3 Fatty Acids",
    "chia":          "Omega-3 & Fiber",
    "ginger":        "Nausea Relief",
    "chamomile":     "Relaxation & Sleep",
    "prenatal":      "Complete Prenatal Nutrition",
    "folic":         "Neural Tube Support",
    "iron":          "Iron Supplementation",
    "dha":           "Brain Development",
    "quinoa":        "Complete Protein",
    "oat":           "Fiber & Iron",
}

CATEGORY_EMOJIS = {
    "Produce":      "🥦",
    "Dairy":        "🥛",
    "Protein":      "🥩",
    "Seafood":      "🐟",
    "Pantry":       "🫙",
    "Supplements":  "💊",
    "Beverages":    "🍵",
    "Snacks":       "🥜",
    "Frozen":       "❄️",
    "Bakery":       "🍞",
    "Other":        "🛒",
}

def clean_grocery(raw: dict, index: int) -> dict:
    """
    Normalise a raw Instacart/grocery scraper result into a clean item dict.
    Attaches prenatal benefit labels.
    """
    name     = raw.get("name") or raw.get("product_name", "Unknown Item")
    price    = raw.get("price") or raw.get("current_price", "N/A")
    unit     = raw.get("unit_size") or raw.get("weight", "")
    category = raw.get("category") or raw.get("department", "Other")
    store    = raw.get("store") or raw.get("retailer", "Instacart")
    image    = raw.get("image_url") or raw.get("thumbnail", "")
    rating   = raw.get("rating") or raw.get("average_rating", 0.0)

    # Match prenatal benefit
    name_lower = name.lower()
    benefit = "Nutritious Choice"
    for keyword, ben in PRENATAL_BENEFIT_MAP.items():
        if keyword in name_lower:
            benefit = ben
            break

    # Format price
    if isinstance(price, (int, float)):
        price = f"${price:.2f}"
    elif not str(price).startswith("$"):
        price = f"${price}"

    # Map category to emoji
    emoji = "🛒"
    for cat_key, em in CATEGORY_EMOJIS.items():
        if cat_key.lower() in category.lower():
            emoji = em
            break

    return {
        "id":         index + 1,
        "name":       name,
        "category":   category,
        "price":      price,
        "unit":       unit,
        "benefit":    benefit,
        "emoji":      emoji,
        "store":      store,
        "rating":     round(float(rating), 1) if rating else 4.5,
        "image":      image,
        "scraped_at": datetime.utcnow().isoformat(),
    }


# ── ROUTES ─────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "forHER API is running 💜", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/jobs")
def get_jobs(
    keyword: str = Query(default="remote flexible jobs for mothers", description="Job search keyword"),
    max_items: int = Query(default=20, ge=1, le=100, description="Max jobs to return"),
    filter_tag: Optional[str] = Query(default=None, description="Filter by tag e.g. Remote, Part-time"),
):
    """
    Triggers Apify's Google Jobs Scraper and returns cleaned, mother-friendly job listings.

    Apify actor: `apify/google-jobs-scraper`
    Docs: https://apify.com/apify/google-jobs-scraper
    """
    client = get_apify_client()

    run_input = {
        "queries":      [keyword],
        "maxJobsPerQuery": max_items,
        "countryCode":  "US",
        "languageCode": "en",
        "datePosted":   "week",   # Jobs posted in the last week
    }

    # Run the Apify actor and wait for it to finish
    run = client.actor("apify/google-jobs-scraper").call(run_input=run_input)
    dataset_id = run["defaultDatasetId"]

    # Fetch all results from the dataset
    raw_items = list(client.dataset(dataset_id).iterate_items())

    # Clean & filter
    cleaned = [clean_job(item, i) for i, item in enumerate(raw_items)]

    # Optional tag filter
    if filter_tag:
        cleaned = [j for j in cleaned if filter_tag in j["tags"]]

    return {
        "count":    len(cleaned),
        "keyword":  keyword,
        "jobs":     cleaned,
        "source":   "Apify Google Jobs Scraper",
        "fetched_at": datetime.utcnow().isoformat(),
    }


@app.get("/api/groceries")
def get_groceries(
    category: Optional[str] = Query(default=None, description="Filter by category e.g. Produce"),
    max_items: int = Query(default=24, ge=1, le=100),
):
    """
    Triggers Apify's Instacart scraper for prenatal grocery essentials.

    Apify actor: `epctex/instacart-scraper`
    Docs: https://apify.com/epctex/instacart-scraper

    The search terms focus on prenatal nutrition essentials.
    """
    client = get_apify_client()

    # Prenatal essentials search terms
    prenatal_searches = [
        "organic spinach prenatal",
        "prenatal vitamins DHA",
        "wild salmon fresh",
        "organic blueberries",
        "greek yogurt full fat",
        "avocado organic",
        "free range eggs",
        "sweet potato organic",
        "almond butter natural",
        "chamomile tea caffeine free",
    ]

    run_input = {
        "searchQueries": prenatal_searches[:5],   # Keep cost low; expand as needed
        "maxResults":    max_items,
        "includeReviews": False,
    }

    run = client.actor("epctex/instacart-scraper").call(run_input=run_input)
    dataset_id = run["defaultDatasetId"]

    raw_items = list(client.dataset(dataset_id).iterate_items())
    cleaned   = [clean_grocery(item, i) for i, item in enumerate(raw_items)]

    if category:
        cleaned = [g for g in cleaned if category.lower() in g["category"].lower()]

    return {
        "count":      len(cleaned),
        "groceries":  cleaned,
        "source":     "Apify Instacart Scraper",
        "fetched_at": datetime.utcnow().isoformat(),
    }


# ── ENTRY POINT ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)