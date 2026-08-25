# ✦ UnseenGo AI

> **Discover the places nobody told you about.**

UnseenGo AI is a tourism and cultural-discovery platform that helps travelers find lesser-known heritage, nature, food, culture, adventure and local experiences across India.

## What it does

```text
City + interests + duration + budget + pace
                    ↓
          Destination recommendations
                    ↓
             UnseenGo Score
                    ↓
           Personalized places
                    ↓
          Route optimization
                    ↓
          Practical itinerary
```

The product focuses on turning destination discovery into a useful journey rather than providing a generic list of attractions.

## Core features

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

## Recommendation model

The current browser recommendation engine uses a transparent deterministic score:

- 45% base discovery signal
- 35% interest match
- 10% travel-pace fit
- 10% budget fit

The score is a product ranking signal, not a claim about real-world popularity.

## Route optimization

Selected destinations can be sent to the secure route service. The route engine uses real road-network travel times and distances, then calculates an optimized visit order. When a traffic-aware provider is configured it can use traffic-aware durations; otherwise the service falls back to road-network routing.

## Data architecture

```text
Browser
   ↓
UnseenGo engine
   ↓
Destination data
   ↓
Supabase
 ├── cities
 ├── places
 ├── accommodations
 ├── profiles
 ├── reviews
 └── saved_places
```

Private server credentials must never be committed to the repository. Browser-accessible Supabase keys must be protected by Row Level Security.

## Main project areas

- `index.html` — homepage
- `discover.html` — India and city discovery
- `planner.html` — personalized trip planning
- `app.js` — destination data
- `unseen-engine.js` — recommendation and itinerary logic
- `live-route.js` — route-service integration
- `city-page.js` — destination experience
- `transport*.js` — transport experience
- `accommodation.js` — stay experience
- `auth*.js` — authentication
- `supabase/` — database schema and seed data

## Product direction

The next improvements are focused on verified destination data, better geographic signals, opening hours, real-time transport information, budget estimation and deeper personalization.

## Status

**Active development.**

Project: **UnseenGo AI**  
Repository: `lsvsaravananganesh-bit/Unseen-Go-AI`  
Default branch: `main`

> **Don't just visit the famous places. Go unseen.**

## © 2026 UnseenGo AI
