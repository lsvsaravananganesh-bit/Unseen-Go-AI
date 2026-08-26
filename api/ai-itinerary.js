export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI service is not configured' });

  const { city, days = 2, interests = [], budget = 'moderate', pace = 'moderate', places = [] } = req.body || {};
  if (!city) return res.status(400).json({ error: 'city is required' });

  const prompt = `You are UnseenGo AI, a tourism itinerary engine. Create a practical ${days}-day itinerary for ${city}. Interests: ${interests.join(', ') || 'general discovery'}. Budget: ${budget}. Pace: ${pace}. Prefer lesser-known cultural, heritage, nature and local experiences. Use ONLY places supplied in the candidate list when possible. Candidate places: ${JSON.stringify(places.slice(0, 30))}. Return JSON with keys summary, days (array of {day,title,morning,afternoon,evening,estimatedBudget}), tips. Do not invent opening hours, ratings or addresses.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
    })
  });

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'Gemini request failed' });
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  let itinerary;
  try { itinerary = JSON.parse(text); } catch { return res.status(502).json({ error: 'AI returned invalid JSON' }); }
  return res.status(200).json({ source: 'Gemini', itinerary });
}
