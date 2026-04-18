# Market Sense Project State

## 1. Project Overview

Market Sense is now a demo-ready financial intelligence system. It does not just plot news on a map; it explains how market-moving events may affect ordinary people through fuel costs, groceries, EMIs, travel, imports, savings, and portfolio volatility.

The original repository contained static Stitch/Tailwind HTML prototypes. Those references remain untouched in `stitch_market_sense_intelligence_system/`. The working product now lives in:

- `frontend/`: React + Vite intelligence dashboard with a permanent light-mode UI
- `backend/`: Express API, live news ingestion, Gemini analysis, rule-based impact engine

The dashboard now uses a cleaner permanent light theme, larger typography, an expanded insights panel, and a dedicated **Startup Insights** workflow that layers prediction output on top of the existing classifier and impact engine.

Current maturity level: **Demo Ready MVP**.

## 2. Tech Stack

Frontend:

- React 18
- Vite
- Tailwind CSS
- Zustand
- Axios
- Leaflet / React Leaflet
- date-fns
- lucide-react

Backend:

- Node.js ES modules
- Express
- cors
- dotenv
- zod
- Axios
- `@google/genai`
- Node test runner
- Supertest

External services:

- NewsAPI.org as the primary configured live news source
- GNews support remains available as a secondary provider
- Gemini as the AI enhancement layer
- Local fallback and curated demo datasets for hackathon reliability

## 3. Folder Structure

```text
/
  frontend/
    src/
      App.jsx
      main.jsx
      index.css
      components/
        DebugPanel.jsx
        DetailPanel.jsx
        ErrorBanner.jsx
        EventCard.jsx
        LoadingOverlay.jsx
        MarketMap.jsx
        NewsRail.jsx
        QuickScanModal.jsx
        RegionStrip.jsx
        SideNav.jsx
        TopBar.jsx
      services/
        api.js
      store/
        useMarketStore.js
      utils/
        categoryColors.js
        debounce.js
        formatDate.js
        mapConfig.js
  backend/
    .env
    .env.example
    package.json
    server.js
    services/
      impactEngine.js
    src/
      app.js
      config/
        env.js
      controllers/
        analysisController.js
        debugController.js
        geoController.js
        newsController.js
        quickScanController.js
        startupInsightsController.js
      data/
        demoEvents.json
        fallbackNews.json
        regionMap.json
        startupFallbackNews.json
      routes/
        analyze.routes.js
        config.routes.js
        debug.routes.js
        geoInsights.routes.js
        health.routes.js
        news.routes.js
        quickScan.routes.js
        startupInsights.routes.js
      services/
        aiService.js
        cacheService.js
        debugService.js
        fallbackService.js
        impactEngine.js
        newsService.js
        scanService.js
      tests/
        classifier.test.js
        coordinateMapper.test.js
        impactEngine.test.js
        normalizeArticle.test.js
        routes.test.js
      utils/
        actionGenerator.js
        classifier.js
        coordinateMapper.js
        insightFallback.js
        locationMap.js
        normalizeArticle.js
      validators/
        schemas.js
  README.md
  PROJECT_STATE.md
```

## 4. Architecture Diagram

```text
User
  |
  v
React Dashboard
  |-- Quick Scan modal
  |-- Startup Insights trigger
  |-- Debug panel
  |-- Leaflet map + animated markers
  |-- Expanded right-side insight panel
  |
  v
Express API
  |
  +--> /api/quick-scan
  |      |
  |      +--> News source resolver
  |      |      |-- NewsAPI live
  |      |      |-- GNews optional
  |      |      |-- demoEvents.json
  |      |      |-- fallbackNews.json
  |      |
  |      +--> Normalizer
  |      +--> Score-based classifier
  |      +--> locationMap coordinate mapper
  |      +--> Financial Impact Engine
  |      +--> Gemini enhancement with fallback model retry
  |      +--> TTL cache
  |      +--> Debug log
  |
  +--> /api/startup-insights
  |      |
  |      +--> Startup-focused news query
  |      +--> Startup fallback dataset
  |      +--> Normalizer
  |      +--> Existing score-based classifier
  |      +--> Financial Impact Engine
  |      +--> Gemini startup prediction with rule fallback
  |      +--> TTL cache
  |
  +--> /api/analyze
  +--> /api/news
  +--> /api/geo-insights
  +--> /api/debug
```

