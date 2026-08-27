# ✦ UnseenGo AI

> **Discover the places nobody told you about — then decide what to do next.**

UnseenGo AI is India's AI hidden-gem tourism explorer. It is designed around three connected product pillars rather than being another generic travel search or chatbot.

## Three product pillars

### 1. 🇮🇳 India Discovery Graph
A structured discovery layer connecting cities with lesser-known places, stories, heritage, nature, food, culture and experiences. Existing city/place records are consumed through `app.js` and normalized by `unseen-engine.js`.

### 2. 🧠 UnseenGo Personalization Engine
The recommendation engine ranks places with transparent components instead of returning unexplained AI suggestions:

- Hiddenness / discovery signal
- Interest match
- Cultural/local value
- Travel ease
- Budget fit
- Pace fit
- Photography fit
- Explicit avoid-preference penalties

Each result exposes an **UnseenGo Score** and a **Why this matches** explanation.

### 3. ⚡ Real-Time Travel Decision Engine
The new `decision-engine.html` experience adds a context layer over recommendations. It reads the current browser time and, when the traveler permits location, retrieves live weather from Open-Meteo. The decision layer then adjusts the suggested action for conditions such as rain, time of day, category, budget and trip duration.

> Production integrations for verified opening hours, traffic, live events, transit and place availability should be connected through server-side APIs before presenting those signals as authoritative.

## Try the three-pillar experience

Open `decision-engine.html` from the deployed GitHub Pages site. It provides:

1. India Discovery Graph overview
2. City + interest + duration + budget controls
3. Explainable ranked hidden gems
4. Live time / optional location / weather context
5. A concrete **What should I do now?** decision
6. Google Maps route handoff

## Product flow

```text
India Discovery Graph
        ↓
Structured place + story signals
        ↓
UnseenGo Personalization Engine
        ↓
Explainable UnseenGo Score
        ↓
Real-Time Travel Decision Engine
        ↓
Time + location + weather + budget + preferences
        ↓
        NEXT BEST ACTION
```

## Existing platform

- Multi-city destination discovery
- State → city exploration across India
- Heritage, nature, food, culture and adventure categories
- Personalized destination ranking
- UnseenGo Score
- Trip-duration and budget preferences
- Travel-pace preferences
- Itinerary generation
- Road-route optimization
- Transport information
- Accommodation discovery
- Place stories and cultural context
- Supabase authentication and data foundation
- Responsive mobile and desktop interface

## Architecture

```text
Browser
   ↓
UnseenGo Engine
   ↓
India Discovery Graph
 ├── Cities
 ├── Places
 ├── Categories
 ├── Stories / context
 └── Verification metadata
   ↓
Personalization
 ├── Interest
 ├── Budget
 ├── Pace
 ├── Hiddenness
 └── Explicit avoids
   ↓
Real-Time Context
 ├── Browser time
 ├── Optional geolocation
 ├── Live weather
 ├── Opening hours → production API
 ├── Traffic → production API
 └── Events → verified event feed
   ↓
Next Best Action
```

## Important data principle

UnseenGo should not fabricate real-world facts. Scores are ranking signals, not claims about popularity. Opening hours, traffic, events, transport availability and live place status should be labeled as live/verified only when they come from an authoritative or configured API.

## Main project areas

- `index.html` — homepage
- `decision-engine.html` — three-pillar Travel Decision Engine experience
- `discover.html` — India and city discovery
- `planner.html` — personalized trip planning
- `app.js` — destination data
- `unseen-engine.js` — explainable recommendation and itinerary logic
- `live-route.js` — route-service integration
- `city-page.js` — destination experience
- `transport*.js` — transport experience
- `accommodation.js` — stay experience
- `auth*.js` — authentication
- `supabase/` — database schema and seed data

## Next production upgrades

To make the third pillar genuinely production-grade, connect:

1. Verified Google Places / Maps or equivalent place data
2. Traffic-aware routing
3. Verified opening hours and temporary closures
4. Weather forecast + severe-weather alerts
5. Government/official event calendars
6. Public transport / railway / flight availability where licensed APIs permit
7. Real-time budget and booking availability
8. Supabase-backed user preference profiles and feedback loops

## Status

**Active development — three-pillar Travel Decision Engine added.**

Project: **UnseenGo AI**  
Repository: `lsvsaravananganesh-bit/Unseen-Go-AI`

> **Don't just visit the famous places. Go unseen.**

## © 2026 UnseenGo AI
