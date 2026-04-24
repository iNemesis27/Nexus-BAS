
import { useState } from "react";

const C = {
  bg: "#04090f", surface: "#080f1a", panel: "#0a1628",
  border: "#0d2137", border2: "#1a3a5c",
  cyan: "#00e5ff", green: "#69ff47", amber: "#ffb300",
  red: "#ff6e6e", purple: "#b388ff",
  text: "#e0f0ff", text2: "#7ab3d4", text3: "#3a6a8a",
  font: "'JetBrains Mono', 'Courier New', monospace",
};

const ROLE_COLOR = { admin: C.purple, manager: C.cyan, staff: C.cyan, client: C.green, viewer: C.text3 };

export default function NavBar({ view, setView, userRole = null, userName = null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const publicLinks = [
    { id: "landing", label: "Home" },
    { id: "about", label: "About" },
    { id: "features", label: "Features" },
    { id: "contact", label: "Contact" },
  ];

  const appLinks = [
    { id: "portal", label: "My Portal", roles: ["admin", "manager", "staff", "client", "viewer"] },
    { id: "designer", label: "Designer", roles: ["admin", "manager", "staff"] },
    { id: "integrations", label: "Integrations", roles: ["admin", "manager"] },
    { id: "building-editor", label: "Building Editor", roles: ["admin", "manager"] },
    { id: "admin", label: "Admin", roles: ["admin"] },
  ];

  const visibleApp = appLinks.filter(l => !userRole || l.roles.includes(userRole));
  const isLanding = !userRole || view === "landing";

  return (
    <nav style={{
      background: C.surface + "f0", borderBottom: `1px solid ${C.border}`,
      backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 100,
      fontFamily: C.font,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>

          {/* Logo */}
          <button onClick={() => setView("landing")} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer",
          }}>
            <div style={{ width: 30, height: 30, background: C.cyan + "18", border: `1px solid ${C.cyan}44`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <polygon points="8,1 15,5 15,11 8,15 1,11 1,5" stroke={C.cyan} strokeWidth="1.2" fill={C.cyan + "20"}/>
                <polygon points="8,5 11,7 11,9 8,11 5,9 5,7" fill={C.cyan} opacity="0.6"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: C.cyan, letterSpacing: "0.06em", lineHeight: 1 }}>NexusBAS</div>
              <div style={{ fontSize: 7, color: C.text3, letterSpacing: "0.2em", lineHeight: 1.2 }}>BUILDING AUTOMATION</div>
            </div>
          </button>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
            {isLanding && publicLinks.map(l => (
              <button key={l.id} onClick={() => setView(l.id)} style={{
                background: "none", border: "none", color: view === l.id ? C.cyan : C.text2,
                fontFamily: C.font, fontSize: 10, cursor: "pointer", padding: "6px 12px",
                borderRadius: 4, fontWeight: view === l.id ? 700 : 400, letterSpacing: "0.06em",
                borderBottom: view === l.id ? `1px solid ${C.cyan}` : "1px solid transparent",
              }}>{l.label}</button>
            ))}
            {userRole && visibleApp.map(l => (
              <button key={l.id} onClick={() => setView(l.id)} style={{
                background: view === l.id ? C.cyan + "15" : "none",
                border: `1px solid ${view === l.id ? C.cyan + "44" : "transparent"}`,
                color: view === l.id ? C.cyan : C.text2,
                fontFamily: C.font, fontSize: 10, cursor: "pointer", padding: "5px 12px",
                borderRadius: 4, fontWeight: view === l.id ? 700 : 400, letterSpacing: "0.06em",
              }}>{l.label}</button>
            ))}
          </div>

          {/* Right: user pill or login */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {userRole ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: ROLE_COLOR[userRole] + "18", border: `1px solid ${ROLE_COLOR[userRole]}44`, borderRadius: 4, padding: "3px 8px", fontSize: 9, color: ROLE_COLOR[userRole], fontWeight: 700, letterSpacing: "0.1em" }}>
                  {userRole.toUpperCase()}
                </div>
                <div style={{ fontSize: 10, color: C.text2 }}>{userName}</div>
              </div>
            ) : (
              <button onClick={() => setView("login")} style={{
                background: C.cyan + "18", border: `1px solid ${C.cyan}44`,
                color: C.cyan, fontFamily: C.font, fontSize: 10, fontWeight: 700,
                padding: "7px 18px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em",
              }}>LOG IN</button>
            )}
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: C.text2, cursor: "pointer", fontSize: 18, padding: 4 }} className="mobile-only">
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 0 16px" }}>
            {[...publicLinks, ...visibleApp].map(l => (
              <button key={l.id} onClick={() => { setView(l.id); setMenuOpen(false); }} style={{
                display: "block", width: "100%", textAlign: "left",
                background: view === l.id ? C.cyan + "12" : "none",
                border: "none", color: view === l.id ? C.cyan : C.text2,
                fontFamily: C.font, fontSize: 11, cursor: "pointer",
                padding: "10px 8px", letterSpacing: "0.06em",
              }}>{l.label}</button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) { .mobile-only { display: none !important; } }
        @media (max-width: 639px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  );
}
