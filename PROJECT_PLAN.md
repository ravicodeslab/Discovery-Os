# DiscoveryOS - AI Agent for Product Discovery & User Research Intelligence

## Executive Summary

**DiscoveryOS** is an MVP AI-powered platform that transforms raw user interviews, transcripts, and survey responses into actionable product insights. The system employs an AI agent to analyze qualitative research data and extract structured insights including pain points, user segments, themes, and product recommendations.

**Timeline:** 6-week hackathon sprint  
**Target Launch:** MVP with core features (upload, analysis, dashboard, reports)

---

## 1. Project Folder Structure

```
discovery-os/
├── frontend/                       # Next.js Frontend Application
│   ├── public/
│   │   ├── icons/
│   │   └── images/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Home/Dashboard
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   └── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx        # Main dashboard
│   │   │   │   ├── upload/         # Transcript upload
│   │   │   │   ├── insights/       # AI insights page
│   │   │   │   ├── reports/        # Reports page
│   │   │   │   ├── settings/       # User settings
│   │   │   │   └── project/[id]/
│   │   │   │       └── page.tsx    # Project details
│   │   │   └── api/
│   │   │       └── auth/           # NextAuth endpoints
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── PainPointsCard.tsx
│   │   │   │   ├── UserSegmentsCard.tsx
│   │   │   │   ├── TrendCard.tsx
│   │   │   │   ├── PriorityMatrix.tsx
│   │   │   │   └── RecommendationsCard.tsx
│   │   │   ├── upload/
│   │   │   │   ├── TranscriptUpload.tsx
│   │   │   │   ├── FileDropZone.tsx
│   │   │   │   └── UploadProgress.tsx
│   │   │   ├── insights/
│   │   │   │   ├── InsightsGrid.tsx
│   │   │   │   ├── ThemeExplorer.tsx
│   │   │   │   ├── SegmentBreakdown.tsx
│   │   │   │   └── ImpactAnalysis.tsx
│   │   │   ├── reports/
│   │   │   │   ├── ReportView.tsx
│   │   │   │   ├── ReportExport.tsx
│   │   │   │   └── ReportList.tsx
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   └── DataTable.tsx
│   │   │   └── charts/
│   │   │       ├── BarChart.tsx
│   │   │       ├── PieChart.tsx
│   │   │       ├── LineChart.tsx
│   │   │       └── ScatterPlot.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useInsights.ts
│   │   │   ├── useUpload.ts
│   │   │   └── useFetch.ts
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   ├── auth-service.ts
│   │   │   ├── upload-service.ts
│   │   │   ├── api-endpoints.ts
│   │   │   └── utils.ts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── AppContext.tsx
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── api.ts
│   │   │   ├── insights.ts
│   │   │   └── models.ts
│   │   └── middleware.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── .env.example
│
├── backend/                        # FastAPI Backend Service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app entry
│   │   ├── config.py               # Configuration
│   │   ├── dependencies.py         # Dependency injection
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py         # Auth endpoints
│   │   │   │   ├── users.py        # User management
│   │   │   │   ├── projects.py     # Project CRUD
│   │   │   │   ├── transcripts.py  # Upload & storage
│   │   │   │   ├── analysis.py     # AI analysis trigger
│   │   │   │   ├── insights.py     # Insights retrieval
│   │   │   │   ├── reports.py      # Report generation
│   │   │   │   └── router.py       # Router aggregator
│   │   │   └── dependencies.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── security.py         # JWT, password hashing
│   │   │   ├── config.py           # Settings validation
│   │   │   └── constants.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── connection.py       # DB connection pool
│   │   │   ├── session.py          # SQLAlchemy session
│   │   │   ├── models.py           # ORM models
│   │   │   └── migrations/         # Alembic migrations
│   │   │       ├── versions/
│   │   │       ├── env.py
│   │   │       ├── script.py.mako
│   │   │       └── alembic.ini
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── transcript.py
│   │   │   ├── insight.py
│   │   │   ├── report.py
│   │   │   └── common.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── user_service.py     # User logic
│   │   │   ├── project_service.py  # Project logic
│   │   │   ├── transcript_service.py # Upload & storage
│   │   │   ├── ai_agent_service.py # AI analysis orchestration
│   │   │   ├── report_service.py   # Report generation
│   │   │   └── file_service.py     # S3/storage integration
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── logger.py
│   │   │   ├── exceptions.py
│   │   │   ├── validators.py
│   │   │   └── helpers.py
│   │   └── ai_agent/
│   │       ├── __init__.py
│   │       ├── agent.py            # Main AI agent
│   │       ├── prompts.py          # LLM prompts
│   │       ├── extractors.py       # Data extraction logic
│   │       ├── processors.py       # Data processing
│   │       ├── llm_client.py       # LLM API client
│   │       ├── validators.py       # Output validation
│   │       └── templates.py        # Response templates
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_projects.py
│   │   ├── test_transcripts.py
│   │   ├── test_analysis.py
│   │   └── test_ai_agent.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml              # Multi-container orchestration
├── .gitignore
├── README.md
├── ARCHITECTURE.md                 # Detailed architecture doc
└── DEPLOYMENT.md                   # Deployment guide

```

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│    ┌──────────────────────────────────────────────────────┐     │
│    │              Next.js Frontend (React)                │     │
│    │  ┌────────────────────────────────────────────────┐  │     │
│    │  │  Dashboard │ Upload │ Insights │ Reports      │  │     │
│    │  └────────────────────────────────────────────────┘  │     │
│    └──────────────────────────────────────────────────────┘     │
└─────────────────────────┬──────────────────────────────────────┘
                          │ HTTP/REST API
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│                  FastAPI Backend Service                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Auth & Security │  │ File Upload Mgmt │  │ Project Mgmt │  │
│  │  (JWT, OAuth)   │  │   (S3, Local)    │  │  (CRUD)      │  │
│  └─────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            AI AGENT SERVICE LAYER                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ Orchestrator │  │ Extractors   │  │ Processors   │   │  │
│  │  │ (Agentic)    │  │ (Parsing)    │  │ (Analytics)  │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Insights Mgmt   │  │ Report Generator │  │ Persistence  │  │
│  │  (Store/Query)  │  │ (Export)         │  │  (Cache)     │  │
│  └─────────────────┘  └──────────────────┘  └──────────────┘  │
└──────────────┬───────────────────────────┬───────────────────┘
               │                           │
       ┌───────▼──────────┐       ┌────────▼──────────┐
       │  PostgreSQL DB   │       │ LLM API (OpenAI) │
       │  (Transcripts,   │       │ Compatible       │
       │   Insights,      │       │ (Groq, Claude)   │
       │   Reports)       │       └──────────────────┘
       └──────────────────┘
