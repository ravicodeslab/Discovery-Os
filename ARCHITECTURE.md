# DiscoveryOS Architecture

## System Overview

```
User Browser
     │
     ├─ Frontend (React + TypeScript + Tailwind)
     │  ├─ Upload Component (drag-drop)
     │  ├─ Analysis Progress (polling)
     │  ├─ Dashboard (4 insight cards)
     │  └─ Report Generator (HTML export)
     │
     └─ HTTP REST API
        │
        Backend (FastAPI + SQLAlchemy)
        ├─ POST /api/upload → Save file, trigger analysis
        ├─ GET /api/analysis/{id} → Check status
        ├─ GET /api/insights/{id} → Retrieve insights
        └─ GET /api/report/{id} → Generate report
           │
           ├─ Database (PostgreSQL)
           │  ├─ transcripts (files + content)
           │  ├─ analysis_jobs (status + progress)
           │  └─ insights (extracted data)
           │
           └─ LLM API (Groq / Claude / OpenAI)
              └─ Single call extracts all insights
```

## Frontend Architecture

### Components

**Upload.tsx**
- Drag-and-drop file input
- File validation (type, size)
- Calls `/api/upload` on drop
- Emits callback with upload data

**AnalysisProgress.tsx**
- Displays analysis status
- Shows progress bar (25%, 75%, 100%)
- Handles error states
- Auto-hides when complete

**Dashboard.tsx**
- 4 card components (pain points, segments, themes, recommendations)
- Renders insights from InsightResponse
- Color-coded impact badges
- Frequency indicators

**ReportButton.tsx**
- Generates HTML report from insights
- Downloads as `.html` file
- Shows loading state during generation

### State Management

**useAnalysis Hook**
```typescript
const {
  upload,              // Current file info
  analysisStatus,      // Job status + progress
  insights,            // Extracted data
  loading,             // Loading flag
  error,               // Error message
  uploadFile,          // Upload handler
  fetchInsights,       // Fetch insights handler
  reset                // Reset state
} = useAnalysis();
```

All state lives in the hook using `useState`. No Redux/Zustand needed for MVP.

### API Client

**src/lib/api.ts**
- Singleton `apiClient` instance
- 4 methods: upload, getAnalysisStatus, getInsights, getReport
- Axios for HTTP
- Error handling + retries

### Styling

**Tailwind CSS + Custom CSS**
- Color palette: Primary (sky blue), Accent (purple), Semantic colors
- Reusable components: `.card`, `.btn-primary`, `.input-field`
- Animations: slideIn, fadeIn, pulse-glow
- Glass-morphism effects

---

## Backend Architecture

### FastAPI Application Structure

**app.py** - Main server
- 5 endpoints (upload, status, insights, report, health)
- CORS middleware
- Database dependency injection
- Error handling

**ai_agent.py** - LLM Integration
- `analyze_transcript()` - Main analysis function
- Calls Groq API or returns mock data
- Single prompt with batched extraction
- Temperature: 0.3 (focused, deterministic)

**models.py** - Database Layer
- SQLAlchemy ORM
- 3 models: Transcript, AnalysisJob, Insight
- Auto-creation on startup
- Session management

**schemas.py** - API Validation
- Pydantic models for request/response
- Type safety + auto-documentation
- JSON serialization

**config.py** - Configuration
- Environment variable loading
- Settings validation
- Database/API config

### Data Models

**Transcript**
```
id: UUID
file_name: string
content: text
upload_status: enum (UPLOADED, ANALYZING, ANALYZED)
created_at: timestamp
```

**AnalysisJob**
```
id: UUID
transcript_id: UUID
status: enum (QUEUED, RUNNING, COMPLETED, FAILED)
error_message: text
started_at: timestamp
completed_at: timestamp
llm_response_raw: text
```

**Insight**
```
id: UUID
transcript_id: UUID
analysis_job_id: UUID
insight_type: enum (PAIN_POINT, SEGMENT, THEME, RECOMMENDATION)
content: text
metadata: jsonb (flexible data storage)
created_at: timestamp
```

### API Flow

```
1. POST /api/upload
   └─ Save file → Create Transcript → Create AnalysisJob
   
2. Synchronous Analysis (in request)
   ├─ Read transcript content
   ├─ Call LLM with prompt
   ├─ Parse response
   └─ Store insights in database
   
3. GET /api/analysis/{id}
   └─ Check AnalysisJob status
   
4. GET /api/insights/{id}
   ├─ Query Insight records
   ├─ Group by type
   └─ Return as InsightResponse JSON
   
5. GET /api/report/{id}
   ├─ Fetch Transcript + Insights
   └─ Return formatted report data
```

### LLM Integration

**Prompt Strategy**
- Single system prompt for all extraction types
- Batched extraction (pain points + segments + themes + recommendations)
- Structured JSON output required
- Temperature 0.3 for consistency

**Model Selection**
- Primary: Groq (free tier, fast, reliable)
- Fallback: Mock data (always works)
- Alternative: Claude, GPT-4 (via same interface)

**Error Handling**
- 30-second timeout per call
- 1 automatic retry on failure
- Fallback to mock data if API unavailable
- Error logged and stored in database

---

## Data Flow

### Upload → Analysis → Insights

