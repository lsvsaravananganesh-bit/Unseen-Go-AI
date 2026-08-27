# UnseenGo production API configuration

The static GitHub Pages frontend must not contain private provider keys.

Configure these environment variables in the server deployment (Vercel/Supabase Edge Function):

- `GOOGLE_MAPS_API_KEY` — Google Places/Maps server key, restricted by API and server origin/IP where applicable.
- `GEMINI_API_KEY` — Gemini API key for server-side AI generation.
- `SUPABASE_URL` — project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only Supabase key; never expose it to browser code.
- `WEATHER_BASE_URL` — optional; defaults to Open-Meteo forecast endpoint.

The frontend should call the server endpoints rather than calling Google or Gemini with secret keys directly.
