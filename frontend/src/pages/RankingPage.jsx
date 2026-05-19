import { useState, useEffect } from "react";
import { getRanking, getJobs } from "../api/client";

const sanitizeCandidateName = (value) =>
  String(value || "")
    .replace(/\b(?:\+?\d[\d\s\-\(\)]{6,}\d)\b/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

export default function RankingPage() {
  const [jobs, setJobs]       = useState([]);
  const [jobId, setJobId]     = useState("");
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getJobs().then(r => setJobs(r.data)).catch(() => {});
  }, []);

  const fetchRanking = async () => {
    if (!jobId) return;
    setLoading(true); setError(null); setRanking(null);
    try {
      const res = await getRanking(jobId);
      setRanking(res.data);
    } catch {
      setError("Failed to load rankings.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 75 ? "score-high" : s >= 50 ? "score-mid" : "score-low";

  const rankClass = (rank) => {
    if (rank === 1) return "ranking-row top-1";
    if (rank === 2) return "ranking-row top-2";
    if (rank === 3) return "ranking-row top-3";
    return "ranking-row";
  };

  const rankBadgeClass = (rank) => {
    if (rank === 1) return "rank-badge rank-1";
    if (rank === 2) return "rank-badge rank-2";
    if (rank === 3) return "rank-badge rank-3";
    return "rank-badge";
  };

  const rankLabel = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Candidate Rankings</h1>
        <p>See who is the best match for each job</p>
      </div>

      {/* Job Selector */}
      <div className="card">
        <h2>Select a Job</h2>
        <div className="row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select value={jobId} onChange={e => setJobId(e.target.value)}>
              <option value="">-- Choose a job to rank candidates --</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} (#{j.id})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchRanking}
            disabled={loading || !jobId}
            style={{ flexShrink: 0, width: "auto", marginBottom: 0 }}
          >
            {loading ? "Loading..." : "Show Rankings"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && (
        <div className="loading">
          <div className="spinner">⚙️</div>
          <p>Fetching rankings...</p>
        </div>
      )}

      {/* Rankings */}
      {ranking && (
        <>
          <div style={{ marginBottom: 16 }}>
            <strong>{ranking.total}</strong>
            <span className="muted"> candidates ranked for </span>
            <strong>{ranking.job_title}</strong>
          </div>

          {ranking.candidates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No resumes uploaded for this job yet.</p>
            </div>
          ) : (
            <div className="ranking-list">
              {ranking.candidates.map(c => (
                <div key={c.candidate_id} className={rankClass(c.rank)}>

                  {/* Rank Badge */}
                  <div className={rankBadgeClass(c.rank)}>
                    {rankLabel(c.rank)}
                  </div>

                  {/* Candidate Info */}
                  <div className="candidate-info">
                    <strong>{sanitizeCandidateName(c.name) || "Unknown"}</strong>
                    <span>{c.email || "No email"}</span>
                    {c.skills?.length > 0 && (
                      <div className="skills-list" style={{ marginTop: 6 }}>
                        {c.skills.slice(0, 5).map(s => (
                          <span key={s} className="skill-tag">{s}</span>
                        ))}
                        {c.skills.length > 5 && (
                          <span className="skill-tag">+{c.skills.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Score Breakdown Mini */}
                  {c.breakdown && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
                      {Object.entries(c.breakdown).map(([key, val]) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                          <span style={{ width: 70, color: "#64748b", textTransform: "capitalize" }}>{key}</span>
                          <div style={{ flex: 1, background: "#334155", borderRadius: 999, height: 4 }}>
                            <div style={{
                              width: `${Math.round(val * 100)}%`,
                              background: "#6366f1",
                              height: 4,
                              borderRadius: 999
                            }} />
                          </div>
                          <span style={{ color: "#94a3b8", width: 30, textAlign: "right" }}>
                            {Math.round(val * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Final Score */}
                  <div className={`score-pill ${scoreColor(c.final_score)}`}>
                    {c.final_score}
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