```

### 2.2 Component Responsibilities

#### **Frontend (Next.js + React)**
- User authentication UI (login, signup, password reset)
- Dashboard with KPI cards and trend visualization
- Transcript upload with drag-and-drop
- Insights viewer with filtering and search
- Report generation and export
- User settings and project management

#### **Backend (FastAPI)**
- RESTful API for all frontend operations
- JWT-based authentication & authorization
- File upload handling (multipart/form-data)
- Transcript persistence and versioning
- Orchestration of AI agent for analysis
- Caching and optimization of query responses
- Report generation and formatting

#### **AI Agent Service**
- **Orchestrator**: Coordinates extraction, processing, and output generation
- **Extractors**: Parse transcripts, identify themes, segments, pain points
- **Processors**: Aggregate data, calculate frequencies, derive insights
- **LLM Client**: Interface with OpenAI-compatible API (Groq, Claude, etc.)
- **Validators**: Ensure output quality and structure compliance
- **Templates**: Define expected response formats

### 2.3 Data Flow

```
1. USER UPLOADS TRANSCRIPT
   User → Frontend Upload Form
   → Upload Service (chunk if > 10MB)
   → Backend /api/v1/transcripts (multipart/form-data)
   → File Storage (S3 or Local)
   → DB Record Created (PENDING status)

2. AI ANALYSIS TRIGGERED
   Frontend → POST /api/v1/analysis/{transcript_id}
   → Backend Receives Request
   → AI Agent Service Starts (async job)
   → LLM API Called with Transcript
   → Analysis Results Structured
   → DB Updated with Insights
   → Frontend Notified (WebSocket or polling)

3. INSIGHTS RETRIEVED & DISPLAYED
   Frontend → GET /api/v1/insights/{project_id}
   → Backend Queries DB
   → Returns Structured Data
   → Frontend Renders Dashboard/Insights Page

4. REPORT GENERATED
   User → Frontend Report Builder
   → POST /api/v1/reports
   → Backend Aggregates Insights
   → Generates PDF/HTML
   → Returns for Download
