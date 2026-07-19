# DiscoveryOS - Hackathon MVP (6-8 Hour Build)

---

## 1. FINAL FEATURE LIST

### Frontend
- ✅ Single-page app (no routing complexity)
- ✅ File upload (drag-and-drop + file input)
- ✅ Analysis progress indicator (polling)
- ✅ Dashboard with 4 insight cards:
  - Top Pain Points (list)
  - User Segments (pills/tags)
  - Key Themes (list with frequency)
  - Product Recommendations (list)
- ✅ One-click report download (PDF)
- ✅ Real-time insight updates (polling every 2s)

### Backend
- ✅ File upload endpoint (save to disk)
- ✅ Trigger AI analysis endpoint
- ✅ Get insights endpoint
- ✅ Get report endpoint
- ✅ That's it. No auth. No middleware complexity.

### AI Agent
- ✅ Single LLM call per transcript (batched extraction)
- ✅ Extract pain points, segments, themes, recommendations in one prompt
- ✅ Parse structured JSON response
- ✅ Store insights in DB

### Database
- ✅ Transcripts table (store file + status)
- ✅ Insights table (store all extracted data)
- ✅ Analysis Jobs table (track progress)
- ✅ That's it. No user tracking. No projects. No reports table (generated on-the-fly).

---

## 2. FOLDER STRUCTURE

```
discovery-os/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Single-page component
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── Upload.tsx       # Drag-drop upload
│   │   │   ├── AnalysisProgress.tsx
│   │   │   ├── Dashboard.tsx    # All 4 insight cards
│   │   │   ├── Card.tsx         # Reusable card component
│   │   │   └── ReportButton.tsx # PDF download
│   │   ├── styles/
│   │   │   └── globals.css      # Tailwind + custom
│   │   ├── lib/
│   │   │   ├── api.ts           # API client (4 methods)
│   │   │   └── types.ts         # 3 types: Insight, AnalysisJob, FileUpload
│   │   └── hooks/
│   │       └── useAnalysis.ts   # Polling & state logic
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/
│   ├── app.py                   # Single FastAPI app file
│   ├── schemas.py               # Pydantic models (3 types)
│   ├── models.py                # SQLAlchemy ORM (3 models)
│   ├── ai_agent.py              # LLM prompt + extraction
│   ├── requirements.txt
│   ├── uploads/                 # Transcript storage (local)
│   └── .env.example
│
├── docker-compose.yml           # Minimal: PostgreSQL + Python server
├── .gitignore
└── README_HACKATHON.md
```

**Why this structure:**
- No app router, no folders for each endpoint
- Single React component per feature
- FastAPI in one file (routes + business logic)
- No middleware, no background tasks, no workers

---

## 3. DATABASE SCHEMA (3 Tables)

### Table 1: TRANSCRIPTS
```sql
CREATE TABLE transcripts (
    id UUID PRIMARY KEY,
    file_name VARCHAR(255),
    content TEXT,
    upload_status VARCHAR(50) DEFAULT 'UPLOADED',  -- UPLOADED, ANALYZING, ANALYZED
    created_at TIMESTAMP DEFAULT now()
);
```

### Table 2: ANALYSIS_JOBS
```sql
CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY,
    transcript_id UUID REFERENCES transcripts(id),
    status VARCHAR(50) DEFAULT 'QUEUED',  -- QUEUED, RUNNING, COMPLETED, FAILED
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    llm_response_raw TEXT  -- Full LLM JSON response
);
```

### Table 3: INSIGHTS
```sql
CREATE TABLE insights (
    id UUID PRIMARY KEY,
    transcript_id UUID REFERENCES transcripts(id),
    analysis_job_id UUID REFERENCES analysis_jobs(id),
    insight_type VARCHAR(50),  -- PAIN_POINT, SEGMENT, THEME, RECOMMENDATION
    content TEXT,
    metadata JSONB,  -- frequency, impact, supporting_quote
    created_at TIMESTAMP DEFAULT now()
);
```

**That's it. No users, no projects, no reports table.**

---

## 4. API ENDPOINTS (4 Total)

### POST /api/upload
```
Request:
  multipart/form-data { file }

Response:
  {
    "transcript_id": "uuid",
    "status": "UPLOADED",
    "file_name": "interview_001.txt"
  }

Logic:
  - Save file to disk
  - Create transcript record
  - Create analysis_job record (status: QUEUED)
  - Trigger AI analysis immediately (synchronous or async)
```

