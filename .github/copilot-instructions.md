# NexusBAS — AI Coding Instructions
## GitHub Copilot · Claude Code · Cursor · Any AI Assistant

---

## What This Is

**NexusBAS** is a smart building automation system (BAS) designer for
**196 West Houston Street, West Village, New York City**.

A React single-page app where you place, manage, and monitor IoT devices
across all 5 floors of a 7,200 SF townhouse. Think of it as a drag-and-drop
floor plan tool for building automation — every device knows its floor,
its protocol, its room, and its live sensor state.

**Stack:** React 18 + Vite · No backend · No external UI library · Pure CSS-in-JS  
**Hosting:** Railway (auto-deploy from GitHub `main` branch)  
**Property:** 196 West Houston Street, West Village, NYC · 7,200 SF · 5 Levels

---

## Project Structure

```
src/
  App.jsx          ← Entire app (homepage + designer) — primary file to edit
  FloorPlans.jsx   ← Standalone clean SVG floor plan drawings (5 floors, not yet integrated)
  main.jsx         ← React entry point — do not modify
public/
  favicon.svg
.github/
  copilot-instructions.md  ← This file
index.html         ← HTML shell — do not modify
package.json       ← scripts: dev, build, start
vite.config.js     ← PORT env var handled for Railway
railway.json       ← Railway deployment config
CLAUDE.md          ← Extended handoff doc for Claude Code
```

---

## The 5 Floors

| Key | Floor Name     | Key Rooms |
|-----|----------------|-----------|
| `B` | Lower Level    | Mech 15'×13'6", Gym 19'4"×15'5", Storage 13'4"×8'6", Sauna 8'5"×10'2", Laundry, Ele.Mech 11'10"×9' |
| `G` | Garden Floor   | Garden 25'×29', Great Room 22'×35'6" (Ceil 11'8"), 2-Car Garage 17'×30'10" (Ceil 9'10"), Foyer 6'2"×8' |
| `2` | Parlor / 2nd   | Terrace 22'6"×28'4", Living Room 22'7"×18'9" (Ceil 9'3"), Kitchen/Dining 22'7"×20'2" (Ceil 10'1") |
| `3` | Third Floor    | Master Bed 13'11"×13'8" (Ceil 13'1"), WIC 7'10"×7'4", Sitting Room 14'7"×10'2" (Ceil 13'9"), 2× Bedrooms |
| `R` | Roof           | Roof Terrace 24'1"×36'9" |

---

## The 16 Device Types

### Sensors
- `motion` — Motion Sensor
- `smoke` — Smoke Detector
- `temp` — Temp/Humidity Sensor
- `door` — Door/Window Sensor
- `water` — Water Leak Sensor

### Control
- `switch` — Smart Switch
- `dimmer` — Dimmer
- `valve` — Valve Control
- `hvac` — HVAC Thermostat
- `shade` — Motorized Shade

### Security
- `camera` — IP Camera
- `access` — Access Control
- `intercom` — Intercom

### Automation
- `relay` — MQTT Relay
- `hub` — Gateway Hub
- `elevator` — Elevator I/O

---

## The 6 Protocols (Color-Coded)

| Protocol  | Color   | Hex       | Typical Devices |
|-----------|---------|-----------|-----------------|
| Z-Wave    | Cyan    | `#00e5ff` | Motion, door/window, smoke |
| Zigbee    | Amber   | `#ffb300` | Temp sensors, smart switches |
| KNX       | Purple  | `#b388ff` | Lighting, shades, HVAC |
| BACnet    | Green   | `#69ff47` | HVAC, elevators, building systems |
| REST API  | Red     | `#ff6e6e` | Cameras, access control |
| MQTT      | Orange  | `#ff9a3c` | Relays, hubs, custom automations |

---

## Device Data Shape

Every placed device follows this exact structure:

```js
{
  id: "unique-string",         // e.g. "dev-1711234567-42"
  type: "hvac",                // one of the 16 device type keys
  protocol: "BACnet",          // one of the 6 protocol names
  floor: "3",                  // B | G | 2 | 3 | R
  x: 45,                       // % position on floor canvas (0-100)
  y: 62,                       // % position on floor canvas (0-100)
  label: "Master HVAC",        // display name
  status: "online",            // online | offline | warning
  room: "Master Bedroom",      // room name for export/reporting
}
```

---

## Pre-Seeded Demo Devices (15 total)

```
B: Gateway Hub (MQTT), HVAC (BACnet), Elevator I/O (BACnet), Valve Control (BACnet)
G: IP Camera (REST), Access Control (REST), Motion Sensor (Z-Wave/warning), Dimmer (KNX)
2: Temp/Humidity (Zigbee), Motorized Shade (KNX), Smoke Detector (Z-Wave)
3: Smart Switch (Zigbee), HVAC Thermostat (BACnet/offline)
R: IP Camera (REST), MQTT Relay (MQTT)
```

