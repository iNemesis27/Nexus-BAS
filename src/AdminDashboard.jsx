import { useState } from "react";

const C = {
  bg: "#04090f", surface: "#080f1a", panel: "#0a1628",
  border: "#0d2137", border2: "#1a3a5c",
  cyan: "#00e5ff", green: "#69ff47", amber: "#ffb300",
  red: "#ff6e6e", purple: "#b388ff", orange: "#ff9a3c",
  text: "#e0f0ff", text2: "#7ab3d4", text3: "#3a6a8a",
  font: "'JetBrains Mono', 'Courier New', monospace",
};

const ROLES = { admin: C.purple, staff: C.cyan, client: C.green };
const STATUS_C = { open: C.amber, assigned: C.cyan, "in-progress": C.orange, resolved: C.green, closed: C.text3 };

const MOCK_PROJECTS = [
  { id: 1, name: "196 W Houston St", type: "Residential Townhouse", floors: 5, devices: 15, client: "Alex Morgan", staff: "Jordan Lee", status: "active", city: "New York, NY" },
  { id: 2, name: "88 Pine Street", type: "Commercial Office", floors: 12, devices: 48, client: "Sarah Chen", staff: "Jordan Lee", status: "active", city: "New York, NY" },
  { id: 3, name: "210 Canal Street", type: "Mixed Use", floors: 8, devices: 32, client: "David Kim", staff: null, status: "pending", city: "New York, NY" },
];

const MOCK_USERS = [
  { id: 1, name: "Rauni Andre", email: "rauni@nexusbas.com", role: "admin", projects: ["all"], joined: "2026-01-01", status: "active" },
  { id: 2, name: "Alex Morgan", email: "alex@westhouston.com", role: "client", projects: [1], joined: "2026-01-15", status: "active" },
  { id: 3, name: "Sarah Chen", email: "sarah@pinestreet.com", role: "client", projects: [2], joined: "2026-02-10", status: "active" },
  { id: 4, name: "David Kim", email: "david@canal210.com", role: "client", projects: [3], joined: "2026-03-20", status: "pending" },
  { id: 5, name: "Jordan Lee", email: "jordan@nexusbas.com", role: "staff", projects: [1, 2], joined: "2026-01-05", status: "active" },
  { id: 6, name: "Sam Rivera", email: "sam@nexusbas.com", role: "staff", projects: [], joined: "2026-04-01", status: "active" },
];

const MOCK_REQUESTS = [
  { id: 1, title: "HVAC not responding on Floor 3", project: "196 W Houston St", client: "Alex Morgan", priority: "high", status: "assigned", assignee: "Jordan Lee", submitted: "2026-04-20", updated: "2026-04-21" },
  { id: 2, title: "Add 4 new motion sensors to lobby", project: "88 Pine Street", client: "Sarah Chen", priority: "medium", status: "open", assignee: null, submitted: "2026-04-22", updated: "2026-04-22" },
  { id: 3, title: "Schedule quarterly BAS audit", project: "196 W Houston St", client: "Alex Morgan", priority: "low", status: "in-progress", assignee: "Jordan Lee", submitted: "2026-04-18", updated: "2026-04-23" },
  { id: 4, title: "Access control integration for main entrance", project: "210 Canal Street", client: "David Kim", priority: "high", status: "open", assignee: null, submitted: "2026-04-23", updated: "2026-04-23" },
  { id: 5, title: "Roof terrace camera offline", project: "196 W Houston St", client: "Alex Morgan", priority: "high", status: "resolved", assignee: "Jordan Lee", submitted: "2026-04-15", updated: "2026-04-16" },
];

const Badge = ({ label, color, small }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: small ? "2px 6px" : "3px 8px", background: color + "18", border: `1px solid ${color}44`, borderRadius: 3, fontSize: small ? 9 : 10, color, fontFamily: C.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
);

