/* UnseenGo AI — Phase 2C public Supabase data access.
 * Browser-safe: only the publishable key is used. RLS controls access.
 */
(function () {
  function client() { return window.unseenGoSupabase || null; }

  async function loadCities() {
    const sb = client();
    if (!sb) return null;
    const { data, error } = await sb
      .from('cities')
      .select('id,name,state,region,description,history,image_url,latitude,longitude')
      .eq('is_active', true)
      .order('name');
    if (error) {
      console.warn('UnseenGo AI: could not load cities from Supabase.', error.message);
      return null;
    }
    return data || [];
  }

  async function loadCity(cityName) {
    const sb = client();
    if (!sb || !cityName) return null;

    const { data: city, error: cityError } = await sb
      .from('cities')
      .select('id,name,state,region,description,history,image_url,latitude,longitude')
      .eq('name', cityName)
      .eq('is_active', true)
      .maybeSingle();
    if (cityError || !city) return null;

    const { data: places, error: placesError } = await sb
      .from('places')
      .select('id,name,category,description,history,image_url,latitude,longitude,map_url,is_hidden_gem,is_famous')
      .eq('city_id', city.id)
      .eq('is_active', true)
      .order('category')
      .order('name');
    if (placesError) return null;

    const { data: stays } = await sb
      .from('accommodations')
      .select('id,area,stay_type,budget_band,description,map_url')
      .eq('city_id', city.id)
      .order('area');

    const placeIds = (places || []).map(p => p.id);
    let reviews = [];
    if (placeIds.length) {
      const { data: reviewRows } = await sb
        .from('reviews')
        .select('id,place_id,rating,title,body,is_verified,created_at')
        .in('place_id', placeIds)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(30);
      reviews = reviewRows || [];
    }

    return { city, places: places || [], stays: stays || [], reviews };
  }

  window.UnseenGoData = { loadCities, loadCity };
})();
