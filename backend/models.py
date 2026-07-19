from sqlalchemy import Column, String, Text, DateTime, JSON, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
from config import settings

Base = declarative_base()


class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(String, primary_key=True)
    file_name = Column(String(255))
    content = Column(Text)
    upload_status = Column(String(50), default="UPLOADED")
    created_at = Column(DateTime, default=datetime.utcnow)


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(String, primary_key=True)
    transcript_id = Column(String, index=True)
    status = Column(String(50), default="QUEUED")
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    llm_response_raw = Column(Text, nullable=True)


class Insight(Base):
    __tablename__ = "insights"

    id = Column(String, primary_key=True)
    transcript_id = Column(String, index=True)
    analysis_job_id = Column(String)
    insight_type = Column(String(50))
    content = Column(Text)

    # Renamed because "metadata" is reserved in SQLAlchemy
    insight_metadata = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)


# Database initialization
engine = create_engine(
    settings.database_url,
    echo=settings.debug
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()