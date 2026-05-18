from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from db.database import engine, Base
import db.models.candidate
import db.models.job
import db.models.score

from api.routes import upload, candidates, jobs, ranking, analytics

Base.metadata.create_all(bind=engine)
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="AI Resume Screener",
    description="Upload resumes, extract data using NLP, match against job descriptions, and rank candidates.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router,     prefix="/api/upload",     tags=["Upload"])
app.include_router(jobs.router,       prefix="/api/jobs",       tags=["Jobs"])
app.include_router(candidates.router, prefix="/api/candidates", tags=["Candidates"])
app.include_router(ranking.router,    prefix="/api/rank",       tags=["Ranking"])
app.include_router(analytics.router,  prefix="/api/analytics",  tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "AI Resume Screener API is running!", "docs": "http://localhost:8000/docs"}

@app.get("/health")
def health_check():
    return {"status": "ok"}