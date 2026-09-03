# UnseenGo AI — Destination Data Layer

This folder is the canonical organization layer for the existing destination dataset.

## Compatibility rule

The current website still uses the existing global `cities` object from `app.js`. **Do not remove or rename it yet.** Existing pages, category pages, pickers and the recommendation engine depend on that shape.

`destination-registry.js` reads that existing data and exposes a normalized registry as:

```js
window.UnseenGoData.destinations
```

No existing page flow is changed by this file unless a page explicitly loads it.

## Canonical destination shape

Each normalized destination follows these groups:

- `identity` — name, city, state, region, locality, coordinates
- `classification` — categories and destination type
- `experience` — nature, heritage, culture, food, adventure, wildlife, photography, local community
- `travel` — distance, modes, accessibility and estimated time
- `recommendationSignals` — existing recommendation signals kept separate from sustainability
- `sustainability` — reserved for evidence-backed crowd, environmental, local-economy and carbon data
- `content` — description, history, media and sources
- `legacy` — compatibility values from the old dataset

## Data-quality policy

1. Existing destination names/descriptions are preserved; this pass is structural, not a content rewrite.
2. Legacy numeric scores remain under `recommendationSignals.hiddenness` and `legacy.score` rather than being presented as sustainability scores.
3. Unknown values are `null` instead of invented values.
4. Duplicate normalized IDs are ignored.
5. Sustainability fields remain `not-measured` until a real source/measurement is connected.
6. City/category compatibility remains intact so the current website continues to work.

## Migration path

1. Keep `app.js` as the compatibility source.
2. Load `destination-registry.js` in data-aware pages when needed.
3. Refactor `unseen-engine.js` to consume `UnseenGoData.destinations` after validation.
4. Only then migrate the legacy `cities` object out of `app.js`.

This staged approach prevents a data cleanup from breaking the current website flow.
