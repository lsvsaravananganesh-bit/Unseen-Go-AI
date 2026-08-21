/* UnseenGo AI — India-wide hierarchical explorer. Robust fallback: the regional directory must render even if another legacy script fails. */
(function () {
  const REGION_META = {
    South: { name: 'Dakshina Bharat', english: 'South India', icon: '✦', desc: 'Southern India · living heritage, temples, crafts, coast and culture' },
    West: { name: 'Paschima Bharat', english: 'West India', icon: '◈', desc: 'Western India · forts, trade heritage, crafts, food and landscapes' },
    East: { name: 'Purva Bharat', english: 'East India', icon: '◇', desc: 'Eastern India · ancient heritage, living traditions, rivers and arts' },
    North: { name: 'Uttara Bharat', english: 'North India', icon: '✧', desc: 'Northern India · royal heritage, historic cities, monuments and culture' }
  };

  const STATE_REGION = {
    'Andhra Pradesh':'South','Telangana':'South','Karnataka':'South','Tamil Nadu':'South','Kerala':'South','Goa':'West','Maharashtra':'West','Gujarat':'West','Madhya Pradesh':'West','Rajasthan':'West','Chhattisgarh':'West',
    'West Bengal':'East','Odisha':'East','Assam':'East','Bihar':'East','Jharkhand':'East','Arunachal Pradesh':'East','Manipur':'East','Meghalaya':'East','Mizoram':'East','Nagaland':'East','Tripura':'East','Sikkim':'East',
    'Uttar Pradesh':'North','Delhi':'North','Punjab':'North','Haryana':'North','Himachal Pradesh':'North','Uttarakhand':'North','Jammu and Kashmir':'North','Ladakh':'North','Chandigarh':'North',
    'Puducherry':'South','Andaman and Nicobar Islands':'East','Dadra and Nagar Haveli and Daman and Diu':'West','Lakshadweep':'South'
  };

  function esc(v) {
    return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function getCitiesData() {
    // Legacy app.js uses a top-level `const cities`; safely retrieve it when available.
    try { return typeof cities !== 'undefined' ? cities : {}; } catch (e) { return {}; }
  }

  function render() {
    const root = document.getElementById('regionExplorer');
    if (!root) return;

    const directory = window.INDIA_DIRECTORY || {};
    const cityData = getCitiesData();
    const grouped = { South:{}, West:{}, East:{}, North:{} };

    Object.keys(directory).forEach(state => {
      (directory[state] || []).forEach(city => {
        const region = STATE_REGION[state] || 'North';
        if (!grouped[region][state]) grouped[region][state] = new Set();
        grouped[region][state].add(city);
      });
    });

    // Keep every existing UnseenGo city attached to its original state/region.
    Object.keys(cityData).forEach(city => {
      const data = cityData[city] || {};
      const state = (window.CITY_STATE && window.CITY_STATE[city]) || null;
      const region = data.region || STATE_REGION[state] || 'South';
      const safeState = state || 'Existing destinations';
      if (!grouped[region][safeState]) grouped[region][safeState] = new Set();
      grouped[region][safeState].add(city);
    });

    const regions = ['South','West','East','North'];
    root.innerHTML = regions.map((region, ri) => {
      const meta = REGION_META[region];
      const states = grouped[region] || {};
      const stateNames = Object.keys(states).sort();
      const totalCities = stateNames.reduce((n, s) => n + states[s].size, 0);

      const statesHtml = stateNames.map(state => {
        const cityNames = Array.from(states[state]).sort();
        const verified = cityNames.filter(c => !!cityData[c]).length;
        return `<details class="state-group">
          <summary><span class="state-name">${esc(state)}</span><span class="state-meta">${cityNames.length} ${cityNames.length === 1 ? 'city' : 'cities'} · ${verified} verified</span></summary>
          <div class="state-cities">${cityNames.map(city => {
            const hasData = !!cityData[city];
            const count = hasData ? Object.keys(cityData[city] || {}).filter(k => k !== 'region' && Array.isArray(cityData[city][k])).reduce((n,k) => n + cityData[city][k].length, 0) : 0;
            return `<a class="city-explorer-card ${hasData ? 'is-verified' : 'is-directory'}" href="city.html?city=${encodeURIComponent(city)}">
              <span class="city-card-region">${esc(state)} · ${esc(region)}</span>
              <strong>${esc(city)}</strong>
              <span class="city-card-detail">${hasData ? `${count}+ places · verified UnseenGo data` : 'City directory · destination details being added'}</span>
              <span class="city-card-arrow">${hasData ? 'Explore city ↗' : 'Open city ↗'}</span>
            </a>`;
          }).join('')}</div>
        </details>`;
      }).join('');

      return `<details class="region-panel" ${ri === 0 ? 'open' : ''}>
        <summary class="region-summary">
          <span class="region-symbol">${meta.icon}</span>
          <span class="region-copy"><small>${meta.english}</small><strong>${meta.name}</strong><em>${meta.desc}</em></span>
          <span class="region-count">${totalCities} cities <b>↓</b></span>
        </summary>
        <div class="region-content">
          <div class="region-rule"><span>STATES & UNION TERRITORIES</span><i>Choose a state to explore its cities</i></div>
          <div class="state-list">${statesHtml}</div>
        </div>
      </details>`;
    }).join('');

    root.classList.add('region-explorer-ready');
  }

  // Run after all page scripts, and retry once in case GitHub Pages/cache loads scripts late.
  document.addEventListener('DOMContentLoaded', render, { once: true });
  window.addEventListener('load', () => setTimeout(render, 50), { once: true });
})();
