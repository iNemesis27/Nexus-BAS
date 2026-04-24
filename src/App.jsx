import { lazy, Suspense, useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { ROLES } from "./lib/auth";

const Landing = lazy(() => import("./Landing"));
const Designer = lazy(() => import("./Designer"));
const BuildingEditor = lazy(() => import("./BuildingEditor"));
const Integrations = lazy(() => import("./Integrations"));
const Portal = lazy(() => import("./Portal"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));

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
  const publicViews = new Set(["landing", "about", "features", "contact", "login"]);
  const getViewFromPath = () => {
    if (window.location.pathname === "/portal") return "portal";
    if (window.location.pathname === "/admin") return "admin";
    if (window.location.pathname === "/building-editor") return "building-editor";
    if (window.location.pathname === "/integrations") return "integrations";
    if (window.location.pathname === "/designer") return "designer";
    return "landing";
  };
  const [view, setView] = useState(getViewFromPath);
  const [targetFloor, setTargetFloor] = useState("G");
  const userRole = ROLES.ADMIN;
  const userName = "Rauni Andre";

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
    const pathname =
      view === "portal" ? "/portal" :
      view === "admin" ? "/admin" :
      view === "building-editor" ? "/building-editor" :
      view === "integrations" ? "/integrations" :
      view === "designer" ? "/designer" :
      "/";
    if (window.location.pathname !== pathname) {
      window.history.pushState({}, "", pathname);
    }
  }, [view]);

  return (
    <Suspense fallback={<LoadingScreen label={view === "portal" ? "LOADING PORTAL..." : "LOADING..."} />}>
      {publicViews.has(view) && (
        <Landing setView={setView} view={view} />
      )}
      {view !== "landing" && !publicViews.has(view) && (
        <NavBar view={view} setView={setView} userRole="admin" userName="Rauni Andre" />
      )}
      {view === "portal" && <Portal setView={setView} userRole={userRole} />}
      {view === "designer" && (
        <Designer
          setView={setView}
          initialFloor={targetFloor}
          onBack={() => setView("landing")}
        />
      )}
      {view === "building-editor" && <BuildingEditor setView={setView} />}
      {view === "integrations" && <Integrations setView={setView} />}
      {view === "admin" && <AdminDashboard setView={setView} />}
    </Suspense>
  );
}
