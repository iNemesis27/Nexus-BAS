
import NavBar from "./components/NavBar";

const FEATURES = [
  { icon: "⬡", title: "Multi-protocol support", desc: "Z-Wave, Zigbee, KNX, BACnet, REST, MQTT — all managed from one interface.", color: "#00e5ff" },
  { icon: "◈", title: "Live floor plan designer", desc: "Drag and drop devices onto real blueprint floor plans. See your building in real time.", color: "#69ff47" },
  { icon: "◉", title: "Multi-building management", desc: "Manage multiple properties from a single admin dashboard. Assign teams and clients.", color: "#b388ff" },
  { icon: "▣", title: "Client request routing", desc: "Clients submit requests through a self-serve portal. Auto-route to the right staff member.", color: "#ffb300" },
  { icon: "◎", title: "Plugin integrations", desc: "Connect Alexa, Google Home, Apple HomeKit, IFTTT, and custom REST/MQTT endpoints.", color: "#ff6e6e" },
  { icon: "⊡", title: "Role-based access", desc: "Admin, Manager, Staff, Client, Viewer — every user sees exactly what they need to.", color: "#ff9a3c" },
];

const STATS = [
  { value: "6", label: "Protocols" },
  { value: "16+", label: "Device Types" },
  { value: "5", label: "User Roles" },
  { value: "100%", label: "Web-based" },
];

export default function Landing({ setView }) {
  const C = {
    bg: "#04090f", surface: "#080f1a", panel: "#0a1628",
    border: "#0d2137", border2: "#1a3a5c",
    cyan: "#00e5ff", green: "#69ff47", amber: "#ffb300",
    text: "#e0f0ff", text2: "#7ab3d4", text3: "#3a6a8a",
    font: "'JetBrains Mono', 'Courier New', monospace",
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: C.font, minHeight: "100vh" }}>
      {/* Grid bg */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border}33 1px,transparent 1px),linear-gradient(90deg,${C.border}33 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
          {/* Hex logo large */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <div style={{ position: "relative", width: 80, height: 80 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" stroke={C.cyan} strokeWidth="1.5" fill={C.cyan + "10"}/>
                <polygon points="40,18 58,28 58,48 40,58 22,48 22,28" stroke={C.cyan} strokeWidth="1" fill={C.cyan + "18"} opacity="0.7"/>
                <polygon points="40,28 50,34 50,46 40,52 30,46 30,34" fill={C.cyan} opacity="0.5"/>
              </svg>
            </div>
          </div>

          <div style={{ fontSize: 11, color: C.cyan, letterSpacing: "0.3em", marginBottom: 16 }}>BUILDING AUTOMATION SYSTEM</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: C.text, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Your building.<br />
            <span style={{ color: C.cyan }}>Fully intelligent.</span>
          </h1>
          <p style={{ fontSize: "clamp(13px, 2vw, 16px)", color: C.text2, lineHeight: 1.8, margin: "0 0 40px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            NexusBAS connects every device in your building — HVAC, lighting, security, access control — into a single intelligent platform. Manage everything from any screen, anywhere.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setView("portal")} style={{ background: C.cyan, border: "none", color: C.bg, fontFamily: C.font, fontSize: 12, fontWeight: 900, padding: "14px 32px", borderRadius: 6, cursor: "pointer", letterSpacing: "0.1em" }}>
              GET STARTED
            </button>
            <button onClick={() => setView("features")} style={{ background: "transparent", border: `1px solid ${C.border2}`, color: C.text2, fontFamily: C.font, fontSize: 12, fontWeight: 600, padding: "14px 32px", borderRadius: 6, cursor: "pointer", letterSpacing: "0.1em" }}>
              SEE FEATURES
            </button>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ padding: "0 24px 60px", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.cyan, fontFamily: C.font, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: C.text3, marginTop: 6, letterSpacing: "0.12em" }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding: "40px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 10, color: C.cyan, letterSpacing: "0.25em", marginBottom: 12 }}>CAPABILITIES</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 900, color: C.text, margin: 0 }}>Everything your building needs</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "24px 20px", borderTop: `2px solid ${f.color}` }}>
                <div style={{ fontSize: 24, color: f.color, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ padding: "40px 24px 60px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "40px 36px" }}>
            <div style={{ fontSize: 10, color: C.cyan, letterSpacing: "0.25em", marginBottom: 16 }}>ABOUT</div>
            <h2 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 900, color: C.text, margin: "0 0 20px" }}>Built for serious buildings</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.9, margin: 0 }}>
                  NexusBAS was built from the ground up to handle the complexity of real buildings — multi-floor townhouses, commercial offices, mixed-use developments. Not a toy. Not a demo.
                </p>
                <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.9, marginTop: 16 }}>
                  Every feature exists because a real building needed it. From 196 West Houston Street in the West Village to commercial properties across New York City.
                </p>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    ["Headquarters", "New York City, NY"],
                    ["Founded", "2026"],
                    ["Properties managed", "Growing"],
                    ["Stack", "React · Railway · PostgreSQL"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 11 }}>
                      <span style={{ color: C.text3 }}>{k}</span>
                      <span style={{ color: C.text }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ padding: "40px 24px 80px", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 10, color: C.cyan, letterSpacing: "0.25em", marginBottom: 12 }}>CONTACT</div>
            <h2 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 900, color: C.text, margin: "0 0 12px" }}>Ready to automate your building?</h2>
            <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.7 }}>Reach out to discuss your property and get a custom automation plan.</p>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 28px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[["Name", "text", "Your name"], ["Email", "email", "your@email.com"], ["Property", "text", "Building address"]].map(([label, type, ph]) => (
                <div key={label}>
                  <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.12em", marginBottom: 6 }}>{label.toUpperCase()}</div>
                  <input type={type} placeholder={ph} style={{ width: "100%", background: C.panel, border: `1px solid ${C.border2}`, borderRadius: 4, padding: "10px 12px", color: C.text, fontFamily: C.font, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.12em", marginBottom: 6 }}>MESSAGE</div>
                <textarea rows={4} placeholder="Tell us about your building and automation needs..." style={{ width: "100%", background: C.panel, border: `1px solid ${C.border2}`, borderRadius: 4, padding: "10px 12px", color: C.text, fontFamily: C.font, fontSize: 11, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <button style={{ background: C.cyan, border: "none", color: C.bg, fontFamily: C.font, fontSize: 11, fontWeight: 900, padding: "12px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.1em" }}>
                SEND MESSAGE
              </button>
            </div>
          </div>

          {/* Contact details */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 32 }}>
            {[
              ["Email", "hello@nexusbas.com"],
              ["Location", "New York City, NY"],
              ["Portal", "nexusbas.up.railway.app"],
            ].map(([k, v]) => (
              <div key={k} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.12em", marginBottom: 4 }}>{k.toUpperCase()}</div>
                <div style={{ fontSize: 10, color: C.text2 }}>{v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${C.border}`, padding: "24px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 12 }}>
            {["Home", "Features", "About", "Contact", "Portal"].map(l => (
              <button key={l} onClick={() => setView(l.toLowerCase())} style={{ background: "none", border: "none", color: C.text3, fontFamily: C.font, fontSize: 10, cursor: "pointer", letterSpacing: "0.08em" }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.15em" }}>
            NEXUSBAS © 2026 · BUILDING AUTOMATION SYSTEMS · NEW YORK CITY
          </div>
        </footer>
      </div>
    </div>
  );
}
