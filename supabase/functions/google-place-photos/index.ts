// UnseenGo AI — Phase 2C Google Places photo proxy
// Keeps the Google Maps API key on the Supabase server instead of exposing it in GitHub Pages.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return response({ error: 'POST required' }, 405);

  const googleKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
  if (!googleKey) return response({ error: 'GOOGLE_MAPS_API_KEY is not configured in Supabase.' }, 500);

  try {
    const { place, city } = await req.json();
    if (!place || !city) return response({ error: 'place and city are required' }, 400);

    const search = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.photos',
      },
      body: JSON.stringify({
        textQuery: `${place}, ${city}, India`,
        languageCode: 'en',
        regionCode: 'IN',
        maxResultCount: 1,
      }),
    });

    if (!search.ok) {
      const detail = await search.text();
      return response({ error: 'Google Places search failed', detail }, search.status);
    }

    const data = await search.json();
    const found = data.places?.[0];
    if (!found) return response({ place: null, photos: [] });

    const photos = [];
    for (const photo of (found.photos || []).slice(0, 6)) {
      try {
        const mediaUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=1200&maxHeightPx=800&skipHttpRedirect=true`;
        const media = await fetch(mediaUrl, {
          headers: { 'X-Goog-Api-Key': googleKey },
        });
        if (!media.ok) continue;
        const mediaData = await media.json();
        if (mediaData.photoUri) {
          photos.push({
            url: mediaData.photoUri,
            width: photo.widthPx,
            height: photo.heightPx,
            attributions: photo.authorAttributions || [],
          });
        }
      } catch (_) {
        // Continue with the remaining photos if one photo request fails.
      }
    }

    return response({
      place: {
        id: found.id,
        name: found.displayName?.text || place,
        address: found.formattedAddress || '',
        latitude: found.location?.latitude ?? null,
        longitude: found.location?.longitude ?? null,
        mapsUrl: found.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + ' ' + city)}`,
      },
      photos,
    });
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : 'Unexpected server error' }, 500);
  }
});