```
User Action
    ↓
Upload.tsx (upload file)
    ↓
apiClient.uploadTranscript()
    ↓
POST /api/upload {file}
    ↓
Backend:
├─ Save file to disk
├─ Create transcript record
├─ Create analysis_job (status: QUEUED)
├─ Call LLM with transcript content
├─ Parse response (JSON)
├─ Store insights in insights table
└─ Update analysis_job (status: COMPLETED)
    ↓
Frontend polls every 2 seconds:
├─ GET /api/analysis/{id}
├─ Check status
├─ If COMPLETED, fetch insights:
└─ GET /api/insights/{id}
    ↓
Dashboard renders:
├─ Pain points card
├─ Segments card
├─ Themes card
└─ Recommendations card
```

---

## Technology Decisions

### Frontend
| Technology | Why |
|------------|-----|
| **React 18** | Familiar, fast, ecosystem |
| **TypeScript** | Type safety, better DX |
| **Vite** | Lightning-fast dev server, 10x CRA |
| **Tailwind CSS** | Rapid styling, consistency |
| **Axios** | Simple HTTP client |
| **Zustand-lite (hooks only)** | No state manager, just React |
| **Lucide Icons** | Beautiful, tree-shakeable icons |

### Backend
| Technology | Why |
|------------|-----|
| **FastAPI** | Async, auto-docs, fast startup |
| **SQLAlchemy** | ORM for flexibility |
| **Pydantic** | Type validation, serialization |
| **PostgreSQL** | Robust, scalable |
| **Groq API** | Free tier, fast, JSON mode |

### DevOps
| Technology | Why |
|------------|-----|
| **Docker** | Consistent environments |
| **docker-compose** | Local dev, one command |
| **Vite Build** | Minimal output, fast |
| **Vercel** | Free frontend hosting |
| **Render/Railway** | Free backend hosting |

---

## Scalability Considerations

### Current (MVP)
- Single request per upload
- Synchronous analysis
- In-memory file reading
- No caching

### Future Improvements
1. **Async Jobs**
   - Use Celery + Redis
   - Background analysis processing
   - WebSocket updates instead of polling

2. **Multi-Transcript**
   - Aggregate insights across files
   - Trend detection
   - Segment comparison

3. **Caching**
   - Cache LLM responses
   - Redis for session data
   - CDN for static assets

4. **Database Optimization**
   - Full-text search indexes
   - Partitioning for large datasets
   - Read replicas

5. **Real-time Collaboration**
   - WebSocket for live updates
   - Shared workspaces
   - Comments on insights

---

## Security Considerations

### Current (MVP - Demo Safe)
- No authentication
- File uploads trusted
- Database on localhost
- Single-user local dev

### Production Hardening
1. **Authentication**
   - JWT tokens
   - OAuth integration
   - Session management

2. **Input Validation**
   - File type whitelist
   - Size limits
   - Content scanning

3. **Data Protection**
   - Encrypt sensitive fields
   - PII detection/masking
   - Audit logging

4. **API Security**
   - Rate limiting
   - CORS validation
   - SQL injection prevention (SQLAlchemy)
   - XSS protection (React escaping)

5. **Infrastructure**
   - HTTPS everywhere
   - Environment variables for secrets
   - Network isolation
   - Regular backups

---

## Performance Metrics

### Target (MVP)
- **Upload:** < 1 second
- **Analysis:** 3-15 seconds (LLM dependent)
- **Dashboard render:** < 500ms
- **Report generation:** < 500ms

### Optimization Already In Place
- Tailwind JIT compilation
- Vite code-splitting
- FastAPI async endpoints
- Database indexes on IDs
- Response JSON compression

### Monitoring (Future)
- Server-side: NewRelic, Datadog
- Client-side: Sentry, Amplitude
- Database: Query performance logs
- API: Response time analytics

---

## Deployment Architecture

### Development
```
localhost:3000 ← Vite dev server
localhost:8000 ← FastAPI dev server
localhost:5432 ← PostgreSQL
```

### Production
```
Vercel
├─ React SPA
├─ Cached at edge
└─ Environment: VITE_API_URL=https://api.yourdomain.com

Render/Railway/Fly.io
├─ FastAPI container
├─ PostgreSQL managed
├─ Groq API (external)
└─ Health checks + auto-restart
```

---

## Error Handling

### Frontend
- Try-catch on API calls
- User-friendly error messages
- Fallback to mock data
- Automatic retry on failure

### Backend
- HTTP exception codes
- Error logging
- Database rollback on failure
- Graceful degradation

### LLM
- Timeout handling
- Retry with exponential backoff
- Fallback to mock data
- Error stored in database

---

## Testing Strategy (Future)

### Frontend
- Unit tests for components
- Integration tests for flows
- E2E with Playwright

### Backend
- Unit tests for services
- API tests with pytest
- Database integration tests

### AI Agent
- Prompt testing with examples
- Output validation
- Response parsing

---

## Code Organization Principles

1. **Separation of Concerns**
   - Components don't know about HTTP
   - API client is abstract
   - Business logic in hooks/services

2. **Type Safety**
   - All data has types
   - Interface contracts enforced
   - No `any` types (except migrations)

3. **Reusability**
   - Shared components
   - Generic hooks
   - Utility functions

4. **Readability**
   - Clear naming
   - Comments on complex logic
   - Small, focused files

5. **Maintainability**
   - Single responsibility
   - DRY principle
   - Easy to extend

---

This architecture is designed for:
- ✅ **Fast Development** (built in 8 hours)
- ✅ **Easy to Understand** (clean, modular)
- ✅ **Simple to Deploy** (Docker, no CI/CD needed)
- ✅ **Ready to Scale** (architecture supports growth)

Ship fast, iterate faster. 🚀
