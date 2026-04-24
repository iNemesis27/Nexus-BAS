import { useState } from "react";

export default function Integrations({ setView }) {
  const [connected, setConnected] = useState({ alexa: false, google: false, homekit: false, ifttt: false, mqtt: true, rest: true });
  const [showConfig, setShowConfig] = useState(null);

  const C = {
    bg: "#04090f", surface: "#080f1a", panel: "#0a1628",
    border: "#0d2137", border2: "#1a3a5c",
    cyan: "#00e5ff", green: "#69ff47", amber: "#ffb300",
    red: "#ff6e6e", purple: "#b388ff",
    text: "#e0f0ff", text2: "#7ab3d4", text3: "#3a6a8a",
    font: "'JetBrains Mono', 'Courier New', monospace",
  };

  const PLUGINS = [
    { id: "alexa", name: "Amazon Alexa", category: "Voice", desc: "Control devices with Alexa voice commands. Say 'Alexa, turn off the lights in the Great Room.'", icon: "◎", color: "#00b8d4", fields: ["Alexa Skill ID", "OAuth Client ID", "OAuth Client Secret"] },
    { id: "google", name: "Google Home", category: "Voice", desc: "Integrate with Google Assistant and the Google Home app for voice and app control.", icon: "◉", color: "#4285f4", fields: ["Project ID", "API Key", "Service Account JSON"] },
    { id: "homekit", name: "Apple HomeKit", category: "Voice", desc: "Add NexusBAS devices to the Apple Home app. Control via Siri and HomeKit automations.", icon: "⬡", color: "#888", fields: ["HomeKit Bridge PIN", "Bridge Name"] },
    { id: "ifttt", name: "IFTTT", category: "Automation", desc: "Create if-this-then-that automations connecting NexusBAS to 700+ apps and services.", icon: "◈", color: "#00aabb", fields: ["IFTTT Webhook Key", "Event Name"] },
    { id: "mqtt", name: "MQTT Broker", category: "Protocol", desc: "Direct MQTT broker connection for custom device integrations and real-time messaging.", icon: "▣", color: "#ff9a3c", fields: ["Broker URL", "Port", "Username", "Password", "Topic Prefix"] },
    { id: "rest", name: "REST API", category: "Protocol", desc: "Expose NexusBAS devices via a REST API. Connect any custom app or third-party service.", icon: "⊡", color: "#ff6e6e", fields: ["API Base URL", "API Key", "Webhook Endpoint"] },
    { id: "zapier", name: "Zapier", category: "Automation", desc: "Automate workflows between NexusBAS and thousands of business apps via Zapier.", icon: "◎", color: "#ff4a00", fields: ["Zapier Webhook URL"] },
    { id: "slack", name: "Slack Alerts", category: "Notifications", desc: "Receive device alerts, status changes, and system notifications in your Slack workspace.", icon: "◉", color: "#4a154b", fields: ["Slack Webhook URL", "Channel Name"] },
  ];

  const CATEGORIES = [...new Set(PLUGINS.map(p => p.category))];

  const toggle = (id) => {
    if (connected[id]) { setConnected(prev => ({ ...prev, [id]: false })); setShowConfig(null); }
    else setShowConfig(id);
  };

  const connect = (id) => { setConnected(prev => ({ ...prev, [id]: true })); setShowConfig(null); };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.font, color: C.text }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border}22 1px,transparent 1px),linear-gradient(90deg,${C.border}22 1px,transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ background: C.surface + "ee", borderBottom: `1px solid ${C.border}`, padding: "12px 20px", backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.cyan }}>Integrations</div>
              <div style={{ fontSize: 9, color: C.text3, marginTop: 2, letterSpacing: "0.1em" }}>CONNECT YOUR DEVICES TO EXTERNAL PLATFORMS</div>
            </div>
            <div style={{ fontSize: 10, color: C.text3 }}>
              {Object.values(connected).filter(Boolean).length} of {PLUGINS.length} connected
            </div>
          </div>
        </div>

        <div style={{ padding: "20px", maxWidth: 1000, margin: "0 auto" }}>
          {/* Connected banner */}
          {Object.entries(connected).filter(([, v]) => v).length > 0 && (
            <div style={{ background: C.green + "10", border: `1px solid ${C.green}33`, borderRadius: 6, padding: "10px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: C.green, fontSize: 12 }}>◉</span>
              <span style={{ fontSize: 10, color: C.green }}>
                Connected: {Object.entries(connected).filter(([, v]) => v).map(([k]) => PLUGINS.find(p => p.id === k)?.name).join(" · ")}
              </span>
            </div>
          )}

          {CATEGORIES.map(cat => (
            <div key={cat} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 10, color: C.text3, letterSpacing: "0.2em", marginBottom: 16, fontWeight: 700 }}>{cat.toUpperCase()}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                {PLUGINS.filter(p => p.category === cat).map(plugin => (
                  <div key={plugin.id}>
                    <div style={{ background: C.surface, border: `1px solid ${connected[plugin.id] ? plugin.color + "44" : C.border}`, borderRadius: 8, padding: "16px 18px", borderTop: `2px solid ${connected[plugin.id] ? plugin.color : C.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: plugin.color + "18", border: `1px solid ${plugin.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: plugin.color }}>
                            {plugin.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{plugin.name}</div>
                            <div style={{ fontSize: 9, color: C.text3, marginTop: 1 }}>{plugin.category}</div>
                          </div>
                        </div>
                        {/* Toggle */}
                        <div onClick={() => toggle(plugin.id)} style={{ width: 40, height: 22, borderRadius: 11, background: connected[plugin.id] ? plugin.color : C.border, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                          <div style={{ position: "absolute", top: 3, left: connected[plugin.id] ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
                        </div>
                      </div>

                      <div style={{ fontSize: 10, color: C.text2, lineHeight: 1.6, marginBottom: 12 }}>{plugin.desc}</div>

                      {connected[plugin.id] ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setShowConfig(showConfig === plugin.id ? null : plugin.id)} style={{ flex: 1, background: plugin.color + "15", border: `1px solid ${plugin.color}44`, color: plugin.color, fontFamily: C.font, fontSize: 9, fontWeight: 700, padding: "6px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em" }}>
                            CONFIGURE
                          </button>
                          <button onClick={() => toggle(plugin.id)} style={{ background: C.red + "15", border: `1px solid ${C.red}44`, color: C.red, fontFamily: C.font, fontSize: 9, fontWeight: 700, padding: "6px 10px", borderRadius: 4, cursor: "pointer" }}>
                            DISCONNECT
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setShowConfig(plugin.id)} style={{ width: "100%", background: "transparent", border: `1px solid ${plugin.color}66`, color: plugin.color, fontFamily: C.font, fontSize: 9, fontWeight: 700, padding: "7px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em" }}>
                          CONNECT
                        </button>
                      )}
                    </div>

                    {/* Config panel */}
                    {showConfig === plugin.id && (
                      <div style={{ background: C.panel, border: `1px solid ${plugin.color}44`, borderRadius: "0 0 8px 8px", padding: "16px 18px", marginTop: -4 }}>
                        <div style={{ fontSize: 9, color: plugin.color, letterSpacing: "0.15em", marginBottom: 14, fontWeight: 700 }}>
                          {connected[plugin.id] ? "CONFIGURATION" : "CONNECT"} — {plugin.name.toUpperCase()}
                        </div>
                        {plugin.fields.map(field => (
                          <div key={field} style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 9, color: C.text3, letterSpacing: "0.1em", marginBottom: 5 }}>{field.toUpperCase()}</div>
                            <input type={field.toLowerCase().includes("secret") || field.toLowerCase().includes("password") || field.toLowerCase().includes("key") ? "password" : "text"}
                              placeholder={`Enter ${field}...`}
                              style={{ width: "100%", background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 4, padding: "7px 10px", color: C.text, fontFamily: C.font, fontSize: 10, outline: "none", boxSizing: "border-box" }}
                            />
                          </div>
                        ))}
                        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                          <button onClick={() => connect(plugin.id)} style={{ flex: 1, background: plugin.color, border: "none", color: C.bg, fontFamily: C.font, fontSize: 10, fontWeight: 900, padding: "8px", borderRadius: 4, cursor: "pointer", letterSpacing: "0.08em" }}>
                            {connected[plugin.id] ? "SAVE" : "CONNECT"}
                          </button>
                          <button onClick={() => setShowConfig(null)} style={{ background: "transparent", border: `1px solid ${C.border2}`, color: C.text2, fontFamily: C.font, fontSize: 10, padding: "8px 14px", borderRadius: 4, cursor: "pointer" }}>
                            CANCEL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