const Btn = ({ children, onClick, variant = "primary", small }) => {
  const v = { primary: { bg: C.cyan+"20", border: C.cyan, color: C.cyan }, danger: { bg: C.red+"20", border: C.red, color: C.red }, ghost: { bg: "transparent", border: C.border2, color: C.text2 }, success: { bg: C.green+"20", border: C.green, color: C.green } }[variant];
  return <button onClick={onClick} style={{ background: v.bg, border: `1px solid ${v.border}`, color: v.color, borderRadius: 4, padding: small ? "4px 10px" : "7px 16px", fontFamily: C.font, fontSize: small ? 9 : 10, fontWeight: 600, cursor: "pointer", letterSpacing: "0.08em" }}>{children}</button>;
};

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 4, padding: "6px 10px", color: C.text, fontFamily: C.font, fontSize: 10, outline: "none", cursor: "pointer" }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const OverviewTab = ({ projects, users, requests }) => {
  const stats = [
    { label: "Active Projects", value: projects.filter(p => p.status === "active").length, color: C.green, icon: "⬡" },
    { label: "Total Clients", value: users.filter(u => u.role === "client").length, color: C.cyan, icon: "◉" },
    { label: "Staff Members", value: users.filter(u => u.role === "staff").length, color: C.purple, icon: "◈" },
    { label: "Open Requests", value: requests.filter(r => r.status === "open").length, color: C.amber, icon: "▣" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "14px 16px", borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: 18, color: s.color }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: C.font, margin: "4px 0 2px" }}>{s.value}</div>
            <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, letterSpacing: "0.1em" }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: C.cyan, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>ACTIVE PROJECTS</div>
          {projects.filter(p => p.status === "active").map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 11, color: C.text, fontFamily: C.font, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginTop: 2 }}>{p.type} · {p.devices} devices</div>
              </div>
              <Badge label={p.client} color={C.green} small />
            </div>
          ))}
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: C.amber, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>OPEN REQUESTS</div>
          {requests.filter(r => r.status === "open").map(r => (
            <div key={r.id} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: C.text, fontFamily: C.font, fontWeight: 600 }}>{r.title.slice(0,34)}{r.title.length > 34 ? "..." : ""}</span>
                <Badge label={r.priority} color={r.priority === "high" ? C.red : r.priority === "medium" ? C.amber : C.green} small />
              </div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font }}>{r.project} · {r.client}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectsTab = ({ projects, setProjects, users }) => {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Residential", city: "", client: "", staff: "", floors: 1, devices: 0 });
  const staffList = users.filter(u => u.role === "staff");
  const clientList = users.filter(u => u.role === "client");

  const addProject = () => {
    if (!form.name.trim()) return;
    setProjects(prev => [...prev, { ...form, id: Date.now(), status: "pending", floors: Number(form.floors), devices: Number(form.devices) }]);
    setShowNew(false);
    setForm({ name: "", type: "Residential", city: "", client: "", staff: "", floors: 1, devices: 0 });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={() => setShowNew(!showNew)}>+ NEW PROJECT</Btn>
      </div>
      {showNew && (
        <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 6, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: C.cyan, fontFamily: C.font, fontWeight: 700, marginBottom: 14, letterSpacing: "0.1em" }}>NEW PROJECT</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[["Building Name", "name"], ["City", "city"]].map(([label, key]) => (
              <div key={key}>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 5, letterSpacing: "0.1em" }}>{label.toUpperCase()}</div>
                <input value={form[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))} style={{ background: C.panel, border: `1px solid ${C.border2}`, borderRadius: 4, padding: "7px 10px", color: C.text, fontFamily: C.font, fontSize: 11, width: "100%", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 5, letterSpacing: "0.1em" }}>TYPE</div>
              <Select value={form.type} onChange={v => setForm(p => ({...p, type: v}))} options={["Residential", "Commercial", "Mixed Use", "Industrial"].map(t => ({ value: t, label: t }))} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 5, letterSpacing: "0.1em" }}>ASSIGN CLIENT</div>
              <Select value={form.client} onChange={v => setForm(p => ({...p, client: v}))} options={[{ value: "", label: "Unassigned" }, ...clientList.map(u => ({ value: u.name, label: u.name }))]} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 5, letterSpacing: "0.1em" }}>ASSIGN STAFF</div>
              <Select value={form.staff} onChange={v => setForm(p => ({...p, staff: v}))} options={[{ value: "", label: "Unassigned" }, ...staffList.map(u => ({ value: u.name, label: u.name }))]} />
            </div>
            {[["Floors", "floors"], ["Devices", "devices"]].map(([label, key]) => (
              <div key={key}>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginBottom: 5, letterSpacing: "0.1em" }}>{label.toUpperCase()}</div>
                <input type="number" value={form[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))} style={{ background: C.panel, border: `1px solid ${C.border2}`, borderRadius: 4, padding: "7px 10px", color: C.text, fontFamily: C.font, fontSize: 11, width: "100%", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={addProject}>CREATE PROJECT</Btn>
            <Btn variant="ghost" onClick={() => setShowNew(false)}>CANCEL</Btn>
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, borderLeft: `3px solid ${p.status === "active" ? C.green : C.amber}` }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: p.status === "active" ? C.green : C.amber, fontFamily: C.font, minWidth: 32 }}>⬡</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: C.text, fontFamily: C.font, fontWeight: 700 }}>{p.name}</span>
                <Badge label={p.status} color={p.status === "active" ? C.green : C.amber} small />
                <Badge label={p.type} color={C.cyan} small />
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 10, color: C.text2, fontFamily: C.font }}>
                <span>{p.city}</span>
                <span>{p.floors} floors · {p.devices} devices</span>
                {p.client && <span style={{ color: C.green }}>Client: {p.client}</span>}
                {p.staff ? <span style={{ color: C.cyan }}>Staff: {p.staff}</span> : <span style={{ color: C.amber }}>No staff assigned</span>}
              </div>
            </div>
            <Btn variant="ghost" small>EDIT</Btn>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersTab = ({ users, setUsers, projects }) => {
  const updateRole = (id, role) => setUsers(prev => prev.map(u => u.id === id ? {...u, role} : u));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
        {["admin", "staff", "client"].map(role => (
          <div key={role} style={{ background: C.surface, border: `1px solid ${ROLES[role]}44`, borderRadius: 6, padding: "10px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: ROLES[role], fontFamily: C.font }}>
              {users.filter(u => u.role === role).length}
            </div>
            <div style={{ fontSize: 9, color: ROLES[role], fontFamily: C.font, fontWeight: 700, letterSpacing: "0.1em", marginTop: 2 }}>{role.toUpperCase()}S</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {users.map(u => (
          <div key={u.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: ROLES[u.role] + "20", border: `1px solid ${ROLES[u.role]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: ROLES[u.role], fontFamily: C.font, fontWeight: 700, flexShrink: 0 }}>
              {u.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.text, fontFamily: C.font, fontWeight: 600 }}>{u.name}</span>
                <Badge label={u.role} color={ROLES[u.role]} small />
                <Badge label={u.status} color={u.status === "active" ? C.green : C.amber} small />
              </div>
              <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font }}>{u.email}</div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginTop: 2 }}>
                Projects: {u.projects[0] === "all" ? "All" : u.projects.length > 0 ? projects.filter(p => u.projects.includes(p.id)).map(p => p.name).join(", ") : "None assigned"}
              </div>
            </div>
            {u.role !== "admin" && (
              <Select value={u.role} onChange={v => updateRole(u.id, v)}
                options={["staff", "client"].map(r => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const RequestsTab = ({ requests, setRequests, users }) => {
  const [filter, setFilter] = useState("all");
  const staffList = users.filter(u => u.role === "staff");
  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);
  const assign = (id, assignee) => setRequests(prev => prev.map(r => r.id === id ? {...r, assignee, status: assignee ? "assigned" : "open"} : r));
  const setStatus = (id, status) => setRequests(prev => prev.map(r => r.id === id ? {...r, status} : r));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "open", "assigned", "in-progress", "resolved"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 14px", borderRadius: 20, background: filter === s ? C.cyan + "20" : "transparent", border: `1px solid ${filter === s ? C.cyan : C.border}`, color: filter === s ? C.cyan : C.text2, fontSize: 10, fontFamily: C.font, cursor: "pointer", fontWeight: filter === s ? 700 : 400, letterSpacing: "0.08em" }}>
            {s.toUpperCase()}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 10, color: C.text3, fontFamily: C.font, alignSelf: "center" }}>
          {filtered.length} request{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "14px 18px", borderLeft: `3px solid ${STATUS_C[r.status]}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: C.text, fontFamily: C.font, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge label={r.project} color={C.cyan} small />
                  <Badge label={r.client} color={C.green} small />
                  <Badge label={r.priority} color={r.priority === "high" ? C.red : r.priority === "medium" ? C.amber : C.green} small />
                  <Badge label={r.status} color={STATUS_C[r.status]} small />
                </div>
              </div>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, textAlign: "right" }}>
                <div>Submitted: {r.submitted}</div>
                <div>Updated: {r.updated}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 9, color: C.text3, fontFamily: C.font }}>ASSIGN TO:</span>
              <Select value={r.assignee || ""} onChange={v => assign(r.id, v || null)}
                options={[{ value: "", label: "Unassigned" }, ...staffList.map(u => ({ value: u.name, label: u.name }))]} />
              <span style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginLeft: 8 }}>STATUS:</span>
              <Select value={r.status} onChange={v => setStatus(r.id, v)}
                options={["open", "assigned", "in-progress", "resolved", "closed"].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const TABS = [
    { id: "overview", label: "OVERVIEW", icon: "◈" },
    { id: "projects", label: "PROJECTS", icon: "⬡" },
    { id: "users", label: "USERS & ROLES", icon: "◉" },
    { id: "requests", label: "REQUESTS", icon: "▣" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.font, color: C.text }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border}22 1px,transparent 1px),linear-gradient(90deg,${C.border}22 1px,transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ background: C.surface + "ee", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(8px)", padding: "0 20px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, background: C.purple + "20", border: `1px solid ${C.purple}44`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: C.purple, fontSize: 12 }}>⬡</span>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: C.purple, letterSpacing: "0.06em" }}>NexusBAS</div>
                <div style={{ fontSize: 8, color: C.text3, letterSpacing: "0.15em" }}>ADMIN DASHBOARD</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font }}>{projects.length} projects · {users.length} users · {requests.filter(r => r.status === "open").length} open</div>
              <div style={{ background: C.purple + "20", border: `1px solid ${C.purple}44`, borderRadius: 4, padding: "4px 10px", fontSize: 9, color: C.purple, fontFamily: C.font, fontWeight: 700, letterSpacing: "0.08em" }}>ADMIN</div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 16px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? C.purple : "transparent"}`, color: tab === t.id ? C.purple : C.text3, fontFamily: C.font, fontSize: 9, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5 }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: "16px 20px", maxWidth: "100%", boxSizing: "border-box" }}>
          {tab === "overview"  && <OverviewTab projects={projects} users={users} requests={requests} />}
          {tab === "projects"  && <ProjectsTab projects={projects} setProjects={setProjects} users={users} />}
          {tab === "users"     && <UsersTab users={users} setUsers={setUsers} projects={projects} />}
          {tab === "requests"  && <RequestsTab requests={requests} setRequests={setRequests} users={users} />}
        </div>
      </div>
    </div>
  );
}
