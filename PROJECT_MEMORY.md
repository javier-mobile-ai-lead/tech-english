# 🧠 Project Memory & Evolution Log: Tech English Studio

**Project:** Tech English Studio (Upwork Mobile Developer Accelerator)  
**Created:** October 2026  
**Status:** Operational (Active Server on port 3000)  
**Primary Tech Stack:** Vanilla HTML5, Tailwind CSS, Lucide Icons, Web Speech API (STT & TTS), Web Audio API, Canvas Confetti, Python 3 HTTP Server (`http.server`).

---

## 📅 Chronological Development & Iteration History

### Phase 1: Foundation & Initial Architecture
- Designed local web app running entirely with zero external pip dependencies via Python 3 standard library (`server.py`).
- Established `db.json` as the local JSON database containing profile metadata and curriculum.
- Implemented `MY_INTERVIEW_PLAYBOOK.md` compiler that automatically updates when exercises are saved.

### Phase 2: Speech Recognition & UX Fixes
- **Issue Discovered:** Dictating with the microphone accumulated repetitive partial chunks ("hello hello hello hello") because `webkitSpeechRecognition` `interimResults` were being appended to the input without clearing the previous interim state.
- **Solution Implemented:** Introduced `sessionBaseText` along with separate accumulation of `event.results[i].isFinal` and interim fragments.
- **Issue Discovered:** When clicking "Next Day" or selecting a day in the sidebar, the page jumped abruptly to the top.
- **Solution Implemented:** Removed disruptive `window.scrollTo({ top: 0 })` calls to preserve comfortable reading viewport.
- **Issue Discovered:** Part 3 (Lexical Chunks) showed `1/3 Done` prematurely on initial page load.
- **Solution Implemented:** Decoupled chunk progress so it only marks complete when the user explicitly clicks the pronunciation speaker 🔊 or the *"Mark as Practiced"* button.

### Phase 3: Visual Identity & Media Integration
- **Theme Shift:** Converted UI from heavy dark mode to clean, high-contrast Light Mode by default (`class="light"`), keeping a sleek dark mode toggle for night practice.
- **Direct Video Embedding:** Replaced external YouTube tab links with an embedded responsive 16:9 player (`<iframe>`) using `getYoutubeEmbedUrl()` with timestamp seeking (`?start=seconds`).
- **Interactive Micro-animations:** Added animated mic equalizer waves during recording, subtle button bounce effects, and multi-burst canvas confetti upon claiming day XP.

### Phase 4: Bulletproof Persistence & Continuity
- **Last Viewed Day Continuity:** Implemented `localStorage.setItem('tech_english_last_day', dayNum)`. On startup, `loadData()` reads this value, selects the exact day, scrolls the sidebar right to it, and alerts the user with `Welcome back! Resumed on Day X`.
- **Silent Auto-Save:** Added debounced background auto-save (1.2s inactivity on input) and `blur` / `beforeunload` flushes with a live `Saved to disk ✓` status badge.

---

## 📈 Real Upwork Mobile Developer Market Intelligence (Job Feed Breakdown)

Analyzed real job postings from the client feed:
1. **Dominant Frameworks:**
   - **React Native (45%):** Highest volume of projects, especially fintech, e-commerce, and SaaS companion apps.
   - **Flutter / Dart (25%):** Strong demand for cross-platform MVPs, rapid prototyping, and FlutterFlow conversions.
   - **Native iOS (Swift / SwiftUI) & Android (Kotlin / Jetpack Compose) (20%):** Higher hourly rates; requested for performance-critical tasks, background location tracking, hardware peripherals, and Bluetooth LE.
   - **Kotlin Multiplatform (KMP) (10%):** Emerging enterprise demand for sharing business logic across existing native codebases.
2. **Pricing & Budgets:**
   - **Fixed-Price Quick Fixes / Audits:** $200 – $1,000 (App Store rejections, Crashlytics bugs).
   - **Hourly Retainers:**
     - Sweet spot for mid/senior developers: **$30 – $55/hr**.
     - Lead Architects & SDK Specialists: **$65 – $90+/hr**.
3. **Crucial Client Interview Signals:**
   - Clients do not want theoretical textbook answers.
   - They look for: **ownership**, **trade-off awareness**, **clear communication**, and **proactive risk mitigation**.

---

## 🗂️ File Structure
```
/Users/novant/Documents/tech_english/
├── GEMINI.md                  # Project rules & guidelines for Antigravity agents
├── PROJECT_MEMORY.md          # Complete project history, technical context, and logs
├── README.md                  # Quickstart & user documentation
├── index.html                 # Single Page Application (Tailwind, Lucide, Web Speech API)
├── server.py                  # Zero-dependency Python 3 HTTP Server & Playbook Generator
├── db.json                    # 30-Day curriculum database & user progress state
└── MY_INTERVIEW_PLAYBOOK.md   # Living Markdown cheatsheet generated from user inputs
```
