# DiscoveryOS Backend

FastAPI backend service for the DiscoveryOS MVP.

## Setup

### Prerequisites
- Python 3.9+
- PostgreSQL (or SQLite for development)

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# - DATABASE_URL: PostgreSQL connection string
# - GROQ_API_KEY: Get from https://console.groq.com
# - CORS_ORIGINS: Frontend URLs
```

### Running

```bash
# Development (auto-reload)
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app:app --host 0.0.0.0 --port 8000
```

API docs available at: http://localhost:8000/docs

## API Endpoints

### Upload Transcript
```
POST /api/upload
Content-Type: multipart/form-data

Response:
{
  "transcript_id": "transcript_xxx",
  "status": "UPLOADED",
  "file_name": "interview.txt"
}
```

### Get Analysis Status
```
GET /api/analysis/{transcript_id}

Response:
{
  "transcript_id": "transcript_xxx",
  "status": "COMPLETED|RUNNING|QUEUED|FAILED",
  "progress_percent": 75,
  "error": null
}
```

### Get Insights
```
GET /api/insights/{transcript_id}

Response:
{
  "pain_points": [...],
  "segments": [...],
  "themes": [...],
  "recommendations": [...]
}
```

### Get Report
```
GET /api/report/{transcript_id}

Response: Complete report JSON with all insights
```

## Database Schema

3 tables:
- **transcripts**: Stores uploaded files and content
- **analysis_jobs**: Tracks analysis progress and status
- **insights**: Stores extracted pain points, segments, themes, recommendations

## AI Agent

Uses Groq API (or fallback to mock data):
- Single call extracts pain points, segments, themes, recommendations
- Temperature: 0.3 (focused, deterministic)
- Model: mixtral-8x7b-32768 (fast, capable)

## Testing

```bash
# Test upload
curl -X POST -F "file=@transcript.txt" http://localhost:8000/api/upload

# Check status
curl http://localhost:8000/api/analysis/{transcript_id}

# Get insights
curl http://localhost:8000/api/insights/{transcript_id}
```

## Troubleshooting

**Database connection error**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Or use SQLite: `DATABASE_URL=sqlite:///./test.db`

**Groq API errors**
- Verify GROQ_API_KEY is set
- Check rate limits at https://console.groq.com
- Falls back to mock data if API unavailable

**CORS errors**
- Add frontend URL to CORS_ORIGINS in .env
- Example: "http://localhost:5173"

## Production Notes

- Use environment variables for all secrets
- Enable HTTPS in production
- Set DEBUG=false
- Use connection pooling for database
- Consider API rate limiting
- Add authentication if needed
