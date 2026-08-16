/* UnseenGo AI — Phase 2C public Supabase data access.
 * Browser-safe: only the publishable key is used. RLS controls access.
 * Current Phase 2C schema uses the places.city text field directly.
 */
(function () {
  function client() { return window.unseenGoSupabase || null; }

  async function loadPlaces(cityName) {
    const sb = client();
    if (!sb || !cityName) return null;

    const { data, error } = await sb
      .from('places')
      .select('id,city,name,category,description,history,latitude,longitude,distance,image_url,maps_url')
      .eq('city', cityName)
      .order('category')
      .order('name');

    if (error) {
      console.warn('UnseenGo AI: could not load places from Supabase.', error.message);
      return null;
    }

    return data || [];
  }

  window.UnseenGoData = { loadPlaces };
})();
