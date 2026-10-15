# 🎙️ Tech English Studio: Upwork Mobile Developer Accelerator

A lightweight, local-first interactive learning studio designed to help mobile developers master technical English interviews for high-paying contracts on Upwork ($35–$75+/hr).

---

## ⚡ Quickstart

1. **Start the local server:**
   ```bash
   python3 server.py
   ```
2. **Open your browser:**
   ```
   http://localhost:3000
   ```

*(Requires standard Python 3. No `pip install` or external dependencies needed!)*

---

## 🌟 Key Features

- **📺 In-App Listening Gym:** Embedded video challenges that start at the exact relevant timestamp.
- **🎙️ Voice Dictation with Live Equalizer:** Dictate answers in English using the built-in Chrome Speech Recognition API with animated mic equalizer waves.
- **🔊 Native Pronunciation (TTS):** One-click US English pronunciation playback for all lexical chunks and senior model answers.
- **💾 Automatic Disk Persistence:** All answers auto-save to `db.json` with background debouncing (`Saved to disk ✓`).
- **🎯 Exact Session Resume:** Automatically remembers the day and position where you left off.
- **📖 Living Interview Playbook (`MY_INTERVIEW_PLAYBOOK.md`):** Automatically compiles your personalized answers, rescue phrases, and technical vocabulary into a Markdown cheatsheet to keep on screen during real client calls.
- **🎨 Modern Light Theme & Dark Mode:** Crisp, high-contrast light mode by default with instant toggle.
- **🎮 XP & Confetti Gamification:** Daily progression tracking with Sound FX, +50 XP per completed day, and multi-burst confetti celebrations.

---

## ⌨️ Keyboard Shortcuts

- `⌘ + S` / `Ctrl + S`: Quick-save progress to disk.
- `Alt + →`: Navigate to next day.
- `Alt + ←`: Navigate to previous day.
