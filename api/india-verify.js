export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Verification service is not configured' });
  const { placeId, status = 'live_verified', source = 'Google Places API (New)', notes = '' } = req.body || {};
  if (!placeId) return res.status(400).json({ error: 'placeId is required' });
  const response = await fetch(`${url}/rest/v1/places?id=eq.${encodeURIComponent(placeId)}`, {
    method: 'PATCH',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ verification_status: status, source, verification_notes: notes, verified_at: new Date().toISOString() })
  });
  const data = await response.json();
  if (!response.ok) return res.status(response.status).json({ error: data.message || data.error || 'Verification update failed' });
  return res.status(200).json({ verified: true, place: data?.[0] || null });
}
