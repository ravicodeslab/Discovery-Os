# DiscoveryOS - AI Agent Hackathon MVP

A lightning-fast AI-powered platform that converts user research transcripts into actionable product insights using advanced language models.

## 🚀 Features

- **Smart Transcript Upload** - Drag-and-drop interface for interview transcripts
- **AI-Powered Analysis** - Extracts pain points, user segments, themes, and recommendations in one intelligent pass
- **Beautiful Dashboard** - Real-time visualization of extracted insights
- **Instant Reports** - Download comprehensive HTML reports with all findings
- **Zero Setup** - Works out of the box with mock data for demo purposes

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Local Development

### Quick Start (Frontend Only - With Mock Data)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will open at `http://localhost:3000`

### Full Stack Setup (Frontend + Backend + Database)

#### Option 1: Docker Compose (Recommended)

```bash
# Install Docker and Docker Compose

# Start all services
docker-compose up

# Frontend: http://localhost:3000 or http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### Option 2: Manual Setup

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add:
# - DATABASE_URL=postgresql://postgres:postgres@localhost:5432/discovery_os
# - GROQ_API_KEY=your_groq_api_key (optional, uses mock data if not set)

# Run migrations and start server
python -m uvicorn app:app --reload
```

**Frontend (in new terminal):**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:8000/api
```

For backend, create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/discovery_os
GROQ_API_KEY=your_api_key_here
```

### Using Mock Data vs. Real API

- **Frontend only**: Uses built-in mock data (perfect for demo)
- **With backend**: Uses real PostgreSQL database and LLM API
- **Automatic fallback**: If Groq API fails, uses mock data

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Upload.tsx      # File upload with drag-and-drop
│   ├── AnalysisProgress.tsx  # Status tracker
│   ├── Dashboard.tsx   # Insights visualization
│   ├── Card.tsx        # Reusable card component
│   └── ReportButton.tsx # Report download
├── hooks/
│   └── useAnalysis.ts  # Analysis state management
├── lib/
│   ├── api.ts          # API client
│   └── types.ts        # TypeScript types
├── styles/
│   └── globals.css     # Tailwind + custom styles
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🎯 Usage

1. **Upload Transcript**
   - Drag and drop a text file, PDF, or Word document
   - Or click to browse files
   - Supports files up to 10MB

2. **Wait for Analysis**
   - AI analyzes the transcript in real-time
   - Shows progress indicator during processing
   - Typically completes in 3-10 seconds

3. **Review Insights**
   - Explore pain points with impact levels
   - View identified user segments
   - Discover key themes and connections
   - See prioritized product recommendations

4. **Download Report**
   - Click "Download Report" to get HTML report
   - Includes all insights with formatting
   - Ready for sharing with stakeholders

## 🤖 AI Analysis Details

The platform uses a single intelligent LLM call to extract:

- **Pain Points** - User frustrations and problems (with frequency and impact)
- **User Segments** - Distinct user personas and characteristics
- **Themes** - Recurring topics and their relationships
- **Recommendations** - Prioritized product improvements with effort/impact scores

This batched approach is more efficient and provides better context than multiple separate calls.

## 🎨 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Lucide React icons
- **State Management**: React hooks (useAnalysis)
- **HTTP Client**: Axios
- **Build Tool**: Vite (⚡ Fast!)

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Connect GitHub repo to Vercel
# Auto-deploys on push
```

### Backend (Optional)

```bash
# Deploy FastAPI to Render, Fly.io, or Railway
# Update VITE_API_URL in production environment
```

## 📊 Mock Data

The demo includes realistic mock data for:
- Interview insights from SaaS product
- 5 pain points with different impact levels
- 3 distinct user segments
- 4 key themes with relationships
- 6 prioritized recommendations

Perfect for showcasing the UI and flow without API dependencies.

## 🔧 Customization

### Change Mock Data

Edit the `mockInsights` object in `src/App.tsx` to test with different scenarios.

### Styling

- Tailwind configuration: `tailwind.config.js`
- Custom CSS: `src/styles/globals.css`
- Component styles: Inline with Tailwind classes

### API Integration

Update `src/lib/api.ts` to point to your backend:

```typescript
const API_BASE_URL = 'https://your-api-domain.com/api'
```

## 📝 API Endpoints (When Backend Available)

```
POST   /api/upload              # Upload transcript
GET    /api/analysis/{id}       # Check analysis status
GET    /api/insights/{id}       # Get extracted insights
GET    /api/report/{id}         # Get report data
```

## 🐛 Troubleshooting

**Port 3000 already in use**
```bash
# Use different port
npm run dev -- --port 3001
```

**Module not found errors**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Types not working**
```bash
# Rebuild TypeScript
npm run build
```

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🎓 Learning Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

Created for AI Agent Hackathon 🚀

## 🤝 Contributing

This is a hackathon project. Feel free to fork, modify, and expand!

## 📞 Support

Found an issue? Create a GitHub issue or submit a pull request.

---

**Built with ❤️ for the hackathon. Ship fast, learn faster.** ⚡