```

### 2.4 Authentication Flow

```
1. SIGNUP/LOGIN
   User → Frontend Login Page
   → POST /api/v1/auth/signup (email, password)
   → Backend Hashes Password (bcrypt)
   → DB Creates User Record
   → JWT Token Generated
   → Token Stored in HttpOnly Cookie (secure)
   → Redirect to Dashboard

2. REQUEST WITH AUTH
   Frontend → Any Protected Endpoint
   → JWT Token in Authorization Header
   → Backend Validates JWT
   → Extracts user_id from Token
   → Proceeds if Valid, 401 if Invalid
```

---

## 3. Database Schema

### 3.1 Entity Relationship Diagram

```
USERS (1) ─────────────────────────── (N) PROJECTS
  │
  │
  ├── id (PK)
  ├── email (UNIQUE)
  ├── password_hash
  ├── full_name
  ├── created_at
  ├── updated_at
  └── is_active


PROJECTS (1) ──────────────────────── (N) TRANSCRIPTS
PROJECTS (1) ──────────────────────── (N) INSIGHTS
PROJECTS (1) ──────────────────────── (N) REPORTS
  │
  ├── id (PK)
  ├── user_id (FK → USERS)
  ├── title
  ├── description
  ├── industry
  ├── status (DRAFT, IN_ANALYSIS, COMPLETE)
  ├── created_at
  ├── updated_at


TRANSCRIPTS
  │
  ├── id (PK)
  ├── project_id (FK → PROJECTS)
  ├── title
  ├── file_path (S3 or local)
  ├── file_size
  ├── mime_type
  ├── content (JSONB - full text)
  ├── metadata (JSONB)
  │   ├── duration (in minutes)
  │   ├── interviewee_role
  │   ├── interview_date
  │   └── tags
  ├── status (UPLOADED, PROCESSING, ANALYZED)
  ├── analysis_status (PENDING, IN_PROGRESS, COMPLETE, FAILED)
  ├── error_message (if failed)
  ├── created_at
  ├── updated_at
  ├── analyzed_at


INSIGHTS
  │
  ├── id (PK)
  ├── project_id (FK → PROJECTS)
  ├── transcript_id (FK → TRANSCRIPTS, nullable)
  ├── insight_type (PAIN_POINT, THEME, USER_SEGMENT, BUSINESS_IMPACT, RECOMMENDATION)
  ├── content (TEXT - full description)
  ├── category (STRING)
  ├── frequency (INT - how many transcripts mention this)
  ├── priority_score (0-100)
  ├── business_impact (STRING - HIGH, MEDIUM, LOW)
  ├── affected_segments (JSONB - array of segment IDs)
  ├── supporting_quotes (JSONB - array of quotes)
  │   ├── quote (TEXT)
  │   ├── transcript_id (FK)
  │   └── timestamp
  ├── evidence_count (INT)
  ├── data (JSONB - additional metadata)
  ├── created_at
  ├── updated_at


THEMES
  │
  ├── id (PK)
  ├── project_id (FK → PROJECTS)
  ├── name (STRING - e.g., "Onboarding Friction")
  ├── description (TEXT)
  ├── frequency (INT)
  ├── related_insights (JSONB - array of insight IDs)
  ├── trend (STRING - UP, DOWN, STABLE)
  ├── created_at
  ├── updated_at


USER_SEGMENTS
  │
  ├── id (PK)
  ├── project_id (FK → PROJECTS)
  ├── name (STRING - e.g., "Enterprise Users")
  ├── description (TEXT)
  ├── size (INT - estimated user count)
  ├── characteristics (JSONB - key traits)
  ├── pain_points (JSONB - array of related insights)
  ├── created_at
  ├── updated_at


REPORTS
  │
  ├── id (PK)
  ├── project_id (FK → PROJECTS)
  ├── title
  ├── description
  ├── report_type (EXECUTIVE_SUMMARY, DETAILED_ANALYSIS, THEME_DEEP_DIVE)
  ├── content (JSONB - structured report data)
  │   ├── executive_summary
  │   ├── pain_points
  │   ├── user_segments
  │   ├── themes
  │   ├── recommendations
  │   └── priority_matrix
  ├── template_version (version of report structure)
  ├── export_format (PDF, HTML, JSON)
  ├── file_path (S3 or local - generated report)
  ├── generated_at
  ├── created_at
  ├── updated_at


ANALYSIS_JOBS
  │
  ├── id (PK)
  ├── transcript_id (FK → TRANSCRIPTS)
  ├── project_id (FK → PROJECTS)
  ├── status (QUEUED, RUNNING, COMPLETED, FAILED)
  ├── started_at
  ├── completed_at
  ├── error_message (if failed)
  ├── llm_tokens_used (for cost tracking)
  ├── processing_time_ms
  ├── created_at
