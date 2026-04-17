# 🌍 Market Sense — AI Financial Intelligence System

Market Sense is an AI-powered financial intelligence platform that transforms complex global news into simple, actionable insights.

It scans live headlines, identifies important geopolitical and market-moving events, maps them on a world map, and explains their impact on markets and everyday personal finances in a clear, easy-to-understand way.

---

## 🚀 Features

* 🌍 Geo-mapped global events on an interactive map
* 🧠 AI-powered explanations using Gemini
* 💸 Personal finance impact analysis (core feature)
* ⚡ Quick Scan (real-time + fallback system)
* 🎯 Demo Mode for hackathon presentations
* 🧒 Explain Like I’m 15 mode
* 📊 Debug panel (AI status, classification, processing time)
* 🔁 Hybrid data system (Live API + fallback JSON)

---

## 🛠 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Zustand, Axios, Leaflet
* **Backend:** Node.js, Express, Zod, Axios
* **AI:** Google Gemini (`@google/genai`)
* **Data:** NewsAPI / GNews + fallback dataset
* **Testing:** Node test runner + Supertest

---

## ⚙️ Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend (in a new terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Open App

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:8080
```

---

## 🔑 Environment Variables

### Backend

```env
NEWS_PROVIDER=auto
NEWS_API_KEY=your_key_here
GNEWS_API_KEY=optional
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
PORT=8080
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📡 API Routes

* `GET /api/health`
* `GET /api/config`
* `GET /api/news`
* `POST /api/analyze`
* `GET /api/geo-insights`
* `GET /api/debug`
* `GET /api/quick-scan`
* `POST /api/quick-scan`

---

## 🧠 Core Concept

The system converts raw news into structured financial intelligence:

```
News → Event Type → Geo Location → Market Impact → Personal Finance Impact → Explanation
```

---

## 📊 Event Output Structure

Every event follows this strict format:

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

---

## 🎬 Demo Flow (Hackathon Ready)

1. Open the app
2. Click **Quick Scan**
3. Watch map populate with live events
4. Click a marker → open detail panel
5. Show:

   * What happened
   * Why it matters
   * Market impact
   * Personal finance impact
6. Toggle **Explain Like I’m 15**
7. Enable **Demo Mode** for curated events
8. (Optional) Open Debug Panel to show AI + system transparency

---

## 🧪 Testing

```bash
cd backend
npm test
```

---

## 🏗 Build

```bash
cd frontend
npm run build
```

---

## ⚠️ Notes

* Works without API keys using fallback dataset
* Gemini failures are handled via retry + rule-based fallback
* Designed for **demo reliability + real-world extensibility**
* Original Stitch UI prototypes are preserved in:

```
stitch_market_sense_intelligence_system/
```

---

## 🏆 Project Goal

> “We don’t just show news — we show what the news means for your money.”

---

## 📌 Status

* ✅ Demo-ready
* ✅ Hackathon-ready
* 🚀 Production deployment pending

---
