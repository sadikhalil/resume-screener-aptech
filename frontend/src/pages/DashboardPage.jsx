import { useState, useEffect } from "react";
import { getAnalytics } from "../api/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

const COLORS = ["#f87171", "#f59e0b", "#60a5fa", "#22c55e"];

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
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      <div className="alert alert-error">{error}</div>
    </div>
  );

  const distData = Object.entries(stats.distribution).map(([range, count], i) => ({
    range, count, color: COLORS[i]
  }));

  const scoreColor = (s) => s >= 75 ? "#22c55e" : s >= 50 ? "#f59e0b" : "#f87171";

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

      {/* Score Distribution Chart */}
      <div className="card">
        <h2>Score Distribution</h2>
        {stats.total_scored === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No resumes scored yet. Upload a resume to get started.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distData} barSize={48}>
              <XAxis dataKey="range" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 13 }} />
              <YAxis allowDecimals={false} stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 13 }} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#818cf8" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {distData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Candidates */}
      {stats.top_candidates?.length > 0 && (
        <div className="card">
          <h2>🏅 Top Candidates</h2>
          <table className="top-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Email</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_candidates.map((c, i) => (
                <tr key={i}>
                  <td>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</td>
                  <td><strong>{c.name || "Unknown"}</strong></td>
                  <td className="muted">{c.email}</td>
                  <td>
                    <span style={{ color: scoreColor(c.final_score), fontWeight: 700 }}>
                      {c.final_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