### GET /api/analysis/{transcript_id}
```
Response:
  {
    "transcript_id": "uuid",
    "status": "COMPLETED",  -- or QUEUED, RUNNING
    "progress_percent": 75,
    "error": null
  }

Logic:
  - Query analysis_jobs table for latest job
  - Return status
```

### GET /api/insights/{transcript_id}
```
Response:
  {
    "pain_points": [
      { "title": "...", "frequency": 1, "quote": "..." }
    ],
    "segments": [
      { "name": "...", "characteristics": "..." }
    ],
    "themes": [
      { "name": "...", "frequency": 1 }
    ],
    "recommendations": [
      { "title": "...", "impact": "HIGH" }
    ]
  }

Logic:
  - Query insights table for transcript_id
  - Group by insight_type
  - Format for frontend
```

### GET /api/report/{transcript_id}
```
Response:
  PDF binary or JSON

Logic:
  - Query insights for transcript
  - Generate PDF (using reportlab or weasyprint)
  - OR return JSON that frontend renders as PDF
```

**No auth. No body validation beyond basic file checks.**

---

## 5. AI AGENT DESIGN

### Single LLM Call Approach

**Prompt Template:**
```
You are a Product Insights Expert analyzing user research transcripts.

Analyze this transcript and extract:
1. PAIN POINTS: What problems or frustrations does the user mention?
2. USER SEGMENTS: Who is this user? What role/company size/industry?
3. THEMES: What recurring topics or topics come up?
4. RECOMMENDATIONS: What features or improvements would address these pain points?

TRANSCRIPT:
{transcript_content}

Respond ONLY with valid JSON in this exact format:
{
  "pain_points": [
    {
      "title": "string (short title)",
      "description": "string",
      "frequency": 1,
      "impact": "HIGH|MEDIUM|LOW",
      "supporting_quote": "direct quote from transcript"
    }
  ],
  "user_segments": [
    {
      "name": "string",
      "role": "string",
      "company_size": "string",
      "characteristics": "string"
    }
  ],
  "themes": [
    {
      "name": "string",
      "description": "string",
      "frequency": 1,
      "related_to_pain_points": ["title1", "title2"]
    }
  ],
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "addresses": ["pain_point_title"],
      "effort": "HIGH|MEDIUM|LOW",
      "impact": "HIGH|MEDIUM|LOW",
      "priority_score": 85
    }
  ]
}
```

**Implementation:**
- Single call to LLM (Groq/Claude/GPT-4o mini)
- 30s timeout
- 1 retry on failure
- Parse JSON response
- Store raw response in analysis_jobs.llm_response_raw
- Insert 10-20 insights into insights table (unpacked from JSON)

---

## 6. TECH STACK (Fastest & Free)

### Frontend
| Tool | Why |
|------|-----|
| **Vite** | 10x faster than CRA, instant HMR |
| **React** | No setup needed, familiar |
| **TypeScript** | Faster error catching |
| **Tailwind CSS** | Rapid styling, built-in components |
| **Axios** | Simple HTTP client |
| **Chart.js or Recharts** | Simple charts with minimal config |

### Backend
| Tool | Why |
|------|-----|
| **FastAPI** | Auto-generated docs, async, fast startup |
| **Pydantic** | Type validation without boilerplate |
| **SQLAlchemy** | Minimal ORM setup, works with any DB |
| **PostgreSQL** | Free, robust, included in docker-compose |

### AI/LLM
| Tool | Cost | Why |
|------|------|-----|
| **Groq API** | FREE (100k tokens/month) | Fastest inference, free tier is generous |
| **Claude 3 Haiku via Anthropic** | $0.25/MTok | Fast, cheap, best JSON output |
| **OpenAI GPT-4o Mini** | $0.15/MTok | If Groq fails, fallback |

**Recommendation: Use Groq. It's free, ridiculously fast (100 req/sec), and JSON mode works great.**

### Database
| Tool | Why |
|------|-----|
| **PostgreSQL** | In docker-compose, free, simple |
| **SQLite** (alternative) | Zero setup, perfect for one-day hack |

### Report Generation
| Tool | Why |
|------|-----|
| **reportlab** | Lightweight, pure Python PDF |
| **HTML2PDF (frontend)** | Use html2pdf.js in browser, no server dependency |

**Recommendation: Skip PDF server-side. Use frontend library (html2pdf.js). Downloads as HTML, user clicks "Save as PDF".**

---

## 7. DEVELOPMENT ORDER (6-8 hours)

### **HOUR 0: Setup (30 min)**
1. Create git repo
2. Initialize Vite + React frontend
3. Initialize FastAPI backend
4. Create docker-compose.yml (PostgreSQL only)
5. Start both servers locally

