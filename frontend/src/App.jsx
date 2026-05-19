import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DashboardPage  from "./pages/DashboardPage";
import JobsPage       from "./pages/JobsPage";
import UploadPage     from "./pages/UploadPage";
import CandidatesPage from "./pages/CandidatesPage";
import RankingPage    from "./pages/RankingPage";
import "./index.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const open  = () => setSidebarOpen(true);
  const close = () => setSidebarOpen(false);

  return (
    <BrowserRouter>

      {/* ── Fixed top bar — mobile/tablet only ── */}
      <header className="topbar">
        <div className="topbar-logo">
          <span className="topbar-logo-icon">🤖</span>
          <span>ResumeAI</span>
        </div>
        <button className="topbar-toggle" onClick={open} aria-label="Open menu">
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      {/* ── Dim overlay behind open drawer ── */}
      <div className={`sidebar-overlay${sidebarOpen ? " open" : ""}`} onClick={close} />

      <div className="app">

        {/* ── Sidebar / Drawer ── */}
        <nav className={`sidebar${sidebarOpen ? " open" : ""}`}>

          {/* Header row: logo left, ✕ right */}
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">🤖</span>
              <span>ResumeAI</span>
            </div>
            <button className="sidebar-close" onClick={close} aria-label="Close menu">✕</button>
          </div>

          <div className="nav-section">
            <p className="nav-label">Main</p>
            <NavLink to="/" end
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={close}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/jobs"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={close}>
              <span>💼</span> Jobs
            </NavLink>
          </div>

          <div className="nav-section">
            <p className="nav-label">Candidates</p>
            <NavLink to="/upload"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={close}>
              <span>📤</span> Upload Resume
            </NavLink>
            <NavLink to="/candidates"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={close}>
              <span>👥</span> All Candidates
            </NavLink>
            <NavLink to="/ranking"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={close}>
              <span>🏆</span> Rankings
            </NavLink>
          </div>
        </nav>

        {/* ── Page content ── */}
        <main className="content">
          <Routes>
            <Route path="/"           element={<DashboardPage />} />
            <Route path="/jobs"       element={<JobsPage />} />
            <Route path="/upload"     element={<UploadPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/ranking"    element={<RankingPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}