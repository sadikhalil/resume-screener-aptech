import { useState, useEffect, useRef } from "react";
import { uploadResume, getJobs } from "../api/client";

export default function UploadPage() {
  const [jobs, setJobs]       = useState([]);
  const [jobId, setJobId]     = useState("");
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const fileInputRef          = useRef();

  useEffect(() => {
    getJobs().then(r => setJobs(r.data)).catch(() => {});
  }, []);

  const handleFile = (f) => {
    const allowed = [".pdf", ".docx", ".pptx", ".doc", ".ppt"];
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setError("Only PDF, DOCX, and PPTX files are allowed.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file)  return setError("Please select a resume file.");
    if (!jobId) return setError("Please select a job to match against.");

    setLoading(true); setError(null); setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_id", jobId);

    try {
      const res = await uploadResume(formData);
      setResult(res.data);
      setFile(null);
    } catch (e) {
      setError(e.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 75 ? "#22c55e" : s >= 50 ? "#f59e0b" : "#f87171";

  return (
    <div className="page">
      <div className="page-header">
        <h1>Upload Resume</h1>
        <p>Upload a resume and match it against a job description</p>
      </div>

      <div className="card">
        {/* File Drop Area */}
        <div
          className={`upload-area ${dragging ? "dragging" : ""}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📄</div>
          <div className="upload-text">
            <strong>Click to upload</strong> or drag and drop your resume here
          </div>
          <div className="upload-formats">Supported: PDF, DOCX, PPTX</div>
          {file && <div className="file-selected">✅ {file.name}</div>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.pptx,.ppt"
          style={{ display: "none" }}
          onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
        />

        {/* Job Selection */}
        <div className="form-group">
          <label>Select Job to Match Against *</label>
          <select value={jobId} onChange={e => setJobId(e.target.value)}>
            <option value="">-- Choose a job --</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} (#{j.id})
              </option>
            ))}
          </select>
          {jobs.length === 0 && (
            <p className="muted" style={{ marginTop: 6 }}>
              No jobs found. Please create a job first.
            </p>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button onClick={handleSubmit} disabled={loading || !file || !jobId}>
          {loading ? "⏳ Processing resume..." : "Upload & Score Resume"}
        </button>

        {loading && (
          <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>
            This may take 30–60 seconds. NLP is extracting and scoring your resume...
          </p>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="card result-card">
          <div className="result-header">
            <div className="result-name">{result.name || "Candidate"}</div>
            <div className="result-email">{result.email}</div>
          </div>

          <div className="score-big" style={{ color: scoreColor(result.final_score) }}>
            {result.final_score}<span>/100</span>
          </div>
          <div className="score-label">Match Score</div>

          {/* Breakdown Bars */}
          <div className="breakdown">
            {Object.entries(result.breakdown).map(([key, val]) => (
              <div key={key} className="breakdown-row">
                <span className="breakdown-key">{key}</span>
                <div className="bar-wrap">
                  <div className="bar" style={{ width: `${Math.round(val * 100)}%` }} />
                </div>
                <span className="breakdown-val">{Math.round(val * 100)}%</span>
              </div>
            ))}
          </div>

          <hr className="divider" />

          {/* Skills */}
          {result.skills?.length > 0 && (
            <>
              <p className="muted" style={{ marginBottom: 6 }}>Extracted Skills</p>
              <div className="skills-list">
                {result.skills.map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
