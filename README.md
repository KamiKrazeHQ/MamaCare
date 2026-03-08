# MamaCare 🌸

> A full-stack web and mobile platform built to support mothers at every stage of their pregnancy journey.

**Live Web App:** https://forher-h9r13n8of-kamikrazehqs-projects.vercel.app  
**Live API + Docs:** https://forher-production.up.railway.app/docs  
**Mobile:** Run `npx expo start` inside `/mobile` and scan the QR code with Expo Go

---

## 🌍 Our Mission

**4-Line Problem Frame**

| | |
|---|---|
| **User** | Expecting and new mothers, especially those without strong support networks or easy access to prenatal resources |
| **Problem** | Pregnancy information, community, jobs, and healthcare are scattered across dozens of apps and websites — creating overwhelm at the worst possible time |
| **Constraints** | Mothers need something fast, mobile-friendly, and free — they don't have time to learn new tools or pay for subscriptions while managing a pregnancy |
| **Success Test** | A mother can book a prenatal appointment, find a flexible job, and message another mom in the same trimester — all in under 5 minutes, from her phone |

**3-Line Pitch**

> **Every mother deserves support in one place.**
> MamaCare connects expecting mothers to community, prenatal care, and flexible work — all from one free app.
> **Join.**

*Aligned with UN SDG 3: Good Health and Well-Being — targeted specifically for women and maternal health.*

---

## 🌍 Our Mission

### 4-Line Problem Frame
- **User:** Expecting and new mothers, especially those without strong support networks or easy access to prenatal resources
- **Problem:** Pregnancy information, community, jobs, and healthcare are scattered across dozens of apps and websites — creating overwhelm at the worst possible time
- **Constraints:** Mothers need something fast, mobile-friendly, and free — they don't have time to learn new tools or pay for subscriptions while managing a pregnancy
- **Success Test:** A mother can book a prenatal appointment, find a flexible job, and message another mom in the same trimester — all in under 5 minutes, from her phone

### 3-Line Pitch
- **Headline:** Every mother deserves support in one place
- **Subhead:** MamaCare connects expecting mothers to community, prenatal care, and flexible work — all from one free app
- **CTA:** Join

> 🌱 *Aligned with UN Sustainable Development Goal #3 — Good Health and Wellbeing, with a focus on maternal health equity*

---

## ⚡ Quickstart

