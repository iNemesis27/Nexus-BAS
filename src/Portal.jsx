// @ts-nocheck
import { useState, useEffect, useRef } from "react";

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
// Dark industrial BAS terminal aesthetic
// JetBrains Mono throughout — feels like a real building control system
// Cyan #00e5ff primary, deep navy #04090f base
// Glassmorphism panels on dark grid background

const C = {
  bg:       "#04090f",
  surface:  "#080f1a",
  panel:    "#0a1628",
  border:   "#0d2137",
  border2:  "#1a3a5c",
  cyan:     "#00e5ff",
  cyan2:    "#00b8cc",
  green:    "#69ff47",
  amber:    "#ffb300",
  red:      "#ff6e6e",
  purple:   "#b388ff",
  text:     "#e0f0ff",
  text2:    "#7ab3d4",
  text3:    "#3a6a8a",
  font:     "'JetBrains Mono', 'Courier New', monospace",
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Alex Morgan",
  property: "196 West Houston Street",
  tier: "Professional",
  floors: 5,
  devices: 15,
  joined: "2026-01-15",
};

const INIT_TASKS = [
  { id: 1, title: "Inspect HVAC units on Floor 3", priority: "high", status: "pending", floor: "3", due: "2026-04-10", created: "2026-04-02" },
  { id: 2, title: "Replace motion sensor — Garden Level", priority: "medium", status: "in-progress", floor: "G", due: "2026-04-08", created: "2026-04-01" },
  { id: 3, title: "Update BACnet gateway firmware", priority: "high", status: "pending", floor: "B", due: "2026-04-12", created: "2026-04-02" },
  { id: 4, title: "Test roof terrace camera feed", priority: "low", status: "complete", floor: "R", due: "2026-04-05", created: "2026-03-28" },
  { id: 5, title: "Calibrate Zigbee thermostat — Master Bed", priority: "medium", status: "complete", floor: "3", due: "2026-04-03", created: "2026-03-30" },
];

const INIT_NOTES = [
  { id: 1, title: "Sauna controller acting up", body: "Intermittent disconnects on the sauna control unit in Lower Level. Likely interference from new laundry appliance. Check Z-Wave channel spacing.", floor: "B", tag: "hardware", created: "2026-04-01" },
  { id: 2, title: "Garage door integration notes", body: "2-car garage door motor is BACnet compatible. Need to add it as a device in the Floor G designer. Model: LiftMaster 87504-267.", floor: "G", tag: "integration", created: "2026-03-30" },
  { id: 3, title: "Roof terrace lighting schedule", body: "Client wants automated dimming from 8pm-11pm on the roof. Set MQTT relay to 60% at sunset, 30% at 10pm, off at 11pm.", floor: "R", tag: "schedule", created: "2026-03-28" },
];

const INIT_SCHEDULE = [
  { id: 1, title: "Quarterly BAS Review", date: "2026-04-15", time: "10:00", type: "meeting", floor: "all", description: "Full system audit across all 5 floors" },
  { id: 2, title: "HVAC Filter Replacement", date: "2026-04-20", time: "09:00", type: "maintenance", floor: "3", description: "Third floor HVAC units — quarterly filter change" },
  { id: 3, title: "Security Camera Calibration", date: "2026-04-25", time: "14:00", type: "maintenance", floor: "G", description: "Garden floor and garage camera angles and motion zones" },
  { id: 4, title: "New Device Installation", date: "2026-05-02", time: "11:00", type: "installation", floor: "2", description: "Add water leak sensors under kitchen island and near dishwasher" },
];

const FLOORS = { B: "Lower Level", G: "Garden", "2": "Parlor/2nd", "3": "Third", R: "Roof", all: "All Floors" };
const PRIORITY_COLOR = { high: C.red, medium: C.amber, low: C.green };
const STATUS_COLOR = { pending: C.text3, "in-progress": C.cyan, complete: C.green };
const EVENT_COLOR = { meeting: C.purple, maintenance: C.amber, installation: C.cyan, inspection: C.green };

// ─── SHARED UI COMPONENTS ──────────────────────────────────────────────────────
const Badge = ({ label, color, small }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    padding: small ? "2px 6px" : "3px 8px",
    background: color + "18", border: `1px solid ${color}44`,
    borderRadius: 3, fontSize: small ? 9 : 10,
    color, fontFamily: C.font, letterSpacing: "0.06em",
    fontWeight: 600, textTransform: "uppercase",
  }}>{label}</span>
);

