import { useState, useEffect, useRef } from "react";
import { uploadResume, getJobs } from "../api/client";

const MAX_FILE_SIZE_MB = 10;

export default function UploadPage() {
  const [jobs, setJobs]         = useState([]);
  const [jobId, setJobId]       = useState("");
  const [file, setFile]         = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const fileInputRef            = useRef();

  useEffect(() => {
    getJobs()
      .then(r => setJobs(r.data))
      .catch(() => setError("Could not load jobs. Please check your internet connection."));
  }, []);

  const handleFile = (f) => {
    // Check file type
    const allowed = [".pdf", ".docx", ".pptx", ".doc", ".ppt"];
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setError(`❌ File type "${ext}" is not supported. Please upload a PDF, DOCX, or PPTX file.`);
      return;
    }

    // Check file size
    const sizeMB = f.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setError(`❌ File is too large (${sizeMB.toFixed(1)}MB). Maximum allowed size is ${MAX_FILE_SIZE_MB}MB. Please compress the file and try again.`);
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
    // Validation checks with specific messages
    if (!file) {
      setError("📄 Please select a resume file first before uploading.");
      return;
    }

    if (!jobId) {
      setError("💼 Please select a job from the dropdown first. You need to choose which job to match this resume against.");
      return;
    }

    if (jobs.length === 0) {
      setError("💼 No jobs found. Please go to the Jobs page and create a job description first, then come back to upload.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_id", jobId);

    try {
      const res = await uploadResume(formData);
      setResult(res.data);
      setFile(null);
    } catch (err) {
      // Handle different types of errors with specific messages
      if (!navigator.onLine) {
        setError("🌐 No internet connection. Please check your network and try again.");
        return;
      }

      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setError("⏱️ Request timed out. The server is taking too long to respond. This can happen when the server is waking up from sleep — please wait 30 seconds and try again.");
        return;
      }

      if (err.message?.includes("Network Error") || !err.response) {
        setError("🌐 Network error. Could not reach the server. Please check your internet connection and make sure the backend is running.");
        return;
      }

      // Server responded with an error
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 400) {
        setError(`❌ Invalid file: ${detail || "File type not supported. Please upload PDF, DOCX, or PPTX."}`);
      } else if (status === 404) {
        setError("💼 Selected job not found. Please refresh the page and select a job again.");
      } else if (status === 413) {
        setError(`❌ File is too large. Please reduce the file size to under ${MAX_FILE_SIZE_MB}MB and try again.`);
      } else if (status === 422) {
        setError("📄 Could not read the file. The file may be corrupted, password protected, or empty. Please try a different file.");
      } else if (status === 500) {
        setError("⚠️ Server error. Something went wrong on the server. Please try again in a moment.");
      } else {
        setError(detail || "❌ Upload failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 75 ? "#3a6b00" : s >= 50 ? "#8A5F41" : "#c0392b";
  const scoreBackground = (s) => s >= 75
    ? "rgba(204,214,127,0.25)"
    : s >= 50
    ? "rgba(138,95,65,0.12)"
    : "rgba(192,57,43,0.10)";

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
          <div className="upload-formats">
            Supported: PDF, DOCX, PPTX &nbsp;·&nbsp; Max size: {MAX_FILE_SIZE_MB}MB
          </div>
          {file && (
            <div className="file-selected">
              ✅ {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
            </div>
          )}
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
            <p className="muted" style={{ marginTop: 6, color: "#c0392b" }}>
              ⚠️ No jobs found. Please create a job first before uploading a resume.
            </p>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "⏳ Processing resume..." : "Upload & Score Resume"}
        </button>

        {loading && (
          <div style={{ marginTop: 12 }}>
            <p className="muted" style={{ fontSize: 13 }}>
              ⏳ This may take 30–60 seconds. The AI is reading and scoring your resume...
            </p>
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              If the server was sleeping, it may take up to 60 seconds to wake up.
            </p>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="card result-card">
          <div className="result-header">
            <div className="result-name">{result.name || "Candidate"}</div>
            <div className="result-email">{result.email}</div>
          </div>

          <div
            className="score-big"
            style={{ color: scoreColor(result.final_score) }}
          >
            {result.final_score}<span>/100</span>
          </div>
          <div className="score-label">
            {result.final_score >= 75
              ? "🟢 Strong Match — Great candidate!"
              : result.final_score >= 50
              ? "🟡 Average Match — Worth reviewing"
              : "🔴 Weak Match — May not be a good fit"}
          </div>

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
              <p className="muted" style={{ marginBottom: 6 }}>
                Extracted Skills ({result.skills.length} found)
              </p>
              <div className="skills-list">
                {result.skills.map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </>
          )}

          {result.skills?.length === 0 && (
            <p className="muted" style={{ fontSize: 13 }}>
              No skills detected. The resume may not contain recognizable skill keywords.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
