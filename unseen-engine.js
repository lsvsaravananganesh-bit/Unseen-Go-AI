/* UnseenGo AI — recommendation, scoring, itinerary and route engine
 * Browser-safe MVP engine. It uses the repository's city dataset and does not
 * expose private API credentials. A server-side LLM can be connected later.
 */
(function () {
  'use strict';

  const CATEGORY_MAP = {
    heritage: 'Heritage', history: 'Heritage', forts: 'Heritage', architecture: 'Heritage',
    nature: 'Nature', wildlife: 'Nature', outdoors: 'Nature',
    food: 'Food', localfood: 'Food', cuisine: 'Food',
    culture: 'Culture', arts: 'Culture', craft: 'Culture',
    adventure: 'Adventure', trekking: 'Adventure', sports: 'Adventure'
  };

  function normalise(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function getCities() {
    // app.js declares the dataset as a global lexical binding (`const cities`).
    // Such bindings are not properties of window, so window.cities alone is
    // not reliable. Prefer the binding when present and keep window.cities as
    // a compatibility fallback for future data loaders.
    try {
      if (typeof cities === 'object' && cities) return cities;
    } catch (_) {}
    return window.cities && typeof window.cities === 'object' ? window.cities : {};
  }

  function getCityNames() {
    return Object.keys(getCities()).sort((a, b) => a.localeCompare(b));
  }

  function parsePlace(row, category, city) {
    return {
      name: String(row?.[0] || 'Unnamed destination'),
      location: String(row?.[1] || city),
      baseScore: Number(row?.[2]) || 70,
      description: String(row?.[3] || 'A distinctive local experience.'),
      category,
      city
    };
  }

  function collectPlaces(city) {
    const data = getCities()[city];
    if (!data || typeof data !== 'object') return [];

    return Object.entries(data)
      .filter(([key, value]) => key !== 'region' && Array.isArray(value))
      .flatMap(([category, rows]) => rows.map(row => parsePlace(row, category, city)));
  }

  function scorePlace(place, preferences = {}) {
    const selected = (preferences.interests || [])
      .map(value => CATEGORY_MAP[normalise(value)] || String(value));
    const interestMatch = selected.length === 0
      ? 70
      : selected.includes(place.category) ? 100 : 45;

    const paceBonus = preferences.pace === 'slow' && ['Nature', 'Culture', 'Heritage'].includes(place.category)
      ? 8
      : preferences.pace === 'fast' && place.category === 'Adventure' ? 6 : 0;
    const budgetBonus = preferences.budget === 'low' && place.category === 'Food' ? 5 : 0;
    const base = Math.min(100, Math.max(0, Number(place.baseScore) || 70));

    // Transparent MVP score: 45% base discovery signal, 35% interest fit,
    // 10% pace fit and 10% budget fit. It is intentionally deterministic.
    const score = Math.round(
      base * 0.45 +
      interestMatch * 0.35 +
      (70 + paceBonus) * 0.10 +
      (70 + budgetBonus) * 0.10
    );

    return Math.min(100, Math.max(1, score));
  }

  function recommend(city, preferences = {}) {
    const places = collectPlaces(city).map(place => ({
      ...place,
      unseenScore: scorePlace(place, preferences)
    }));

    const selected = (preferences.interests || [])
      .map(value => CATEGORY_MAP[normalise(value)] || String(value));
    const ranked = places.sort((a, b) =>
      b.unseenScore - a.unseenScore || b.baseScore - a.baseScore || a.name.localeCompare(b.name)
    );

    const requestedDays = Math.max(1, Math.min(14, Number(preferences.days) || 2));
    const pace = preferences.pace || 'balanced';
    const perDay = pace === 'slow' ? 2 : pace === 'fast' ? 4 : 3;
    const targetCount = Math.min(places.length, Math.max(6, requestedDays * perDay));

    // Prefer requested categories while preserving category diversity.
    const result = [];
    const usedCategories = new Set();
    for (const place of ranked) {
      if (result.length >= targetCount) break;
      const preferred = selected.length === 0 || selected.includes(place.category);
      if (preferred && !usedCategories.has(place.category)) {
        result.push(place);
        usedCategories.add(place.category);
      }
    }
    for (const place of ranked) {
      if (result.length >= targetCount) break;
      if (!result.includes(place)) result.push(place);
    }

    return result;
  }

  function buildItinerary(recommendations, days, pace = 'balanced') {
    const requestedDays = Math.max(1, Math.min(14, Number(days) || 1));
    const perDay = pace === 'slow' ? 2 : pace === 'fast' ? 4 : 3;
    const usableDays = Math.min(requestedDays, Math.max(1, Math.ceil(recommendations.length / perDay)));
    const plan = Array.from({ length: usableDays }, (_, index) => ({
      day: index + 1,
      places: []
    }));

    recommendations.forEach((place, index) => {
      const day = Math.floor(index / perDay);
      if (day < plan.length) plan[day].places.push(place);
    });

    return plan;
  }

  function mapsUrl(places) {
    if (!Array.isArray(places) || places.length === 0) return '#';

    const names = places.map(place =>
      encodeURIComponent(`${place.name}, ${place.city}`)
    );
    const destination = names[names.length - 1];
    const params = new URLSearchParams({
      api: '1',
      destination,
      travelmode: 'driving'
    });
    if (names.length > 1) params.set('waypoints', names.slice(0, -1).join('|'));
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }

  function budgetLabel(value) {
    return ({ low: 'Budget-friendly', medium: 'Comfort', high: 'Premium' })[value] || 'Flexible';
  }

  function generate(city, preferences = {}) {
    const cityName = String(city || '').trim();
    const availablePlaces = collectPlaces(cityName);
    if (!cityName || availablePlaces.length === 0) {
      return {
        city: cityName || 'Unknown destination',
        recommendations: [],
        itinerary: [],
        mapsUrl: '#',
        requestedDays: Math.max(1, Math.min(14, Number(preferences.days) || 2)),
        summary: 'No verified UnseenGo destination records are available for this city yet.'
      };
    }

    const requestedDays = Math.max(1, Math.min(14, Number(preferences.days) || 2));
    const recommendations = recommend(cityName, preferences);
    const itinerary = buildItinerary(recommendations, requestedDays, preferences.pace || 'balanced');

    return {
      city: cityName,
      recommendations,
      itinerary,
      mapsUrl: mapsUrl(recommendations),
      requestedDays,
      actualDays: itinerary.length,
      summary: `${itinerary.length}-day ${preferences.pace || 'balanced'} trip · ${budgetLabel(preferences.budget)}`
    };
  }

  window.UnseenGoAI = {
    getCityNames,
    collectPlaces,
    scorePlace,
    recommend,
    buildItinerary,
    mapsUrl,
    generate
  };
})();