---

## Architecture — App.jsx

The app has **two views** managed by a `view` state:

### View 1: Homepage (`view === "home"`)
- Animated 3D isometric SVG building (5 stacked floors, each clickable)
- Live device ticker scrolling at bottom (all 15 devices cycling through)
- Floor status cards — click any to jump to that floor in the designer
- Protocol grid showing all 6 protocols with device counts
- Stats bar: total devices, floors, online/offline counts

### View 2: Designer (`view === "designer"`)
- Floor selector tabs: B · G · 2 · 3 · R
- 2D floor plan canvas:
  - Blueprint image rendered at 35% opacity (base64, correctly cropped per floor)
  - Device icons positioned at x/y percentages — draggable
  - Protocol color badge on each device icon
  - Status ring: green=online, red=offline, amber=warning
- Horizontal device picker strip (scroll to pick device type to add)
- Bottom sheet inspector — slides up on device tap (mobile-first)
  - Shows: device type, protocol, status, live simulated sensor readings
  - Per-device-type data: HVAC shows temp/setpoint/mode, Camera shows resolution/night vision, etc.

### Key State
```js
const [view, setView] = useState("home");          // "home" | "designer"
const [floor, setFloor] = useState("G");           // active floor key
const [devices, setDevices] = useState([...]);     // all placed devices array
const [selected, setSelected] = useState(null);    // selected device id
const [floorImgs, setFloorImgs] = useState({...}); // base64 blueprint per floor
const [addMode, setAddMode] = useState(null);      // device type being placed
```

---

## Floor Plan Images (In App.jsx)

Each floor has a real blueprint crop baked in as base64 in `FLOOR_PLANS`:

```js
const FLOOR_PLANS = {
  "B": "data:image/png;base64,...",   // Lower Level — cropped from architect drawing
  "G": "data:image/png;base64,...",   // Garden Floor
  "2": "data:image/png;base64,...",   // Parlor/2nd Floor
  "3": "data:image/png;base64,...",   // Third Floor
  "R": "data:image/png;base64,...",   // Roof
};
```

`FloorPlans.jsx` has clean hand-drawn vector SVG versions of all 5 floors
built from actual room dimensions. **These are not yet integrated into the
main designer** — that is the #1 priority task below.

---

## Design System

```js
// Color palette
background:    "#04090f"   // near-black deep navy — main bg
surface:       "#0a1628"   // cards, panels
border:        "#0d2137"   // subtle borders
cyan:          "#00e5ff"   // primary accent, Z-Wave, interactive elements
text:          "#e0f0ff"   // primary text
textMuted:     "#4a7a9b"   // secondary text, labels

// Protocol colors (also used for device badges)
zwave:   "#00e5ff"
zigbee:  "#ffb300"
knx:     "#b388ff"
bacnet:  "#69ff47"
rest:    "#ff6e6e"
mqtt:    "#ff9a3c"

// Status colors
online:  "#69ff47"
offline: "#ff6e6e"
warning: "#ffb300"

// Typography
fontFamily: "'JetBrains Mono', 'Courier New', monospace"
```

---

## Coding Standards

- **No external UI libraries** — everything is hand-coded CSS-in-JS inline styles
- **No TypeScript** — plain JavaScript/JSX
- **Functional components only** — hooks, no class components
- **Single file preference** — keep App.jsx as one file unless a component
  is genuinely reusable (like FloorPlans.jsx)
- **Mobile-first** — bottom sheet inspector, horizontal scroll, touch targets ≥44px
- **Dark theme only** — the whole app is dark navy/black, never white backgrounds
- **Monospace font throughout** — JetBrains Mono for all text, UI feels like a
  professional BAS terminal interface

---

## Prioritized Roadmap

### 🔴 Priority 1 — Integrate Vector Floor Plans
**File:** `FloorPlans.jsx` → integrate into `App.jsx` designer canvas

Replace the base64 blueprint images with the clean SVG floor plans from
`FloorPlans.jsx`. The SVG should render as the canvas background at ~25-30%
opacity so device icons remain readable on top.

Each floor's SVG component: `<FloorB />`, `<FloorG />`, `<Floor2 />`,
`<Floor3 />`, `<FloorR />` — render the correct one based on active `floor` state.

```jsx
// In the designer canvas div:
<div style={{ position: "relative", width: "100%", height: "100%" }}>
  {/* SVG floor plan as background */}
  <div style={{ position: "absolute", inset: 0, opacity: 0.28, pointerEvents: "none" }}>
    {floor === "B" && <FloorB />}
    {floor === "G" && <FloorG />}
    {floor === "2" && <Floor2 />}
    {floor === "3" && <Floor3 />}
    {floor === "R" && <FloorR />}
  </div>
  {/* Device icons on top */}
  {devices.filter(d => d.floor === floor).map(d => (
    <DeviceIcon key={d.id} device={d} />
  ))}
</div>
```

