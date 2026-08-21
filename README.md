# ✦ UnseenGo AI

> **Discover the places nobody told you about.**

UnseenGo AI is a tourism and cultural-discovery platform designed to help travelers find **lesser-known heritage, nature, food, culture, adventure and local experiences** instead of seeing only the most popular attractions.

The project starts with a Rayalaseema-focused pilot and is structured to expand city-by-city across India.

## 🎯 Problem

Mainstream travel discovery often rewards popularity. That makes famous attractions easier to find while smaller cultural assets, local experiences and nearby destinations receive less visibility.

UnseenGo aims to turn discovery into a complete journey:

**Place → verified story → visitor interest → practical access → local opportunity**

## 💡 How UnseenGo works

```text
Traveler
   ↓
City + interests + duration + budget + pace
   ↓
City destination records
   ↓
UnseenGo scoring engine
   ├── base discovery signal
   ├── preference match
   ├── pace fit
   └── budget fit
   ↓
Ranked hidden-gem recommendations
   ↓
Day-by-day itinerary
   ↓
Google Maps route
```

The current planner is intentionally transparent and deterministic. A secure server-side LLM can later add natural-language explanations, conversational planning and richer personalization without exposing API secrets in the browser.

## ✨ Current MVP

- 🌍 Multi-city destination dataset
- 🏛 Heritage discovery
- 🌿 Nature discovery
- 🍛 Local food discovery
- 🎭 Culture and craft discovery
- 🥾 Adventure discovery
- ⭐ Dynamic UnseenGo Score
- 🧭 Personalized ranking from interests
- 🕐 Trip-duration-aware itinerary generation
- 💰 Budget preference
- 🚶 Travel pace preference
- 🗺️ Google Maps route generation
- 🔐 Supabase authentication foundation
- 💾 Supabase schema for places, profiles, reviews and saved places
- 📱 Responsive premium UI
- 🇮🇳 State → city discovery structure

## 🧠 UnseenGo Score

The browser MVP uses a deterministic score so the recommendation logic can be inspected and tested without an API key:

- **45%** base discovery signal from the destination dataset
- **35%** user-interest fit
- **10%** travel-pace fit
- **10%** budget fit

This is a prototype scoring model, not a claim that the score represents real tourist popularity. Future versions can add verified popularity, crowd, distance, opening-hours, review and geographic signals.

## 🔐 Security model

The public repository may contain a **Supabase publishable key** because that key is intended for browser use. The database must remain protected by Row Level Security (RLS).

**Never commit:**

- Supabase service-role keys
- Gemini private API keys
- Google server API keys
- database passwords
- other server-side credentials

For future AI integration, use:

```text
Browser
   ↓
Supabase Edge Function / secure backend
   ↓
Gemini / Google APIs
```

not direct browser calls containing private credentials.

## 🏗️ Data architecture

The repository currently contains both a static city dataset for the GitHub Pages MVP and a Supabase schema for the next data-backed stage.

```text
Static MVP data
      │
      └── UnseenGo engine

Supabase
 ├── cities
 ├── places
 ├── accommodations
 ├── profiles
 ├── reviews
 └── saved_places
```

The Supabase schema enables RLS and limits browser writes to authenticated user-owned records. Tourism data is publicly readable only when marked active. See `supabase/schema.sql`.

## 📁 Important project files

```text
index.html                 # Premium homepage
app.js                     # City destination dataset
unseen-engine.js           # Scoring, ranking, itinerary and Maps route engine
planner.html               # Planner UI
planner-ui.js              # Planner validation and rendering
city-picker.js             # City search and selection
city-page.js               # Destination page behaviour
transport*.js              # Transport experience
accommodation.js           # Stay experience
auth*.js                   # Authentication flow
supabase/                  # Database schema and seed data
cultural-economy.js        # Cultural-economy product layer
README.md                  # Documentation
```

## 🚀 Roadmap

### Phase 1 — Functional MVP
- [x] Premium responsive interface
- [x] Multi-city destination records
- [x] Dynamic scoring
- [x] Preference-aware recommendations
- [x] Duration-aware itinerary
- [x] Google Maps route

### Phase 2 — Verified discovery
- [x] Supabase schema
- [x] City/place records
- [x] RLS foundation
- [ ] Complete source metadata for every destination
- [ ] Opening hours and live availability signals
- [ ] Better geographic distance calculations

### Phase 3 — AI intelligence
- [ ] Secure Gemini server-side integration
- [ ] Natural-language preference understanding
- [ ] AI destination explanations grounded in verified records
- [ ] Conversational trip planning
- [ ] Preference learning with user consent

### Phase 4 — Travel intelligence
- [ ] Weather-aware recommendations
- [ ] Real-time transport information
- [ ] Route-time optimization
- [ ] Budget estimation
- [ ] Local guide and experience discovery

### Phase 5 — Platform
- [x] Authentication foundation
- [x] Reviews schema
- [x] Saved places schema
- [ ] Saved trips
- [ ] Admin destination management
- [ ] Moderation workflow
- [ ] Analytics

## 🧪 Pre-merge checklist

Before merging major feature changes:

- [ ] Test at least three cities
- [ ] Test 1, 2, 3, 5 and 7-day plans
- [ ] Test every interest category
- [ ] Test empty/unknown destination states
- [ ] Test mobile layouts
- [ ] Confirm no private secrets are committed
- [ ] Confirm Supabase RLS policies are enabled
- [ ] Confirm external links use safe `noopener` behaviour

## 📌 Status

**Active development — functional MVP / Phase 2 foundation.**

The current repository is considerably beyond the original static landing-page prototype: it contains a multi-city dataset, a deterministic recommendation engine, itinerary generation, authentication foundation, destination pages, transport/stay modules and a Supabase data model. The next major product milestone is a **secure AI recommendation layer backed by verified destination data**.

## 👨‍💻 Repository

Project: **UnseenGo AI**  
Repository: `lsvsaravananganesh-bit/Unseen-Go-AI`  
Default branch: `main`

> **Don't just visit the famous places. Go unseen.**

## © 2026 UnseenGo AI
