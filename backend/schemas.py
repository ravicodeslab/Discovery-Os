from pydantic import BaseModel
from typing import List, Optional, Literal

# Request schemas
class FileUploadResponse(BaseModel):
    transcript_id: str
    status: str
    file_name: str

class AnalysisStatusResponse(BaseModel):
    transcript_id: str
    status: str
    progress_percent: int
    error: Optional[str] = None

# Insight schemas
class PainPoint(BaseModel):
    title: str
    description: Optional[str] = None
    frequency: int
    impact: Literal["HIGH", "MEDIUM", "LOW"]
    supporting_quote: Optional[str] = None

class UserSegment(BaseModel):
    name: str
    role: Optional[str] = None
    company_size: Optional[str] = None
    characteristics: str

class Theme(BaseModel):
    name: str
    description: Optional[str] = None
    frequency: int
    related_to_pain_points: Optional[List[str]] = None

class Recommendation(BaseModel):
    title: str
    description: Optional[str] = None
    addresses: List[str]
    effort: Literal["HIGH", "MEDIUM", "LOW"]
    impact: Literal["HIGH", "MEDIUM", "LOW"]
    priority_score: int

class InsightsResponse(BaseModel):
    pain_points: List[PainPoint]
    segments: List[UserSegment]
    themes: List[Theme]
    recommendations: List[Recommendation]

class ReportResponse(BaseModel):
    transcript_id: str
    file_name: str
    created_at: str
    insights: InsightsResponse
