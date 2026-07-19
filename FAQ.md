# DiscoveryOS - FAQ & Troubleshooting

## Getting Started

### Q: What's the fastest way to try this?
**A:** Run just the frontend with mock data:
```bash
npm install
npm run dev
```
Opens at http://localhost:3000. No backend needed. Upload `sample-transcript.txt` to see it work.

### Q: Do I need Docker?
**A:** No. Docker makes it easier, but you can run frontend + backend separately.

### Q: What if I don't have PostgreSQL installed?
**A:** No problem. Edit `backend/config.py` and use SQLite:
```python
DATABASE_URL = "sqlite:///./discovery_os.db"
```

---

## Setup Issues

### Port Already In Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Option 1: Kill the process
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :3000
kill -9 <PID>

# Option 2: Use a different port
npm run dev -- --port 3001
```

### npm install Fails

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Use legacy peer deps
npm install --legacy-peer-deps

# Or use specific Node version
nvm install 18
nvm use 18
npm install
```

### Database Connection Error

**Error:** `psycopg2.OperationalError: could not connect to server`

**Solution:**
1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `backend/.env`
3. Or switch to SQLite (no setup needed)

---

## Runtime Issues

### Frontend Won't Load

**Error:** Blank page or CORS errors

**Solution:**
1. Check Vite is running: `npm run dev`
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Clear cache: Ctrl+F5
4. Check browser console (F12) for errors

### Upload Fails

**Error:** `Upload failed: 500` or file not accepted

**Solution:**
1. Check file format: TXT, PDF, Markdown, DOCX
2. Check file size: < 10MB
3. Check backend is running: `docker logs backend`
4. Look at API response: Open DevTools → Network tab

### Analysis Never Completes

**Error:** Progress bar stuck at 75%

**Solution:**
1. **If using real Groq API:**
   - Check internet connection
   - Check API key is valid
   - Check rate limits: `https://console.groq.com`
   - Wait 5-10 seconds (API might be slow)

2. **If using mock data:**
   - Refresh page (F5)
   - Check browser console for errors
   - Check backend logs

### Report Download Doesn't Work

**Error:** File doesn't download or browser shows error

**Solution:**
1. Try different browser (Chrome, Firefox, Safari)
2. Check browser download settings
3. Ensure pop-ups aren't blocked
4. Check DevTools for console errors

---

## API Issues

### 404 on /api/upload

**Error:** `POST /api/upload 404 Not Found`

**Solution:**
1. Backend not running: Start with `docker-compose up`
2. Wrong URL: Check `VITE_API_URL` in `.env`
3. CORS issue: Check `CORS_ORIGINS` in `backend/.env`

### 500 on Analysis

**Error:** `Internal Server Error` during analysis

**Solution:**
1. Check Groq API key: `echo $GROQ_API_KEY`
2. Check backend logs: `docker logs backend -f`
3. Check database is running: `docker logs postgres`
4. Clear database and try again:
   ```bash
   docker-compose down -v
   docker-compose up
   ```

### Slow API Responses

**Issue:** API takes > 10 seconds

**Solution:**
1. Using real Groq API? It can take 10-30 seconds
2. Database query slow? Check indexes
3. Network latency? Check backend logs for timing
4. Switch to mock data temporarily for testing

---

## Development Issues

### TypeScript Errors

**Error:** `Type 'any' is not assignable to type`

**Solution:**
1. Add type definitions: `import { MyType } from './lib/types'`
2. Check imports are correct
3. Run `npm run build` to see all errors
4. Check `tsconfig.json` settings

### Tailwind Classes Not Working

**Error:** Styles don't apply (class name like `bg-primary-500`)

**Solution:**
1. Save file (triggers rebuild)
2. Check class name spelling
3. Verify class is in `tailwind.config.js`
4. Check no conflicting CSS
5. Hard refresh browser

### Hot Reload Not Working

**Error:** Changes don't reflect when file saved

**Solution:**
```bash
# Restart dev server
npm run dev

# Or kill and restart
Ctrl+C
npm run dev
```

### Missing Module Errors

**Error:** `Cannot find module 'react'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

---

## Backend Specific Issues

### Can't Start Backend

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### Database Migrations Failed

**Error:** `Table already exists` or schema mismatch

**Solution:**
1. Drop all tables:
   ```sql
   DROP TABLE insights;
   DROP TABLE analysis_jobs;
   DROP TABLE transcripts;
   ```
2. Restart backend (recreates tables)
3. Or use fresh database

### Groq API Not Found

**Error:** `ModuleNotFoundError: No module named 'groq'`

**Solution:**
```bash
# Install Groq package
pip install groq