```

### 3.2 SQL Schema Definition

#### Key Tables (Detailed)

```sql
-- USERS Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    organization VARCHAR(255),
    profile_picture_url VARCHAR(512),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    INDEX idx_email (email)
);

-- PROJECTS Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    status VARCHAR(50) DEFAULT 'DRAFT',  -- DRAFT, IN_ANALYSIS, COMPLETE
    transcript_count INT DEFAULT 0,
    analysis_status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, IN_PROGRESS, COMPLETE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- TRANSCRIPTS Table
CREATE TABLE transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    content TEXT,  -- Full transcript text
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'UPLOADED',  -- UPLOADED, PROCESSING, ANALYZED
    analysis_status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, IN_PROGRESS, COMPLETE, FAILED
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    analyzed_at TIMESTAMP WITH TIME ZONE,
    INDEX idx_project_id (project_id),
    INDEX idx_status (status)
);

-- INSIGHTS Table
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    transcript_id UUID REFERENCES transcripts(id) ON DELETE SET NULL,
    insight_type VARCHAR(50) NOT NULL,  -- PAIN_POINT, THEME, USER_SEGMENT, etc.
    content TEXT NOT NULL,
    category VARCHAR(100),
    frequency INT DEFAULT 1,
    priority_score INT CHECK (priority_score >= 0 AND priority_score <= 100),
    business_impact VARCHAR(50),  -- HIGH, MEDIUM, LOW
    affected_segments JSONB DEFAULT '[]',
    supporting_quotes JSONB DEFAULT '[]',
    evidence_count INT DEFAULT 1,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    INDEX idx_project_id (project_id),
    INDEX idx_insight_type (insight_type),
    INDEX idx_priority_score (priority_score DESC)
);

-- THEMES Table
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    frequency INT DEFAULT 0,
    related_insights JSONB DEFAULT '[]',
    trend VARCHAR(50),  -- UP, DOWN, STABLE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    INDEX idx_project_id (project_id)
);

-- USER_SEGMENTS Table
CREATE TABLE user_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    size INT,
    characteristics JSONB DEFAULT '{}',
    pain_points JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    INDEX idx_project_id (project_id)
);

-- REPORTS Table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100),
    content JSONB,
    template_version VARCHAR(20),
    export_format VARCHAR(50),  -- PDF, HTML, JSON
    file_path VARCHAR(512),
    generated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    INDEX idx_project_id (project_id)
);

-- ANALYSIS_JOBS Table
CREATE TABLE analysis_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transcript_id UUID NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'QUEUED',  -- QUEUED, RUNNING, COMPLETED, FAILED
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    llm_tokens_used INT,
    processing_time_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    INDEX idx_status (status),
    INDEX idx_transcript_id (transcript_id)
);
```

---

## 4. API Endpoints

### 4.1 Authentication Endpoints

```
POST   /api/v1/auth/signup
       Body: { email, password, full_name, organization }
       Response: { user_id, email, token, token_expiry }

POST   /api/v1/auth/login
       Body: { email, password }
       Response: { user_id, email, token, token_expiry }

POST   /api/v1/auth/logout
       Header: Authorization: Bearer <token>
       Response: { message: "Logged out successfully" }

POST   /api/v1/auth/refresh-token
       Body: { refresh_token }
       Response: { token, token_expiry }

POST   /api/v1/auth/password-reset
       Body: { email }
       Response: { message: "Reset link sent" }
```

### 4.2 Project Management Endpoints

```
GET    /api/v1/projects
       Header: Authorization: Bearer <token>
       Query: { page, limit, sort_by, status }
       Response: { projects: [...], total, page, limit }

GET    /api/v1/projects/{project_id}
       Header: Authorization: Bearer <token>
       Response: { id, title, description, status, transcript_count, created_at, ... }

POST   /api/v1/projects
       Header: Authorization: Bearer <token>
       Body: { title, description, industry }
       Response: { id, title, description, status, created_at, ... }

PUT    /api/v1/projects/{project_id}
       Header: Authorization: Bearer <token>
       Body: { title, description, industry }
       Response: { id, title, description, status, updated_at, ... }

DELETE /api/v1/projects/{project_id}
       Header: Authorization: Bearer <token>
       Response: { message: "Project deleted successfully" }

GET    /api/v1/projects/{project_id}/stats
       Header: Authorization: Bearer <token>
       Response: { transcript_count, insight_count, themes_count, segments_count, ... }
