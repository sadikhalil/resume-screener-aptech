import { useState } from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import DashboardPage  from "./pages/DashboardPage";
import JobsPage       from "./pages/JobsPage";
import UploadPage     from "./pages/UploadPage";
import CandidatesPage from "./pages/CandidatesPage";
import RankingPage    from "./pages/RankingPage";
import "./index.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <HashRouter>
      <div className="app">

        {/* Dark overlay when sidebar open on mobile */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* Sidebar */}
        <nav className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <span>ResumeAI</span>
          </div>

          <div className="nav-section">
            <p className="nav-label">Main</p>
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeSidebar}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/jobs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeSidebar}>
              <span>💼</span> Jobs
            </NavLink>
          </div>

          <div className="nav-section">
            <p className="nav-label">Candidates</p>
            <NavLink to="/upload" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeSidebar}>
              <span>📤</span> Upload Resume
            </NavLink>
            <NavLink to="/candidates" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeSidebar}>
              <span>👥</span> All Candidates
            </NavLink>
            <NavLink to="/ranking" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeSidebar}>
              <span>🏆</span> Rankings
            </NavLink>
          </div>
        </nav>

        {/* Right side wrapper */}
        <div className="main-wrapper">

          {/* Mobile top bar with hamburger */}
          <div className="mobile-topbar">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? "✕" : "☰"}
            </button>
            <span className="mobile-logo">🤖 ResumeAI</span>
          </div>

          <main className="content">
            <Routes>
              <Route path="/"           element={<DashboardPage />} />
              <Route path="/jobs"       element={<JobsPage />} />
              <Route path="/upload"     element={<UploadPage />} />
              <Route path="/candidates" element={<CandidatesPage />} />
              <Route path="/ranking"    element={<RankingPage />} />
              <Route path="*"           element={<DashboardPage />} />
            </Routes>
          </main>
        </div>

      </div>
    </HashRouter>
  );
}
