# forHER 🌸

> A full-stack web and mobile platform built to support mothers at every stage of their pregnancy journey.

**Live Web App:** https://forher-h9r13n8of-kamikrazehqs-projects.vercel.app  
**Live API + Docs:** https://forher-production.up.railway.app/docs  
**Mobile:** Run `npx expo start` inside `/mobile` and scan the QR code with Expo Go

---

## ⚡ Quickstart

```bash
# 1. Clone the repo
git clone https://github.com/KamiKrazeHQ/forHer.git
cd forHer

# 2. Set up the backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in your keys
uvicorn main:app --reload --port 8000

# 3. Set up the web frontend (new terminal)
cd frontend
npm install
cp .env.example .env            # Fill in your API URL
npm run dev

# 4. Set up the mobile app (new terminal)
cd mobile
npm install
npx expo start
```

### `.env.example` (backend)
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
DYNAMODB_TABLE_APPOINTMENTS=appointments
DYNAMODB_TABLE_MESSAGES=messages
OLOSTEP_API_KEY=your_olostep_key
GROCERY_NEAR_LOCATION=Chicago, IL
OPENAI_API_KEY=your_openai_key
```

### `.env.example` (frontend + mobile)
```
VITE_API_URL=http://localhost:8000
```

---

## 📖 Project Overview

### What It Does

forHER gives expecting and new mothers a single platform to manage the chaos of pregnancy:

| Feature | Description |
|---|---|
| 💬 **Mother Chat** | Real-time community rooms organized by trimester — messages appear instantly for all connected mothers |
| 📅 **Appointment Calendar** | Book, reschedule, and cancel prenatal appointments — all saved to the cloud |
| 💼 **Job Board** | Real-time feed of remote, flexible, and family-friendly jobs scraped live from the web |
| 🛒 **Prenatal Groceries** | Smart grocery finder with prenatal benefit labels (Iron & Folate, DHA, Omega-3, etc.) |
| 👩‍⚕️ **Doctor Finder** | Specialist directory with direct booking integration and prenatal care tips |
| 📱 **Mobile App** | Full Android companion app (6 screens) connected to the same live backend |

### Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, Uvicorn |
| Database | AWS DynamoDB (NoSQL) |
| Real-time | WebSockets (native FastAPI) |
| Web Frontend | React, Vite, JSX |
| Mobile | Expo (React Native) |
| Scraping | Olostep API |
| Backend Hosting | Railway (Dockerfile) |
| Frontend Hosting | Vercel |

### Dependencies

**Backend (`requirements.txt`)**
- `fastapi` — web framework
- `uvicorn` — ASGI server
- `boto3` — AWS SDK for DynamoDB
- `python-dotenv` — environment variable loader
- `mangum` — AWS Lambda adapter
- `websockets` — WebSocket support
- `pydantic` — request validation

**Frontend / Mobile**
- `react`, `vite` — web app
- `expo`, `react-native` — mobile app
- `@react-navigation/native`, `@react-navigation/bottom-tabs` — mobile navigation
- `react-native-screens`, `react-native-safe-area-context` — mobile layout

---

## 🏗 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│                                                         │
│   ┌──────────────────┐      ┌──────────────────┐        │
│   │   Web App        │      │   Mobile App     │        │
│   │   React + Vite   │      │   Expo (RN)      │        │
│   │   Vercel         │      │   Expo Go        │        │
│   └────────┬─────────┘      └────────┬─────────┘        │
└────────────┼────────────────────────┼─────────────────-─┘
             │ HTTP (REST)            │ HTTP (REST)
             │ WebSocket              │ WebSocket
             ▼                        ▼
┌─────────────────────────────────────────────────────────┐
│                     BACKEND LAYER                       │
│                                                         │
│              FastAPI (Python) — Railway                 │
│                                                         │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│   │ calendar │ │  chat    │ │   jobs   │ │groceries │  │
│   │  router  │ │  router  │ │  router  │ │  router  │  │
│   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└────────┼────────────┼────────────┼─────────────┼───────-┘
         │            │            │             │
         ▼            ▼            ▼             ▼
┌─────────────┐  ┌─────────┐  ┌──────────────────────┐
│   AWS       │  │   AWS   │  │    Olostep API        │
│  DynamoDB   │  │DynamoDB │  │  (job + grocery       │
│appointments │  │messages │  │   scraping)           │
└─────────────┘  └─────────┘  └──────────────────────┘
```

---

## 🛠 Decision Log

- **FastAPI over Express** — Python's boto3 SDK gives native AWS access from one backend; tradeoff is higher cold start latency than Node.js
- **DynamoDB over SQL** — No database server to manage, free on AWS free tier, scales automatically; tradeoff is no relational joins across tables
- **WebSockets over polling** — Zero-latency real-time chat without page refresh; tradeoff is connections reset on server restart, mitigated by auto-reconnect
- **Monorepo over multiple repos** — Single PR workflow and one place for judges to review all layers; tradeoff is merge conflicts span backend, web, and mobile simultaneously
- **Railway over AWS App Runner** — App Runner required a paid tier we didn't have; Railway deployed our Dockerfile in under 3 minutes; tradeoff is backend lives outside AWS
- **Expo over Flutter** — Reused existing React/JSX knowledge, no new language required under time pressure; tradeoff is Expo Go SDK version conflicts cost ~45 minutes of setup
- **Olostep API over custom scraper** — Returns structured JSON from natural language queries in one API call; tradeoff is 5–15 second response latency and rate limits on free tier
- **Vercel over S3 + CloudFront** — Zero-config React deployment with instant preview URLs; tradeoff is not fully AWS-native, loses points on all-AWS stack judging criteria
- **One backend for web + mobile** — No duplicated logic; both platforms hit the same Railway API; tradeoff is a backend change breaks both simultaneously
- **Direct commits to `test` during crunch** — Eliminated PR review overhead in final sprint; tradeoff is messy git history and multiple forced merges