```

### 4.3 Transcript Upload Endpoints

```
POST   /api/v1/transcripts
       Header: Authorization: Bearer <token>
       Body: multipart/form-data { project_id, file, title, metadata }
       Response: { id, project_id, title, status, file_path, created_at }

GET    /api/v1/projects/{project_id}/transcripts
       Header: Authorization: Bearer <token>
       Query: { page, limit, status, sort_by }
       Response: { transcripts: [...], total, page, limit }

GET    /api/v1/transcripts/{transcript_id}
       Header: Authorization: Bearer <token>
       Response: { id, title, content, status, file_path, metadata, created_at, ... }

DELETE /api/v1/transcripts/{transcript_id}
       Header: Authorization: Bearer <token>
       Response: { message: "Transcript deleted successfully" }

GET    /api/v1/transcripts/{transcript_id}/download
       Header: Authorization: Bearer <token>
       Response: File (octet-stream)
```

### 4.4 AI Analysis & Insights Endpoints

```
POST   /api/v1/analysis/{transcript_id}
       Header: Authorization: Bearer <token>
       Body: { include_recommendations: true }
       Response: { job_id, status: "QUEUED", transcript_id, started_at }

GET    /api/v1/analysis/{transcript_id}/status
       Header: Authorization: Bearer <token>
       Response: { job_id, status, progress, estimated_time_remaining, error }

GET    /api/v1/projects/{project_id}/insights
       Header: Authorization: Bearer <token>
       Query: { insight_type, category, sort_by, limit }
       Response: {
           insights: [
               {
                   id, project_id, insight_type, content, category,
                   frequency, priority_score, business_impact,
                   supporting_quotes, created_at
               }
           ],
           total
       }

GET    /api/v1/projects/{project_id}/insights/{insight_id}
       Header: Authorization: Bearer <token>
       Response: { id, content, supporting_quotes, affected_segments, ... }

GET    /api/v1/projects/{project_id}/themes
       Header: Authorization: Bearer <token>
       Response: { themes: [...], total }

GET    /api/v1/projects/{project_id}/user-segments
       Header: Authorization: Bearer <token>
       Response: { segments: [...], total }

GET    /api/v1/projects/{project_id}/priority-matrix
       Header: Authorization: Bearer <token>
       Response: {
           matrix: [
               { impact: "HIGH", effort: "LOW", insights: [...] },
               ...
           ]
       }
```

### 4.5 Report Generation Endpoints

```
POST   /api/v1/projects/{project_id}/reports
       Header: Authorization: Bearer <token>
       Body: { title, description, report_type, include_sections, export_format }
       Response: { id, project_id, title, status, created_at }

GET    /api/v1/projects/{project_id}/reports
       Header: Authorization: Bearer <token>
       Query: { page, limit, sort_by }
       Response: { reports: [...], total, page, limit }

GET    /api/v1/reports/{report_id}
       Header: Authorization: Bearer <token>
       Response: { id, title, content, created_at, export_format, ... }

GET    /api/v1/reports/{report_id}/download
       Header: Authorization: Bearer <token>
       Query: { format: "pdf" | "html" | "json" }
       Response: File (PDF/HTML/JSON)

DELETE /api/v1/reports/{report_id}
       Header: Authorization: Bearer <token>
       Response: { message: "Report deleted successfully" }
```

### 4.6 User Settings Endpoints

```
GET    /api/v1/users/me
       Header: Authorization: Bearer <token>
       Response: { id, email, full_name, organization, created_at, ... }

PUT    /api/v1/users/me
       Header: Authorization: Bearer <token>
       Body: { full_name, organization, profile_picture_url }
       Response: { id, email, full_name, organization, updated_at, ... }

POST   /api/v1/users/change-password
       Header: Authorization: Bearer <token>
       Body: { current_password, new_password }
       Response: { message: "Password changed successfully" }

DELETE /api/v1/users/me
       Header: Authorization: Bearer <token>
       Response: { message: "Account deleted successfully" }
```

### 4.7 Health & System Endpoints

```
GET    /api/v1/health
       Response: { status: "ok", timestamp }

GET    /api/v1/status
       Response: { db: "ok", llm: "ok", storage: "ok", timestamp }