## 5. Data Flow Explanation

1. The dashboard boots into a default intelligence scan through `POST /api/quick-scan`.
2. The `Startup Insights` button triggers `GET /api/startup-insights`.
3. The backend uses live NewsAPI unless fallback mode or a provider failure applies.
4. Raw articles are normalized into event objects.
5. The classifier scores keywords into one of five categories:
   - `geopolitics`
   - `indian_politics`
   - `global_markets`
   - `energy`
   - `inflation`
6. Startup queries reuse the same classifier and impact engine, with extra startup keywords to keep funding, IPO, unicorn, and acquisition stories relevant.
7. The location mapper always assigns coordinates, falling back to `Global`.
8. The Financial Impact Engine generates the mandatory money-impact structure first.
9. Gemini enhances the rule output second. If the primary Gemini model is busy, the backend retries a fallback Gemini model. If Gemini still fails, rule-engine output is returned.
10. Startup Insights adds a `prediction` object with short-term, long-term, and confidence fields, using Gemini first and a rule-based fallback second.
11. The frontend renders animated map markers, the news rail, and the expanded detail panel.
12. `/api/debug` exposes source, classification, AI path, and processing latency.

## 6. API Design

### Strict Event Output

Every event returned by `/api/news`, `/api/analyze`, and `/api/quick-scan` includes:

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

### `GET /api/health`

Returns API health and uptime.

### `GET /api/config`

Returns categories, regions, defaults, and safe integration status.

### `GET /api/news`

Returns normalized events from the selected provider.

### `POST /api/analyze`

Enhances one event or multiple events with strict financial impact output.

### `GET /api/geo-insights`

Returns region-level aggregation for map panels.

### `POST /api/quick-scan`

Request body:

```json
{
  "scope": "Global Macro",
  "focus": "fuel prices",
  "region": "Global",
  "category": "all",
  "provider": "auto",
  "demoMode": false,
  "explainMode": "normal",
  "limit": 10
}
```

### `GET /api/debug`

Returns:

- API source used
- fallback status
- demo mode status
- processing time
- classification score
- matched keywords
- AI provider/model/status

### `GET /api/startup-insights`

Returns startup-focused events using startup, funding, venture capital, IPO, unicorn, and acquisition keywords. Each event preserves the standard money-impact contract and adds:

```json
{
  "prediction": {
    "short_term": "...",
    "long_term": "...",
    "confidence": "low"
  }
}
```

## 7. Features Implemented

- Live NewsAPI integration configured and validated.
- Gemini integration configured and validated.
- Gemini fallback-model retry for temporary demand spikes.
- Strict snake_case event output contract.
- Financial Impact Engine in `backend/src/services/impactEngine.js`.
- Compatibility re-export at `backend/services/impactEngine.js`.
- Score-based classifier with five required categories.
- Priority scoring: `high`, `medium`, `low`.
- Guaranteed coordinates through `backend/src/utils/locationMap.js`.
- Hybrid data system:
  - live API primary
  - fallback JSON backup
  - curated demo dataset
- UI refinement summary:
  - permanent light mode
  - larger typography and button padding
  - wider right-side detail panel
  - removal of frontend Explain Like I'm 15, Demo Mode, and region-filter controls
- Permanent light-mode dashboard theme.
- Larger global typography and roomier button spacing.
- Expanded right-side detail panel with clearer section separation.
- Startup Insights feature summary:
  - dedicated header trigger
  - startup-focused news retrieval
  - Gemini prediction with rule fallback
  - prediction rendering in the detail panel
- `Startup Insights` button and `/api/startup-insights` flow.
- Startup prediction output with Gemini-first and rule-based fallback logic.
- Startup-specific fallback dataset for offline/demo resilience.
- Debug API and frontend Debug Panel.
- Smooth map fly-to on event selection.
- Pulsing markers with appear animation.
- Selected event highlight.
- Loading scan animation.
- TTL caching.
- Demo Mode backend support retained for API compatibility.
- Explain Like I'm 15 backend support retained for API compatibility.
- Backend tests for classifier, impact engine, normalizer, and API routes.

## 8. Features Pending

- Firestore or Postgres persistence for scan history.
- Cloud Run deployment config.
- Saved user watchlists.
- Full Playwright end-to-end browser tests.
- More granular country extraction beyond keyword location mapping.
- More robust finance taxonomy for asset-specific impacts.
- Optional GNews live validation with a real `GNEWS_API_KEY`.

