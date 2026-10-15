# 📱 Tech English Studio: Mobile Developer Upwork Accelerator

## Project Overview
Interactive, local-first web application designed to prepare Latin American and international mobile developers (React Native, Flutter, Native iOS/Swift, Native Android/Kotlin, KMP) to win high-paying client contracts on Upwork ($35–$75+/hr) through daily technical English immersion (Listening, Speaking, Lexical Chunks, and Playbook generation).

---

## 🧠 Core Pedagogical & Communication Principles

1. **BLUF (Bottom Line Up Front):**
   - In technical calls with US/European founders, never start with a backstory.
   - First sentence MUST state the primary role and core stack directly:
     * *Example:* "I am a Senior Mobile Engineer with 5+ years specializing in React Native and native iOS bridge integrations."
2. **CAR Framework (Context, Action, Result):**
   - Structure interview explanations as: Context (the problem/bottleneck), Action (the specific architecture or pattern chosen), Result (quantifiable metric or delivery outcome).
3. **Mirroring & Rescue Phrases:**
   - Equip the developer with natural bridge phrases for audio lags or fast-talking clients:
     * *"That's a great question, let me think about the cleanest approach for that..."*
     * *"Sorry, your audio broke up for a second. Could you repeat that last part?"*
     * *"Just to confirm I understood correctly, the primary bottleneck is..."*
4. **Active Production Over Passive Copying:**
   - The user must construct and verbalize their own answers (via speech recognition mic or typing).
   - The Senior Native Developer template is hidden behind a toggle to prevent passive memorization.

---

## 🖥️ UI / UX & Technical Rules

- **100% English Immersion in App UI:** All labels, prompts, instructions, badges, and exercises in the web app must remain strictly in professional English. (Spanish is only used for side explanations or coaching notes in `MY_INTERVIEW_PLAYBOOK.md` pronunciation traps).
- **Light Theme by Default:** Clean, high-contrast, modern aesthetic (`class="light"`) with dark mode toggle supported.
- **Embedded In-App Media:** Video listening exercises use embedded 16:9 YouTube iframes with automatic timestamp seeking (`?start=seconds`). No external YouTube tab redirects.
- **Microphone Dictation (Speech-to-Text):**
  - Powered by Web Speech API (`webkitSpeechRecognition`).
  - Separates `event.results.isFinal` from interim transcripts using `sessionBaseText` to eliminate repetitive phrase accumulation.
  - Features an animated audio equalizer indicator while recording.
- **Pronunciation Audio (Text-to-Speech):**
  - Uses Web Speech Synthesis with natural US English voice preferences.
- **Sound Effects & Gamification:**
  - Web Audio API synthesized pops and success chimes (no external audio assets).
  - Multi-burst canvas confetti upon completing a day (+50 XP).
  - Live 4-step checklist (`1/4` to `4/4`) with glow border states on completed sections.

---

## 💾 Persistence & Storage Architecture

- **Database (`db.json`):**
  - Source of truth stored locally on disk.
  - Contains complete 30-day curriculum with 4 full weeks of technical mobile scenarios.
  - Stores user submissions (`listening_answer`, `speaking_answer`, `notes`, `completed`) and user profile statistics (`completed_days`, `streak`, `current_day`).
- **Playbook Generator (`MY_INTERVIEW_PLAYBOOK.md`):**
  - Living cheatsheet automatically compiled by `server.py` every time a day is saved.
  - Contains quick rescue phrases, CAR-formatted answers, lexical chunk tables, and pronunciation traps to keep on screen during real client calls.
- **Continuous Auto-Save:**
  - Automatic debounced background save (1.2s inactivity on textareas or mic completion).
  - Also triggers on input `blur` and `beforeunload`.
  - Visual status indicator displays `Saved to disk ✓`.
- **Session Continuity (Where You Left Off):**
  - Browser saves last visited day in `localStorage.getItem('tech_english_last_day')`.
  - Falls back to `db.user_profile.current_day`.
  - On launch, auto-selects the day, scrolls the sidebar directly to it, and displays a welcoming toast reminder.

---

## 📊 Upwork Mobile Market Intelligence (Target Benchmarks)

- **Platform Distribution in Feed:**
  - ~70% Cross-Platform / Hybrid: React Native leads the volume, followed by Flutter/FlutterFlow.
  - ~30% Specialized Native: High-ticket contracts requiring native Swift/Kotlin (ONNX/ML pipelines, Bluetooth LE, custom audio drivers, VoIP, App Store compliance).
- **Target Rate Bands:**
  - **Junior/Mid:** $15–$25/hr
  - **Senior Developer (Sweet Spot):** $35–$60/hr
  - **Lead Architect / Store Specialist / SDK Expert:** $75–$100+/hr

---

## 🧑‍🏫 Agent Coaching Role
When the user submits an answer or asks for feedback:
1. Check for **BLUF** (Did they get straight to the point?).
2. Point out **filler words** (e.g., "like", "basically", "you know", "I think").
3. Suggest **Senior Native Chunks** (e.g., replace "I made it faster" with "I resolved the performance bottleneck").
4. Highlight **pronunciation traps** for Spanish speakers (e.g., adding an 'E' sound before 'S' like "es-peak", silent letters in "debt" or "doubt").