```

---

## 5. AI Agent Design

### 5.1 Agent Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  USER UPLOADS TRANSCRIPT                                    │
│  ↓                                                           │
│  Async Job Created (QUEUED)                                 │
│  ↓                                                           │
│  ORCHESTRATOR STARTS                                        │
│  ├─ Load Transcript Content                                 │
│  ├─ Validate Format & Content                               │
│  └─ Chunk Large Documents (if > 5000 tokens)                │
│                                                              │
│  ↓                                                           │
│  EXTRACTOR PHASE                                            │
│  ├─ Pain Points Extractor                                   │
│  │  └─ LLM Call: "Identify pain points from transcript"     │
│  ├─ User Segments Extractor                                 │
│  │  └─ LLM Call: "Identify user segments mentioned"         │
│  ├─ Themes Extractor                                        │
│  │  └─ LLM Call: "Extract recurring themes"                 │
│  └─ Business Impact Extractor                               │
│     └─ LLM Call: "Assess business impact of insights"       │
│                                                              │
│  ↓                                                           │
│  PROCESSOR PHASE                                            │
│  ├─ Aggregate Similar Insights (fuzzy matching)             │
│  ├─ Calculate Frequency (across all project transcripts)    │
│  ├─ Score Priority (impact + frequency + urgency)           │
│  └─ Link Themes to Segments                                 │
│                                                              │
│  ↓                                                           │
│  RECOMMENDER PHASE                                          │
│  ├─ Generate Product Recommendations                        │
│  │  └─ LLM Call: "Based on pain points, suggest features"   │
│  └─ Create Executive Summary                                │
│     └─ LLM Call: "Summarize key findings"                   │
│                                                              │
│  ↓                                                           │
│  PERSISTENCE PHASE                                          │
│  ├─ Store All Insights in DB                                │
│  ├─ Create/Update Themes                                    │
│  ├─ Create/Update User Segments                             │
│  └─ Mark Transcript as ANALYZED                             │
│                                                              │
│  ↓                                                           │
│  JOB COMPLETED → Notify Frontend (WebSocket/Polling)        │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Prompt Templates

#### Pain Points Extractor Prompt
```
ROLE: You are a Product Insights Expert analyzing user research.

TASK: Extract ALL pain points mentioned in the following interview transcript.

CONSTRAINTS:
- Only identify explicit or strongly implied problems
- Format each pain point with: title, description, affected_role, severity

TRANSCRIPT:
[TRANSCRIPT CONTENT]

OUTPUT FORMAT (JSON):
{
  "pain_points": [
    {
      "title": "string",
      "description": "string",
      "affected_role": "string",
      "severity": "HIGH|MEDIUM|LOW",
      "quote": "supporting quote from transcript"
    }
  ]
}
```

#### User Segments Extractor Prompt
```
ROLE: You are a User Research Analyst.

TASK: Identify distinct user segments/personas in the transcript.

CONSTRAINTS:
- Extract roles, use cases, company sizes, industries
- Look for behavioral or demographic patterns
- Avoid assumptions not stated in transcript

TRANSCRIPT:
[TRANSCRIPT CONTENT]

OUTPUT FORMAT (JSON):
{
  "segments": [
    {
      "name": "string",
      "description": "string",
      "characteristics": {
        "role": "string",
        "company_size": "string",
        "use_cases": ["string"],
        "pain_points": ["string"]
      }
    }
  ]
}
```

#### Themes Extractor Prompt
```
ROLE: You are a Qualitative Data Analyst.

TASK: Identify recurring themes/topics across the transcript.

CONSTRAINTS:
- Themes should emerge from the data, not be pre-defined
- Each theme should have clear evidence
- Group related concepts

TRANSCRIPT:
[TRANSCRIPT CONTENT]

OUTPUT FORMAT (JSON):
{
  "themes": [
    {
      "name": "string",
      "description": "string",
      "evidence_points": ["string"],
      "related_topics": ["string"]
    }
  ]
}
```

#### Recommendations Generator Prompt
```
ROLE: You are a Product Manager synthesizing insights.

TASK: Generate product recommendations based on pain points and themes.

CONTEXT:
- Pain Points: [EXTRACTED PAIN POINTS]
- User Segments: [EXTRACTED SEGMENTS]
- Themes: [EXTRACTED THEMES]

CONSTRAINTS:
- Recommendations should directly address identified pain points
- Consider feasibility and impact
- Link each recommendation to supporting evidence

