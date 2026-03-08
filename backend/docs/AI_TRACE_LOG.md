# AI Trace Log

**Project Name:** MamaCare
**Team Name:** Nisitha Sree Gadhi, SaiKamalaksha Nimishakavi

---

## 🤖 AI Trace Entries

---

### Trace #1: Research
**Tool:** Gemini 3

**Prompt:** Our team brainstormed 12 features for the website, then explained our idea to Gemini and asked it to pick out 8 that would be feasible to complete since we joined only 2 days before the deadline.

**AI Response:** Gemini recommended we prioritize the job search feature for pregnant women needing remote work and suggested using Apify for scraping. It also highlighted our RAG implementation idea for summarizing medical documents as a strong efficiency feature.

**✅ What We Kept:** We kept the job search, chat system, and AI advisor features. We skipped the RAG implementation — we joined too late and the team had midterms and homework, so we focused on what we could ship.

**✏️ What We Changed:** We did not use Apify. We tried it, $5 disappeared in one run that loaded 24 jobs, and we ran out of credits immediately. We switched to Olostep, whose free plan was far more practical for our use case.

**🔍 Verification:** We built ourselves a timeline to decide what was actually achievable. We ran the backend once with Apify, confirmed it worked but burned through all credits on one call, then switched to Olostep and validated the same output.

---

### Trace #2: Frontend Website Theme and Visuals
**Tool:** Claude Sonnet 4.6

**Prompt:** Give me an overall frontend for a website for mothers. We want a pastel Easter-like color scheme — baby blue, lavender, and butter yellow — to look joyful and pretty for expecting mothers. Include a lot of emojis and tabs in the header for multiple features.

**AI Response:** Returned full frontend code for a webpage with placeholder tabs for upcoming features, a whimsical pastel color scheme, and emoji-heavy UI.

**✅ What We Kept:** The overall layout structure, color scheme, and header format.

**✏️ What We Changed:** Made the website title cursive and added a profile button in the top right as a placeholder to demonstrate job favoriting and grocery cart functionality. Populated the home page with a pregnancy tracker and feature shortcuts. Replaced incompatible emojis with ones confirmed to render correctly.

**🔍 Verification:** Ran the frontend with `npm run dev`, confirmed all onClick handlers worked, and verified all emojis rendered as emojis rather than garbled characters.

---

### Trace #3: Placeholder Jobs and Groceries
**Tool:** Codex

**Prompt:** Go into the job and groceries sections and create placeholder jobs and grocery items so that when the frontend runs and the user clicks the tabs, there is already content displayed — fake but formatted correctly.

**AI Response:** Wrote code across two files (one for jobs, one for groceries) with 10 placeholder jobs and 10 placeholder items displayed in a consistent format.

**✅ What We Kept:** The placeholder items and the display format — so that when real scraped data came in, it would render in the same layout.

**✏️ What We Changed:** After obtaining the Olostep API key, we removed all placeholders and wired in a live backend for scraping. We also added job favoriting via a heart button and grocery cart functionality.

**🔍 Verification:** Ran the backend first with Apify (ran out of credits), then switched to Olostep, confirmed the backend passed, then updated the frontend to display real scraped data in the same format as the placeholders.

---

### Trace #4: Complete Code for AI Advisor
**Tool:** Goose

**Prompt:** I wrote starter backend logic for the AI advisor — phrases it should avoid, when to prompt the user to call 911, etc. I asked Goose to finish it and tell me where to place the API key.

**AI Response:** Completed `backend/doctor.py` and the frontend advisor UI, styled to match the MamaCare theme, with logic to answer user questions.

**✅ What We Kept:** The entire AI advisor feature and its frontend.

**✏️ What We Changed:** Added yes/no emergency detection prompts so the chat knows when it cannot help and must direct the user to call 911 or visit a hospital. Double-checked that the advisor never diagnoses — only answers general questions. Provided the OpenRouter API key.

**🔍 Verification:** Ran both backend and frontend; confirmed that emergency or medication-related questions prompt the user to consult a specialist or visit a hospital immediately rather than providing a diagnosis.

---

### Trace #5: Fixing Integration Errors
**Tool:** Codex

**Prompt:** My teammate made changes to the overall folder. Look over the frontend and backend and make sure they work together correctly.

**AI Response:** Fixed small file path and import direction errors to ensure the frontend and backend connected without errors.

**✅ What We Kept:** All fixes that resolved errors without touching working features.

**✏️ What We Changed:** Any change Codex made to a feature that was already working correctly was reverted to its original state before the Codex call.

**🔍 Verification:** Ran the full stack after changes and confirmed everything loaded and functioned correctly end to end.

---

*Part of the #75HER Challenge | CreateHER Fest 2026*
