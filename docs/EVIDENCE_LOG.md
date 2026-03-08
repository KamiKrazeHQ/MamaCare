# Evidence Log

**Project Name:** MamaCare
**Team Name:** Nisitha Sree Gadhi, SaiKamalaksha Nimishakavi

---

## 📊 Evidence Log

| Item / Claim | Purpose in Project | Source Link | Type | License / Attribution | Notes |
|---|---|---|---|---|---|
| React 18 | Frontend framework | https://react.dev | Code | MIT License | v18.2.0 |
| Vite 5 | Web build tool and development server | https://vitejs.dev | Code | MIT License | |
| FastAPI | Python backend framework | https://fastapi.tiangolo.com | Code | MIT License | |
| Uvicorn | ASGI server that runs FastAPI | https://www.uvicorn.org | Code | BSD License | |
| boto3 (AWS SDK) | Python library to connect to DynamoDB | https://boto3.amazonaws.com | Code | Apache 2.0 | |
| AWS DynamoDB | NoSQL database for appointments and chat messages | https://aws.amazon.com/dynamodb | Service | AWS Service | Free tier |
| python-dotenv | Loads environment variables from .env files | https://pypi.org/project/python-dotenv | Code | BSD License | |
| Pydantic | Data validation for FastAPI request schemas | https://docs.pydantic.dev | Code | MIT License | |
| Mangum | Adapter to run FastAPI on AWS Lambda | https://pypi.org/project/mangum | Code | MIT License | |
| Expo SDK 54 | Mobile app framework (React Native) | https://expo.dev | Code | MIT License | |
| @react-navigation/native | Tab-based navigation for mobile app | https://reactnavigation.org | Code | MIT License | |
| Olostep API | Web scraping for job listings and grocery data | https://olostep.com | Third-Party API | Commercial | API key required |
| Railway | Backend hosting and auto-deployment platform | https://railway.app | Third-Party | Commercial | Free tier |
| Vercel | Frontend hosting and auto-deployment platform | https://vercel.com | Third-Party | Commercial | Free tier |
| ZocDoc (deep link) | Doctor booking reference in Doctor screen | https://zocdoc.com | Third-Party | Public URL | No data extracted |
| websockets (PyPI) | Real-time bidirectional communication for chat | https://pypi.org/project/websockets | Code | BSD License | |
| @fullcalendar/react | Calendar UI component for web appointment view | https://fullcalendar.io | Code | MIT License | Open source build |

---

## 🤖 AI-Generated Content Log

| AI Tool Used | Purpose | What AI Generated | What We Changed | Verification Method |
|---|---|---|---|---|
| Claude (Anthropic) via Goose | Backend architecture + FastAPI setup for `jobs.py` and `groceries.py` | Boilerplate route structure, Pydantic schemas, and DynamoDB query patterns | Added doctor router, fixed `clean_food()` bug where `parsed_rating` was defined outside the function, updated CORS origins, added custom comments throughout | Ran every route in FastAPI's `/docs` explorer; tested POST/GET/PUT/DELETE for appointments; tested WebSocket chat with wscat in two terminals |
| Claude (Anthropic) via Goose | Frontend React components | `Calendar.jsx`, `ChatRoom.jsx`, `useChat.js`, `api/calendar.js` scaffolding | Integrated with existing MamaCare theme (`theme.js`), matched color palette, wired into existing tab routing system in `forHER-app.jsx` | Manually tested all calendar CRUD flows in browser; tested real-time chat with two browser tabs open simultaneously |
| Claude (Anthropic) via Goose | Mobile app (Expo) | `App.js` navigation shell and all 6 screen file skeletons | Wrote out each screen fully using the skeleton provided by Claude as a starting structure | Scanned QR code with Expo Go on Android; verified each tab loads and connects to live Railway backend; confirmed chat sends and receives in real time |

---

*Part of the #75HER Challenge | CreateHER Fest 2026*
