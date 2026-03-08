# Decision Log

**Project Name:** MamaCare
**Team Name:** Nisitha Sree Gadhi, SaiKamalaksha Nimishakavi

---

## 🛠 Decision Log

| Category | Decision → Why | Tradeoff |
|---|---|---|
| **Tech Stack** | FastAPI for backend → The native boto3 integration made AWS DynamoDB and future AI (Anthropic/Goose, Olostep) connections seamless from one backend through the usage of routers | Uvicorn/Python has higher cold start latency than Node.js; less overlap with our React frontend language |
| **Tech Stack** | React + Vite over Next.js → Vite's instant browser refresh on every save let us iterate much faster during a 48-hour build; we didn't need server-side rendering for an authenticated app | No built-in SEO — fine for a user-facing app but would matter if we needed public search indexing (e.g. a login page) |
| **Tech Stack** | Expo (React Native) for mobile → We could reuse our existing React component knowledge and build for Android without needing a Mac or a new language | Expo Go SDK was one version behind Node.js, causing a conflict that cost us ~45 minutes to resolve by downgrading Node |
| **Architecture** | Railway (backend) + Vercel (frontend) over full AWS → AWS App Runner requires a paid tier we didn't have; Railway deployed our Dockerfile in under 3 minutes; Vercel handles React builds with zero config | Backend lives outside AWS — not a fully AWS-native stack, though we still use AWS DynamoDB for all data storage; harder to track hosting locations and configurations |
| **Architecture** | AWS DynamoDB (NoSQL) over a traditional SQL database → No database server to set up or pay for; free on AWS starter tier; appointments and messages fit naturally into a key-value structure, making FastAPI integration easier | Required two separate tables since appointments and messages have no correlation — no way to relate them with joins |
| **AI Integration** | Olostep API over a custom scraper or Apify → Returns structured JSON from a natural language search query in one API call; no scraper infrastructure needed | Responses take 5–15 seconds and are rate-limited on the free tier, leading to noticeable delays during the demo |
| **Feature Scope** | Mobile app as a companion (6 screens) using the same live backend → Zero backend changes needed; validated that our API works across web and mobile simultaneously | Mobile doesn't sync state with the web app — saved jobs and cart items are locally limited to the device being used |
| **Third-Party** | AWS DynamoDB over Firebase or Supabase → Already inside the AWS ecosystem we were building on; no extra account or SDK needed; free tier covers our hackathon load | DynamoDB's NoSQL structure requires more upfront data modeling than Firebase's flexible document store — we had to define partition and sort keys before writing a single query |
| **Process** | Teammates worked independently on separate parts of the app → Minimal GitHub conflicts while building; cleaner individual code with less overlap | Integrating into shared files (`main.py`, `App.js`) took extra time to reconcile two independent codebases into one large file |

---

*Part of the #75HER Challenge | CreateHER Fest 2026*
