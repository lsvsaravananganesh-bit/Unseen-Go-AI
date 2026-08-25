export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { message, city, preferences = {}, places = [], model: requestedModel } = req.body || {};
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'message is required' });

    const ollamaKey = process.env.OLLAMA_API_KEY;
    if (!ollamaKey) return res.status(503).json({ error: 'Ollama Cloud is not configured on Vercel.' });

    const allowedModels = ['gemma4:31b-cloud', 'gemma4:26b-cloud', 'gemma4:12b-cloud', 'gemma4:cloud'];
    const envModel = process.env.OLLAMA_MODEL || 'gemma4:31b-cloud';
    const model = allowedModels.includes(requestedModel) ? requestedModel : (allowedModels.includes(envModel) ? envModel : 'gemma4:31b-cloud');

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    let verifiedPlaces = Array.isArray(places) ? places.slice(0, 12) : [];
    if (supabaseUrl && supabaseKey && city) {
      const url = `${supabaseUrl}/rest/v1/places?select=name,city,category,description,latitude,longitude,opening_time,closing_time,visit_duration_minutes,verification_status,verified_at,crowd_level,budget_level,pace_level,source_url&city=ilike.${encodeURIComponent(city)}&limit=30`;
      const r = await fetch(url, { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } });
      if (r.ok) {
        const rows = await r.json();
        if (Array.isArray(rows) && rows.length) verifiedPlaces = rows;
      }
    }

    const system = `You are UnseenGo AI, an Indian hidden-gem tourism assistant. Use only destination facts supplied in CONTEXT. Never invent coordinates, opening hours, prices, verification status, crowd levels, travel times, or local businesses. If a fact is missing, say it is not verified. Respect explicit preferences and avoid constraints. Distinguish UnseenGo Score from real crowd/popularity measurements. Give practical, concise answers and explain why recommendations match the user's intent.`;
    const context = JSON.stringify({ city, preferences, places: verifiedPlaces }, null, 2);
    const response = await fetch('https://ollama.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ollamaKey}` },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: `CONTEXT:\n${context}\n\nUSER:\n${message}` }], stream: false, options: { temperature: 0.7 } })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status).json({ error: data.error || 'Ollama Cloud request failed.' });
    return res.status(200).json({ reply: data.message?.content || 'I could not generate a response.', provider: 'ollama-cloud', model });
  } catch (error) {
    console.error('UnseenGo /api/chat:', error);
    return res.status(500).json({ error: 'AI service temporarily unavailable.' });
  }
}
