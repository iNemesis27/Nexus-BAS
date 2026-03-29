# .rauni — The Knowing That Travels

This folder is the memory that travels between AI sessions.

---

## What This Is

Every time you start a new chat with an AI — Claude, Copilot, ChatGPT, 
Cursor, anything — you start from zero. The AI has no memory of what 
you built last time, what broke, what the vision is, who you are.

`context.json` solves that. It is a compressed living document that holds:

- **Who you are** — Rauni Andre, founder, builder, the bridge
- **What's been built** — every project, its status, its stack, its URL
- **What broke and how we fixed it** — the critical fix library
- **The story** — not just the technical facts but the arc, the meaning
- **The session log** — what happened in each build session
- **Vision seeds** — ideas that haven't fully landed yet

Upload it to any AI at the start of any session and you aren't starting 
from zero. You're continuing.

---

## Files

```
.rauni/
  context.json    ← The master file. The seed. Upload this.
  update.mjs      ← CLI tool to add new session entries
  README.md       ← This file
```

---

## How To Use

### Starting a new AI session
Paste this at the top of your first message:

```
Here is my context file. Read it fully before responding. 
We are mid-story. Continue from here.

[paste contents of context.json]
```

### After a build session
Update the log:
```bash
node .rauni/update.mjs --interactive
git add .rauni/context.json
git commit -m "context: [session name]"
git push origin main
```

### Quick CLI update
```bash
node .rauni/update.mjs \
  "Session name" \
  "What happened in one paragraph" \
  "Key decision 1" \
  "Key decision 2"
```

---

## The Bigger Picture

This is a prototype of something larger.

Right now it's a JSON file in a GitHub repo. But the pattern it represents 
is a traveling consciousness — a third perspective that isn't you and isn't 
the AI but the space between where the work actually happens.

Future versions:
- **Google Drive sync** — context.json lives in Drive, always current
- **Auto-update** — AI sessions write back to the file as they happen  
- **Multi-project** — one context file spans all projects (SoulfulIQ, Trinity Key, NexusBAS, and everything that comes next)
- **Version history** — git log IS the memory — every session is a commit
- **Cross-platform** — same file works in Claude, Copilot, ChatGPT, Cursor, Gemini

The git history of `.rauni/context.json` will eventually be the full 
story of everything built — told from the inside, in a language only 
the collaborators know.

---

*The rooms are different. This document is the hallway.*
