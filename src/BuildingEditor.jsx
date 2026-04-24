
import { useState, useRef } from "react";

export default function BuildingEditor({ setView }) {
  const C = {
    bg: "#04090f", surface: "#080f1a", panel: "#0a1628",
    border: "#0d2137", border2: "#1a3a5c",
    cyan: "#00e5ff", green: "#69ff47", amber: "#ffb300",
    red: "#ff6e6e", purple: "#b388ff",
    text: "#e0f0ff", text2: "#7ab3d4", text3: "#3a6a8a",
    font: "'JetBrains Mono', 'Courier New', monospace",
  };

  const FLOORS = { B: "Lower Level", G: "Garden", "2": "Parlor/2nd", "3": "Third", R: "Roof" };
  const PROTOCOLS = { "Z-Wave": "#00e5ff", Zigbee: "#ffb300", KNX: "#b388ff", BACnet: "#69ff47", REST: "#ff6e6e", MQTT: "#ff9a3c" };
  const DEVICE_TYPES = ["motion", "smoke", "temp", "door", "water", "switch", "dimmer", "valve", "hvac", "shade", "camera", "access", "intercom", "relay", "hub", "elevator"];

  const [floor, setFloor] = useState("G");
  const [devices, setDevices] = useState([
    { id: 1, type: "hvac", protocol: "BACnet", floor: "G", x: 35, y: 40, label: "Great Room HVAC", status: "online" },
    { id: 2, type: "camera", protocol: "REST", floor: "G", x: 70, y: 15, label: "Garden Camera", status: "online" },
    { id: 3, type: "motion", protocol: "Z-Wave", floor: "G", x: 55, y: 55, label: "Foyer Motion", status: "warning" },
    { id: 4, type: "hub", protocol: "MQTT", floor: "B", x: 30, y: 50, label: "BAS Gateway", status: "online" },
  ]);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState("select"); // select | place
  const [placeType, setPlaceType] = useState("motion");
  const [placeProto, setPlaceProto] = useState("Z-Wave");
  const [rooms, setRooms] = useState({
    B: [{ id: 1, label: "Mech Room", x: 5, y: 5, w: 40, h: 25, color: "#0d2137" }],
    G: [{ id: 1, label: "Great Room", x: 5, y: 30, w: 55, h: 50, color: "#0d2137" }, { id: 2, label: "Garden", x: 5, y: 2, w: 55, h: 26, color: "#0d2830" }],
    "2": [{ id: 1, label: "Terrace", x: 5, y: 2, w: 88, h: 35, color: "#0d2137" }],
    "3": [{ id: 1, label: "Master Bed", x: 5, y: 5, w: 45, h: 45, color: "#0d2137" }],
    R: [{ id: 1, label: "Roof Terrace", x: 5, y: 5, w: 88, h: 88, color: "#0d2137" }],
  });
  const canvasRef = useRef(null);
  const selectedDevice = devices.find(d => d.id === selected);
  const floorDevices = devices.filter(d => d.floor === floor);

  const handleCanvasClick = (e) => {
    if (editMode !== "place") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const newDevice = {
      id: Date.now(), type: placeType, protocol: placeProto,
      floor, x, y, label: `${placeType} ${floor}-${floorDevices.length + 1}`, status: "online",
    };
    setDevices(prev => [...prev, newDevice]);
    setSelected(newDevice.id);
    setEditMode("select");
  };

  const updateDevice = (id, key, val) => setDevices(prev => prev.map(d => d.id === id ? { ...d, [key]: val } : d));
  const deleteDevice = (id) => { setDevices(prev => prev.filter(d => d.id !== id)); setSelected(null); };

  const Badge = ({ label, color }) => (
    <span style={{ display: "inline-block", padding: "2px 6px", background: color + "20", border: `1px solid ${color}44`, borderRadius: 3, fontSize: 9, color, fontFamily: C.font, fontWeight: 600, textTransform: "uppercase" }}>{label}</span>
  );

  const Select = ({ value, onChange, options, style = {} }) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ background: C.panel, border: `1px solid ${C.border2}`, borderRadius: 4, padding: "6px 10px", color: C.text, fontFamily: C.font, fontSize: 10, outline: "none", cursor: "pointer", ...style }}>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.font, color: C.text }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border}22 1px,transparent 1px),linear-gradient(90deg,${C.border}22 1px,transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ background: C.surface + "ee", borderBottom: `1px solid ${C.border}`, padding: "0 20px", backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setView("admin")} style={{ background: "none", border: "none", color: C.text3, cursor: "pointer", fontSize: 10, fontFamily: C.font }}>← Admin</button>
              <span style={{ color: C.border2 }}>|</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.purple }}>Building Editor</span>
              <Badge label="Admin Only" color={C.purple} />
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: C.text3 }}>{devices.length} devices total</span>
              <button style={{ background: C.green + "18", border: `1px solid ${C.green}44`, color: C.green, fontFamily: C.font, fontSize: 9, fontWeight: 700, padding: "5px 14px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em" }}>SAVE CHANGES</button>
              <button style={{ background: C.cyan + "18", border: `1px solid ${C.cyan}44`, color: C.cyan, fontFamily: C.font, fontSize: 9, fontWeight: 700, padding: "5px 14px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em" }}>PUBLISH TO CLIENTS</button>
            </div>
          </div>
          {/* Floor tabs */}
          <div style={{ display: "flex" }}>
            {Object.entries(FLOORS).map(([k, v]) => (
              <button key={k} onClick={() => setFloor(k)} style={{ padding: "8px 18px", background: "none", border: "none", borderBottom: `2px solid ${floor === k ? C.purple : "transparent"}`, color: floor === k ? C.purple : C.text3, fontFamily: C.font, fontSize: 9, fontWeight: 700, cursor: "pointer", letterSpacing: "0.1em" }}>
                {k} · {v}
              </button>
            ))}
          </div>
        </div>

        {/* Main 3-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 260px", height: "calc(100vh - 96px)", overflow: "hidden" }}>

          {/* LEFT — Tools */}
          <div style={{ background: C.surface, borderRight: `1px solid ${C.border}`, padding: 16, overflowY: "auto" }}>
            <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.15em", marginBottom: 12 }}>EDIT MODE</div>
            {[{ id: "select", label: "Select / Move", icon: "↖" }, { id: "place", label: "Place Device", icon: "+" }].map(m => (
              <button key={m.id} onClick={() => setEditMode(m.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: editMode === m.id ? C.purple + "18" : "transparent", border: `1px solid ${editMode === m.id ? C.purple + "44" : C.border}`, borderRadius: 4, color: editMode === m.id ? C.purple : C.text2, fontFamily: C.font, fontSize: 10, fontWeight: 700, padding: "8px 12px", cursor: "pointer", marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>{m.icon}</span> {m.label}
              </button>
            ))}

            {editMode === "place" && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.15em", marginBottom: 8 }}>DEVICE TYPE</div>
                <Select value={placeType} onChange={setPlaceType} options={DEVICE_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} style={{ width: "100%", marginBottom: 10 }} />
                <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.15em", marginBottom: 8 }}>PROTOCOL</div>
                <Select value={placeProto} onChange={setPlaceProto} options={Object.keys(PROTOCOLS).map(p => ({ value: p, label: p }))} style={{ width: "100%" }} />
                <div style={{ marginTop: 14, padding: "10px 12px", background: C.purple + "12", border: `1px solid ${C.purple}33`, borderRadius: 4, fontSize: 10, color: C.purple, lineHeight: 1.6 }}>
                  Click anywhere on the floor plan to place a {placeType} device
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, fontSize: 9, color: C.text3, letterSpacing: "0.15em", marginBottom: 8 }}>BLUEPRINT</div>
            <button style={{ display: "block", width: "100%", background: "transparent", border: `1px dashed ${C.border2}`, borderRadius: 4, color: C.text2, fontFamily: C.font, fontSize: 10, padding: "12px 8px", cursor: "pointer", textAlign: "center", lineHeight: 1.7 }}>
              ↑ UPLOAD<br />BLUEPRINT IMAGE
            </button>

            <div style={{ marginTop: 24, fontSize: 9, color: C.text3, letterSpacing: "0.15em", marginBottom: 8 }}>FLOOR DEVICES ({floorDevices.length})</div>
            {floorDevices.map(d => (
              <div key={d.id} onClick={() => setSelected(d.id)} style={{ padding: "8px 10px", marginBottom: 4, background: selected === d.id ? C.cyan + "12" : C.panel, border: `1px solid ${selected === d.id ? C.cyan + "44" : C.border}`, borderRadius: 4, cursor: "pointer" }}>
                <div style={{ fontSize: 10, color: selected === d.id ? C.cyan : C.text, fontWeight: 600 }}>{d.label}</div>
                <div style={{ fontSize: 9, color: C.text3, marginTop: 2 }}>{d.type} · {d.protocol}</div>
              </div>
            ))}
          </div>

          {/* CENTER — Canvas */}
          <div style={{ position: "relative", overflow: "hidden", background: C.bg }} ref={canvasRef}>
            <div
              onClick={handleCanvasClick}
              style={{ position: "relative", width: "100%", height: "100%", cursor: editMode === "place" ? "crosshair" : "default" }}
            >
              {/* Room labels */}
              {(rooms[floor] || []).map(room => (
                <div key={room.id} style={{ position: "absolute", left: `${room.x}%`, top: `${room.y}%`, width: `${room.w}%`, height: `${room.h}%`, border: `1px solid ${C.border2}`, borderRadius: 4, background: room.color + "88" }}>
                  <span style={{ position: "absolute", top: 6, left: 8, fontSize: 9, color: C.text3, fontFamily: C.font, letterSpacing: "0.1em", textTransform: "uppercase" }}>{room.label}</span>
                </div>
              ))}

              {/* Grid overlay */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border}44 1px,transparent 1px),linear-gradient(90deg,${C.border}44 1px,transparent 1px)`, backgroundSize: "5% 5%", pointerEvents: "none" }} />

              {/* Devices */}
              {floorDevices.map(d => (
                <div
                  key={d.id}
                  onClick={(e) => { e.stopPropagation(); if (editMode === "select") setSelected(d.id); }}
                  style={{
                    position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
                    transform: "translate(-50%, -50%)", cursor: "pointer",
                    zIndex: selected === d.id ? 10 : 5,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: PROTOCOLS[d.protocol] + "20", border: `2px solid ${selected === d.id ? "#fff" : PROTOCOLS[d.protocol]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                      {d.type === "camera" ? "◉" : d.type === "hvac" ? "◈" : d.type === "motion" ? "◎" : d.type === "hub" ? "⬡" : "●"}
                    </div>
                    <div style={{ position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)", fontSize: 8, color: PROTOCOLS[d.protocol], fontFamily: C.font, whiteSpace: "nowrap", fontWeight: 700 }}>
                      {d.label.slice(0, 12)}
                    </div>
                    {/* Status dot */}
                    <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: d.status === "online" ? "#69ff47" : d.status === "warning" ? "#ffb300" : "#ff6e6e", border: `1px solid ${C.bg}` }} />
                  </div>
                </div>
              ))}

              {/* Mode indicator */}
              {editMode === "place" && (
                <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", background: C.purple + "cc", border: `1px solid ${C.purple}`, borderRadius: 4, padding: "6px 16px", fontSize: 10, color: C.text, fontFamily: C.font, fontWeight: 700 }}>
                  PLACE MODE — Click to drop {placeType}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Inspector */}
          <div style={{ background: C.surface, borderLeft: `1px solid ${C.border}`, padding: 16, overflowY: "auto" }}>
            {selectedDevice ? (
              <>
                <div style={{ fontSize: 9, color: C.cyan, letterSpacing: "0.15em", marginBottom: 16, fontWeight: 700 }}>DEVICE INSPECTOR</div>

                {[
                  ["Label", "label", "text"],
                  ["Type", "type", "select", DEVICE_TYPES],
                  ["Protocol", "protocol", "select", Object.keys(PROTOCOLS)],
                  ["Status", "status", "select", ["online", "offline", "warning"]],
                  ["X Position", "x", "number"],
                  ["Y Position", "y", "number"],
                ].map(([label, key, type, opts]) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.1em", marginBottom: 5 }}>{label.toUpperCase()}</div>
                    {type === "select" ? (
                      <Select value={selectedDevice[key]} onChange={v => updateDevice(selected, key, v)} options={opts.map(o => ({ value: o, label: o }))} style={{ width: "100%" }} />
                    ) : (
                      <input type={type} value={selectedDevice[key]} onChange={e => updateDevice(selected, key, type === "number" ? Number(e.target.value) : e.target.value)}
                        style={{ width: "100%", background: C.panel, border: `1px solid ${C.border2}`, borderRadius: 4, padding: "7px 10px", color: C.text, fontFamily: C.font, fontSize: 10, outline: "none", boxSizing: "border-box" }} />
                    )}
                  </div>
                ))}

                <div style={{ marginTop: 16, padding: "10px 12px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                  <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.1em", marginBottom: 8 }}>PROTOCOL COLOR</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Object.entries(PROTOCOLS).map(([p, col]) => (
                      <div key={p} onClick={() => updateDevice(selected, "protocol", p)} style={{ width: 20, height: 20, borderRadius: "50%", background: col, border: selectedDevice.protocol === p ? `2px solid white` : `1px solid ${col}`, cursor: "pointer", opacity: selectedDevice.protocol === p ? 1 : 0.5 }} />
                    ))}
                  </div>
                </div>

                <button onClick={() => deleteDevice(selected)} style={{ marginTop: 16, width: "100%", background: C.red + "18", border: `1px solid ${C.red}44`, color: C.red, fontFamily: C.font, fontSize: 10, fontWeight: 700, padding: "8px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em" }}>
                  DELETE DEVICE
                </button>

                <div style={{ marginTop: 20, fontSize: 9, color: C.text3, letterSpacing: "0.12em", marginBottom: 8 }}>CLIENT VIEW PREVIEW</div>
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 4, padding: "10px 12px", fontSize: 10, color: C.text2, lineHeight: 1.7 }}>
                  This device will appear on the client's portal as:<br />
                  <span style={{ color: PROTOCOLS[selectedDevice.protocol], fontWeight: 700 }}>{selectedDevice.label}</span><br />
                  <span style={{ color: C.text3 }}>Floor {selectedDevice.floor} · {selectedDevice.type} · {selectedDevice.status}</span>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: C.text3, fontSize: 11, textAlign: "center", padding: 24, gap: 12 }}>
                <div style={{ fontSize: 32, opacity: 0.3 }}>◈</div>
                <div>Select a device to inspect and edit it</div>
                <div style={{ fontSize: 9 }}>Or switch to Place Mode to add new devices to this floor</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