## 9. Known Issues

- NewsAPI quota and rate limits can still force fallback behavior.
- Gemini can occasionally return temporary demand errors; fallback model retry and rule-engine output handle this.
- In-memory cache resets when the backend restarts.
- Map tiles depend on external CARTO/OpenStreetMap availability.
- Location detection is keyword-based and country-level, not full geocoding.

## 10. Setup Instructions

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

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

Backend:

```text
http://localhost:8080
```

Run backend tests:

```bash
cd backend
npm test
```

Build frontend:

```bash
cd frontend
npm run build
```

## 11. Environment Variables Required

Backend:

```bash
NODE_ENV=development
PORT=8080
FRONTEND_ORIGIN=http://localhost:5173
BACKEND_BASE_URL=http://localhost:8080
NEWS_PROVIDER=auto
NEWS_API_KEY=
NEWS_API_BASE_URL=https://newsapi.org/v2
GNEWS_API_KEY=
GNEWS_BASE_URL=https://gnews.io/api/v4
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
CACHE_TTL_MS=600000
REQUEST_TIMEOUT_MS=12000
MAX_ARTICLES=10
```

Frontend:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

Local `backend/.env` is configured with provided live keys. Do not commit it.

## 12. Current Maturity Level

Status: **Demo Ready MVP**

Evidence:

- Backend tests: 17 passing.
- Frontend production build passes.
- Live `/api/quick-scan` validated with NewsAPI and Gemini.
- `/api/startup-insights` validated with fallback prediction output.
- Debug endpoint validated.
- Fallback mode remains operational.

## 13. Feature Completeness Checklist

- [x] Live news ingestion
- [x] Gemini AI enhancement
- [x] Rule-first financial impact engine
- [x] Strict money-impact event contract
- [x] Personal finance impact shown prominently
- [x] Suggested action shown as a first-class section
- [x] Interactive map
- [x] Region navigation
- [x] Quick Scan modal
- [x] Permanent light-mode dashboard
- [x] Expanded detail panel
- [x] Startup Insights with prediction output
- [x] Demo mode backend support retained
- [x] Explain-like-15 backend support retained
- [x] Debug panel
- [x] Fallback data path
- [x] TTL caching
- [x] Backend tests
- [ ] Persistent storage
- [ ] Cloud deployment
- [ ] E2E browser automation

## 14. Demo Script

1. Open `http://localhost:5173`.
2. Say: "Market Sense turns live global news into personal money impact."
3. Click **Quick Scan** and run a live scan.
4. Click a marker on the map and show the fly-to animation.
5. Open the detail panel and walk through:
   - What happened
   - Why it matters
   - Market impact
   - Personal finance impact
   - Suggested action
   - Possible outcomes
6. Click **Startup Insights** and show the startup-focused feed with:
   - startup news coverage
   - prediction section
   - confidence level
7. Open the **Debug Panel** and show:
   - source used
   - classification category
   - score
   - Gemini/rule-engine status
   - processing time
8. Closing line: "This is not stock prediction; it is decision-ready financial context for everyday people."

## 15. Known Weak Points

- Location mapping is deterministic and fast, but not a full geocoder.
- Gemini can be slow during live scans; rule fallback protects the demo.
- News relevance depends on provider results and quota.
- No database means history is not durable yet.
- Mobile layout is functional but could use a dedicated bottom drawer polish pass.

## 16. Future Roadmap

1. Add Firestore or Postgres scan history.
2. Add Cloud Run deployment.
3. Add persistent demo snapshots for offline judging.
4. Add asset/persona-specific impact views:
   - student
   - salaried worker
   - small business owner
   - investor
5. Add source credibility scoring.
6. Add full E2E testing with Playwright.
7. Add geocoder fallback for unseen locations.
8. Add watchlists and push alerts.

## 17. Next Steps

1. Keep backend and frontend dev servers running for demo.
2. Use the built-in fallback path if the live provider returns low-impact headlines or quota errors.
3. Run `npm test` in `/backend` before final submission.
4. Run `npm run build` in `/frontend` before packaging.
5. If deploying, configure `NEWS_API_KEY` and `GEMINI_API_KEY` in the hosting environment, not in source control.
