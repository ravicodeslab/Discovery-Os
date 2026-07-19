import os
import uuid
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

from config import settings
from models import Transcript, AnalysisJob, Insight, init_db, get_db
from schemas import FileUploadResponse, AnalysisStatusResponse, InsightsResponse, ReportResponse
from ai_agent import analyze_transcript
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="DiscoveryOS API",
    description="AI-powered user research analysis",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

@app.post("/api/upload", response_model=FileUploadResponse)
async def upload_transcript(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and start analysis of a transcript"""
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        # Read file content
        content = await file.read()
        text_content = content.decode('utf-8', errors='ignore')
        
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Create transcript record
        transcript_id = f"transcript_{uuid.uuid4()}"
        transcript = Transcript(
            id=transcript_id,
            file_name=file.filename,
            content=text_content,
            upload_status="UPLOADED"
        )
        db.add(transcript)
        db.commit()
        
        # Create analysis job
        job_id = f"job_{uuid.uuid4()}"
        job = AnalysisJob(
            id=job_id,
            transcript_id=transcript_id,
            status="QUEUED"
        )
        db.add(job)
        db.commit()
        
        # Start analysis (synchronous for demo)
        try:
            job.status = "RUNNING"
            job.started_at = datetime.utcnow()
            db.commit()
            
            # Call AI agent
            insights_data = analyze_transcript(text_content)
            
            # Store raw response
            job.llm_response_raw = json.dumps(insights_data)
            
            # Parse and store insights
            if insights_data:
                # Store pain points
                for pp in insights_data.get("pain_points", []):
                    insight = Insight(
                        id=f"insight_{uuid.uuid4()}",
                        transcript_id=transcript_id,
                        analysis_job_id=job_id,
                        insight_type="PAIN_POINT",
                        content=pp.get("title", ""),
                        insight_metadata=pp
                    )
                    db.add(insight)
                
                # Store segments
                for seg in insights_data.get("user_segments", []):
                    insight = Insight(
                        id=f"insight_{uuid.uuid4()}",
                        transcript_id=transcript_id,
                        analysis_job_id=job_id,
                        insight_type="SEGMENT",
                        content=seg.get("name", ""),
                        insight_metadata=seg
                    )
                    db.add(insight)
                
                # Store themes
                for theme in insights_data.get("themes", []):
                    insight = Insight(
                        id=f"insight_{uuid.uuid4()}",
                        transcript_id=transcript_id,
                        analysis_job_id=job_id,
                        insight_type="THEME",
                        content=theme.get("name", ""),
                        insight_metadata=theme
                    )
                    db.add(insight)
                
                # Store recommendations
                for rec in insights_data.get("recommendations", []):
                    insight = Insight(
                        id=f"insight_{uuid.uuid4()}",
                        transcript_id=transcript_id,
                        analysis_job_id=job_id,
                        insight_type="RECOMMENDATION",
                        content=rec.get("title", ""),
                        insight_metadata=rec
                    )
                    db.add(insight)
            
            job.status = "COMPLETED"
            job.completed_at = datetime.utcnow()
            transcript.upload_status = "ANALYZED"
            
        except Exception as e:
            logger.error(f"Analysis error: {e}")
            job.status = "FAILED"
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
        
        db.commit()
        
        return FileUploadResponse(
            transcript_id=transcript_id,
            status="UPLOADED",
            file_name=file.filename
        )
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analysis/{transcript_id}", response_model=AnalysisStatusResponse)
async def get_analysis_status(
    transcript_id: str,
    db: Session = Depends(get_db)
):
    """Get analysis status"""
    try:
        job = db.query(AnalysisJob).filter(
            AnalysisJob.transcript_id == transcript_id
        ).order_by(AnalysisJob.id.desc()).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Analysis job not found")
        
        progress = 0
        if job.status == "QUEUED":
            progress = 25
        elif job.status == "RUNNING":
            progress = 75
        elif job.status == "COMPLETED":
            progress = 100
        
        return AnalysisStatusResponse(
            transcript_id=transcript_id,
            status=job.status,
            progress_percent=progress,
            error=job.error_message
        )
        
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/{transcript_id}")
async def get_insights(
    transcript_id: str,
    db: Session = Depends(get_db)
):
    """Get extracted insights"""
    try:
        # Fetch all insights for this transcript
        insights = db.query(Insight).filter(
            Insight.transcript_id == transcript_id
        ).all()
        
        if not insights:
            raise HTTPException(status_code=404, detail="No insights found")
        
        # Organize by type
        pain_points = []
        segments = []
        themes = []
        recommendations = []
        
        for insight in insights:
            if insight.insight_type == "PAIN_POINT":
                pain_points.append(insight.insight_metadata)
            elif insight.insight_type == "SEGMENT":
                segments.append(insight.insight_metadata)
            elif insight.insight_type == "THEME":
                themes.append(insight.insight_metadata)
            elif insight.insight_type == "RECOMMENDATION":
                recommendations.append(insight.insight_metadata)
        
        return {
            "pain_points": pain_points,
            "segments": segments,
            "themes": themes,
            "recommendations": recommendations
        }
        
    except Exception as e:
        logger.error(f"Insights fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/report/{transcript_id}")
async def get_report(
    transcript_id: str,
    db: Session = Depends(get_db)
):
    """Get report data"""
    try:
        transcript = db.query(Transcript).filter(
            Transcript.id == transcript_id
        ).first()
        
        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not found")
        
        # Fetch insights
        insights = db.query(Insight).filter(
            Insight.transcript_id == transcript_id
        ).all()
        
        pain_points = []
        segments = []
        themes = []
        recommendations = []
        
        for insight in insights:
            if insight.insight_type == "PAIN_POINT":
                pain_points.append(insight.insight_metadata)
            elif insight.insight_type == "SEGMENT":
                segments.append(insight.insight_metadata)
            elif insight.insight_type == "THEME":
                themes.append(insight.insight_metadata)
            elif insight.insight_type == "RECOMMENDATION":
                recommendations.append(insight.insight_metadata)
        
        return {
            "transcript_id": transcript_id,
            "file_name": transcript.file_name,
            "created_at": transcript.created_at.isoformat(),
            "insights": {
                "pain_points": pain_points,
                "segments": segments,
                "themes": themes,
                "recommendations": recommendations
            }
        }
        
    except Exception as e:
        logger.error(f"Report fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
