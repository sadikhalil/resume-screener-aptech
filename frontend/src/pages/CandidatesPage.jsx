import { useState, useEffect } from "react";
import { getCandidates, deleteCandidate } from "../api/client";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [error, setError]           = useState(null);

  const fetchCandidates = () => {
    setLoading(true);
    getCandidates()
      .then(r => setCandidates(r.data))
      .catch(() => setError("Failed to load candidates."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove candidate "${name}"?`)) return;
    try {
      await deleteCandidate(id);
      fetchCandidates();
    } catch {
      setError("Failed to delete candidate.");
    }
  };

  const filtered = candidates.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>All Candidates</h1>
        <p>{candidates.length} candidates in the database</p>
      </div>

      {/* Search */}
      <div className="form-group" style={{ marginBottom: 24 }}>
        <input
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading"><div className="spinner">⚙️</div><p>Loading candidates...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <p>{search ? "No candidates match your search." : "No candidates yet. Upload a resume to get started."}</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {filtered.map(c => (
            <div key={c.id} className="card candidate-card">
              <div className="avatar">
                {(c.name || "?").charAt(0).toUpperCase()}
              </div>
              <div className="candidate-name">{c.name || "Unknown"}</div>
              <div className="candidate-email">{c.email || "No email"}</div>

              {c.skills?.length > 0 && (
                <div className="skills-list">
                  {c.skills.slice(0, 5).map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                  {c.skills.length > 5 && (
                    <span className="skill-tag">+{c.skills.length - 5} more</span>
                  )}
                </div>
              )}

              <button
                className="btn-danger"
                style={{ marginTop: 8 }}
                onClick={() => handleDelete(c.id, c.name)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
