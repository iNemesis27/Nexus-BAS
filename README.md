# NexusBAS — Building Automation System Designer

**Property:** 196 West Houston Street, West Village, NYC  
**Stack:** React 18 + Vite · Zero dependencies beyond React

---

## Quick Start

```bash
npm install
npm run dev        # → localhost:5173
npm run build      # production build
```

---

## Features

- **5-Level Floor Designer** — Lower Level → Garden → Parlor → Third → Roof
- **16 Device Types** — Motion, HVAC, Camera, Access Control, Elevator I/O, etc.
- **6 Protocols** — Z-Wave, Zigbee, KNX, BACnet, REST API, MQTT (color-coded)
- **Embedded Floor Plans** — Real blueprint crops from 196 W Houston, correctly cropped per floor
- **Vector Floor Plans** — Clean hand-drawn SVG floor plans (FloorPlans.jsx)
- **Live Device Inspector** — Hover tooltips with real-time sensor data per device type
- **3D Isometric Building** — Animated homepage with floor status and device ticker
- **Mobile-First Layout** — Bottom sheet inspector, horizontal scroll device picker
- **15 Pre-seeded Demo Devices** — One per protocol/floor combination

---

## Project Structure

```
src/
  App.jsx          ← Main NexusBAS designer app (full featured)
  FloorPlans.jsx   ← Standalone clean vector floor plan drawings
  main.jsx         ← React entry point
public/
  favicon.svg
index.html
vite.config.js
package.json
```

---

## Floor Plan Reference — 196 W Houston St

| Floor | Label         | Key Rooms |
|-------|---------------|-----------|
| B     | Lower Level   | Mech 15'×13'6", Gym 19'4"×15'5", Storage, Sauna, Laundry, Ele.Mech |
| G     | Garden Floor  | Garden 25'×29', Great Room 22'×35'6" (Ceil 11'8"), 2-Car Garage, Foyer |
| 2     | Parlor Floor  | Terrace 22'6"×28'4", Living Room 22'7"×18'9" (Ceil 9'3"), Kitchen/Dining |
| 3     | Third Floor   | Master Bed 13'11"×13'8" (Ceil 13'1"), Sitting Room, 2× Bedrooms, WICs |
| R     | Roof          | Roof Terrace 24'1"×36'9" |

---

## Deploy

**Vercel / Netlify** — push repo, zero config needed (Vite auto-detected)  
**GitHub Pages** — set build output to `dist/`

---

*NexusBAS © 2025 · For device planning purposes only*
