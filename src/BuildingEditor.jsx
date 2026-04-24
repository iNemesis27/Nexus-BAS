import { useState, useRef } from "react";

const C = {
  bg: "#04090f", surface: "#080f1a", panel: "#0a1628",
  border: "#0d2137", border2: "#1a3a5c",
  cyan: "#00e5ff", green: "#69ff47", amber: "#ffb300",
  red: "#ff6e6e", purple: "#b388ff", orange: "#ff9a3c",
  text: "#e0f0ff", text2: "#7ab3d4", text3: "#3a6a8a",
  font: "'JetBrains Mono', 'Courier New', monospace",
};

const PROTOCOLS = { "Z-Wave": "#00e5ff", Zigbee: "#ffb300", KNX: "#b388ff", BACnet: "#69ff47", REST: "#ff6e6e", MQTT: "#ff9a3c" };
const DEVICE_TYPES = ["motion", "smoke", "temp", "door", "water", "switch", "dimmer", "valve", "hvac", "shade", "camera", "access", "intercom", "relay", "hub", "elevator"];
const DEVICE_ICONS = { motion: "MOT", smoke: "SMK", temp: "TMP", door: "DOR", water: "H2O", switch: "SWT", dimmer: "DIM", valve: "VLV", hvac: "HVC", shade: "SHD", camera: "CAM", access: "ACC", intercom: "INT", relay: "RLY", hub: "HUB", elevator: "ELV" };
const FLOORS = { B: "Lower Level", G: "Garden", "2": "Parlor/2nd", "3": "Third", R: "Roof" };
const ROOM_COLORS = ["#0a1e30", "#0a2018", "#1a1020", "#1a1510", "#1a0a0a", "#0d1a2a"];

