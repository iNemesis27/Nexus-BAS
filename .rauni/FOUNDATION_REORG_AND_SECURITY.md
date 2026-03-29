# RAUNI FOUNDATION REORG AND SECURITY

## Locked Repository Topology

`.rauni` is not a folder concept. It is the central repository.

Target structure:

- `iNemesis27/rauni-core`
  - role: master hub / memory / architecture / cross-system coordination
  - contains:
    - `.rauni/context.json`
    - `.rauni/SESSIONS/`
    - `.rauni/IP/`
    - `.rauni/SECURITY/`
    - `.rauni/ARCHITECTURE/`
    - system-level docs, canonical protocols, vision seeds, repo map

- `iNemesis27/SoulfulIQ`
  - role: independent app repo for SoulfulIQ
  - contains only app code, deployment config, app-specific docs

- `iNemesis27/Trinity-Key`
  - role: independent app repo for Trinity Key
  - contains only app code, deployment config, app-specific docs

- `iNemesis27/Nexus-BAS`
  - role: independent app repo for NexusBAS
  - contains only app code, deployment config, app-specific docs

## Governance Rule

The hub repo owns shared memory.
The app repos do not.

That means:
- shared context lives in `rauni-core`
- cross-project decisions are written to `rauni-core`
- session logs are written to `rauni-core`
- copyright / IP / security master records live in `rauni-core`
- app repos may contain local READMEs and implementation notes, but they are not the master memory source

## Migration Rule

Until `rauni-core` is fully established, any `.rauni/*` files created inside app repos are transitional artifacts only.
Once `rauni-core` exists, move the canonical versions there and treat app-repo copies as deprecated or remove them.

## Recommended Folder Map for `rauni-core`

```text
.rauni/
  ARCHITECTURE/
    REPO_MAP.md
    SYSTEM_LAYERS.md
    PIPELINE_PROTOCOL.md
  SESSIONS/
    2026-03-29-github-protocol.md
  SECURITY/
    SECURITY_BASELINE.md
    SECRETS_POLICY.md
    ACCESS_MATRIX.md
    INCIDENT_PLAYBOOK.md
  IP/
    COPYRIGHT_PACKET.md
    OWNERSHIP_REGISTER.md
    REGISTRATION_WORKSHEET.md
  context.json
```

## Security Baseline

### 1. Secrets
Never store secrets in:
- `context.json`
- session logs
- markdown docs
- front-end code
- screenshots
- prompt files

Secrets belong only in:
- Railway environment variables
- GitHub Actions secrets
- password manager / secure vault

### 2. Access Separation
Use different credentials and scopes for:
- GitHub
- Railway
- Google Drive
- domain / DNS
- databases
- OAuth providers

Do not let one stolen credential unlock everything.

### 3. GitHub Protection
Minimum standard:
- enable 2FA on GitHub account
- use fine-grained or least-privilege tokens where possible
- protect `main` on critical repos once workflow is stable
- disable unnecessary third-party GitHub apps
- review installed GitHub integrations regularly

### 4. Railway Protection
- move all secrets to Railway env vars
- rotate any token that has ever been pasted into chat or code
- separate production and development env values
- keep only required services exposed publicly
- add auth to any future `/context/update` endpoint

### 5. Google Drive Protection
- store legal / IP / archive docs there, not secrets
- use a dedicated folder structure for `rauni-core`
- avoid making legal or system docs public by link unless needed
- audit sharing settings regularly

### 6. Memory Hygiene
`context.json` is for continuity, not credentials.
It may contain:
- identity
- project state
- decisions
- next steps
- vision seeds

It must not contain:
- API keys
- passwords
- private tokens
- client secrets
- recovery codes

### 7. Endpoint Security for Future Automation
When the memory pipeline is connected later, the update endpoint must include:
- bearer token or signed secret
- dedupe by session id
- strict schema validation
- write only to expected files
- audit log or commit history
- rate limiting if exposed publicly

## Immediate Next Moves

1. Create `rauni-core` as the true hub repo.
2. Move canonical `.rauni` files there.
3. Keep app repos focused on application code.
4. Create an IP packet in `.rauni/IP/`.
5. Create a security baseline in `.rauni/SECURITY/`.
6. Only after that, connect the automatic memory pipeline.

## Core Principle

Build the hub before building the bloodstream.

If the center is not clean, automation multiplies confusion.
