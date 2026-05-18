import axios from "axios";

const api = axios.create({
  baseURL: "https://sadiakhalil-resumescreenerbackend.hf.space/api",
  timeout: 30000,
});

// ── Jobs ──────────────────────────────────────────────
export const getJobs      = ()       => api.get("/jobs");
export const getJob       = (id)     => api.get(`/jobs/${id}`);
export const createJob    = (data)   => api.post("/jobs", data);
export const updateJob    = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob    = (id)     => api.delete(`/jobs/${id}`);

// ── Upload ────────────────────────────────────────────
export const uploadResume = (formData) =>
  api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000, // 2 minutes for large files
  });

// ── Candidates ────────────────────────────────────────
export const getCandidates   = ()  => api.get("/candidates");
export const getCandidate    = (id) => api.get(`/candidates/${id}`);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

// ── Ranking ───────────────────────────────────────────
export const getRanking = (jobId) => api.get(`/rank?job_id=${jobId}`);

// ── Analytics ─────────────────────────────────────────
export const getAnalytics = () => api.get("/analytics/overview");
