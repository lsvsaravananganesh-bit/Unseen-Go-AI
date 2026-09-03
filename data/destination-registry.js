/*
 * UnseenGo AI — Canonical Destination Registry
 *
 * Purpose:
 * - Keep the existing `cities` dataset as the compatibility source of truth.
 * - Normalize its legacy category arrays into one predictable destination schema.
 * - Do NOT change the current website flow or existing page APIs.
 * - Keep future sustainability/verification fields explicit and empty until real
 *   measurements and sources are connected.
 *
 * Legacy shape consumed:
 * cities = {
 *   City: {
 *     region: 'South',
 *     Nature: [[name, location, score, description], ...],
 *     Heritage: [...], Food: [...], Culture: [...], Adventure: [...]
 *   }
 * }
 */
(function () {
  'use strict';

  const CATEGORY_ALIASES = {
    Nature: 'nature',
    Heritage: 'heritage',
    Food: 'food',
    Culture: 'culture',
    Adventure: 'adventure',
    Wildlife: 'wildlife',
    Photography: 'photography'
  };

  const LEGACY_CATEGORIES = Object.keys(CATEGORY_ALIASES);

  function clean(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim();
  }

  function slugify(value) {
    return clean(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function parseLocation(rawLocation, cityName) {
    const raw = clean(rawLocation);
    const parts = raw.split('·').map(clean).filter(Boolean);
    const locality = parts[0] || cityName;
    const distanceText = parts.slice(1).join(' · ');
    const isCity = !distanceText || /^city$/i.test(distanceText);
    const distanceKmMatch = distanceText.match(/(\d+)\s*km/i);

    return {
      label: raw,
      locality,
      distanceText: distanceText || null,
      distanceKm: distanceKmMatch ? Number(distanceKmMatch[1]) : null,
      withinCity: isCity
    };
  }

  function normalizePlace(cityName, region, category, row, index) {
    if (!Array.isArray(row)) return null;

    const name = clean(row[0]);
    if (!name) return null;

    const location = parseLocation(row[1], cityName);
    const legacyScore = Number(row[2]);
    const description = clean(row[3]);

    return {
      id: `${slugify(cityName)}-${slugify(name) || index + 1}`,
      identity: {
        name,
        city: cityName,
        state: null,
        region: clean(region) || null,
        locality: location.locality,
        coordinates: null
      },
      classification: {
        categories: [CATEGORY_ALIASES[category] || category.toLowerCase()],
        destinationType: category.toLowerCase()
      },
      experience: {
        nature: null,
        heritage: null,
        culture: null,
        food: null,
        adventure: null,
        wildlife: null,
        photography: null,
        localCommunity: null
      },
      travel: {
        distanceKm: location.distanceKm,
        distanceText: location.distanceText,
        withinCity: location.withinCity,
        travelModes: [],
        accessibility: null,
        estimatedTime: null
      },
      recommendationSignals: {
        hiddenness: Number.isFinite(legacyScore) ? legacyScore : null,
        culturalValue: null,
        travelEase: null,
        localExperience: null,
        budgetLevel: null,
        paceLevel: null,
        crowdLevel: null
      },
      sustainability: {
        crowdLoad: null,
        environmentalImpact: null,
        localEconomicOpportunity: null,
        carbonFactor: null,
        score: null,
        dataSource: null,
        verificationStatus: 'not-measured'
      },
      content: {
        description,
        history: null,
        image: null,
        source: null,
        sourceUrl: null
      },
      legacy: {
        category,
        locationLabel: location.label,
        score: Number.isFinite(legacyScore) ? legacyScore : null
      }
    };
  }

  function buildRegistry(source) {
    const registry = [];
    const seen = new Set();

    Object.entries(source || {}).forEach(([cityName, cityData]) => {
      if (!cityData || typeof cityData !== 'object') return;

      LEGACY_CATEGORIES.forEach(category => {
        const rows = Array.isArray(cityData[category]) ? cityData[category] : [];
        rows.forEach((row, index) => {
          const place = normalizePlace(cityName, cityData.region, category, row, index);
          if (!place || seen.has(place.id)) return;
          seen.add(place.id);
          registry.push(place);
        });
      });
    });

    return registry;
  }

  function summarize(registry) {
    const cities = new Set();
    const categories = new Set();
    registry.forEach(place => {
      cities.add(place.identity.city);
      place.classification.categories.forEach(category => categories.add(category));
    });

    return {
      destinations: registry.length,
      cities: cities.size,
      categories: [...categories].sort(),
      measuredSustainability: registry.filter(p => p.sustainability.verificationStatus !== 'not-measured').length,
      sourceModel: 'legacy-cities-compatible-normalized'
    };
  }

  // Expose a stable read-only-ish registry without touching the existing `cities`
  // object or any existing page code.
  const source = typeof window !== 'undefined' && window.cities
    ? window.cities
    : (typeof cities !== 'undefined' ? cities : {});

  const destinations = buildRegistry(source);

  window.UnseenGoData = window.UnseenGoData || {};
  window.UnseenGoData.destinations = destinations;
  window.UnseenGoData.categories = Object.values(CATEGORY_ALIASES);
  window.UnseenGoData.summary = summarize(destinations);
  window.UnseenGoData.schemaVersion = '1.0';
  window.UnseenGoData.normalize = buildRegistry;
})();
