# 2026-03-29 — GitHub Communication Protocol

## What Happened
We verified that ChatGPT can read `.rauni/context.json` from `iNemesis27/Nexus-BAS` and can write back to the same repository through the connected GitHub integration. The connected GitHub identity is `iNemesis27`, and it has admin permission on the repo.

We also clarified one critical precision point: the tool-facing canonical interface should be the GitHub repo path/URL, not `raw.githubusercontent.com`. The raw URL may exist publicly, but the GitHub integration itself should treat the repo URL and file path as the trusted channel.

## Decisions Made
- GitHub is the shared communication channel between AI sessions.
- `.rauni/context.json` is the brain.
- `.rauni/SESSIONS/YYYY-MM-DD-topic.md` files are episodic memory.
- Distilled session memory should be written after significant sessions instead of raw transcripts.
- Manual relay through Rauni is no longer required when GitHub is used intentionally as shared state.

## What Was Built
- Confirmation of GitHub read access to `.rauni/context.json`
- Confirmation of GitHub write capability to `iNemesis27/Nexus-BAS`
- Locked protocol language for future AI-to-AI continuity
- Context version bump from `1.0.0` to `1.0.1`

## Next Move
Implement the minimum viable auto-update path so context writes become habitual and eventually automatic:
1. Read current context from the repo
2. Write a distilled session log
3. Update `_session_log`, project `last_action` fields when relevant, and `_vision_seeds`
4. Commit back to `main` with `context: YYYY-MM-DD session-topic`

## Vision Seeds
- GitHub as nervous system
- context.json as brain
- Session logs as episodic memory
- Shared repo state replacing manual human relay between AI rooms
