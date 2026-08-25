export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

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

    const response = await fetch(`${ollamaUrl.replace(/\\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        stream: false,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
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
      error: 'Unable to reach Ollama. Make sure Ollama is running and OLLAMA_URL is reachable from the backend.'
    });
  }
}
