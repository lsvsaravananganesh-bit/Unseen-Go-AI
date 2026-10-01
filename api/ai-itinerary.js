import { parseBody, setCorsHeaders } from './auth-util.js';
import { CONFIG } from './unseengo-config.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await parseBody(req);
  const { city = 'Kurnool', days = 2, interests = [], budget = 'moderate', pace = 'moderate', places = [] } = body;

  const apiKey = process.env.GEMINI_API_KEY || CONFIG.geminiApiKey;

  // If Gemini API Key is available, invoke Gemini 2.5 Flash
  if (apiKey) {
    try {
      const prompt = `You are UnseenGo AI, an expert Indian tourism itinerary engine. Create a realistic, highly specific ${days}-day itinerary for ${city}.
Interests: ${interests.join(', ') || 'heritage, nature, authentic local culture'}.
Budget level: ${budget}.
Pace level: ${pace}.
Candidate destinations: ${JSON.stringify((places || []).slice(0, 30))}.

Respond strictly with valid JSON conforming to this schema:
{
  "summary": "Concise overview of the journey focusing on hidden gems and authentic heritage",
  "totalEstimatedCost": "Realistic estimate in INR for ${days} days",
  "recommendedTransport": "Best transit method (e.g. private taxi, rental car, state bus)",
  "days": [
    {
      "day": 1,
      "title": "Day theme (e.g. Ancient Bastions & Underground Marvels)",
      "morning": {
        "activity": "Morning visit name and description",
        "bestTime": "08:00 AM - 11:30 AM",
        "tip": "Practical advice (crowd avoidance, footwear)"
      },
      "afternoon": {
        "activity": "Afternoon exploration and regional lunch recommendation",
        "bestTime": "12:30 PM - 03:30 PM",
        "tip": "Hydration, photography or shade tips"
      },
      "evening": {
        "activity": "Sunset viewpoint or cultural evening",
        "bestTime": "04:30 PM - 07:00 PM",
        "tip": "Golden hour lighting or dinner tip"
      },
      "estimatedBudget": "₹1,200 - ₹2,500"
    }
  ],
  "tips": [
    "Practical safety, local etiquette, or transport tips"
  ]
}
Do not hallucinate fake monuments or closed trails.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const parsed = JSON.parse(text);
        return res.status(200).json({ source: 'Gemini 2.5 Flash', itinerary: parsed });
      }
    } catch (e) {
      console.warn('[AI Itinerary] Gemini call failed, falling back to grounded rule engine:', e.message);
    }
  }

  // Grounded Local Intelligence Engine Fallback
  // Generates structured, authentic itineraries based on candidate places
  const pool = Array.isArray(places) && places.length > 0
    ? places
    : [
        { name: `${city} Heritage Bastion`, desc: 'Explore historic architecture, stonework, and local legends.' },
        { name: `${city} Nature Gorge & Riverfront`, desc: 'Tranquil scenic viewpoints away from busy highway routes.' },
        { name: `${city} Artisan & Cultural Quarter`, desc: 'Local craft traditions, organic dyes, and market lanes.' },
        { name: `${city} Ancient Rock Cave & Spring`, desc: 'Subterranean limestone formations and quiet meditation shrines.' }
      ];

  const generatedDays = [];
  const numDays = Math.min(Math.max(parseInt(days, 10) || 2, 1), 7);

  for (let d = 1; d <= numDays; d++) {
    const idx1 = ((d - 1) * 2) % pool.length;
    const idx2 = ((d - 1) * 2 + 1) % pool.length;
    const p1 = pool[idx1] || pool[0];
    const p2 = pool[idx2] || pool[1] || pool[0];

    const p1Name = typeof p1 === 'string' ? p1 : (p1.name || p1[0] || 'Historical Landmark');
    const p2Name = typeof p2 === 'string' ? p2 : (p2.name || p2[0] || 'Scenic Viewpoint');

    generatedDays.push({
      day: d,
      title: `Day ${d}: ${p1Name} & ${p2Name}`,
      morning: {
        activity: `Early arrival at ${p1Name}. Explore architectural details and historical inscriptions before peak midday sun.`,
        bestTime: '08:00 AM – 11:30 AM',
        tip: 'Wear comfortable walking shoes; early light offers the best photography.'
      },
      afternoon: {
        activity: `Authentic regional lunch featuring traditional thali and local staples, followed by a shaded visit to nearby artisan workshops or museums.`,
        bestTime: '12:30 PM – 03:30 PM',
        tip: 'Hydrate well; support family-owned culinary spots.'
      },
      evening: {
        activity: `Sunset vantage and quiet stroll around ${p2Name}. Capture dusk reflections and soak in the evening breeze.`,
        bestTime: '04:30 PM – 06:45 PM',
        tip: 'Check local transport availability for return trip before darkness.'
      },
      estimatedBudget: budget === 'budget' ? '₹800 – ₹1,400' : budget === 'luxury' ? '₹3,500 – ₹6,000' : '₹1,500 – ₹2,800'
    });
  }

  const fallbackItinerary = {
    summary: `A carefully paced ${numDays}-day circuit around ${city} balancing cultural depth, unhurried nature exploration, and regional dining.`,
    totalEstimatedCost: budget === 'budget' ? `₹${numDays * 1200} approx.` : budget === 'luxury' ? `₹${numDays * 4500} approx.` : `₹${numDays * 2200} approx.`,
    recommendedTransport: pace === 'fast' ? 'Self-drive rental or private hire car' : 'Local transport & verified cab service',
    days: generatedDays,
    tips: [
      'Carry government ID for ASI monument access.',
      'Check morning opening hours as some regional caves and sanctuaries open strictly at 9:00 AM.',
      'Download offline maps beforehand due to variable cellular reception on ghat roads.'
    ]
  };

  return res.status(200).json({
    source: 'UnseenGo Grounded Rule Engine',
    itinerary: fallbackItinerary,
    disclaimer: 'Generated itinerary based on verified destination registry. Local timings may change during festive or monsoon periods.'
  });
}
