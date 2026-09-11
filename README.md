# ✦ UnseenGo AI — Hidden-Gem Tourism Explorer

> **Don't just visit the famous places. Go unseen.**

UnseenGo AI is a static, AI-assisted tourism platform for discovering lesser-known destinations across India and turning traveller preferences into explainable recommendations and practical trip plans.

## What the project solves

Most travel platforms are good at showing popular places. UnseenGo focuses on the places people may miss: local heritage, quiet landscapes, food trails, culture, stories and experiences around a destination.

The system combines a structured India destination dataset with an explainable recommendation engine, optional real-time context, maps handoff and travel-support modules.

## Core experience

### 1. India Discovery Graph
- City and destination discovery across India
- Heritage, temples, forts, nature, food, culture and adventure categories
- Destination stories and local context
- State/city exploration pages
- Verification metadata and source-aware content

### 2. UnseenGo Personalization Engine
The recommendation engine does not pretend that every suggestion comes from a black-box AI model. It calculates an explainable **UnseenGo Score** using signals such as:

- Hiddenness / discovery signal
- Interest match
- Cultural/local value
- Travel ease
- Budget fit
- Pace fit
- Photography fit
- Explicit avoid-preference penalties

Every recommendation can expose **Why this matches** instead of giving an unexplained list.

### 3. Travel Decision Engine
`decision-engine.html` combines the recommendation layer with contextual signals such as browser time, optional location permission and weather when available. It can then suggest a practical next action and hand the selected route to Google Maps.

Live opening hours, traffic, events, transport availability and booking availability are **not treated as authoritative unless a configured production API provides them**.

## Product flow

```text
Traveller preferences
        ↓
India Discovery Graph
        ↓
Structured destination records
        ↓
UnseenGo Personalization Engine
        ↓
Explainable UnseenGo Score
        ↓
Trip duration + budget + pace
        ↓
Itinerary + Google Maps route
        ↓
Optional real-time context
        ↓
Next best travel action
```

## Current architecture

UnseenGo is intentionally a **static HTML/CSS/JavaScript application**. The previous experimental React entrypoint has been removed so GitHub Pages does not depend on a React runtime.

```text
Browser
  │
  ├── HTML pages
  ├── CSS design system
  └── JavaScript modules
       │
       ├── app.js
       │    └── legacy city/destination dataset
       │
       ├── data/destination-registry.js
       │    └── normalized destination records
       │
       ├── core/unseengo-core.js
       │    └── shared data/runtime access
       │
       └── unseen-engine.js
            ├── preference parsing
            ├── scoring
            ├── ranking
            ├── itinerary generation
            └── Google Maps route URL

Optional services
  ├── Supabase data/auth foundation
  ├── Google Places / Photos integrations
  ├── Weather API/server functions
  └── AI/server endpoints
```

## Important project areas

| Area | Purpose |
|---|---|
| `index.html` | Main homepage and first discovery experience |
| `discover.html` | Destination discovery and filtering |
| `india-cities.html` | India city directory |
| `decision-engine.html` | Explainable travel decision experience |
| `planner.html` | Trip planning and itinerary UI |
| `app.js` | Existing city/place dataset and compatibility layer |
| `unseen-engine.js` | Recommendation, scoring and itinerary engine |
| `data/destination-registry.js` | Normalized destination registry |
| `core/unseengo-core.js` | Shared canonical runtime |
| `api/` | Server/API handlers for AI, places, stays, transport and weather |
| `supabase/` | Database schema, migrations and functions |
| `live-*.js` | Optional live travel integrations |
| `.github/workflows/pages.yml` | GitHub Pages static deployment |
| `tests/` | Runtime smoke tests |

## AI approach

The current browser recommendation layer is deliberately explainable and deterministic. Natural-language preferences such as:

> “I have 2 days. I like history, photography and quiet places. Budget ₹6,000.”

are converted into structured preferences such as interests, duration, pace, budget and avoid conditions. The engine then ranks destinations and generates an itinerary.

For production AI, Gemini or another server-side model can be added behind the existing API layer without exposing private API keys in browser JavaScript.

## Real places, maps, ratings and photos

The project contains integration points for real-world services, including Google Places/Photos and Maps. The production rule is:

**Do not fabricate a rating, opening hour, event, route condition or place status.**

Live information should be labelled according to its source and only displayed as verified/live when an authoritative configured service supplies it.

## Responsive design

The interface includes responsive CSS for desktop, tablet and mobile layouts. The homepage and discovery cards are designed to collapse into smaller layouts rather than requiring a desktop-only experience.

## GitHub Pages deployment

The repository deploys as a static site through GitHub Actions. The deployment workflow explicitly prepares the normalized UnseenGo runtime before publishing the Pages artifact.

No React build is required for the GitHub Pages site.

## Local development

Requirements:

- Node.js 18+
- npm

Run:

```bash
npm install
npm run dev
```

For a production-style check:

```bash
npm run build
```

The application itself remains a multi-page static site; Vite is used only as a development/build helper and does not turn the homepage into a React application.

## HMEL QUEST / submission positioning

### Suggested project title

**AI-Powered Hidden-Gem & Sustainable Tourism Explorer**

### Short project description

UnseenGo AI is an intelligent tourism platform designed to help travellers discover lesser-known Indian destinations while considering personal interests, trip duration, budget, travel pace and sustainability-aware discovery signals. Instead of repeatedly showing only popular tourist attractions, the platform organizes hidden destinations, stories and local experiences into a structured discovery graph and produces transparent recommendations with an explainable UnseenGo Score. The platform also supports itinerary generation, Google Maps route handoff, destination stories and optional real-time context such as weather.

### Demonstrable prototype flow

1. Open the homepage.
2. Select **AI Discover**.
3. Enter a natural-language travel requirement.
4. Review ranked hidden-gem recommendations.
5. Inspect the score explanation.
6. Generate the itinerary.
7. Open the route in Google Maps.
8. Explore the destination/story pages for additional context.

## Production roadmap

### Priority 1 — Reliability
- Browser smoke tests for the main user journey
- Consistent asset paths for GitHub Pages and Vercel
- Better loading/error/empty states
- Remove unused legacy modules progressively

### Priority 2 — Verified place intelligence
- Google Places / Maps integration
- Verified ratings and opening hours
- Real place photos with attribution/source metadata
- Temporary closure/status handling

### Priority 3 — Secure AI
- Server-side Gemini integration
- Structured itinerary JSON
- AI-generated explanations grounded in verified destination records
- No private API keys in frontend code

### Priority 4 — Sustainable tourism intelligence
- Crowd-aware recommendations
- Local economic opportunity signals
- Lower-impact route alternatives
- Community/source verification workflow

## Data and trust principle

UnseenGo is intended to help people make travel decisions, so trust matters more than making the interface look “AI-generated”. A recommendation score is a ranking signal, not a factual claim about popularity. Real-world facts should be backed by an appropriate source and labelled clearly.

## Status

**Active development — static MVP with explainable personalization, destination discovery, itinerary generation and travel-decision foundations.**

Repository: `lsvsaravananganesh-bit/Unseen-Go-AI`

© 2026 UnseenGo AI