---

### 🟠 Priority 2 — Desktop Layout

Current layout is mobile-first. Add a responsive desktop layout at ≥1024px:

```
┌──────────────────────────────────────────────────┐
│  NexusBAS Header                    [Floor tabs] │
├─────────────┬────────────────────────┬────────────┤
│             │                        │            │
│  Device     │    Floor Plan Canvas   │  Inspector │
│  Palette    │    (with SVG overlay)  │  Panel     │
│  (left)     │                        │  (right)   │
│             │                        │            │
└─────────────┴────────────────────────┴────────────┘
```

- Left sidebar: device type palette (grouped by category)
- Center: floor plan canvas (main area, flex-grow)
- Right sidebar: device inspector (appears when device selected)
- Mobile (<1024px): keep current bottom sheet approach

---

### 🟡 Priority 3 — Device Connection Lines

Draw SVG connection lines between devices on the same floor:

- Line color = protocol color of the source device
- Dashed stroke = wireless protocol (Z-Wave, Zigbee, MQTT)
- Solid stroke = wired protocol (KNX, BACnet, REST)
- Line weight = 1.5px normal, 2.5px when either device is selected
- Only show lines for the active floor
- Lines should be interactive — click a line to see connection info

```jsx
// SVG overlay on canvas for connection lines
<svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
  {connections.map(conn => {
    const from = devices.find(d => d.id === conn.fromId);
    const to = devices.find(d => d.id === conn.toId);
    return (
      <line
        key={conn.id}
        x1={`${from.x}%`} y1={`${from.y}%`}
        x2={`${to.x}%`} y2={`${to.y}%`}
        stroke={PROTOCOL_COLORS[from.protocol]}
        strokeWidth={2}
        strokeDasharray={isWireless(from.protocol) ? "6,4" : "none"}
        opacity={0.7}
      />
    );
  })}
</svg>
```

---

### 🟢 Priority 4 — PDF Export

Generate a per-floor PDF report containing:
- Floor plan image (SVG exported to canvas)
- Device list table: name, type, protocol, room, status
- Protocol summary: count per protocol
- Stats: total devices, online/offline/warning counts

Use the browser's native print API:
```js
const exportFloorPDF = (floor) => {
  window.print(); // with a print-specific CSS that shows only the report
};
```

Or use `jspdf` + `html2canvas` for more control.

---

### 🔵 Priority 5 — JSON Export for BAS Handoff

Export all device placements as structured JSON for the actual BAS backend:

```js
const exportJSON = () => {
  const payload = {
    property: "196 West Houston Street",
    exportedAt: new Date().toISOString(),
    floors: FLOORS.map(f => ({
      key: f,
      name: FLOOR_NAMES[f],
      devices: devices
        .filter(d => d.floor === f)
        .map(({ id, type, protocol, x, y, label, status, room }) => ({
          id, type, protocol, x, y, label, status, room
        }))
    }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nexusbas-196-w-houston.json";
  a.click();
};
```

---

### ⚪ Priority 6 — Future

- **Save/Load** — localStorage persistence of device placements
- **Multi-property** — support multiple buildings/projects
- **Real device integration** — connect to actual MQTT broker or BACnet gateway
- **Mobile app** — Capacitor wrapper for iOS/Android
- **User auth** — Clerk authentication (already used in SoulfulIQ stack)
- **Cloud sync** — save placements to a database

---

## Deployment

### Railway (Current)
```
GitHub push to main → Railway auto-deploys
Build: npm run build (Vite → dist/)
Start: npm run start (vite preview --host 0.0.0.0 --port $PORT)
```

### Local Development
```bash
npm install
npm run dev    # → http://localhost:5173
```

### Environment Variables
None required for frontend-only mode. Future backend features may need:
- `VITE_MQTT_BROKER_URL` — MQTT WebSocket endpoint
- `VITE_API_URL` — Backend API base URL

---

## Git Workflow

```bash
# Make changes in Claude Code / Copilot / Cursor
git add .
git commit -m "feat: description of what changed"
git push origin main
# → Railway auto-deploys in ~60 seconds
```

### Commit Message Format
```
feat: add desktop sidebar layout
fix: floor plan SVG not rendering on mobile
chore: update dependencies
refactor: extract DeviceIcon into separate component
docs: update roadmap in copilot-instructions
```

---

## Property Reference

**196 West Houston Street**  
West Village, Manhattan, New York City  
$13.8M · 7,200 SF · 5 Levels · ~22' wide townhouse  
Built: ~1900s, fully renovated  

Neighbors on both sides, standard NYC rowhouse footprint (~22' wide × ~80-100' deep).
The building sits on an irregular lot — the Garden Floor has an angled front facing the street.

---

*NexusBAS © 2025 — For device planning and BAS design purposes only*
