import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DashboardPage  from "./pages/DashboardPage";
import JobsPage       from "./pages/JobsPage";
import UploadPage     from "./pages/UploadPage";
import CandidatesPage from "./pages/CandidatesPage";
import RankingPage    from "./pages/RankingPage";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* Sidebar */}
        <nav className="sidebar">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <span>ResumeAI</span>
          </div>

          <div className="nav-section">
            <p className="nav-label">Main</p>
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/jobs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span>💼</span> Jobs
            </NavLink>
          </div>

          <div className="nav-section">
            <p className="nav-label">Candidates</p>
            <NavLink to="/upload" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span>📤</span> Upload Resume
            </NavLink>
            <NavLink to="/candidates" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span>👥</span> All Candidates
            </NavLink>
            <NavLink to="/ranking" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span>🏆</span> Rankings
            </NavLink>
          </div>
        </nav>

        {/* Main Content */}
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
