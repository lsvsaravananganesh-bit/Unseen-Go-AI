/* UnseenGo AI — Phase 3.1: Explainable Recommendation Engine
 * Content-based ranking foundation. No fabricated ML claims.
 * Unknown/null destination signals are treated neutrally.
 */
(function (global) {
  'use strict';

  const WEIGHTS = {
    interest: 0.30,
    hiddenness: 0.20,
    experience: 0.15,
    travelEase: 0.10,
    budgetFit: 0.10,
    paceFit: 0.05,
    photography: 0.05,
    localExperience: 0.05
  };

  const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 50));
  const norm = (v) => String(v || '').trim().toLowerCase();
  const arr = (v) => Array.isArray(v) ? v.map(norm) : [];

  function scoreInterest(destination, preferences) {
    const wanted = arr(preferences.interests);
    if (!wanted.length) return 50;
    const experience = destination.experience || {};
    const categories = arr((destination.classification || {}).categories);
    const matches = wanted.filter((x) => {
      if (categories.includes(x)) return true;
      return Object.keys(experience).some((k) => norm(k) === x && Number(experience[k]) > 0);
    });
    return clamp((matches.length / wanted.length) * 100);
  }

  function numericSignal(destination, key, fallback) {
    const signals = destination.recommendationSignals || {};
    const value = signals[key];
    return value == null ? fallback : clamp(Number(value));
  }

  function budgetFit(destination, preferences) {
    if (!preferences.budget) return 50;
    const travel = destination.travel || {};
    if (travel.estimatedCost == null) return 50;
    const budget = Number(preferences.budget);
    if (!Number.isFinite(budget) || budget <= 0) return 50;
    const cost = Number(travel.estimatedCost);
    if (!Number.isFinite(cost)) return 50;
    return clamp(100 - Math.abs(cost - budget) / budget * 100);
  }

  function paceFit(destination, preferences) {
    if (!preferences.pace) return 50;
    const signal = numericSignal(destination, 'paceFit', 50);
    return signal;
  }

  function photographyFit(destination, preferences) {
    const wants = arr(preferences.interests).includes('photography') || preferences.photography === true;
    if (!wants) return 50;
    return numericSignal(destination, 'photography', 50);
  }

  function score(destination, preferences) {
    const parts = {
      interest: scoreInterest(destination, preferences),
      hiddenness: numericSignal(destination, 'hiddenness', 50),
      experience: numericSignal(destination, 'culturalValue', 50),
      travelEase: numericSignal(destination, 'travelEase', 50),
      budgetFit: budgetFit(destination, preferences),
      paceFit: paceFit(destination, preferences),
      photography: photographyFit(destination, preferences),
      localExperience: numericSignal(destination, 'localExperience', 50)
    };
    const weighted = Object.keys(WEIGHTS).reduce((sum, key) => sum + parts[key] * WEIGHTS[key], 0);
    return { score: Math.round(weighted), parts, weights: WEIGHTS };
  }

  function explain(destination, result, preferences) {
    const p = result.parts;
    const strongest = Object.entries(p).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]);
    const labels = {
      interest: 'your interests', hiddenness: 'its hidden-gem character', experience: 'its experience value',
      travelEase: 'travel convenience', budgetFit: 'your budget', paceFit: 'your preferred pace',
      photography: 'photography potential', localExperience: 'local-experience value'
    };
    const reasons = strongest.map(k => labels[k]).join(' and ');
    return `Recommended because of ${reasons}. The ranking uses transparent preference matching and destination signals; missing data is not invented.`;
  }

  function recommend(destinations, preferences, limit = 5) {
    const list = Array.isArray(destinations) ? destinations : [];
    return list.map(d => {
      const result = score(d, preferences || {});
      return { destination: d, ...result, explanation: explain(d, result, preferences || {}) };
    }).sort((a, b) => b.score - a.score).slice(0, limit);
  }

  global.UnseenGoRecommendation = { version: '3.1.0', weights: WEIGHTS, score, recommend, explain };
})(window);
