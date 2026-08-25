export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, city, preferences = {}, places = [], model: requestedModel } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    // OpenAI API key must exist only in Vercel Environment Variables.
    // Never expose it in browser JavaScript or commit it to GitHub.
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return res.status(503).json({ error: 'OpenAI is not configured on Vercel.' });
    }

    const allowedModels = ['gpt-5.6', 'gpt-5.6-luna', 'gpt-5.6-terra', 'gpt-5.5'];
    const envModel = process.env.OPENAI_MODEL || 'gpt-5.6-luna';
    const model = allowedModels.includes(requestedModel)
      ? requestedModel
      : (allowedModels.includes(envModel) ? envModel : 'gpt-5.6-luna');

    // Prefer verified Supabase destination data when available.
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    let verifiedPlaces = Array.isArray(places) ? places.slice(0, 12) : [];

    if (supabaseUrl && supabaseKey && city) {
      const url = `${supabaseUrl}/rest/v1/places?select=name,city,category,description,latitude,longitude,opening_time,closing_time,visit_duration_minutes,verification_status,verified_at,crowd_level,budget_level,pace_level,source_url&city=ilike.${encodeURIComponent(city)}&limit=30`;
      const r = await fetch(url, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      });
      if (r.ok) {
        const rows = await r.json();
        if (Array.isArray(rows) && rows.length) verifiedPlaces = rows;
      }
    }

    const system = `You are UnseenGo AI, an Indian hidden-gem tourism assistant.
Use only destination facts supplied in CONTEXT. Never invent coordinates, opening hours, prices, verification status, crowd levels, travel times, or local businesses. If a fact is missing, clearly say it is not verified.
Respect explicit interests and avoid constraints. If the user explicitly selects one category, prioritize that category rather than forcing unrelated categories.
Treat Photography as its own preference when relevant. Distinguish Travel ease from physical accessibility. Distinguish UnseenGo Score from real crowd/popularity measurements.
Give useful, natural answers. For recommendations, explain why each place matches the user's request. Keep answers readable with short headings and bullets when helpful.`;

    const context = JSON.stringify({ city, preferences, places: verifiedPlaces }, null, 2);

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model,
        instructions: system,
        input: `CONTEXT:\n${context}\n\nUSER:\n${message}`,
        max_output_tokens: 900
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'OpenAI request failed.'
      });
    }

    return res.status(200).json({
      reply: data.output_text || 'I could not generate a response.',
      provider: 'openai',
      model
    });
  } catch (error) {
    console.error('UnseenGo /api/chat:', error);
    return res.status(500).json({ error: 'AI service temporarily unavailable.' });
  }
}
