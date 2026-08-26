/* UnseenGo live Google Places adapter.
 * Uses the secure /api/places-search endpoint when deployed on Vercel.
 */
window.UnseenGoGooglePlaces = {
  async search(query, city = '') {
    const params = new URLSearchParams({ q: query, city });
    const response = await fetch(`/api/places-search?${params}`);
    if (!response.ok) throw new Error('Live place search is unavailable');
    return response.json();
  }
};
