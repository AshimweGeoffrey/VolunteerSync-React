import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import OnmapList from "./components/OnmapList";
import ProjectList from "./components/ProjectList";
import ProjectDetails from "./components/ProjectDetails";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import "./css/style.css";

function App() {
  // Scroll configuration: change this to a value between 0 and 1 to adjust
  // where the page should land on first load (0.8 = 80%).
  // Zoom configuration: set this to a value between 0 and 1 (0.8 = 80% zoom).
  // Note: browsers do not allow scripts to change the user's browser zoom level
  // directly in a cross-browser way. This implements a visual "zoom" by
  // setting the non-standard `zoom` CSS property where supported (Chrome/Edge)
  // and falling back to `transform: scale(...)` + width compensation which
  // works in Firefox.
  const ZOOM_PERCENT = 0.9;

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const html = document.documentElement as HTMLElement | null;
    const body = document.body as HTMLElement | null;

    const zoomValue = ZOOM_PERCENT;
    const zoomCss = `${Math.round(zoomValue * 100)}%`;

    const applied: { method: "zoom" | "transform" | null } = { method: null };

    const applyZoom = () => {
      try {
        // Try the non-standard but widely supported `zoom` property first
        if (html) {
          // Some browsers (Chrome/Edge) support html.style.zoom
          // This changes rendering similar to browser zoom.
          (html.style as any).zoom = zoomCss;
          applied.method = "zoom";
        }

        // Double-check whether the zoom had any effect; Firefox doesn't support zoom.
        const supportsZoom =
          (html && (html.style as any).zoom) ||
          (body && (body.style as any).zoom);
        if (!supportsZoom) {
          // Fallback: use transform scale on body/html. This requires compensating
          // width so the scaled content fits the viewport without clipping.
          const targetEl = body || html;
          if (targetEl) {
            targetEl.style.transformOrigin = "0 0";
            targetEl.style.transform = `scale(${zoomValue})`;
            // Expand the width so the scaled-down content still fills the viewport
            // and doesn't become scrollable horizontally.
            targetEl.style.width = `${100 / zoomValue}%`;
            applied.method = "transform";
          }
        }
      } catch (e) {
        // No-op: don't throw if the browser disallows style changes
        applied.method = null;
      }
    };

    const cleanupZoom = () => {
      try {
        if (applied.method === "zoom") {
          if (html) (html.style as any).zoom = "";
          if (body) (body.style as any).zoom = "";
        } else if (applied.method === "transform") {
          const targetEl = body || html;
          if (targetEl) {
            targetEl.style.transform = "";
            targetEl.style.transformOrigin = "";
            targetEl.style.width = "";
          }
        }
      } catch (e) {
        // ignore
      }
    };

    // Apply once on mount and again after load to handle layout differences.
    applyZoom();
    window.addEventListener("load", applyZoom);

    return () => {
      window.removeEventListener("load", applyZoom);
      cleanupZoom();
    };
  }, []);
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/onmap"
                element={
                  <ProtectedRoute>
                    <OnmapList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
