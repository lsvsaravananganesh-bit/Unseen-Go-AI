/* UnseenGo AI — India registry verification helper
 *
 * This script never marks a place as Google-verified without a successful
 * Google Places response. Government-listed and Google-verified are separate
 * states by design.
 *
 * Required environment variables when used with the live API:
 *   GOOGLE_MAPS_API_KEY
 *
 * Usage:
 *   node scripts/verify-india-registry.mjs "Kurnool"
 */
const query = process.argv.slice(2).join(' ').trim();
const key = process.env.GOOGLE_MAPS_API_KEY;

if (!query) {
  console.error('Usage: node scripts/verify-india-registry.mjs "City or destination"');
  process.exit(1);
}

if (!key) {
  console.error('GOOGLE_MAPS_API_KEY is required. Never commit this key to GitHub.');
  process.exit(1);
}

const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': key,
    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.businessStatus,places.googleMapsUri,places.regularOpeningHours'
  },
  body: JSON.stringify({ textQuery: query, languageCode: 'en', regionCode: 'IN', pageSize: 10 })
});

if (!response.ok) {
  console.error(`Google Places verification failed: HTTP ${response.status}`);
  console.error(await response.text());
  process.exit(1);
}

const data = await response.json();
console.log(JSON.stringify({
  query,
  source: 'Google Places API (New)',
  verified_at: new Date().toISOString(),
  matches: data.places ?? []
}, null, 2));
