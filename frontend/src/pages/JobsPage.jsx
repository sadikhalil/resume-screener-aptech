import { useState, useEffect } from "react";
import { getJobs, createJob, deleteJob } from "../api/client";

const EMPTY_FORM = {
  title: "",
  description: "",
  required_skills: "",
  required_edu: "bachelor",
  required_exp: 0,
};

export default function JobsPage() {
  const [jobs, setJobs]       = useState([]);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchJobs = () => {
    setLoading(true);
    getJobs()
      .then(r => setJobs(r.data))
      .catch(() => setError("Failed to load jobs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.description) return setError("Title and description are required.");
    setSaving(true); setError(null); setSuccess(null);

    try {
      await createJob({
        ...form,
        required_skills: form.required_skills
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
        required_exp: Number(form.required_exp),
      });
      setForm(EMPTY_FORM);
      setSuccess("Job created successfully!");
      fetchJobs();
    } catch {
      setError("Failed to create job.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete job "${title}"?`)) return;
    try {
      await deleteJob(id);
      fetchJobs();
    } catch {
      setError("Failed to delete job.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Job Descriptions</h1>
        <p>Create and manage jobs to match resumes against</p>
      </div>

      {/* Create Job Form */}
      <div className="card">
        <h2>➕ Add New Job</h2>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-group">
          <label>Job Title *</label>
          <input
            placeholder="e.g. Senior Python Developer"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Job Description *</label>
          <textarea
            placeholder="Describe the role, responsibilities, and requirements..."
            rows={5}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Required Skills (comma separated)</label>
          <input
            placeholder="e.g. Python, React, SQL, Docker"
            value={form.required_skills}
            onChange={e => setForm({ ...form, required_skills: e.target.value })}
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>Minimum Education</label>
            <select
              value={form.required_edu}
              onChange={e => setForm({ ...form, required_edu: e.target.value })}
            >
              <option value="high school">High School</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          <div className="form-group">
            <label>Minimum Experience (years)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={form.required_exp}
              onChange={e => setForm({ ...form, required_exp: e.target.value })}
            />
          </div>
        </div>

        <button onClick={handleCreate} disabled={saving}>
          {saving ? "Creating..." : "Create Job"}
        </button>
      </div>

      {/* Jobs List */}
      <h2 style={{ marginBottom: 16, fontSize: 18 }}>
        All Jobs ({jobs.length})
      </h2>

      {loading ? (
        <div className="loading"><div className="spinner">⚙️</div><p>Loading jobs...</p></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <p>No jobs created yet. Add your first job above.</p>
        </div>
      ) : (
        <div className="jobs-list">
          {jobs.map(j => (
            <div key={j.id} className="job-card">
              <div style={{ flex: 1 }}>
                <div className="job-title">{j.title}</div>
                <div className="job-desc">{j.description?.slice(0, 150)}...</div>
                <div className="skills-list">
                  {j.required_skills?.map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                </div>
                <div className="job-meta">
                  <span>🎓 {j.required_edu}</span>
                  <span>📅 {j.required_exp} yrs exp</span>
                  <span>🆔 Job #{j.id}</span>
                </div>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(j.id, j.title)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
