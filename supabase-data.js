/* UnseenGo AI — Phase 2C Supabase tourism data layer
 * Reads public tourism data from Supabase. No secret/service-role key is used.
 * The existing local data remains the safe fallback while the database is populated.
 */
(function () {
  function client() {
    return window.unseenGoSupabase || null;
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
      .order('name');

    if (placesError) return null;

    const { data: stays } = await sb
      .from('accommodations')
      .select('id,area,stay_type,budget_band,description,map_url')
      .eq('city_id', city.id)
      .order('area');

    return { city, places: places || [], stays: stays || [] };
  }

  window.UnseenGoData = { loadCity };
})();
