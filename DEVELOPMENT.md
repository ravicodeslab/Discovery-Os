# Development Guide

## Project Structure

```
discovery-os/
├── src/                        # React frontend
│   ├── components/            # React components
│   │   ├── Upload.tsx        # File upload with drag-drop
│   │   ├── AnalysisProgress.tsx
│   │   ├── Dashboard.tsx      # Insights display
│   │   ├── Card.tsx           # Reusable card wrapper
│   │   └── ReportButton.tsx   # PDF download
│   ├── hooks/
│   │   └── useAnalysis.ts     # State management
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── types.ts           # TypeScript definitions
│   ├── styles/
│   │   └── globals.css        # Tailwind + animations
│   ├── App.tsx                # Main component
│   └── main.tsx               # Entry point
├── backend/                    # FastAPI backend
│   ├── app.py                 # Main API server
│   ├── ai_agent.py            # LLM integration
│   ├── models.py              # Database models
│   ├── schemas.py             # API schemas
│   ├── config.py              # Configuration
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── HACKATHON_MVP_PLAN.md
├── PROJECT_PLAN.md
├── QUICKSTART.md
├── README.md
└── DEVELOPMENT.md (this file)
```

## Frontend Development

### Adding a New Component

1. Create file in `src/components/MyComponent.tsx`:
```typescript
import React from 'react';
import { MyIcon } from 'lucide-react';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}
```

2. Import in `src/App.tsx`:
```typescript
import { MyComponent } from './components/MyComponent';
```

### Using Tailwind Classes

Common patterns used in the project:
```typescript
// Cards
className="card"           // Standard card
className="card-lg"        // Large card with more padding

// Buttons
className="btn-primary"    // Primary CTA
className="btn-secondary"  // Secondary action

// Text
className="text-gradient"  // Gradient text effect
className="gradient-text"  // Alternative gradient

// Utilities
className="animate-slideIn"     // Slide animation
className="animate-fadeIn"      // Fade animation
className="animate-pulse-glow"  // Glow animation
```

### State Management

Uses React hooks (no Redux needed for MVP):

```typescript
const { upload, analysisStatus, insights, loading, error, uploadFile } = useAnalysis();
```

Manage state in `src/hooks/useAnalysis.ts`.

## Backend Development

### Adding a New Endpoint

1. Add schema in `backend/schemas.py`:
```python
class MyResponse(BaseModel):
    data: str
```

2. Add route in `backend/app.py`:
```python
@app.get("/api/my-endpoint", response_model=MyResponse)
async def my_endpoint(db: Session = Depends(get_db)):
    # Implementation
    return MyResponse(data="value")
```

### Database Models

Add new table to `backend/models.py`:
```python
class MyTable(Base):
    __tablename__ = "my_table"
    
    id = Column(String, primary_key=True)
    name = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
```

Tables are auto-created on app startup.

### AI Agent Integration

Edit `backend/ai_agent.py`:

```python
def analyze_transcript(content: str) -> Optional[dict]:
    # Current: Uses Groq API or fallback mock data
    # To customize: Modify prompt or add new extraction logic
```

## Styling

### Tailwind Configuration

Defined in `tailwind.config.js`:
- Primary color: Sky blue (#0ea5e9)
- Accent color: Purple (#8b5cf6)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)

### Custom CSS

In `src/styles/globals.css`:
- `.glass-effect` - Frosted glass backdrop
- `.gradient-primary` - Primary gradient
- `.text-gradient` - Gradient text
- `.card` - Standard card styling
- `.btn-primary` - Primary button
- `.input-field` - Input styling
- Animations: slideIn, fadeIn, pulse-glow

### Adding New Styles

Add to `globals.css` `@layer components`:
```css
.my-custom-style {
  @apply p-4 rounded-lg bg-slate-800 hover:bg-slate-700;
}
```

## Testing

### Frontend
```bash
# Linting
npm run lint

# Build test
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
# No tests yet - add pytest for full coverage
# For now, use:
curl http://localhost:8000/docs
```

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Auto-deploys on push
4. Set env var: `VITE_API_URL=https://api.yourdomain.com`

### Backend (Render/Railway/Fly.io)

1. Create `backend/Dockerfile` (already included)
2. Push to GitHub
3. Deploy from git
4. Set env vars:
   - `DATABASE_URL`
   - `GROQ_API_KEY`
   - `ENVIRONMENT=production`

## Common Tasks

### Running Frontend Only
```bash
npm run dev
```
Uses built-in mock data. No backend needed!

### Running Full Stack
```bash
docker-compose up
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Postgres: localhost:5432

### Testing Upload Flow
```bash
# 1. Start everything
docker-compose up

# 2. Get API endpoint
http://localhost:8000/docs

# 3. Use sample transcript
sample-transcript.txt

# 4. Upload via frontend
http://localhost:3000
```

### Debugging

**Frontend:**
- DevTools: F12
- Network tab to see API calls
- React DevTools Chrome extension

**Backend:**
- Check logs: `docker-compose logs backend`
- Use Swagger: http://localhost:8000/docs
- Add logging: `logger.error(message)`

## Performance Tips

### Frontend
- Images are lazy-loaded
- CSS is minimized (Tailwind)
- JS is tree-shaken (Vite)
- No external fonts (system fonts)

### Backend
- Database queries indexed
- Async processing where possible
- Caching for LLM responses
- Connection pooling

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend (backend/.env)
```
DATABASE_URL=postgresql://...
GROQ_API_KEY=...
CORS_ORIGINS=["http://localhost:3000"]
ENVIRONMENT=development
DEBUG=true
```

## Troubleshooting Development

| Issue | Solution |
|-------|----------|
| Hot reload not working | Restart: `npm run dev` |
| Types not recognized | Run: `npm run build` |
| API 404s | Check backend is running: `docker logs backend` |
| Database locked | Restart postgres: `docker-compose restart postgres` |
| Out of memory | Clear node_modules: `rm -rf node_modules && npm install` |

## Code Style

### Frontend
- Use TypeScript (strict mode)
- Functional components only
- Props interfaces always defined
- Tailwind for styling (no CSS-in-JS)

### Backend
- Type hints always (Python 3.9+)
- Pydantic for validation
- SQLAlchemy for ORM
- Async endpoints where possible

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .

# Commit with clear message
git commit -m "feat: add new component"

# Push and create PR
git push origin feature/my-feature
```

## Next Steps

1. **MVP features done** - All core functionality complete
2. **Hackathon ready** - Can submit as-is
3. **Future improvements**:
   - Real authentication
   - Multi-transcript aggregation
   - Advanced filtering
   - Custom themes
   - User workspaces

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Vite Docs](https://vitejs.dev/)

---

Happy coding! 🚀
