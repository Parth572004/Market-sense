# Market Sense

AI-powered market intelligence dashboard that turns market-moving news into geo-mapped personal finance context.

The original repository contained static Stitch/Tailwind HTML prototypes. This build keeps those files as design references and adds a production-oriented React frontend plus an Express backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Zustand, Axios, Leaflet
- Backend: Node.js, Express, Zod, Axios, Gemini via `@google/genai`
- Data safety: live news providers with local fallback data and in-memory TTL cache
- Hackathon safety: Demo Mode with curated high-impact events
- Tests: Node test runner and Supertest for backend routes

## Run Locally

Install backend dependencies:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Install frontend dependencies in a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open:

```text
http://localhost:5173
```

Backend defaults to:

```text
http://localhost:8080
```

## Environment Variables

Backend keys are optional for local fallback mode, but required for live news and AI output:

```bash
NEWS_PROVIDER=auto
NEWS_API_KEY=
GNEWS_API_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
```

Frontend:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## API Routes

- `GET /api/health`
- `GET /api/config`
- `GET /api/news`
- `POST /api/analyze`
- `GET /api/geo-insights`
- `GET /api/debug`
- `GET /api/quick-scan`
- `POST /api/quick-scan`

Aliases without `/api` are also registered, for example `/news` and `/quick-scan`.

## Test Backend

```bash
cd backend
npm test
```

## Build Frontend

```bash
cd frontend
npm run build
```

## Strict Event Contract

Every event returned by scan/analyze routes includes:

```json
{
  "what_happened": "...",
  "why_it_matters": "...",
  "market_impact": ["..."],
  "personal_finance_impact": ["..."],
  "suggested_action": "...",
  "possible_outcomes": ["..."]
}
```

## Demo Flow

1. Open `http://localhost:5173`.
2. Run **Quick Scan** for live NewsAPI + Gemini output.
3. Click a map marker and show the detail panel.
4. Highlight personal finance impact and suggested action.
5. Toggle **Explain Like I'm 15** for simpler output.
6. Toggle **Demo Mode** for curated high-impact events.
7. Open the debug panel to show source, classification score, AI status, and processing time.

## Notes

- If no external keys are configured, the backend uses `backend/src/data/fallbackNews.json`.
- Gemini failures do not break the UI; the backend retries a fallback Gemini model and then uses deterministic rule-engine output.
- The original static screens remain in `stitch_market_sense_intelligence_system/`.
