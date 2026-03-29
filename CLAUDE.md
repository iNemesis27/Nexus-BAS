# NexusBAS — Claude Code Handoff

## Project
Smart Building Automation System Designer for **196 West Houston Street, NYC**  
7,200 SF · 5 Levels · West Village

## Stack
- **Frontend:** React 18 + Vite (single-page app, no backend needed)
- **Hosting:** Railway (auto-deploy from GitHub `main` branch)
- **Repo:** GitHub → Railway auto-deploy on push

## Quick Start (Claude Code)
```bash
npm install
npm run dev          # localhost:5173
npm run build        # production build → dist/
```

## Deploy Flow
```
Claude Code (edit) → git push → GitHub (main) → Railway (auto-deploy)
```

## File Structure
```
nexusbas/
├── src/
│   ├── App.jsx          ← MAIN FILE — entire NexusBAS app (React)
│   ├── FloorPlans.jsx   ← Standalone vector SVG floor plan drawings
│   └── main.jsx         ← React entry point (don't touch)
├── public/
│   └── favicon.svg
├── index.html           ← HTML shell (don't touch)
├── package.json         ← scripts: dev, build, start (Railway uses start)
├── vite.config.js       ← PORT env var handled for Railway
├── railway.json         ← Railway build/deploy config
└── .nvmrc               ← Node 20
```

## What's Built (App.jsx)

### Pages
1. **Homepage** — 3D isometric building, live device ticker, floor status cards, protocol grid
2. **Designer** — 2D floor plan with drag-and-drop device placement per floor

### Floors (B / G / 2 / 3 / R)
| Key | Name | Rooms |
|-----|------|-------|
| B | Lower Level | Mech, Gym, Storage, Sauna, Laundry, Ele.Mech |
| G | Garden Floor | Garden, Great Room, 2-Car Garage, Foyer |
| 2 | Parlor/2nd | Terrace, Living Room, Kitchen/Dining |
| 3 | Third Floor | Master Bed, Sitting Room, 2× Bedrooms, WICs |
| R | Roof | Roof Terrace 24'1"×36'9" |

### Device Types (16)
Motion, Smoke Detector, Temp/Humidity, Door/Window, Water Leak,  
Smart Switch, Dimmer, Valve Control, HVAC, Motorized Shade,  
IP Camera, Access Control, Intercom, MQTT Relay, Gateway Hub, Elevator I/O

### Protocols (6, color-coded)
- Z-Wave `#00e5ff`
- Zigbee `#ffb300`  
- KNX `#b388ff`
- BACnet `#69ff47`
- REST API `#ff6e6e`
- MQTT `#ff9a3c`

### Floor Plans
- **Embedded blueprints** — real crops from architect drawings, base64 embedded per floor
- **Vector SVGs** — clean hand-drawn plans in `FloorPlans.jsx` (for overlay/integration)

### Demo Devices (15 pre-seeded)
```
B: Gateway Hub (MQTT), HVAC (BACnet), Elevator I/O (BACnet), Valve (BACnet)
G: IP Camera (REST), Access Control (REST), Motion (Z-Wave), Dimmer (KNX)  
2: Temp/Humidity (Zigbee), Motorized Shade (KNX), Smoke (Z-Wave)
3: Smart Switch (Zigbee), HVAC Thermostat (BACnet)
R: IP Camera (REST), MQTT Relay (MQTT)
```

## Roadmap — Next Steps for Claude Code

### Priority 1: Integrate Vector Floor Plans
- Replace base64 blueprint images with the clean SVG plans from `FloorPlans.jsx`
- SVG renders as the canvas layer under device icons at ~30% opacity
- Each floor SVG is independently drawn to scale

### Priority 2: Desktop Layout
- Current app is mobile-first (bottom sheet, horizontal scroll)
- Add sidebar layout for desktop (device palette on left, inspector on right)
- Responsive breakpoint ~1024px

### Priority 3: Device Connection Lines
- Draw SVG lines between devices on the same floor
- Color = protocol color
- Dashed for wireless, solid for wired
- Line state: active / inactive / fault

### Priority 4: PDF Export
- Per-floor PDF with device list, protocol summary, placement map
- Use browser print API or a lightweight PDF lib

### Priority 5: JSON Export
- Export all device placements as JSON for BAS backend handoff
- Format: `{ floor, deviceType, protocol, x, y, label, status }`

## Railway Setup
1. Create new Railway project → "Deploy from GitHub repo"
2. Select this repo, branch `main`
3. Railway auto-detects Node/Vite via Nixpacks
4. No env vars needed for frontend-only app
5. Custom domain optional

## Git Workflow
```bash
git add .
git commit -m "feat: description"
git push origin main        # triggers Railway auto-deploy
```
