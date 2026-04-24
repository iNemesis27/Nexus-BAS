import { lazy, Suspense, useEffect, useState } from "react";
import { ROLES } from "./lib/auth";

const Home = lazy(() => import("./Home"));
const Designer = lazy(() => import("./Designer"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));
const Portal = lazy(() => import("./Portal"));

function LoadingScreen({ label = "LOADING..." }) {
  return (
    <div style={{ minHeight: "100vh", background: "#04090f", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#00e5ff", fontFamily: "JetBrains Mono, monospace",
        fontSize: 11, letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}

export default function App() {
  const getViewFromPath = () => {
    if (window.location.pathname === "/portal") return "portal";
    if (window.location.pathname === "/admin") return "admin";
    return "home";
  };
  const [view, setView] = useState(getViewFromPath);
  const [targetFloor, setTargetFloor] = useState("G");
  const tempUserRole = ROLES.ADMIN;

  const openDesigner = (floor) => {
    if (floor) setTargetFloor(floor);
    setView("designer");
  };

  useEffect(() => {
    const syncView = () => setView(getViewFromPath());
    window.addEventListener("popstate", syncView);
    return () => window.removeEventListener("popstate", syncView);
  }, []);

  useEffect(() => {
    const pathname = view === "portal" ? "/portal" : view === "admin" ? "/admin" : "/";
    if (window.location.pathname !== pathname) {
      window.history.pushState({}, "", pathname);
    }
  }, [view]);

  return (
    <Suspense fallback={<LoadingScreen label={view === "portal" ? "LOADING PORTAL..." : "LOADING..."} />}>
      {view === "home" && (
        <div style={{ position: "relative" }}>
          <Home
            onEnter={() => openDesigner(null)}
            onFloor={openDesigner}
            onPortal={() => setView("portal")}
          />
          {tempUserRole === ROLES.ADMIN && (
            <button
              onClick={() => setView("admin")}
              style={{
                position: "fixed",
                top: 12,
                right: 16,
                zIndex: 40,
                background: "#b388ff20",
                border: "1px solid #b388ff44",
                color: "#b388ff",
                borderRadius: 6,
                padding: "6px 10px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              ADMIN
            </button>
          )}
        </div>
      )}
      {view === "designer" && (
        <Designer
          initialFloor={targetFloor}
          onBack={() => setView("home")}
        />
      )}
      {view === "admin" && <AdminDashboard setView={setView} />}
      {view === "portal" && <Portal setView={setView} />}
    </Suspense>
  );
}
