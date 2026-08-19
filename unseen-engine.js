/* UnseenGo AI — recommendation, scoring, itinerary and route engine
 * Runs entirely in the browser so the GitHub Pages demo needs no API key.
 * The engine ranks the existing city dataset using user preferences, then
 * builds a day-by-day plan and a Google Maps route. A secure server-side LLM
 * can be connected later without exposing credentials in this repository.
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
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function getCities() {
    return typeof window.cities === 'object' ? window.cities : {};
  }

  function getCityNames() {
    return Object.keys(getCities()).sort();
  }

  function parsePlace(row, category, city) {
    return {
      name: row[0],
      location: row[1] || city,
      baseScore: Number(row[2]) || 70,
      description: row[3] || 'A distinctive local experience.',
      category,
      city
    };
  }

  function collectPlaces(city) {
    const data = getCities()[city];
    if (!data) return [];
    return Object.entries(data)
      .filter(([key, value]) => key !== 'region' && Array.isArray(value))
      .flatMap(([category, rows]) => rows.map(row => parsePlace(row, category, city)));
  }

  // Dynamic UnseenGo Score: hiddenness is the existing base score, while
  // preference, practical fit and category diversity personalise the result.
  function scorePlace(place, preferences) {
    const selected = (preferences.interests || []).map(v => CATEGORY_MAP[normalise(v)] || v);
    const interestMatch = selected.length === 0 ? 70 : selected.includes(place.category) ? 100 : 45;
    const paceBonus = preferences.pace === 'slow' && ['Nature', 'Culture', 'Heritage'].includes(place.category) ? 8 :
      preferences.pace === 'fast' && place.category === 'Adventure' ? 6 : 0;
    const budgetBonus = preferences.budget === 'low' && place.category === 'Food' ? 5 : 0;
    const base = Math.min(100, Math.max(0, place.baseScore));

    // 45% hiddenness + 35% preference fit + 10% pace + 10% budget.
    const score = Math.round(base * 0.45 + interestMatch * 0.35 + (70 + paceBonus) * 0.10 + (70 + budgetBonus) * 0.10);
    return Math.min(100, Math.max(1, score));
  }

  function recommend(city, preferences) {
    const places = collectPlaces(city).map(place => ({
      ...place,
      unseenScore: scorePlace(place, preferences)
    }));

    const selected = (preferences.interests || []).map(v => CATEGORY_MAP[normalise(v)] || v);
    const ranked = places.sort((a, b) => b.unseenScore - a.unseenScore || b.baseScore - a.baseScore);

    // Ensure the final shortlist is varied rather than returning five Food places.
    const result = [];
    const usedCategories = new Set();
    for (const place of ranked) {
      if (result.length >= Math.max(6, Number(preferences.days || 1) * 3)) break;
      const preferred = selected.length === 0 || selected.includes(place.category);
      if (preferred && (!usedCategories.has(place.category) || result.length >= selected.length)) {
        result.push(place);
        usedCategories.add(place.category);
      }
    }
    for (const place of ranked) {
      if (result.length >= Math.max(6, Number(preferences.days || 1) * 3)) break;
      if (!result.includes(place)) result.push(place);
    }
    return result;
  }

  function buildItinerary(recommendations, days, pace) {
    const perDay = pace === 'slow' ? 2 : pace === 'fast' ? 4 : 3;
    const plan = Array.from({ length: days }, (_, i) => ({ day: i + 1, places: [] }));
    recommendations.forEach((place, index) => {
      const day = Math.floor(index / perDay);
      if (day < plan.length) plan[day].places.push(place);
    });
    return plan.filter(day => day.places.length);
  }

  function mapsUrl(places) {
    const names = places.map(p => encodeURIComponent(`${p.name}, ${p.city}`));
    if (!names.length) return '#';
    // Google Maps Directions accepts an ordered list of destinations.
    return `https://www.google.com/maps/dir/?api=1&destination=${names[names.length - 1]}&waypoints=${names.slice(0, -1).join('|')}&travelmode=driving`;
  }

  function budgetLabel(value) {
    return ({ low: 'Budget-friendly', medium: 'Comfort', high: 'Premium' })[value] || 'Flexible';
  }

  function generate(city, preferences) {
    const recommendations = recommend(city, preferences);
    const days = Math.max(1, Math.min(14, Number(preferences.days) || 2));
    const itinerary = buildItinerary(recommendations, days, preferences.pace || 'balanced');
    return {
      city,
      recommendations,
      itinerary,
      mapsUrl: mapsUrl(recommendations),
      summary: `${days}-day ${preferences.pace || 'balanced'} trip · ${budgetLabel(preferences.budget)}`
    };
  }

  window.UnseenGoAI = { getCityNames, collectPlaces, scorePlace, recommend, buildItinerary, mapsUrl, generate };
})();