const Pill = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 14px", borderRadius: 20,
    background: active ? C.cyan + "20" : "transparent",
    border: `1px solid ${active ? C.cyan : C.border}`,
    color: active ? C.cyan : C.text2,
    fontSize: 10, fontFamily: C.font, cursor: "pointer",
    letterSpacing: "0.08em", fontWeight: active ? 700 : 400,
    transition: "all 0.15s",
  }}>{children}</button>
);

const Input = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input
    type={type} value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      background: C.surface, border: `1px solid ${C.border2}`,
      borderRadius: 4, padding: "8px 12px", color: C.text,
      fontFamily: C.font, fontSize: 11, width: "100%",
      outline: "none", boxSizing: "border-box", ...style,
    }}
  />
);

const TextArea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} rows={rows}
    style={{
      background: C.surface, border: `1px solid ${C.border2}`,
      borderRadius: 4, padding: "8px 12px", color: C.text,
      fontFamily: C.font, fontSize: 11, width: "100%",
      outline: "none", resize: "vertical", boxSizing: "border-box",
    }}
  />
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value} onChange={e => onChange(e.target.value)}
    style={{
      background: C.surface, border: `1px solid ${C.border2}`,
      borderRadius: 4, padding: "8px 12px", color: C.text,
      fontFamily: C.font, fontSize: 11, width: "100%",
      outline: "none", cursor: "pointer",
    }}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Btn = ({ children, onClick, variant = "primary", small, style = {} }) => {
  const variants = {
    primary:  { bg: C.cyan + "20", border: C.cyan, color: C.cyan },
    danger:   { bg: C.red  + "20", border: C.red,  color: C.red  },
    ghost:    { bg: "transparent", border: C.border2, color: C.text2 },
    success:  { bg: C.green + "20", border: C.green, color: C.green },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} style={{
      background: v.bg, border: `1px solid ${v.border}`, color: v.color,
      borderRadius: 4, padding: small ? "4px 10px" : "7px 16px",
      fontFamily: C.font, fontSize: small ? 9 : 10, fontWeight: 600,
      cursor: "pointer", letterSpacing: "0.08em",
      transition: "all 0.15s", ...style,
    }}>{children}</button>
  );
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 16,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.panel, border: `1px solid ${C.border2}`,
        borderRadius: 8, padding: 24, width: "100%", maxWidth: 480,
        maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ color: C.cyan, fontSize: 12, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.1em" }}>
            {title}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.text2, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