**Estimated: 30 minutes**  
**Blocker Risk: Very low (boilerplate)**

---

### **HOUR 1: Database & API Foundation (45 min)**
1. Create 3 database tables (simple SQL)
2. Create SQLAlchemy models (3 models, < 50 lines each)
3. Implement POST /api/upload endpoint
4. Implement GET /api/analysis/{id} endpoint
5. Test with Postman/curl

**Estimated: 45 minutes**  
**Blocker Risk: Low**

---

### **HOUR 2: File Upload UI & Progress (45 min)**
1. Create Upload.tsx (drag-and-drop + input)
2. Create AnalysisProgress.tsx (polling component)
3. Create useAnalysis.ts hook (polling logic every 2s)
4. Connect Upload → POST /api/upload
5. Test file upload end-to-end

**Estimated: 45 minutes**  
**Blocker Risk: Very low**

---

### **HOUR 3: AI Agent Integration (1.5 hours) ⭐ CRITICAL
1. Create ai_agent.py (LLM client + prompt)
2. Set Groq/Claude API key in .env
3. Implement GET /api/insights/{id} endpoint (stub with mock data first)
4. Call LLM in POST /api/upload endpoint (after file saved)
5. Parse JSON response → insert into insights table
6. Test with real transcript (50-500 words)

**Estimated: 1.5 hours**  
**Blocker Risk: MEDIUM (LLM API rate limits, JSON parsing)**

**Fallback:** If LLM fails, use mock JSON response for demo.

---

### **HOUR 4.5: Dashboard UI (1 hour)**
1. Create Dashboard.tsx (4 cards component)
2. Create Card.tsx (reusable card wrapper)
3. Query GET /api/insights → display pain points, segments, themes, recommendations
4. Add basic styling with Tailwind
5. Test refresh → data updates

**Estimated: 1 hour**  
**Blocker Risk: Low**

---

### **HOUR 5.5: Polish & Report (45 min)**
1. Create ReportButton.tsx (download PDF button)
2. Implement GET /api/report/{id} endpoint (JSON response)
3. Use html2pdf.js on frontend (click → download PDF)
4. Add loading spinners & empty states
5. Fix UI bugs & improve typography

**Estimated: 45 minutes**  
**Blocker Risk: Low**

---

### **HOUR 6.5: Demo Preparation & Testing (1.5 hours)**
1. Create sample transcripts for demo
2. Test full flow: upload → analysis → dashboard → report
3. Record demo screencast (optional but recommended)
4. Create README with clear instructions
5. Deploy to Vercel (frontend) + Render/Fly.io (backend)
6. Test production link

**Estimated: 1.5 hours**  
**Blocker Risk: Low**

---

## 8. TIMELINE SUMMARY

| Phase | Duration | Risk |
|-------|----------|------|
| Setup | 30 min | Very Low |
| Database & API Foundation | 45 min | Low |
| File Upload UI | 45 min | Very Low |
| **AI Agent (Critical)** | **1.5 hours** | **Medium** |
| Dashboard UI | 1 hour | Low |
| Report & Polish | 45 min | Low |
| Demo & Deployment | 1.5 hours | Low |
| **TOTAL** | **≈ 6.5 hours** | **Medium** |

**Buffer: 1.5 hours for debugging, API issues, UI tweaks**

---

## 9. JUDGING CRITERIA OPTIMIZATION

### AI Integration (25%) ⭐⭐⭐⭐⭐
- **Single, powerful LLM call** that extracts ALL insights at once
- **Structured JSON output** proves AI understanding of problem
- **Real-time analysis** shows sophistication
- **Fallback mock data** ensures demo doesn't fail on API outage

**How to impress:**
- Show JSON response during demo
- Explain why single call is smarter than multi-call
- Have 2-3 sample transcripts ready to analyze live

---

### Prototype Quality & UX (20%) ⭐⭐⭐⭐⭐
- **Drag-and-drop upload** (not boring file picker)
- **Real-time progress** (spinning animation while analyzing)
- **Beautiful dashboard** with color-coded cards
- **Smooth transitions** between upload → analysis → insights
- **Professional PDF report** with branding

**How to impress:**
- Use Tailwind gradients for cards
- Animate progress bar
- Add icons (Lucide or Heroicons)
- Show dark mode option
- Responsive mobile design

---

### Innovation (15%) ⭐⭐⭐⭐
- **Smart batching:** Extract pain points + segments + themes + recommendations in ONE call (not 4 separate calls)
- **Priority scoring:** Use frequency + impact to auto-rank insights
- **Theme linking:** Show which pain points each theme addresses
- **Segment personas:** Generate lightweight personas, not just user roles

