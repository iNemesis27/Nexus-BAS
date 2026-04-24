import { lazy, Suspense, useEffect, useState } from "react";

const Home = lazy(() => import("./Home"));
const Designer = lazy(() => import("./Designer"));
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
  const getViewFromPath = () => window.location.pathname === "/portal" ? "portal" : "home";
  const [view, setView] = useState(getViewFromPath);
  const [targetFloor, setTargetFloor] = useState("G");

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
    const pathname = view === "portal" ? "/portal" : "/";
    if (window.location.pathname !== pathname) {
      window.history.pushState({}, "", pathname);
    }
  }, [view]);

  return (
    <Suspense fallback={<LoadingScreen label={view === "portal" ? "LOADING PORTAL..." : "LOADING..."} />}>
      {view === "home" && (
        <Home
          onEnter={() => openDesigner(null)}
          onFloor={openDesigner}
          onPortal={() => setView("portal")}
        />
      )}
      {view === "designer" && (
        <Designer
          initialFloor={targetFloor}
          onBack={() => setView("home")}
        />
      )}
      {view === "portal" && <Portal setView={setView} />}
    </Suspense>
  );
}
