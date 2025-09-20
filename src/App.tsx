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
