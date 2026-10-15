#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
import sys
from urllib.parse import urlparse

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "db.json")
PLAYBOOK_FILE = os.path.join(BASE_DIR, "MY_INTERVIEW_PLAYBOOK.md")

def update_playbook_markdown(db):
    """Generates a clean, ready-to-use Markdown playbook for Upwork calls."""
    md = []
    md.append("# 🎙️ My Mobile Developer Upwork Interview Playbook\n")
    md.append("> *Keep this document open on the left half of your screen during client video calls.*\n")
    md.append("---\n\n")

    md.append("## 🛟 Rescue Phrases (Frases de Control Rápido)\n")
    md.append("- **To gain 5 seconds to think:** *\"That's a great question, let me think about the cleanest approach for that...\"*\n")
    md.append("- **If audio broke up / fast speaking:** *\"Sorry, your audio broke up for a second. Could you repeat that last part?\"*\n")
    md.append("- **To verify understanding (Mirroring):** *\"Just to confirm I understood correctly, the main bottleneck is...\"*\n")
    md.append("- **To switch to code / visual demo:** *\"It's actually easier if I show you on screen. Let me share my screen real quick.\"*\n\n")
    md.append("---\n\n")

    md.append("## 🎯 My Prepared Interview Responses (CAR Framework)\n\n")

    for day in db.get("days", []):
        sub = day.get("user_submission", {})
        if sub.get("speaking_answer") or sub.get("completed"):
            md.append(f"### 📍 Day {day['day']}: {day['title']}\n")
            md.append(f"**Client Question:** *\"{day['client_challenge']['client_prompt']}\"*\n\n")
            if sub.get("speaking_answer"):
                md.append("**My Answer (What I say):**\n")
                md.append(f"> {sub['speaking_answer']}\n\n")
            md.append(f"**Senior Native Reference:**\n")
            md.append(f"> {day['client_challenge']['senior_template']}\n\n")
            if sub.get("notes"):
                md.append(f"**Personal Notes:** {sub['notes']}\n\n")
            md.append("---\n\n")

    md.append("## 🧱 Lexical Chunks (Inglés Técnico Nativo)\n\n")
    md.append("| Phrase | Meaning | Example |\n")
    md.append("| :--- | :--- | :--- |\n")
    for day in db.get("days", []):
        for chunk in day.get("lexical_chunks", []):
            md.append(f"| **{chunk['phrase']}** | {chunk['meaning']} | *\"{chunk['example']}\"* |\n")

    md.append("\n---\n")
    md.append("## 🔊 Pronunciation Traps for Spanish Speakers\n\n")
    for day in db.get("days", []):
        tip = day.get("pronunciation_tip", {})
        if tip:
            md.append(f"- **{tip.get('word')}**: {tip.get('explanation')}\n")

    with open(PLAYBOOK_FILE, "w", encoding="utf-8") as f:
        f.write("".join(md))

class TechEnglishHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/data":
            if not os.path.exists(DB_FILE):
                self.send_error(404, "db.json not found")
                return
            with open(DB_FILE, "r", encoding="utf-8") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(content.encode("utf-8"))
            return
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/save":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode("utf-8"))
            except Exception as e:
                self.send_error(400, f"Invalid JSON: {e}")
                return

            if not os.path.exists(DB_FILE):
                self.send_error(500, "db.json missing")
                return

            with open(DB_FILE, "r", encoding="utf-8") as f:
                db = json.load(f)

            day_num = payload.get("day")
            for day in db.get("days", []):
                if day["day"] == day_num:
                    sub = day.setdefault("user_submission", {})
                    if "listening_answer" in payload:
                        sub["listening_answer"] = payload["listening_answer"]
                    if "speaking_answer" in payload:
                        sub["speaking_answer"] = payload["speaking_answer"]
                    if "notes" in payload:
                        sub["notes"] = payload["notes"]
                    if payload.get("mark_completed"):
                        sub["completed"] = True
                        if day_num not in db["user_profile"]["completed_days"]:
                            db["user_profile"]["completed_days"].append(day_num)
                        db["user_profile"]["current_day"] = min(day_num + 1, 30)

            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(db, f, indent=2, ensure_ascii=False)

            # Sync with markdown
            update_playbook_markdown(db)

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "db": db}).encode("utf-8"))
            return

        return super().do_POST()

def run():
    socketserver.TCPServer.allow_reuse_address = True
    port = PORT
    while port < PORT + 10:
        try:
            with socketserver.TCPServer(("", port), TechEnglishHandler) as httpd:
                print(f"\n=======================================================")
                print(f"🚀 Tech English Studio running at: http://localhost:{port}")
                print(f"📁 Files located at: {BASE_DIR}")
                print(f"Press Ctrl+C to stop the server")
                print(f"=======================================================\n")
                # Initialize Playbook on first start
                if os.path.exists(DB_FILE):
                    with open(DB_FILE, "r", encoding="utf-8") as f:
                        update_playbook_markdown(json.load(f))
                httpd.serve_forever()
                break
        except OSError as e:
            if "Address already in use" in str(e):
                port += 1
            else:
                raise e

if __name__ == "__main__":
    run()
