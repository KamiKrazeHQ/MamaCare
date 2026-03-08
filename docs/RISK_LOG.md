# Risk Log

**Project Name:** MamaCare
**Team Name:** Nisitha Sree Gadhi, SaiKamalaksha Nimishakavi

---

## 🛡️ Risk Log

| Area | Issue Description | Severity | Fix Applied | Evidence / Link | Status |
|---|---|---|---|---|---|
| **Ethics** | We started with an AI Doctor but soon realized it is unethical to let a non-human, non-professional give medical advice and answer questions for expecting mothers | 🔴 Critical | Redesigned as an AI Advisor that does not diagnose the user, clearly states its limitations, asks if it is an emergency before proceeding, and directs emergencies to call 911 | `backend/doctor.py` | ✅ Fixed |
| **Security** | While using Olostep for web scraping, when the backend had an issue the Olostep API key was printed in the terminal. We also could not commit to GitHub because the API key was hardcoded in a frontend file | 🔴 Critical | Moved all API keys (Olostep and others) into `.env` and added `.env` to `.gitignore` to prevent credentials from leaking | `backend/.gitignore` | ✅ Fixed |
| **Code Writing** | When using Goose in the VS Code terminal to build the AI Advisor, Goose confirmed that it had created the file with changes — but no changes were visible in the editor | 🟠 Major | Updated `.goosehints` to explicitly define what Goose can and cannot do, specifically instructing it to update the currently open folder rather than creating a new one elsewhere | `.goosehints` | ✅ Fixed |
| **Accessibility** | We used a lot of emojis to make the app feel friendly and cute. When we ran the frontend, all the emojis and the favorite heart on the Jobs board rendered as question marks | 🟡 Minor | Researched emoji compatibility with VSCode and our frontend renderer using Google and Codex; replaced unsupported emojis with ones confirmed to render correctly across environments | Frontend components | ✅ Fixed |

---

*Part of the #75HER Challenge | CreateHER Fest 2026*