OUTPUT FORMAT (JSON):
{
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "addresses_pain_points": ["string"],
      "target_segments": ["string"],
      "estimated_impact": "HIGH|MEDIUM|LOW",
      "effort_level": "HIGH|MEDIUM|LOW",
      "priority_score": 0-100
    }
  ]
}
```

### 5.3 AI Agent Parameters

- **LLM Model**: GPT-4 or compatible (Claude 3, Groq, Llama)
- **Temperature**: 0.3 (low creativity, focused extraction)
- **Max Tokens Per Call**: 2000
- **Timeout**: 30 seconds per extraction call
- **Retry Logic**: 3 attempts with exponential backoff
- **Batch Processing**: Process transcripts sequentially if queue > 5

### 5.4 Quality Assurance

- **Output Validation**: Ensure JSON compliance, required fields present
- **Deduplication**: Fuzzy match insights across transcripts (levenshtein distance > 0.8)
- **Frequency Thresholds**: Only aggregate insights appearing in 2+ transcripts
- **Manual Review Flag**: Flag low-confidence extractions for human review

---

## 6. Development Roadmap

### 6.1 Phase 1: Foundation (Weeks 1-2)

#### Backend Infrastructure
- [ ] Set up FastAPI project structure
- [ ] Configure PostgreSQL connection & Alembic migrations
- [ ] Implement JWT authentication
- [ ] Create user & project database models
- [ ] Build user signup/login endpoints
- [ ] Set up error handling & logging

#### Frontend Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS & component library
- [ ] Implement authentication pages (login, signup)
- [ ] Create main layout & navigation
- [ ] Set up API client & context for auth state
- [ ] Deploy placeholder dashboard

#### AI Agent Foundation
- [ ] Set up LLM API client (OpenAI-compatible)
- [ ] Create prompt templates
- [ ] Build basic orchestrator skeleton
- [ ] Implement error handling for LLM calls

#### DevOps & Infrastructure
- [ ] Create docker-compose.yml for local development
- [ ] Set up .env configuration templates
- [ ] Document development setup in README

---

### 6.2 Phase 2: Core Features (Weeks 2-3)

#### File Upload & Storage
- [ ] Implement multipart file upload endpoint
- [ ] Create file validation (format, size, encoding)
- [ ] Set up S3 or local file storage integration
- [ ] Build transcript model & persistence
- [ ] Create upload progress tracking

#### Transcript Management
- [ ] Build transcript listing endpoint
- [ ] Create transcript detail view page
- [ ] Implement transcript metadata editor
- [ ] Add transcript search functionality
- [ ] Create transcript deletion & archival

#### Frontend Upload UI
- [ ] Build drag-and-drop upload component
- [ ] Implement upload progress bar
- [ ] Create transcript list view
- [ ] Add transcript detail modal
- [ ] Build file preview component

---

### 6.3 Phase 3: AI Analysis Engine (Weeks 3-4)

#### Core AI Extractors
- [ ] Implement pain points extractor
- [ ] Implement user segments extractor
- [ ] Implement themes extractor
- [ ] Implement business impact analyzer
- [ ] Add output validation layer

#### Insight Storage & Management
- [ ] Create insights database model
- [ ] Build insight aggregation logic (deduplication)
- [ ] Implement frequency calculation
- [ ] Create priority scoring algorithm
- [ ] Build insights query endpoints

#### Analysis Orchestration
- [ ] Implement async job processing (Celery or APScheduler)
- [ ] Create analysis status tracking
- [ ] Build error handling & retry logic
- [ ] Implement WebSocket/polling for job status
- [ ] Add analysis history tracking

---

### 6.4 Phase 4: Insights & Dashboard (Weeks 4-5)

#### Dashboard Components
- [ ] Build top pain points card
- [ ] Create user segments visualization
- [ ] Implement trend cards
- [ ] Build priority matrix component
- [ ] Create recommendations panel

#### Insights Explorer
- [ ] Build insights grid with filters
- [ ] Create theme explorer
- [ ] Implement segment breakdown view
- [ ] Add impact analysis visualization
- [ ] Create supporting quotes viewer

#### Advanced Features
- [ ] Implement insight search & filtering
- [ ] Add export to CSV/JSON
- [ ] Create insight detail modal with drill-down
- [ ] Build related insights linking
- [ ] Add tagging system for insights

---

### 6.5 Phase 5: Report Generation (Week 5)

#### Report Builder
- [ ] Create report generation endpoint
- [ ] Implement report templates (Executive Summary, Detailed)
- [ ] Build report content aggregation
- [ ] Add report formatting logic

#### Report Export
- [ ] Implement PDF export (using reportlab/weasyprint)
- [ ] Implement HTML export
- [ ] Create JSON export
- [ ] Build report download endpoint

#### Frontend Report UI
- [ ] Create report builder form
- [ ] Build report list view
- [ ] Implement report preview
- [ ] Add report export buttons
- [ ] Create email sharing capability

---

### 6.6 Phase 6: Polish & Deployment (Week 6)

#### Testing & QA
- [ ] Unit tests for backend services (80%+ coverage)
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Manual QA & bug fixes
- [ ] Performance testing & optimization

#### Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] User guide for dashboard
- [ ] Developer setup guide
- [ ] Deployment guide
- [ ] Architecture decision records

#### DevOps & Deployment
- [ ] Set up GitHub Actions CI/CD
- [ ] Configure production environment
- [ ] Set up monitoring & alerting
- [ ] Create backup strategy
- [ ] Deploy to production

#### Final Polish
- [ ] UX refinements
- [ ] Error message improvements
- [ ] Loading state optimizations
- [ ] Mobile responsiveness
- [ ] Accessibility audit (WCAG 2.1)

---

## 7. Technology Justification

| Technology | Justification |
|------------|--------------|
| **Next.js** | Full-stack React with SSR, excellent for dashboards; built-in API routes reduce backend complexity |
| **TypeScript** | Type safety reduces bugs; better IDE support; documentation via types |
| **Tailwind CSS** | Rapid UI development; consistent design system; utility-first approach |
| **FastAPI** | High performance async Python; auto-generated API docs (Swagger); modern type hints |
| **PostgreSQL** | Robust relational DB; JSONB for metadata; excellent for structured data |
| **OpenAI API** | State-of-the-art LLM with JSON mode; can switch to Claude/Groq seamlessly |
| **Docker** | Consistent local/prod environments; easy onboarding for new contributors |

---

## 8. Success Metrics & MVP Definition

### MVP Criteria (Hackathon Submission)
✅ User authentication (signup/login)  
✅ Transcript upload functionality  
✅ AI analysis on single transcript  
✅ Basic insights extraction (pain points, themes)  
✅ Dashboard with KPI cards  
✅ Report generation (PDF/HTML)  
✅ Deployable via Docker  

### Nice-to-Have (Post-MVP)
- Multi-transcript analysis with aggregation
- Advanced segmentation & clustering
- Real-time WebSocket updates
- User session recording/playback
- Integration with Figma/Miro boards
- Advanced analytics (funnel analysis, cohort tracking)

---

## 9. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **API Response Time** | < 200ms for GET requests; < 500ms for POST |
| **File Upload Size** | Support up to 100MB (chunked) |
| **Concurrent Users** | 100+ simultaneous users |
| **Availability** | 99.5% uptime |
| **Database Backup** | Daily snapshots; 30-day retention |
| **LLM Cost** | ~$0.02-0.10 per transcript analysis |
| **Security** | HTTPS, JWT auth, CORS, input validation, SQL injection protection |
| **Scalability** | Horizontal scaling via container orchestration (K8s-ready) |

---

## 10. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| LLM API rate limits | Implement queue & exponential backoff; monitor token usage |
| Analysis accuracy | Human review flag for low-confidence insights; feedback loop |
| Data privacy (PII in transcripts) | Warn users not to upload sensitive data; consider PII masking |
| Storage costs | Compress files; archive old transcripts; set quota per user |
| Long analysis times | Optimize prompts; use GPT-3.5 turbo for speed vs cost tradeoff |
| Database growth | Implement retention policies; archival strategy |

---

## 11. Deployment Architecture

### Local Development
```bash
docker-compose up
# Spins up: PostgreSQL, Backend, Frontend, Redis (optional)
```

### Staging/Production
```
Load Balancer (Nginx)
    ↓
Frontend (Next.js)  ← CDN Cache (CloudFlare)
Backend (FastAPI)   ← RDS (PostgreSQL)
AI Workers (Celery) ← Queue (Redis/RabbitMQ)
```

---

## Conclusion

This project plan provides a comprehensive blueprint for building DiscoveryOS as a production-ready MVP within the hackathon timeframe. The architecture is modular, scalable, and leverages proven technologies for rapid development.

**Key Strengths:**
- Clear separation of concerns (frontend, backend, AI agent)
- Well-defined API contracts
- Comprehensive database schema supporting future features
- Realistic 6-week delivery timeline
- Docker-based deployment ready from day one

**Next Steps:**
1. Approve architecture & database schema
2. Set up development environment & CI/CD
3. Begin Phase 1 implementation (backend foundation)
4. Parallel: UI design & component library
5. Iterative integration & testing throughout

