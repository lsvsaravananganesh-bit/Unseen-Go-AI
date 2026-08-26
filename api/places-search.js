export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Google Maps API is not configured' });

  const q = String(req.query.q || '').trim();
  const city = String(req.query.city || '').trim();
  if (!q && !city) return res.status(400).json({ error: 'q or city is required' });

  const textQuery = [q, city].filter(Boolean).join(' in ');
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.photos,places.primaryType,places.types,places.businessStatus,places.regularOpeningHours'
    },
    body: JSON.stringify({ textQuery, languageCode: 'en', maxResultCount: 20 })
  });

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'Places request failed' });

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).json({ source: 'Google Places API (New)', places: data.places || [] });
}