**How to impress:**
- Explain "why one call is better than four calls"
- Show priority matrix (impact vs frequency)
- Demonstrate theme clustering
- Mention ability to handle multiple transcripts (even if not fully implemented)

---

### Problem Understanding (15%) ⭐⭐⭐⭐
- **Clear value prop:** "Convert messy interviews into structured insights"
- **Demo shows pain:** Show a raw transcript, then show clean dashboard
- **Explain use cases:** Product teams, researchers, founders
- **Mention future:** This can scale to 10+ transcripts, generate reports, export to Figma

**How to impress:**
- Use realistic interview transcripts in demo
- Show actual pain points that resonate (e.g., "onboarding is confusing")
- Mention 2-3 real use cases
- Explain why AI agents > manual transcription

---

## 10. DEPLOYMENT (Zero-Cost Free Tier)

### Frontend (Vercel)
```bash
# Push to GitHub
# Connect to Vercel
# Auto-deploys on push
# Free tier: unlimited
```

### Backend (Render.com or Fly.io)
```bash
# Push to GitHub with Dockerfile
# Deploy with docker-compose.yml
# Free tier: sleeps after 15 min (OK for demo)
```

### Database (Railway or Supabase)
```bash
# Free PostgreSQL instance
# 250MB storage
# Enough for demo
```

**Total cost: $0**

---

## 11. DEMO SCRIPT (5 minutes)

```
1. SHOW PROBLEM (30s)
   "Product teams spend hours analyzing user interviews manually.
    Here's a raw transcript [show text file]."

2. UPLOAD & ANALYZE (45s)
   Drag file into upload zone.
   Show progress: "Analyzing with AI..."
   Takes ~5-10 seconds.

3. REVEAL DASHBOARD (2 min)
   "Now we have structured insights:
    - Pain Points: Top 3 frustrations
    - Segments: Who the user is
    - Themes: Recurring topics
    - Recommendations: What to build
    
   Each insight shows supporting quotes from the transcript."

4. SHOW REPORT (1 min)
   Click "Download Report"
   Show PDF with all insights formatted nicely.

5. CLOSE (45s)
   "Imagine doing this for 50 interviews.
    Scale to multiple transcripts, generate reports, export to product roadmap.
    AI agent orchestrates the entire analysis.
    That's DiscoveryOS."
```

---

## 12. SUCCESS CRITERIA FOR SUBMISSION

- [ ] Upload form works (drag-and-drop)
- [ ] AI analysis completes in < 15 seconds
- [ ] Dashboard renders insights correctly
- [ ] Report downloads as PDF
- [ ] No auth required
- [ ] Demo script flows smoothly
- [ ] Code is clean and readable
- [ ] README has setup instructions
- [ ] Works on deployed URL (not just localhost)

---

## 13. CONTINGENCY PLANS

### If LLM API is slow/fails:
- Pre-load mock insights JSON
- Use Groq (faster than OpenAI)
- Implement 5s timeout + fallback to mock

### If PostgreSQL connection fails:
- Switch to SQLite (one line change)
- Works instantly, no setup

### If report generation fails:
- Skip PDF, show JSON insights
- Frontend downloads HTML table

### If frontend deployment fails:
- Use GitHub Pages (static build)
- Or just submit localhost link with instructions

---

## FINAL CHECKLIST

**By EOD:**
- [ ] GitHub repo with clean commit history
- [ ] Working frontend (Vercel deployed)
- [ ] Working backend (Render deployed)
- [ ] Demo video or live demo link
- [ ] README with 3-step setup (git clone, install, run)
- [ ] Sample transcript for demo
- [ ] Presentation slides (5 slides max)

**Judging will see:**
- Live demo of full flow
- GitHub code (clean, readable)
- Deployed links
- Demo video (30 sec version)

---

## ESTIMATED RESULTS

**What you'll have in 6-8 hours:**
- ✅ Fully functional MVP (3 core features)
- ✅ Professional UI (Tailwind + animations)
- ✅ Real AI integration (Groq/Claude)
- ✅ Cloud deployment (Vercel + Render)
- ✅ Demo-ready (5-min pitch)

**Realistic scoring estimate:**
- AI Integration: 23/25 (single call is elegant)
- UX/Prototype: 18/20 (professional, clean)
- Innovation: 13/15 (priority scoring, theme linking)
- Problem Understanding: 14/15 (clear value prop)
- **TOTAL: 68/75 (90% — Top 10 range)**

---