---

## ⚠️ Risk Log

| Issue | Impact | How We Caught It | Fix Applied |
|---|---|---|---|
| AWS credentials committed to GitHub in an early push | High — GitHub's secret scanner blocked the push and flagged exposed keys | GitHub push protection triggered immediately | Deactivated and deleted the exposed IAM keys, removed `.env` from git tracking using `git filter-branch`, added `.env` to `.gitignore` |
| CORS policy blocking frontend from accessing backend after deployment | High — all API calls failed in production | Browser console showed `Access-Control-Allow-Origin` errors after deploying to Vercel | Updated `allow_origins` in FastAPI CORS middleware to include the live Vercel domain |
| `clean_food()` bug — `parsed_rating` defined outside the function in `app.py` | Medium — would cause a `NameError` crash on any `/api/foods` request | Code review during router migration from `app.py` to `groceries.py` | Moved the `try/except` rating parse block inside the function before the return statement |
| Expo Go SDK version mismatch with Node.js v24 | Medium — mobile app wouldn't load on physical device | Expo CLI error message on `npx expo start` | Downgraded Expo SDK to version 54 to match the stable Expo Go build on the App Store |
| WebSocket disconnects when non-JSON text sent to chat | Low — crashes the connection for the affected user | Manual testing with wscat in two terminals | Added `try/except json.JSONDecodeError` around message parsing with a `continue` to keep the connection alive |

---

## 📚 Evidence Log

| Item | Purpose | Source | Type | License |
|---|---|---|---|---|
| React 18 | Web frontend framework | https://react.dev | Code | MIT |
| Vite 5 | Build tool and dev server | https://vitejs.dev | Code | MIT |
| FastAPI | Python backend framework | https://fastapi.tiangolo.com | Code | MIT |
| boto3 | AWS SDK for DynamoDB | https://boto3.amazonaws.com | Code | Apache 2.0 |
| AWS DynamoDB | Cloud NoSQL database | https://aws.amazon.com/dynamodb | Service | AWS Terms |
| python-dotenv | Environment variable loader | https://pypi.org/project/python-dotenv | Code | BSD |
| Pydantic | Request schema validation | https://docs.pydantic.dev | Code | MIT |
| Expo SDK 54 | React Native mobile framework | https://expo.dev | Code | MIT |
| @react-navigation/native | Mobile tab navigation | https://reactnavigation.org | Code | MIT |
| Olostep API | Job and grocery web scraping | https://olostep.com | API | Commercial |
| Railway | Backend hosting | https://railway.app | Service | Commercial (free tier) |
| Vercel | Frontend hosting | https://vercel.com | Service | Commercial (free tier) |
| ZocDoc | Doctor booking deep link | https://zocdoc.com | Third-Party | Public URL |
| websockets (PyPI) | WebSocket support | https://pypi.org/project/websockets | Code | BSD |

---

## 🤖 Goose / AI Integration Documentation

### AI Tools Used
- **Claude (Anthropic)** — used via Claude.ai for architecture planning, code generation, and debugging throughout the hackathon

### How We Used It

| Task | What Was Generated | What We Changed | How We Verified |
|---|---|---|---|
| Backend scaffold | `main.py`, `calendar.py`, `chat.py`, `jobs.py`, `groceries.py` route structure and Pydantic schemas | Added doctor router, fixed `clean_food()` bug, updated CORS origins, added custom annotations | Tested all routes in FastAPI `/docs` interactive explorer |
| Frontend components | `Calendar.jsx`, `ChatRoom.jsx`, `useChat.js`, `api/calendar.js` | Integrated with existing forHER theme, wired into existing tab routing in `forHER-app.jsx` | Manually tested calendar CRUD and live chat in browser with two tabs open |
| Mobile app | `App.js` navigation, all 6 screen files, `api/client.js` | Fixed `HomeSreen.jsx` typo, confirmed all imports matched file names | Tested on physical Android device via Expo Go |
| Deployment | Dockerfile, Railway + Vercel setup steps, CORS debugging | Debugged Railway builder settings, resolved invalid AWS credentials error | Confirmed `/health` returns 200 on live Railway URL |

### Impact
Using Claude for code generation let us ship a full-stack web + mobile app with real-time features in 48 hours — a scope that would normally take 2–3 weeks. All AI output was reviewed line by line, tested against live endpoints, and modified to fit our existing codebase and theme system.

---

## 🐛 Known Issues & Next Steps

### Known Issues
- Chat history doesn't load when switching rooms on mobile (WebSocket reconnect needed)
- Mobile cart and saved jobs are local only — don't sync with the web app
- Olostep job/grocery requests take 5–15 seconds — no loading skeleton on mobile yet
- Doctor screen links to ZocDoc externally — no owned provider data yet

### Next Steps

- **Midwife Connect** — Verified directory with in-app booking for in-person and virtual consultations
- **Drugstore** — Prenatal-safe product marketplace with real-time deal scraping
- **Push Notifications** — Appointment reminders via Expo push notifications
- **Profile Sync** — Unified accounts so saved jobs and cart items carry across web and mobile
- **Teenage Mother Hub** — Dedicated resource section with peer support and local assistance links

---

## 📄 License

MIT License

Copyright (c) 2026 KamiKrazeHQ

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

### Attributions
- FastAPI — MIT License — Sebastián Ramírez
- React — MIT License — Meta Platforms 
- Expo — MIT License — Expo Inc.
- boto3 — Apache 2.0 — Amazon Web Services
- React Navigation — MIT License — React Navigation Contributors
