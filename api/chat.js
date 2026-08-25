export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://lsvsaravananganesh-bit.github.io').split(',').map(x => x.trim()).filter(Boolean);
  const allowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!allowed && origin) return res.status(403).json({ error: 'Origin not allowed' });

  const ollamaUrl = process.env.OLLAMA_URL;
  const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
  const ollamaApiKey = process.env.OLLAMA_API_KEY;

  if (!ollamaUrl) {
    return res.status(503).json({
      error: 'Ollama is not configured. Set OLLAMA_URL in the Vercel project environment variables.'
    });
  }

  try {
    const { message, city, preferences, places } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const safePlaces = Array.isArray(places) ? places.slice(0, 10) : [];
    const system = `You are UnseenGo AI, a helpful tourism assistant for discovering lesser-known places in India.
Use only the destination context supplied by the application when making claims about specific places. Do not invent opening hours, prices, ratings, coordinates, availability, or facts about a place.
If the supplied context is insufficient, clearly say so and give general travel guidance instead.
Keep answers practical, concise, friendly, and personalized. Recommend hidden-gem style experiences rather than only famous tourist attractions.

Current city: ${city || 'not provided'}
User preferences: ${JSON.stringify(preferences || {})}
Available destination context: ${JSON.stringify(safePlaces)}`;

    const headers = { 'Content-Type': 'application/json' };
    if (ollamaApiKey) headers.Authorization = `Bearer ${ollamaApiKey}`;

    const response = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: ollamaModel,
        stream: false,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message.slice(0, 6000) }
        ],
        options: { temperature: 0.4 }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(502).json({ error: data.error || 'Ollama request failed' });
    }

    return res.status(200).json({
      reply: data.message?.content || 'I could not generate a response.',
      provider: 'ollama',
      model: ollamaModel
    });
  } catch (error) {
    console.error('Ollama chatbot error:', error);
    return res.status(502).json({
      error: 'Unable to reach Ollama. Check that OLLAMA_URL is publicly reachable from Vercel and the selected model is installed.'
    });
  }
}
