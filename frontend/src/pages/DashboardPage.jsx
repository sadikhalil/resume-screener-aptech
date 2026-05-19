import { useState, useEffect } from "react";
import { getAnalytics } from "../api/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

const sanitizeCandidateName = (value) =>
  String(value || "")
    .replace(/\b(?:\+?\d[\d\s\-\(\)]{6,}\d)\b/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const COLORS = ["#f87171", "#f59e0b", "#60a5fa", "#CCD67F"];

export default function DashboardPage() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getAnalytics()
      .then(r => setStats(r.data))
      .catch(() => setError("Could not load analytics. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page">
      <div className="loading">
        <div className="spinner">⚙️</div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="page">
      <div className="page-header"><h1>Dashboard</h1></div>
      <div className="alert alert-error">{error}</div>
    </div>
  );

  const distData = Object.entries(stats.distribution).map(([range, count], i) => ({
    range, count, color: COLORS[i]
  }));

  const scoreColor = (s) => s >= 75 ? "#3a6b00" : s >= 50 ? "#8A5F41" : "#c0392b";
  const scoreBg    = (s) => s >= 75
    ? "rgba(204,214,127,0.25)"
    : s >= 50
    ? "rgba(138,95,65,0.12)"
    : "rgba(192,57,43,0.10)";

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of all resume screening activity</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-label">Total Candidates</span>
          <span className="stat-value">{stats.total_candidates}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💼</span>
          <span className="stat-label">Total Jobs</span>
          <span className="stat-value">{stats.total_jobs}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Average Score</span>
          <span className="stat-value">{stats.average_score}</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <span className="stat-label">Top Score</span>
          <span className="stat-value">{stats.top_score}</span>
        </div>
      </div>

      {/* Chart + Top Candidates side by side on desktop, stacked on mobile */}
      <div
        className="dashboard-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
      >
        {/* Score Distribution */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h2>Score Distribution</h2>
          {stats.total_scored === 0 ? (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              <div className="empty-icon">📭</div>
              <p>No resumes scored yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={distData} barSize={32}>
                <XAxis dataKey="range" stroke="#B08060" tick={{ fill: "#7A5C3E", fontSize: 11 }} />
                <YAxis allowDecimals={false} stroke="#B08060" tick={{ fill: "#7A5C3E", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #E2CCB0", borderRadius: 8, color: "#3B2510" }}
                  labelStyle={{ color: "#3B2510" }}
                  itemStyle={{ color: "#8A5F41" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {distData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Candidates */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h2>🏅 Top Candidates</h2>
          {stats.top_candidates?.length === 0 ? (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              <div className="empty-icon">👤</div>
              <p>No candidates yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stats.top_candidates?.slice(0, 4).map((c, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: i === 0 ? "rgba(204,214,127,0.12)" : "var(--bg-main)",
                  border: `1px solid ${i === 0 ? "#b8c45a" : "var(--border)"}`,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {sanitizeCandidateName(c.name) || "Unknown"}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {c.email}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: scoreColor(c.final_score),
                    background: scoreBg(c.final_score),
                    padding: "3px 8px",
                    borderRadius: 6,
                    flexShrink: 0,
                  }}>
                    {c.final_score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