```bash
# 1. Clone the repo
git clone https://github.com/KamiKrazeHQ/MamaCare.git
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

MamaCare gives expecting and new mothers a single platform to manage the chaos of pregnancy:

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

| Category | Decision → Why | Tradeoff |
|---|---|---|
| **Tech Stack** | FastAPI for backend → boto3 integration made AWS DynamoDB and AI (Goose, Olostep) connections seamless through modular routers | Higher cold start latency than Node.js; Python and React are different languages for the team |
| **Tech Stack** | React + Vite over Next.js → Instant browser refresh on every save; no SSR needed for an authenticated app | No built-in SEO — fine for a logged-in app, matters if we add public pages |
| **Tech Stack** | Expo (React Native) for mobile → Reused existing React knowledge; no Mac or new language required | Expo Go SDK was one version behind Node.js, costing ~45 minutes to downgrade and resolve |
| **Architecture** | One GitHub repo for backend, web, and mobile → Single PR workflow; judges can see how everything connects in one place | Backend and mobile features on the same branch caused repeated merge conflicts and temporarily crashed deployment |
| **Architecture** | Railway + Vercel over full AWS → App Runner required a paid tier; Railway deployed our Dockerfile in under 3 minutes; Vercel handles React with zero config | Backend lives outside AWS — harder to track all hosting locations and their different configurations |
| **Architecture** | AWS DynamoDB over SQL → No server to manage, free on AWS free tier, key-value structure fits appointments and messages naturally | Required two separate tables with no way to relate them — no relational joins between appointments and chat data |
| **AI Integration** | Olostep API over custom scraper or Apify → Structured JSON from a natural language query in one API call, no scraper infrastructure needed | 5–15 second response time, rate-limited on free tier — noticeable delay during demo |
| **Feature Scope** | Mobile as a companion app (6 screens) using the same live backend → Zero backend changes; validated API works across web and mobile simultaneously | Saved jobs and cart items are local to the device — no sync with the web app |
| **Third-Party** | AWS DynamoDB over Firebase or Supabase → Already in our AWS ecosystem; no extra account or SDK; free tier covers hackathon load | Required defining partition and sort keys upfront before writing a single query — more planning than Firebase's flexible document store |
| **Process** | Teammates worked independently on separate features → Minimal GitHub conflicts while building; cleaner individual code | Integrating into shared files (`main.py`, `App.js`) took adjustment time as we reconciled two independent codebases into one |

---

## ⚠️ Risk Log

| Area | Issue Description | Severity | Fix Applied | Evidence / Link | Status |
|---|---|---|---|---|---|
| Ethics | We started with an AI Doctor but realized it is unethical to let a non-human, non-professional give medical advice to pregnant mothers | 🔴 Critical | Redesigned as an AI Advisor that does not diagnose, clearly states its limitations, asks if it is an emergency before proceeding, and directs emergencies to call 911 | `backend/doctor.py` | ✅ Fixed |
| Security | Olostep API key was being printed in the terminal on backend errors, and was also hardcoded in a frontend file — blocked from pushing to GitHub | 🔴 Critical | Moved all API keys into `.env` and added `.env` to `.gitignore` to prevent leaking credentials | `backend/.gitignore` | ✅ Fixed |
| Security | AWS credentials were committed to GitHub in an early push and flagged by GitHub's secret scanner | 🔴 Critical | Deactivated and deleted the exposed IAM keys, removed `.env` from git history using `git filter-branch` | GitHub push protection alert | ✅ Fixed |
| Code Writing | When using Goose in VS Code terminal to build the AI Advisor, Goose confirmed file changes were made but no changes were visible in the editor | 🟠 Major | Updated `.goosehints` to explicitly define Goose's boundaries — instructing it to update the currently open folder rather than creating new files elsewhere | `.goosehints` | ✅ Fixed |
| Accessibility | Emojis throughout the UI rendered as question marks on some systems — the favorite heart on the Jobs board was also broken | 🟡 Minor | Researched emoji compatibility with VSCode and our frontend renderer; replaced unsupported emojis with ones confirmed to render correctly | Frontend components | ✅ Fixed |

---

## 📚 Evidence Log

### Sources & Libraries

| Item / Claim | Purpose in Project | Source Link | Type | License / Attribution | Notes |
|---|---|---|---|---|---|
| React 18 | Frontend framework | https://react.dev | Code | MIT License | v18.2.0 |
| Vite 5 | Web build tool and dev server | https://vitejs.dev | Code | MIT License | |
| FastAPI | Python backend framework | https://fastapi.tiangolo.com | Code | MIT License | |
| Uvicorn | ASGI server that runs FastAPI | https://www.uvicorn.org | Code | BSD License | |
| boto3 (AWS SDK) | Python library to connect to DynamoDB | https://boto3.amazonaws.com | Code | Apache 2.0 | |
| AWS DynamoDB | NoSQL database for appointments and chat | https://aws.amazon.com/dynamodb | Service | AWS Service | Free tier |
| python-dotenv | Loads environment variables from .env files | https://pypi.org/project/python-dotenv | Code | BSD License | |
| Pydantic | Data validation for FastAPI request schemas | https://docs.pydantic.dev | Code | MIT License | |
| Mangum | Adapter to run FastAPI on AWS Lambda | https://pypi.org/project/mangum | Code | MIT License | |
| Expo SDK 54 | Mobile app framework (React Native) | https://expo.dev | Code | MIT License | |
| @react-navigation/native | Tab-based navigation for mobile app | https://reactnavigation.org | Code | MIT License | |
| Olostep API | Web scraping for job listings and grocery data | https://olostep.com | Third-Party API | Commercial | API key required |
| Railway | Backend hosting and auto-deployment | https://railway.app | Third-Party | Commercial | Free tier |
| Vercel | Frontend hosting and auto-deployment | https://vercel.com | Third-Party | Commercial | Free tier |
| ZocDoc (deep link) | Doctor booking reference in Doctor screen | https://zocdoc.com | Third-Party | Public URL | No data extracted |
| websockets (PyPI) | Real-time bidirectional chat communication | https://pypi.org/project/websockets | Code | BSD License | |
| @fullcalendar/react | Calendar UI component for appointment view | https://fullcalendar.io | Code | MIT License | Open source build |

### AI-Generated Content Log

| AI Tool Used | Purpose | What AI Generated | What We Changed | Verification Method |
|---|---|---|---|---|
| Claude (Anthropic) via Goose | Backend architecture + FastAPI setup for `jobs.py` and `groceries.py` | Boilerplate route structure, Pydantic schemas, and DynamoDB query patterns | Added doctor router, fixed `clean_food()` bug where `parsed_rating` was defined outside the function, updated CORS origins, added custom comments throughout | Ran every route in FastAPI's `/docs` explorer; tested POST/GET/PUT/DELETE for appointments; tested WebSocket chat with wscat in two terminals |
| Claude (Anthropic) via Goose | Frontend React components | `Calendar.jsx`, `ChatRoom.jsx`, `useChat.js`, `api/calendar.js` scaffolding | Integrated with existing MamaCare theme (`theme.js`), matched color palette, wired into existing `MamaCare-app.jsx` tab routing | Manually tested all calendar CRUD flows in browser; tested real-time chat with two browser tabs open simultaneously |
| Claude (Anthropic) via Goose | Mobile app (Expo) | `App.js` navigation shell and all 6 screen file skeletons | Wrote out each screen fully using the skeleton provided by Claude as a starting structure | Scanned QR code with Expo Go on Android; verified each tab loads and connects to live Railway backend; confirmed chat sends and receives in real time |

---

## 🤖 Goose / AI Integration Documentation

### AI Tools Used
- **Claude (Anthropic)** — used via Claude.ai for architecture planning, code generation, and debugging throughout the hackathon

### How We Used It

| Task | What Was Generated | What We Changed | How We Verified |
|---|---|---|---|
| Backend scaffold | `main.py`, `calendar.py`, `chat.py`, `jobs.py`, `groceries.py` route structure and Pydantic schemas | Added doctor router, fixed `clean_food()` bug, updated CORS origins, added custom annotations | Tested all routes in FastAPI `/docs` interactive explorer |
| Frontend components | `Calendar.jsx`, `ChatRoom.jsx`, `useChat.js`, `api/calendar.js` | Integrated with existing MamaCare theme, wired into existing tab routing in `MamaCare-app.jsx` | Manually tested calendar CRUD and live chat in browser with two tabs open |
| Mobile app | `App.js` navigation, all 6 screen files, `api/client.js` | Fixed `HomeSreen.jsx` typo, confirmed all imports matched file names | Tested on physical Android device via Expo Go |
| Deployment | Dockerfile, Railway + Vercel setup steps, CORS debugging | Debugged Railway builder settings, resolved invalid AWS credentials error | Confirmed `/health` returns 200 on live Railway URL |

### Impact
Using Claude for code generation let us ship a full-stack web + mobile app with real-time features in 48 hours — a scope that would normally take 2–3 weeks. All AI output was reviewed line by line, tested against live endpoints, and modified to fit our existing codebase and theme system. We used Goose as our AI Co-Pilot to help build MamaCare. Instead of just asking for code snippets, we provided it with a special instruction file, .goosehints, that let it act like any other team member who knew our entire folder structure. Goose actually opened our terminal to install libraries, fixed a broken "Mother Chat" feature by reviewing its own error logs, and connected our Olostep scraper to our database. Most importantly, when Goose initially tried to create an "AI Doctor" that offered medical advice, we collaborated to pivot it into a safe "AI Advisor" that refers moms to real doctors in emergencies. It helped us manage a website and a mobile app at once.

---

## 🐛 Known Issues & Next Steps

### Known Issues
- Chat history doesn't load when switching rooms on mobile (WebSocket reconnect needed)
- Mobile cart and saved jobs are local only — don't sync with the web app
- Olostep job/grocery requests take 5–15 seconds — no loading skeleton on mobile yet
- Doctor screen links to ZocDoc externally — no owned provider data yet

### Next Steps
- **AI Doctor** — OpenAI-powered prenatal Q&A with safe, non-alarmist guidance
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