# Then restart backend
python -m uvicorn app:app --reload
```

### Memory/Connection Pooling

**Error:** `Too many connections` or memory leak

**Solution:**
1. Restart backend
2. Clear database connections
3. Add connection pooling to SQLAlchemy (production)

---

## Deployment Issues

### Frontend Won't Deploy to Vercel

**Error:** Build fails or shows blank page

**Solution:**
1. Check build output: `npm run build`
2. Ensure env vars set in Vercel dashboard
3. Check `VITE_API_URL` is set correctly
4. Verify API is accessible from Vercel IP

### Backend Won't Deploy to Render/Railway

**Error:** Build fails or crashes on startup

**Solution:**
1. Dockerfile exists: `backend/Dockerfile`
2. Set environment variables in dashboard
3. Check PostgreSQL connection string
4. Verify Groq API key is set
5. Check port is 8000

### Production API Returns 401/403

**Error:** Frontend can't call API in production

**Solution:**
1. Add frontend domain to `CORS_ORIGINS`
2. Check authentication if enabled
3. Verify API endpoint URL is correct
4. Check HTTPS (must use https://)

---

## Common Errors

### "Cannot read property 'file' of undefined"

**Cause:** File upload form not handling properly

**Fix:**
```typescript
if (!file || !file.files || !file.files[0]) {
  console.error('No file selected');
  return;
}
```

### JSON.parse error in AI response

**Cause:** LLM returned malformed JSON

**Fix:** Already handled with try-catch + fallback to mock data

### CORS error: "No 'Access-Control-Allow-Origin' header"

**Cause:** Frontend and backend on different origins

**Fix:** Add frontend URL to `CORS_ORIGINS` in `backend/.env`:
```
CORS_ORIGINS=["http://localhost:3000", "https://yourdomain.com"]
```

---

## Performance Optimization

### Frontend is Slow

1. **Check Network tab in DevTools:**
   - Are API calls hanging?
   - Are large files being transferred?

2. **Check Performance tab:**
   - Is React rendering slowly?
   - Use React DevTools Profiler

3. **Optimize:**
   ```bash
   # Create production build
   npm run build
   npm run preview
   ```

### Backend is Slow

1. **Check API response times:**
   - Use `curl -w "@curl-format.txt" http://localhost:8000/docs`
   - Is LLM call slow? (Most likely)

2. **Database queries:**
   - Add indexes
   - Check query plans with `EXPLAIN ANALYZE`

3. **Profile with:**
   ```python
   import cProfile
   cProfile.run('analyze_transcript(...)')
   ```

---

## Browser Issues

### Not Working in Safari

**Cause:** Compatibility issues

**Fix:**
1. Use Chrome/Firefox instead (for development)
2. Check can I use: https://caniuse.com
3. Add polyfills if needed

### Not Working on Mobile

**Cause:** Responsive design issue

**Fix:**
1. Check viewport meta tag (already in `index.html`)
2. Test with DevTools mobile emulation
3. Check touch events on upload

---

## Data Issues

### Lost Data After Restart

**Cause:** Using SQLite in-memory or default location

**Fix:** Data should persist by default. If lost:
1. Check database file exists: `backend/discovery_os.db` or PostgreSQL
2. Ensure `DATABASE_URL` points to persistent location
3. Check file permissions

### Wrong Insights Showing

**Cause:** Cached mock data or stale API response

**Fix:**
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Clear browser storage: DevTools → Application → Clear Storage
4. Restart backend

---

## Getting Help

### Check These First
1. ✅ Frontend running? `npm run dev` output
2. ✅ Backend running? `docker logs backend` or terminal
3. ✅ Database running? `docker ps` shows postgres
4. ✅ Correct environment variables set? `cat .env`
5. ✅ Network tab shows what's happening? Press F12

### Debug Commands
```bash
# Frontend
npm run lint              # Check TypeScript
npm run build             # Full build test
npm run preview           # Test production build

# Backend
docker logs backend -f    # Live logs
curl http://localhost:8000/docs  # Check API
docker exec discovery-os-backend python -c "import models; print('OK')"
```

### Report an Issue
Include:
1. Error message (exact)
2. Steps to reproduce
3. `npm run build` output
4. `docker logs` output
5. System info (OS, Node version)

---

## Quick Reference

| Task | Command |
|------|---------|
| Start everything | `docker-compose up` |
| Start frontend only | `npm run dev` |
| Start backend only | `cd backend && python -m uvicorn app:app --reload` |
| Build frontend | `npm run build` |
| Lint code | `npm run lint` |
| View API docs | http://localhost:8000/docs |
| Clear database | `docker-compose down -v` |
| Rebuild images | `docker-compose build --no-cache` |
| View logs | `docker-compose logs -f` |

---

## Still Stuck?

1. **Check the documentation:**
   - README.md - Overview
   - QUICKSTART.md - Setup
   - DEVELOPMENT.md - Code structure
   - ARCHITECTURE.md - Design

2. **Search this FAQ** for keywords from your error

3. **Check browser console** (F12) for clues

4. **Try the simplest test:** Upload `sample-transcript.txt` with mock data (frontend only)

---

**Happy hacking!** 🚀

If you find an issue not listed here, consider adding it to improve the docs for others.