export default function BuildingEditor({ setView }) {
  const [floor, setFloor] = useState("G");
  const [editMode, setEditMode] = useState("select");
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState("room");
  const [placeType, setPlaceType] = useState("motion");
  const [placeProto, setPlaceProto] = useState("Z-Wave");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ label: "", color: ROOM_COLORS[0] });
  const canvasRef = useRef(null);

  const [devices, setDevices] = useState([
    { id: 1, type: "hvac", protocol: "BACnet", floor: "G", x: 35, y: 45, label: "Great Room HVAC", status: "online" },
    { id: 2, type: "camera", protocol: "REST", floor: "G", x: 75, y: 12, label: "Garden Camera", status: "online" },
    { id: 3, type: "motion", protocol: "Z-Wave", floor: "G", x: 55, y: 62, label: "Foyer Motion", status: "warning" },
    { id: 4, type: "hub", protocol: "MQTT", floor: "B", x: 30, y: 50, label: "BAS Gateway", status: "online" },
  ]);

  const [rooms, setRooms] = useState({
    B: [
      { id: 1, label: "Mech Room", x: 3, y: 3, w: 42, h: 28, color: "#0a1e30", doors: [], windows: [] },
      { id: 2, label: "Gym", x: 3, y: 33, w: 42, h: 30, color: "#0a2018", doors: [], windows: [] },
      { id: 3, label: "Storage", x: 50, y: 3, w: 44, h: 20, color: "#0a1e30", doors: [], windows: [] },
      { id: 4, label: "Sauna", x: 50, y: 25, w: 20, h: 20, color: "#1a1510", doors: [], windows: [] },
      { id: 5, label: "Laundry", x: 72, y: 25, w: 22, h: 20, color: "#0a1e30", doors: [], windows: [] },
    ],
    G: [
      { id: 1, label: "Garden", x: 3, y: 3, w: 58, h: 30, color: "#0a2018", doors: [], windows: [] },
      { id: 2, label: "Great Room", x: 3, y: 35, w: 58, h: 45, color: "#0a1628", doors: [], windows: [] },
      { id: 3, label: "Garage", x: 65, y: 35, w: 30, h: 32, color: "#0a1e30", doors: [], windows: [] },
      { id: 4, label: "Foyer", x: 65, y: 70, w: 30, h: 10, color: "#0d1a2a", doors: [], windows: [] },
    ],
    "2": [
      { id: 1, label: "Terrace", x: 3, y: 3, w: 88, h: 32, color: "#0a1e20", doors: [], windows: [] },
      { id: 2, label: "Living Room", x: 3, y: 38, w: 55, h: 35, color: "#0a1628", doors: [], windows: [] },
      { id: 3, label: "Kitchen / Dining", x: 3, y: 76, w: 88, h: 20, color: "#0a1e30", doors: [], windows: [] },
    ],
    "3": [
      { id: 1, label: "Master Bedroom", x: 3, y: 3, w: 45, h: 45, color: "#0a1628", doors: [], windows: [] },
      { id: 2, label: "WIC", x: 50, y: 3, w: 20, h: 22, color: "#0a1e30", doors: [], windows: [] },
      { id: 3, label: "Sitting Room", x: 3, y: 50, w: 45, h: 28, color: "#0a1628", doors: [], windows: [] },
      { id: 4, label: "Bedroom", x: 50, y: 50, w: 42, h: 28, color: "#0a1628", doors: [], windows: [] },
    ],
    R: [
      { id: 1, label: "Roof Terrace", x: 3, y: 3, w: 88, h: 88, color: "#0a1e20", doors: [], windows: [] },
    ],
  });

  const floorRooms = rooms[floor] || [];
  const floorDevices = devices.filter((d) => d.floor === floor);
  const selectedRoom = selectedType === "room" ? floorRooms.find((r) => r.id === selected) : null;
  const selectedDevice = selectedType === "device" ? devices.find((d) => d.id === selected) : null;

  const getCanvasXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  };

  const handleCanvasClick = (e) => {
    if (editMode !== "place") return;
    const { x, y } = getCanvasXY(e);
    const newDevice = {
      id: Date.now(),
      type: placeType,
      protocol: placeProto,
      floor,
      x: Math.round(x),
      y: Math.round(y),
      label: `${placeType} ${floor}-${floorDevices.length + 1}`,
      status: "online",
    };
    setDevices((prev) => [...prev, newDevice]);
    setSelected(newDevice.id);
    setSelectedType("device");
    setEditMode("select");
  };

  const addRoom = () => {
    if (!newRoom.label.trim()) return;
    const id = Date.now();
    setRooms((prev) => ({
      ...prev,
      [floor]: [...(prev[floor] || []), { id, label: newRoom.label, x: 10, y: 10, w: 30, h: 25, color: newRoom.color, doors: [], windows: [] }],
    }));
    setShowAddRoom(false);
    setNewRoom({ label: "", color: ROOM_COLORS[0] });
    setSelected(id);
    setSelectedType("room");
  };

  const updateRoom = (id, key, val) => {
    setRooms((prev) => ({
      ...prev,
      [floor]: prev[floor].map((r) => r.id === id ? { ...r, [key]: val } : r),
    }));
  };

  const deleteRoom = (id) => {
    setRooms((prev) => ({ ...prev, [floor]: prev[floor].filter((r) => r.id !== id) }));
    setSelected(null);
  };

  const addDoor = (roomId) => {
    setRooms((prev) => ({
      ...prev,
      [floor]: prev[floor].map((r) => r.id === roomId ? { ...r, doors: [...r.doors, { id: Date.now(), wall: "bottom", pos: 50, width: 8 }] } : r),
    }));
  };

  const addWindow = (roomId) => {
    setRooms((prev) => ({
      ...prev,
      [floor]: prev[floor].map((r) => r.id === roomId ? { ...r, windows: [...r.windows, { id: Date.now(), wall: "top", pos: 30, width: 15 }] } : r),
    }));
  };

  const updateDevice = (id, key, val) => setDevices((prev) => prev.map((d) => d.id === id ? { ...d, [key]: val } : d));
  const deleteDevice = (id) => { setDevices((prev) => prev.filter((d) => d.id !== id)); setSelected(null); };

  const Sel = ({ value, onChange, options, style = {} }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ background: C.panel, border: "1px solid " + C.border2, borderRadius: 4, padding: "6px 8px", color: C.text, fontFamily: C.font, fontSize: 10, outline: "none", cursor: "pointer", width: "100%", ...style }}>
      {options.map((o) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  );

  const Inp = ({ label, value, onChange, type = "text" }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 4, letterSpacing: "0.1em" }}>{label.toUpperCase()}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", background: C.panel, border: "1px solid " + C.border2, borderRadius: 4, padding: "7px 10px", color: C.text, fontFamily: C.font, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.font, color: C.text }}>
      <div style={{ background: C.surface + "ee", borderBottom: "1px solid " + C.border, padding: "0 16px", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 46 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setView("admin")} style={{ background: "none", border: "none", color: C.text3, cursor: "pointer", fontSize: 11, fontFamily: C.font }}>{"<-"} Admin</button>
            <span style={{ color: C.border2 }}>|</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>Building Editor</span>
            <span style={{ display: "inline-block", padding: "2px 7px", background: C.purple + "18", border: "1px solid " + C.purple + "44", borderRadius: 3, fontSize: 9, color: C.purple, fontFamily: C.font, fontWeight: 600 }}>ADMIN ONLY</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: C.green + "18", border: "1px solid " + C.green + "44", color: C.green, fontFamily: C.font, fontSize: 10, fontWeight: 700, padding: "6px 16px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em" }}>SAVE CHANGES</button>
            <button style={{ background: C.cyan + "18", border: "1px solid " + C.cyan + "44", color: C.cyan, fontFamily: C.font, fontSize: 10, fontWeight: 700, padding: "6px 16px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em" }}>PUBLISH TO CLIENTS</button>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {Object.entries(FLOORS).map(([k, v]) => (
            <button key={k} onClick={() => setFloor(k)} style={{ padding: "7px 16px", background: "none", border: "none", borderBottom: "2px solid " + (floor === k ? C.purple : "transparent"), color: floor === k ? C.purple : C.text3, fontFamily: C.font, fontSize: 9, fontWeight: 700, cursor: "pointer", letterSpacing: "0.1em" }}>
              {k} · {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "210px 1fr 260px", height: "calc(100vh - 92px)", overflow: "hidden" }}>
        <div style={{ background: C.surface, borderRight: "1px solid " + C.border, padding: 14, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.15em", marginBottom: 10 }}>EDIT MODE</div>
          {[
            { id: "select", label: "Select / Move" },
            { id: "place", label: "Place Device" },
          ].map((m) => (
            <button key={m.id} onClick={() => setEditMode(m.id)} style={{ display: "block", width: "100%", textAlign: "left", background: editMode === m.id ? C.purple + "18" : "transparent", border: "1px solid " + (editMode === m.id ? C.purple + "44" : C.border), borderRadius: 4, color: editMode === m.id ? C.purple : C.text2, fontFamily: C.font, fontSize: 10, fontWeight: 700, padding: "7px 12px", cursor: "pointer", marginBottom: 5 }}>
              {m.label}
            </button>
          ))}

          {editMode === "place" && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: C.panel, border: "1px solid " + C.border, borderRadius: 4 }}>
              <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.1em", marginBottom: 6 }}>DEVICE TYPE</div>
              <Sel value={placeType} onChange={setPlaceType} options={DEVICE_TYPES.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.1em", marginBottom: 6 }}>PROTOCOL</div>
              <Sel value={placeProto} onChange={setPlaceProto} options={Object.keys(PROTOCOLS).map((p) => ({ value: p, label: p }))} />
              <div style={{ marginTop: 10, fontSize: 10, color: C.purple, lineHeight: 1.5 }}>Click canvas to place</div>
            </div>
          )}

          <div style={{ marginTop: 20, borderTop: "1px solid " + C.border, paddingTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.15em" }}>ROOMS ({floorRooms.length})</div>
              <button onClick={() => setShowAddRoom(!showAddRoom)} style={{ background: C.amber + "18", border: "1px solid " + C.amber + "44", color: C.amber, fontFamily: C.font, fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 3, cursor: "pointer" }}>+ ADD</button>
            </div>

            {showAddRoom && (
              <div style={{ background: C.panel, border: "1px solid " + C.amber + "44", borderRadius: 4, padding: 10, marginBottom: 10 }}>
                <input value={newRoom.label} onChange={(e) => setNewRoom((p) => ({ ...p, label: e.target.value }))} placeholder="Room name..." style={{ width: "100%", background: C.surface, border: "1px solid " + C.border2, borderRadius: 3, padding: "6px 8px", color: C.text, fontFamily: C.font, fontSize: 10, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
                <div style={{ fontSize: 9, color: C.text3, marginBottom: 5 }}>COLOR</div>
                <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                  {ROOM_COLORS.map((col) => (
                    <div key={col} onClick={() => setNewRoom((p) => ({ ...p, color: col }))} style={{ width: 20, height: 20, borderRadius: 3, background: col, border: newRoom.color === col ? "2px solid " + C.amber : "1px solid " + C.border, cursor: "pointer" }} />
                  ))}
                </div>
                <button onClick={addRoom} style={{ width: "100%", background: C.amber + "18", border: "1px solid " + C.amber + "44", color: C.amber, fontFamily: C.font, fontSize: 9, fontWeight: 700, padding: "6px", borderRadius: 3, cursor: "pointer" }}>CREATE ROOM</button>
              </div>
            )}

            {floorRooms.map((r) => (
              <div key={r.id} onClick={() => { setSelected(r.id); setSelectedType("room"); }} style={{ padding: "7px 10px", marginBottom: 4, background: selected === r.id && selectedType === "room" ? C.amber + "15" : C.panel, border: "1px solid " + (selected === r.id && selectedType === "room" ? C.amber + "44" : C.border), borderRadius: 4, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: r.color, border: "1px solid " + C.border2, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: selected === r.id && selectedType === "room" ? C.amber : C.text, fontWeight: 600 }}>{r.label}</span>
                </div>
                <div style={{ fontSize: 9, color: C.text3, marginTop: 2 }}>{r.doors.length}D · {r.windows.length}W</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, borderTop: "1px solid " + C.border, paddingTop: 14 }}>
            <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.15em", marginBottom: 10 }}>DEVICES ({floorDevices.length})</div>
            {floorDevices.map((d) => (
              <div key={d.id} onClick={() => { setSelected(d.id); setSelectedType("device"); }} style={{ padding: "7px 10px", marginBottom: 4, background: selected === d.id && selectedType === "device" ? C.cyan + "12" : C.panel, border: "1px solid " + (selected === d.id && selectedType === "device" ? C.cyan + "44" : C.border), borderRadius: 4, cursor: "pointer" }}>
                <div style={{ fontSize: 10, color: selected === d.id && selectedType === "device" ? C.cyan : C.text, fontWeight: 600 }}>{d.label}</div>
                <div style={{ fontSize: 9, color: C.text3, marginTop: 2 }}>{d.type} · {d.protocol}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={canvasRef} onClick={handleCanvasClick} style={{ position: "relative", overflow: "hidden", background: "#02060e", cursor: editMode === "place" ? "crosshair" : "default" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(" + C.border + "55 1px,transparent 1px),linear-gradient(90deg," + C.border + "55 1px,transparent 1px)", backgroundSize: "5% 5%", pointerEvents: "none" }} />

          {floorRooms.map((room) => (
            <div key={room.id} onClick={(e) => { e.stopPropagation(); if (editMode === "select") { setSelected(room.id); setSelectedType("room"); } }} style={{ position: "absolute", left: room.x + "%", top: room.y + "%", width: room.w + "%", height: room.h + "%", background: room.color, border: "1px solid " + (selected === room.id && selectedType === "room" ? C.amber : C.border2), boxSizing: "border-box", cursor: editMode === "select" ? "pointer" : "default" }}>
              <div style={{ position: "absolute", top: 4, left: 6, fontSize: 10, color: C.text3, fontFamily: C.font, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, pointerEvents: "none" }}>{room.label}</div>

              {room.doors.map((door) => (
                <div key={door.id} style={{ position: "absolute", ...(door.wall === "bottom" ? { bottom: -3, left: door.pos + "%", transform: "translateX(-50%)" } : door.wall === "top" ? { top: -3, left: door.pos + "%", transform: "translateX(-50%)" } : door.wall === "left" ? { left: -3, top: door.pos + "%", transform: "translateY(-50%)" } : { right: -3, top: door.pos + "%", transform: "translateY(-50%)" }), width: door.wall === "left" || door.wall === "right" ? 6 : door.width + "%", height: door.wall === "left" || door.wall === "right" ? door.width + "%" : 6, background: C.amber, borderRadius: 2, zIndex: 5 }} title="Door" />
              ))}

              {room.windows.map((win) => (
                <div key={win.id} style={{ position: "absolute", ...(win.wall === "top" ? { top: -2, left: win.pos + "%", transform: "translateX(-50%)" } : win.wall === "bottom" ? { bottom: -2, left: win.pos + "%", transform: "translateX(-50%)" } : win.wall === "left" ? { left: -2, top: win.pos + "%", transform: "translateY(-50%)" } : { right: -2, top: win.pos + "%", transform: "translateY(-50%)" }), width: win.wall === "left" || win.wall === "right" ? 4 : win.width + "%", height: win.wall === "left" || win.wall === "right" ? win.width + "%" : 4, background: "#88ccff", borderRadius: 1, zIndex: 5 }} title="Window" />
              ))}

              {selected === room.id && selectedType === "room" && (
                <>
                  {["top left", "top right", "bottom left", "bottom right"].map((pos) => (
                    <div key={pos} style={{ position: "absolute", width: 10, height: 10, background: C.amber, border: "1px solid " + C.bg, borderRadius: 2, zIndex: 10, ...(pos.includes("top") ? { top: 0 } : { bottom: 0 }), ...(pos.includes("left") ? { left: 0 } : { right: 0 }) }} />
                  ))}
                </>
              )}
            </div>
          ))}

          {floorDevices.map((d) => (
            <div key={d.id} onClick={(e) => { e.stopPropagation(); if (editMode === "select") { setSelected(d.id); setSelectedType("device"); } }} style={{ position: "absolute", left: d.x + "%", top: d.y + "%", transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: selected === d.id && selectedType === "device" ? 15 : 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: PROTOCOLS[d.protocol] + "25", border: "2px solid " + (selected === d.id && selectedType === "device" ? "#fff" : PROTOCOLS[d.protocol]), display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: PROTOCOLS[d.protocol], fontFamily: C.font }}>{DEVICE_ICONS[d.type] || "?"}</span>
                <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: d.status === "online" ? C.green : d.status === "warning" ? C.amber : C.red, border: "1px solid " + C.bg }} />
              </div>
              <div style={{ position: "absolute", top: 38, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: PROTOCOLS[d.protocol], fontFamily: C.font, whiteSpace: "nowrap", fontWeight: 700, textShadow: "0 0 4px " + C.bg }}>{d.label.slice(0, 14)}</div>
            </div>
          ))}

          {editMode === "place" && (
            <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", background: C.purple + "cc", border: "1px solid " + C.purple, borderRadius: 4, padding: "6px 16px", fontSize: 11, color: C.text, fontFamily: C.font, fontWeight: 700, zIndex: 20 }}>
              PLACE MODE - Click to drop {placeType}
            </div>
          )}
        </div>

        <div style={{ background: C.surface, borderLeft: "1px solid " + C.border, padding: 16, overflowY: "auto" }}>
          {selectedRoom ? (
            <>
              <div style={{ fontSize: 10, color: C.amber, letterSpacing: "0.15em", marginBottom: 16, fontWeight: 700 }}>ROOM INSPECTOR</div>
              <Inp label="Room Name" value={selectedRoom.label} onChange={(v) => updateRoom(selected, "label", v)} />
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>ROOM COLOR</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ROOM_COLORS.map((col) => (
                    <div key={col} onClick={() => updateRoom(selected, "color", col)} style={{ width: 24, height: 24, borderRadius: 3, background: col, border: selectedRoom.color === col ? "2px solid " + C.amber : "1px solid " + C.border, cursor: "pointer" }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {[["X %", "x"], ["Y %", "y"], ["W %", "w"], ["H %", "h"]].map(([label, key]) => (
                  <div key={key}>
                    <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 4, letterSpacing: "0.1em" }}>{label}</div>
                    <input type="number" min="0" max="95" value={selectedRoom[key]} onChange={(e) => updateRoom(selected, key, Number(e.target.value))} style={{ width: "100%", background: C.panel, border: "1px solid " + C.border2, borderRadius: 3, padding: "6px 8px", color: C.text, fontFamily: C.font, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid " + C.border, paddingTop: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 9, color: C.amber, letterSpacing: "0.12em", fontWeight: 700 }}>DOORS ({selectedRoom.doors.length})</div>
                  <button onClick={() => addDoor(selected)} style={{ background: C.amber + "18", border: "1px solid " + C.amber + "44", color: C.amber, fontFamily: C.font, fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 3, cursor: "pointer" }}>+ ADD</button>
                </div>
                {selectedRoom.doors.map((door, i) => (
                  <div key={door.id} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 4, padding: "8px 10px", marginBottom: 6 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div>
                        <div style={{ fontSize: 8, color: C.text3, marginBottom: 3 }}>WALL</div>
                        <select value={door.wall} onChange={(e) => updateRoom(selected, "doors", selectedRoom.doors.map((d, j) => j === i ? { ...d, wall: e.target.value } : d))} style={{ width: "100%", background: C.surface, border: "1px solid " + C.border2, borderRadius: 3, padding: "4px 6px", color: C.text, fontFamily: C.font, fontSize: 9, outline: "none" }}>
                          {["top", "bottom", "left", "right"].map((w) => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 8, color: C.text3, marginBottom: 3 }}>POSITION %</div>
                        <input type="number" min="5" max="90" value={door.pos} onChange={(e) => updateRoom(selected, "doors", selectedRoom.doors.map((d, j) => j === i ? { ...d, pos: Number(e.target.value) } : d))} style={{ width: "100%", background: C.surface, border: "1px solid " + C.border2, borderRadius: 3, padding: "4px 6px", color: C.text, fontFamily: C.font, fontSize: 9, outline: "none", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    <button onClick={() => updateRoom(selected, "doors", selectedRoom.doors.filter((_, j) => j !== i))} style={{ marginTop: 6, background: C.red + "15", border: "1px solid " + C.red + "33", color: C.red, fontFamily: C.font, fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 3, cursor: "pointer" }}>REMOVE</button>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid " + C.border, paddingTop: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 9, color: "#88ccff", letterSpacing: "0.12em", fontWeight: 700 }}>WINDOWS ({selectedRoom.windows.length})</div>
                  <button onClick={() => addWindow(selected)} style={{ background: "#88ccff18", border: "1px solid #88ccff44", color: "#88ccff", fontFamily: C.font, fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 3, cursor: "pointer" }}>+ ADD</button>
                </div>
                {selectedRoom.windows.map((win, i) => (
                  <div key={win.id} style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 4, padding: "8px 10px", marginBottom: 6 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div>
                        <div style={{ fontSize: 8, color: C.text3, marginBottom: 3 }}>WALL</div>
                        <select value={win.wall} onChange={(e) => updateRoom(selected, "windows", selectedRoom.windows.map((w, j) => j === i ? { ...w, wall: e.target.value } : w))} style={{ width: "100%", background: C.surface, border: "1px solid " + C.border2, borderRadius: 3, padding: "4px 6px", color: C.text, fontFamily: C.font, fontSize: 9, outline: "none" }}>
                          {["top", "bottom", "left", "right"].map((w) => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 8, color: C.text3, marginBottom: 3 }}>POSITION %</div>
                        <input type="number" min="5" max="85" value={win.pos} onChange={(e) => updateRoom(selected, "windows", selectedRoom.windows.map((w, j) => j === i ? { ...w, pos: Number(e.target.value) } : w))} style={{ width: "100%", background: C.surface, border: "1px solid " + C.border2, borderRadius: 3, padding: "4px 6px", color: C.text, fontFamily: C.font, fontSize: 9, outline: "none", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    <button onClick={() => updateRoom(selected, "windows", selectedRoom.windows.filter((_, j) => j !== i))} style={{ marginTop: 6, background: C.red + "15", border: "1px solid " + C.red + "33", color: C.red, fontFamily: C.font, fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 3, cursor: "pointer" }}>REMOVE</button>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid " + C.border, paddingTop: 12 }}>
                <div style={{ fontSize: 9, color: C.text3, marginBottom: 8 }}>CLIENT VIEW</div>
                <div style={{ background: C.panel, border: "1px solid " + C.border, borderRadius: 4, padding: "8px 10px", fontSize: 10, color: C.text2, lineHeight: 1.7 }}>
                  Clients will see this room as <span style={{ color: C.amber, fontWeight: 700 }}>{selectedRoom.label}</span> on Floor {floor}
                </div>
                <button onClick={() => deleteRoom(selected)} style={{ width: "100%", marginTop: 12, background: C.red + "18", border: "1px solid " + C.red + "44", color: C.red, fontFamily: C.font, fontSize: 10, fontWeight: 700, padding: "8px", borderRadius: 4, cursor: "pointer" }}>DELETE ROOM</button>
              </div>
            </>
          ) : selectedDevice ? (
            <>
              <div style={{ fontSize: 10, color: C.cyan, letterSpacing: "0.15em", marginBottom: 16, fontWeight: 700 }}>DEVICE INSPECTOR</div>
              <Inp label="Label" value={selectedDevice.label} onChange={(v) => updateDevice(selected, "label", v)} />
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 4, letterSpacing: "0.1em" }}>TYPE</div>
                <Sel value={selectedDevice.type} onChange={(v) => updateDevice(selected, "type", v)} options={DEVICE_TYPES.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 4, letterSpacing: "0.1em" }}>PROTOCOL</div>
                <Sel value={selectedDevice.protocol} onChange={(v) => updateDevice(selected, "protocol", v)} options={Object.keys(PROTOCOLS).map((p) => ({ value: p, label: p }))} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 4, letterSpacing: "0.1em" }}>STATUS</div>
                <Sel value={selectedDevice.status} onChange={(v) => updateDevice(selected, "status", v)} options={["online", "offline", "warning"].map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {[["X %", "x"], ["Y %", "y"]].map(([label, key]) => (
                  <div key={key}>
                    <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 4, letterSpacing: "0.1em" }}>{label}</div>
                    <input type="number" min="0" max="99" value={selectedDevice[key]} onChange={(e) => updateDevice(selected, key, Number(e.target.value))} style={{ width: "100%", background: C.panel, border: "1px solid " + C.border2, borderRadius: 3, padding: "6px 8px", color: C.text, fontFamily: C.font, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <button onClick={() => deleteDevice(selected)} style={{ width: "100%", background: C.red + "18", border: "1px solid " + C.red + "44", color: C.red, fontFamily: C.font, fontSize: 10, fontWeight: 700, padding: "8px", borderRadius: 4, cursor: "pointer" }}>DELETE DEVICE</button>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: C.text3, fontSize: 11, textAlign: "center", gap: 10, padding: 20 }}>
              <div style={{ fontSize: 28, opacity: 0.2 }}>DIA</div>
              <div>Select a room or device to edit</div>
              <div style={{ fontSize: 9 }}>Use + ADD in the left panel to create new rooms</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
