# DiscoveryOS - Quick Start Guide

## 🚀 Fastest Way to Start (Frontend Only)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Opens at http://localhost:3000 with built-in demo data. No backend needed!

## 🐳 Full Stack with Docker

```bash
# Make sure Docker is installed
docker-compose up

# Frontend: http://localhost:3000 or http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 🔧 Manual Setup (Frontend + Backend)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/discovery_os
# GROQ_API_KEY=your_groq_api_key (optional)

# Run server
python -m uvicorn app:app --reload --port 8000
```

### Frontend (new terminal)

```bash
npm install
npm run dev
```

## 📝 Configuration

### Frontend (.env or .env.local)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend (backend/.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/discovery_os
GROQ_API_KEY=your_groq_api_key_here
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

## 🤖 AI Integration

### Get Groq API Key (Free)
1. Visit https://console.groq.com
2. Sign up (free tier included)
3. Create an API key
4. Add to `backend/.env`: `GROQ_API_KEY=your_key`

### If No API Key
- Backend uses mock data automatically
- Frontend works in demo mode
- Everything still works!

## 📊 Database

### PostgreSQL Setup

```bash
# With Docker
docker-compose up postgres

# Or install locally: https://www.postgresql.org/download/
psql -U postgres -d discovery_os
```

### Or Use SQLite
Edit `backend/config.py`:
```python
DATABASE_URL=sqlite:///./discovery_os.db
```

No additional setup needed!

## ✅ Verification

**Frontend works:**
- Navigate to http://localhost:3000
- See upload interface
- Drag and drop test works

**Backend works:**
- Visit http://localhost:8000/docs
- See interactive API documentation
- Try POST /api/upload

**Database works:**
- Check PostgreSQL or SQLite file exists
- Data persists after upload

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or use different port: `npm run dev -- --port 3001` |
| Database connection error | Check DATABASE_URL, ensure PostgreSQL running |
| CORS errors | Add frontend URL to CORS_ORIGINS in backend/.env |
| Groq API rate limit | Wait 1 minute or use SQLite without backend |
| Module not found | `rm -rf node_modules && npm install` |

## 📚 Next Steps

1. Upload a test transcript
2. Review AI-generated insights
3. Download report
4. Explore code: `src/components/` for UI, `backend/` for API
5. Customize mock data in `src/App.tsx`

## 🚢 Deploy

**Frontend (Vercel):**
```bash
npm run build
# Connect GitHub repo to Vercel
# Auto-deploys on push
```

**Backend (Render/Railway/Fly.io):**
```bash
# Push to GitHub with docker-compose.yml
# Deploy via platform web interface
```

---

**Questions?** Check README.md for detailed documentation.