const OverviewTab = ({ tasks, notes, schedule, user }) => {
  const pending = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in-progress").length;
  const upcoming = schedule.filter(e => new Date(e.date) >= new Date()).slice(0, 3);
  const recentNotes = [...notes].sort((a, b) => b.id - a.id).slice(0, 3);

  const stats = [
    { label: "Devices Online", value: user.devices, color: C.green, icon: "◉" },
    { label: "Active Tasks", value: pending + inProgress, color: C.amber, icon: "▣" },
    { label: "Open Notes", value: notes.length, color: C.purple, icon: "✎" },
    { label: "Upcoming Events", value: upcoming.length, color: C.cyan, icon: "◈" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 6, padding: "16px 20px",
            borderTop: `2px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 22, color: s.color, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: C.font }}>{s.value}</div>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, letterSpacing: "0.1em", marginTop: 4 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Upcoming */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20 }}>
          <div style={{ fontSize: 10, color: C.cyan, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 16 }}>UPCOMING EVENTS</div>
          {upcoming.length === 0 ? (
            <div style={{ color: C.text3, fontSize: 10, fontFamily: C.font }}>No upcoming events</div>
          ) : upcoming.map(e => (
            <div key={e.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                minWidth: 40, textAlign: "center", background: EVENT_COLOR[e.type] + "18",
                border: `1px solid ${EVENT_COLOR[e.type]}44`, borderRadius: 4, padding: "4px 6px",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: EVENT_COLOR[e.type], fontFamily: C.font }}>
                  {new Date(e.date).getDate()}
                </div>
                <div style={{ fontSize: 8, color: EVENT_COLOR[e.type], fontFamily: C.font }}>
                  {new Date(e.date).toLocaleString("default", { month: "short" }).toUpperCase()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.text, fontFamily: C.font, fontWeight: 600 }}>{e.title}</div>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginTop: 2 }}>{e.time} · {FLOORS[e.floor]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Notes */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20 }}>
          <div style={{ fontSize: 10, color: C.cyan, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 16 }}>RECENT NOTES</div>
          {recentNotes.map(n => (
            <div key={n.id} style={{
              marginBottom: 12, paddingBottom: 12,
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: C.text, fontFamily: C.font, fontWeight: 600 }}>{n.title}</div>
                <Badge label={FLOORS[n.floor]} color={C.cyan} small />
              </div>
              <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font, lineHeight: 1.5 }}>
                {n.body.slice(0, 80)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floor Status */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20 }}>
        <div style={{ fontSize: 10, color: C.cyan, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 16 }}>FLOOR STATUS — 196 W HOUSTON ST</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {Object.entries(FLOORS).filter(([k]) => k !== "all").map(([key, name]) => {
            const floorTasks = tasks.filter(t => t.floor === key);
            const hasPending = floorTasks.some(t => t.status === "pending");
            const hasInProgress = floorTasks.some(t => t.status === "in-progress");
            const statusColor = hasInProgress ? C.amber : hasPending ? C.red : C.green;
            const statusLabel = hasInProgress ? "ACTIVE" : hasPending ? "PENDING" : "CLEAR";
            return (
              <div key={key} style={{
                background: C.panel, border: `1px solid ${statusColor}44`,
                borderRadius: 6, padding: "14px 12px", textAlign: "center",
                borderTop: `2px solid ${statusColor}`,
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: statusColor, fontFamily: C.font }}>{key}</div>
                <div style={{ fontSize: 8, color: C.text3, fontFamily: C.font, marginTop: 4, letterSpacing: "0.06em" }}>{name.toUpperCase()}</div>
                <div style={{ fontSize: 8, color: statusColor, fontFamily: C.font, marginTop: 8, fontWeight: 700, letterSpacing: "0.1em" }}>{statusLabel}</div>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginTop: 4 }}>{floorTasks.length} task{floorTasks.length !== 1 ? "s" : ""}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── TASKS TAB ────────────────────────────────────────────────────────────────
const TasksTab = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", priority: "medium", floor: "G", due: "", status: "pending" });

  const filtered = tasks.filter(t => {
    const matchStatus = filter === "all" || t.status === filter;
    const matchFloor = floorFilter === "all" || t.floor === floorFilter;
    return matchStatus && matchFloor;
  });

  const addTask = () => {
    if (!form.title.trim()) return;
    setTasks(prev => [...prev, { ...form, id: Date.now(), created: new Date().toISOString().split("T")[0] }]);
    setForm({ title: "", priority: "medium", floor: "G", due: "", status: "pending" });
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = { pending: "in-progress", "in-progress": "complete", complete: "pending" };
      return { ...t, status: next[t.status] };
    }));
  };

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "pending", "in-progress", "complete"].map(s => (
            <Pill key={s} active={filter === s} onClick={() => setFilter(s)}>
              {s === "all" ? "ALL" : s.toUpperCase()}
            </Pill>
          ))}
        </div>
        <Btn onClick={() => setShowModal(true)}>+ ADD TASK</Btn>
      </div>

      {/* Floor filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", ...Object.keys(FLOORS).filter(k => k !== "all")].map(f => (
          <Pill key={f} active={floorFilter === f} onClick={() => setFloorFilter(f)}>
            {f === "all" ? "ALL FLOORS" : `${f} · ${FLOORS[f]}`}
          </Pill>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ color: C.text3, fontSize: 11, fontFamily: C.font, textAlign: "center", padding: "40px 0" }}>
            No tasks match this filter
          </div>
        )}
        {filtered.map(task => (
          <div key={task.id} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 6, padding: "14px 16px",
            borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            {/* Status toggle */}
            <button onClick={() => toggleStatus(task.id)} style={{
              width: 22, height: 22, borderRadius: "50%",
              border: `2px solid ${STATUS_COLOR[task.status]}`,
              background: task.status === "complete" ? STATUS_COLOR[task.status] + "30" : "transparent",
              cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {task.status === "complete" && <span style={{ color: C.green, fontSize: 10 }}>✓</span>}
              {task.status === "in-progress" && <span style={{ color: C.cyan, fontSize: 8 }}>●</span>}
            </button>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 12, color: task.status === "complete" ? C.text3 : C.text,
                fontFamily: C.font, fontWeight: 600,
                textDecoration: task.status === "complete" ? "line-through" : "none",
              }}>{task.title}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                <Badge label={FLOORS[task.floor]} color={C.cyan} small />
                <Badge label={task.priority} color={PRIORITY_COLOR[task.priority]} small />
                <Badge label={task.status} color={STATUS_COLOR[task.status]} small />
                {task.due && (
                  <span style={{ fontSize: 9, color: C.text3, fontFamily: C.font }}>
                    Due: {task.due}
                  </span>
                )}
              </div>
            </div>

            <Btn onClick={() => deleteTask(task.id)} variant="danger" small>✕</Btn>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="ADD TASK">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>TASK TITLE</div>
            <Input value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Describe the task..." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>FLOOR</div>
              <Select value={form.floor} onChange={v => setForm(p => ({ ...p, floor: v }))}
                options={Object.entries(FLOORS).filter(([k]) => k !== "all").map(([k, v]) => ({ value: k, label: `${k} · ${v}` }))} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>PRIORITY</div>
              <Select value={form.priority} onChange={v => setForm(p => ({ ...p, priority: v }))}
                options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }]} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>DUE DATE</div>
            <Input type="date" value={form.due} onChange={v => setForm(p => ({ ...p, due: v }))} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>CANCEL</Btn>
            <Btn onClick={addTask}>CREATE TASK</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── NOTES TAB ────────────────────────────────────────────────────────────────
const NotesTab = ({ notes, setNotes }) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", floor: "G", tag: "general" });
  const [floorFilter, setFloorFilter] = useState("all");

  const filtered = notes.filter(n => floorFilter === "all" || n.floor === floorFilter);

  const addNote = () => {
    if (!form.title.trim()) return;
    setNotes(prev => [...prev, { ...form, id: Date.now(), created: new Date().toISOString().split("T")[0] }]);
    setForm({ title: "", body: "", floor: "G", tag: "general" });
    setShowModal(false);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const TAG_COLORS = { hardware: C.red, integration: C.cyan, schedule: C.purple, general: C.text2 };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, height: "calc(100vh - 280px)" }}>
      {/* Left — list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Select value={floorFilter} onChange={setFloorFilter}
            options={[{ value: "all", label: "All Floors" }, ...Object.entries(FLOORS).filter(([k]) => k !== "all").map(([k, v]) => ({ value: k, label: `${k} · ${v}` }))]}
          />
          <Btn onClick={() => setShowModal(true)} style={{ marginLeft: 8, whiteSpace: "nowrap" }}>+ NOTE</Btn>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.map(note => (
            <div key={note.id}
              onClick={() => setSelected(note)}
              style={{
                background: selected?.id === note.id ? C.cyan + "10" : C.surface,
                border: `1px solid ${selected?.id === note.id ? C.cyan + "44" : C.border}`,
                borderRadius: 6, padding: "14px 16px", marginBottom: 8,
                cursor: "pointer", transition: "all 0.15s",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: C.text, fontFamily: C.font, fontWeight: 600 }}>{note.title}</span>
                <Badge label={note.floor} color={C.cyan} small />
              </div>
              <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font, lineHeight: 1.4 }}>
                {note.body.slice(0, 60)}...
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                <Badge label={note.tag} color={TAG_COLORS[note.tag] || C.text2} small />
                <span style={{ fontSize: 9, color: C.text3, fontFamily: C.font }}>{note.created}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — detail */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 6, padding: 24,
        display: "flex", flexDirection: "column",
      }}>
        {selected ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, color: C.text, fontFamily: C.font, fontWeight: 700, marginBottom: 8 }}>{selected.title}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge label={FLOORS[selected.floor]} color={C.cyan} />
                  <Badge label={selected.tag} color={TAG_COLORS[selected.tag] || C.text2} />
                  <span style={{ fontSize: 9, color: C.text3, fontFamily: C.font, alignSelf: "center" }}>{selected.created}</span>
                </div>
              </div>
              <Btn onClick={() => deleteNote(selected.id)} variant="danger" small>DELETE</Btn>
            </div>
            <div style={{
              flex: 1, fontSize: 12, color: C.text2, fontFamily: C.font,
              lineHeight: 1.8, whiteSpace: "pre-wrap",
            }}>{selected.body}</div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.text3, fontSize: 11, fontFamily: C.font }}>
            Select a note to read it
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="ADD NOTE">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>TITLE</div>
            <Input value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Note title..." />
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>CONTENT</div>
            <TextArea value={form.body} onChange={v => setForm(p => ({ ...p, body: v }))} placeholder="Write your note..." rows={5} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>FLOOR</div>
              <Select value={form.floor} onChange={v => setForm(p => ({ ...p, floor: v }))}
                options={Object.entries(FLOORS).filter(([k]) => k !== "all").map(([k, v]) => ({ value: k, label: `${k} · ${v}` }))} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>TAG</div>
              <Select value={form.tag} onChange={v => setForm(p => ({ ...p, tag: v }))}
                options={[{ value: "general", label: "General" }, { value: "hardware", label: "Hardware" }, { value: "integration", label: "Integration" }, { value: "schedule", label: "Schedule" }]} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>CANCEL</Btn>
            <Btn onClick={addNote}>SAVE NOTE</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── SCHEDULE TAB ─────────────────────────────────────────────────────────────
const ScheduleTab = ({ schedule, setSchedule }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "09:00", type: "maintenance", floor: "G", description: "" });

  const sorted = [...schedule].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = sorted.filter(e => new Date(e.date) >= new Date());
  const past = sorted.filter(e => new Date(e.date) < new Date());

  const addEvent = () => {
    if (!form.title.trim() || !form.date) return;
    setSchedule(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ title: "", date: "", time: "09:00", type: "maintenance", floor: "G", description: "" });
    setShowModal(false);
  };

  const deleteEvent = (id) => setSchedule(prev => prev.filter(e => e.id !== id));

  const EventRow = ({ event, isPast }) => (
    <div style={{
      background: isPast ? C.surface + "80" : C.surface,
      border: `1px solid ${isPast ? C.border : EVENT_COLOR[event.type] + "44"}`,
      borderRadius: 6, padding: "16px 20px", marginBottom: 8,
      display: "flex", gap: 16, alignItems: "flex-start",
      opacity: isPast ? 0.6 : 1,
    }}>
      {/* Date block */}
      <div style={{
        minWidth: 52, textAlign: "center",
        background: EVENT_COLOR[event.type] + "18",
        border: `1px solid ${EVENT_COLOR[event.type]}44`,
        borderRadius: 6, padding: "8px 4px",
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: EVENT_COLOR[event.type], fontFamily: C.font, lineHeight: 1 }}>
          {new Date(event.date).getDate()}
        </div>
        <div style={{ fontSize: 9, color: EVENT_COLOR[event.type], fontFamily: C.font, marginTop: 2 }}>
          {new Date(event.date).toLocaleString("default", { month: "short" }).toUpperCase()}
        </div>
        <div style={{ fontSize: 8, color: C.text3, fontFamily: C.font, marginTop: 2 }}>
          {new Date(event.date).getFullYear()}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: C.text, fontFamily: C.font, fontWeight: 700 }}>{event.title}</span>
          <Badge label={event.type} color={EVENT_COLOR[event.type]} small />
          <Badge label={FLOORS[event.floor]} color={C.cyan} small />
        </div>
        <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font, marginBottom: 6 }}>{event.description}</div>
        <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font }}>⏰ {event.time}</div>
      </div>

      <Btn onClick={() => deleteEvent(event.id)} variant="danger" small>✕</Btn>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <Btn onClick={() => setShowModal(true)}>+ SCHEDULE EVENT</Btn>
      </div>

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: C.cyan, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>
            UPCOMING — {upcoming.length} event{upcoming.length !== 1 ? "s" : ""}
          </div>
          {upcoming.map(e => <EventRow key={e.id} event={e} />)}
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: C.text3, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>
            PAST EVENTS
          </div>
          {past.map(e => <EventRow key={e.id} event={e} isPast />)}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="SCHEDULE EVENT">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>EVENT TITLE</div>
            <Input value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Event name..." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>DATE</div>
              <Input type="date" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>TIME</div>
              <Input type="time" value={form.time} onChange={v => setForm(p => ({ ...p, time: v }))} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>TYPE</div>
              <Select value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))}
                options={[{ value: "meeting", label: "Meeting" }, { value: "maintenance", label: "Maintenance" }, { value: "installation", label: "Installation" }, { value: "inspection", label: "Inspection" }]} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>FLOOR</div>
              <Select value={form.floor} onChange={v => setForm(p => ({ ...p, floor: v }))}
                options={Object.entries(FLOORS).map(([k, v]) => ({ value: k, label: k === "all" ? "All Floors" : `${k} · ${v}` }))} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 6, letterSpacing: "0.1em" }}>DESCRIPTION</div>
            <TextArea value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} placeholder="Event details..." rows={3} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>CANCEL</Btn>
            <Btn onClick={addEvent}>SCHEDULE</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
const ProfileTab = ({ user }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 24 }}>
      <div style={{ fontSize: 10, color: C.cyan, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 20 }}>ACCOUNT DETAILS</div>
      {[
        ["Name", user.name],
        ["Property", user.property],
        ["Plan", user.tier],
        ["Member Since", user.joined],
        ["Floors", user.floors],
        ["Devices", user.devices],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 10, color: C.text3, fontFamily: C.font, letterSpacing: "0.08em" }}>{k.toUpperCase()}</span>
          <span style={{ fontSize: 11, color: C.text, fontFamily: C.font, fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>

    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 24 }}>
      <div style={{ fontSize: 10, color: C.cyan, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 20 }}>SYSTEM INFO</div>
      {[
        ["Protocol Mix", "Z-Wave · Zigbee · KNX · BACnet"],
        ["Designer Status", "Active"],
        ["Last Sync", "2026-04-02 14:32"],
        ["Repo", "iNemesis27/Nexus-BAS"],
        ["Deployment", "Railway · Auto-deploy"],
        ["Version", "v1.0.0"],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 10, color: C.text3, fontFamily: C.font, letterSpacing: "0.08em" }}>{k.toUpperCase()}</span>
          <span style={{ fontSize: 10, color: C.text2, fontFamily: C.font }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── MAIN PORTAL ──────────────────────────────────────────────────────────────
export default function NexusBASPortal() {
  const [tab, setTab] = useState("overview");
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [notes, setNotes] = useState(INIT_NOTES);
  const [schedule, setSchedule] = useState(INIT_SCHEDULE);

  const TABS = [
    { id: "overview", label: "OVERVIEW", icon: "◈" },
    { id: "tasks", label: "TASKS", icon: "▣" },
    { id: "notes", label: "NOTES", icon: "✎" },
    { id: "schedule", label: "SCHEDULE", icon: "◉" },
    { id: "profile", label: "PROFILE", icon: "⊡" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.font, color: C.text }}>
      {/* Global grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.border}22 1px, transparent 1px), linear-gradient(90deg, ${C.border}22 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{
          background: C.surface + "ee",
          borderBottom: `1px solid ${C.border}`,
          backdropFilter: "blur(8px)",
          padding: "0 32px",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32, background: C.cyan + "20",
                border: `1px solid ${C.cyan}44`, borderRadius: 4,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: C.cyan, fontSize: 14 }}>⬡</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: C.cyan, letterSpacing: "0.08em" }}>NexusBAS</div>
                <div style={{ fontSize: 8, color: C.text3, letterSpacing: "0.15em" }}>USER PORTAL</div>
              </div>
            </div>

            {/* Property */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.text, fontWeight: 700 }}>{MOCK_USER.property}</div>
              <div style={{ fontSize: 8, color: C.text3, letterSpacing: "0.1em" }}>{MOCK_USER.floors} FLOORS · {MOCK_USER.devices} DEVICES</div>
            </div>

            {/* User */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge label={MOCK_USER.tier} color={C.cyan} />
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: C.cyan + "20", border: `1px solid ${C.cyan}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: C.cyan, fontWeight: 700,
              }}>
                {MOCK_USER.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.text, fontWeight: 600 }}>{MOCK_USER.name}</div>
                <div style={{ fontSize: 8, color: C.text3, letterSpacing: "0.08em" }}>PROPERTY MANAGER</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 0 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${tab === t.id ? C.cyan : "transparent"}`,
                color: tab === t.id ? C.cyan : C.text3,
                fontFamily: C.font, fontSize: 10, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.1em",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
          {tab === "overview" && <OverviewTab tasks={tasks} notes={notes} schedule={schedule} user={MOCK_USER} />}
          {tab === "tasks"    && <TasksTab tasks={tasks} setTasks={setTasks} />}
          {tab === "notes"    && <NotesTab notes={notes} setNotes={setNotes} />}
          {tab === "schedule" && <ScheduleTab schedule={schedule} setSchedule={setSchedule} />}
          {tab === "profile"  && <ProfileTab user={MOCK_USER} />}
        </div>
      </div>
    </div>
  );
}
