/* UnseenGo AI — stable core runtime
 * Compatibility-first facade for the existing static website.
 * This file owns initialization and shared data access without moving pages.
 */
(function () {
  'use strict';

  const VERSION = '2.0.0-core';

  function ready() {
    return Boolean(window.UnseenGoData && Array.isArray(window.UnseenGoData.destinations));
  }

  function destinations() {
    return ready() ? window.UnseenGoData.destinations : [];
  }

  function cities() {
    return [...new Set(destinations().map(p => p?.identity?.city).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function categories() {
    return [...new Set(destinations().flatMap(p => p?.classification?.categories || []).filter(Boolean))].sort();
  }

  function byCity(city) {
    if (!city) return destinations();
    return destinations().filter(p => p?.identity?.city === city);
  }

  function diagnostics() {
    const list = destinations();
    const ids = new Set();
    const duplicateIds = [];
    list.forEach(p => {
      if (ids.has(p.id)) duplicateIds.push(p.id);
      ids.add(p.id);
    });
    return {
      version: VERSION,
      registryLoaded: ready(),
      destinationCount: list.length,
      cityCount: cities().length,
      categoryCount: categories().length,
      duplicateIds,
      sustainabilityMeasured: list.filter(p => p?.sustainability?.verificationStatus !== 'not-measured').length
    };
  }

  window.UnseenGoCore = {
    version: VERSION,
    ready,
    destinations,
    cities,
    categories,
    byCity,
    diagnostics
  };
})();
