/* UnseenGo AI — Interactive AI Discovery Widget Controller
 * Features smooth step-by-step calculation animations, photo fallbacks, and explainable breakdowns.
 */

(function () {
  'use strict';

  const SAMPLE_PHOTOS = {
    gandikota: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=800&q=85',
    lepakshi: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=85',
    agumbe: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=85',
    hampi: 'https://images.unsplash.com/photo-1600100397608-f0109f7d1d4e?auto=format&fit=crop&w=800&q=85',
    orvakal: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85',
    paigah: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=85',
    belum: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85',
    default: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=85'
  };

  function getPlacePhoto(name) {
    const key = String(name || '').toLowerCase();
    for (const [k, url] of Object.entries(SAMPLE_PHOTOS)) {
      if (key.includes(k)) return url;
    }
    return SAMPLE_PHOTOS.default;
  }

  function safeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, x => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[x]));
  }

  function initAiWidget() {
    const input = document.getElementById('homePrompt');
    const runBtn = document.getElementById('homeRun');
    const resultPanel = document.getElementById('homeResultPanel');
    const chips = document.querySelectorAll('.ug-prompt-chip');

    if (!input || !runBtn || !resultPanel) return;

    // Search Mode Switcher: AI Discover vs Direct Destination Search
    const modeAiBtn = document.getElementById('modeAiBtn');
    const modeDestBtn = document.getElementById('modeDestBtn');
    const aiDiscoverBox = document.getElementById('aiDiscoverBox');
    const destSearchBox = document.getElementById('destSearchBox');
    const destDirectInput = document.getElementById('destDirectInput');
    const destDirectBtn = document.getElementById('destDirectBtn');

    if (modeAiBtn && modeDestBtn && aiDiscoverBox && destSearchBox) {
      modeAiBtn.addEventListener('click', () => {
        modeAiBtn.classList.add('active');
        modeDestBtn.classList.remove('active');
        aiDiscoverBox.style.display = 'block';
        destSearchBox.style.display = 'none';
        input.focus();
      });

      modeDestBtn.addEventListener('click', () => {
        modeDestBtn.classList.add('active');
        modeAiBtn.classList.remove('active');
        destSearchBox.style.display = 'block';
        aiDiscoverBox.style.display = 'none';
        if (destDirectInput) destDirectInput.focus();
      });
    }

    if (destDirectBtn && destDirectInput) {
      const handleDirectSearch = () => {
        const query = destDirectInput.value.trim() || 'Gandikota';
        window.location.href = `place.html?place=${encodeURIComponent(query)}`;
      };
      destDirectBtn.addEventListener('click', handleDirectSearch);
      destDirectInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleDirectSearch();
        }
      });
    }

    // Inspiration prompt chips
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.dataset.prompt || chip.textContent.trim();
        input.value = text;
        runDiscoveryWithAnimation(text);
      });
    });

    runBtn.addEventListener('click', () => {
      const text = input.value.trim() || 'I have 2 days from Hyderabad. I love quiet heritage, cave temples and local food. Budget ₹6,000.';
      runDiscoveryWithAnimation(text);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runBtn.click();
      }
    });

    async function runDiscoveryWithAnimation(promptText) {
      if (!window.UnseenGoAI || typeof window.UnseenGoAI.generate !== 'function') {
        renderFallback('The UnseenGo engine is initializing. Please try again in a moment or visit the AI Decision Engine.');
        return;
      }

      runBtn.disabled = true;
      runBtn.textContent = '✨ Analyzing…';

      resultPanel.style.display = 'block';
      resultPanel.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.75rem; animation: ugPulse 1.2s infinite ease-in-out;">✦</div>
          <h4 style="font-size: 1.2rem; margin-bottom: 0.4rem; color: var(--ug-text-primary);" id="aiStepText">
            Analyzing your travel preferences & pacing…
          </h4>
          <p style="font-size: 0.85rem; color: var(--ug-text-muted);">
            Connecting to India Discovery Graph with 300+ verified destination records
          </p>
        </div>
      `;

      // Smooth step simulation for delightful UX
      await delay(300);
      const stepEl = document.getElementById('aiStepText');
      if (stepEl) stepEl.textContent = 'Scanning regional circuits & hidden heritage spots…';
      await delay(350);
      if (stepEl) stepEl.textContent = 'Calculating explainable UnseenGo score breakdown…';
      await delay(250);

      try {
        const profile = window.UnseenGoAI.parseNaturalLanguage(promptText);
        if (!profile.interests.length) {
          profile.interests = ['Heritage', 'Culture'];
        }

        const currentSavedCity = localStorage.getItem('unseengo_city');
        const cityToSearch = profile.city || currentSavedCity || '';

        const result = window.UnseenGoAI.generate(cityToSearch, profile);
        const top = result.recommendations && result.recommendations[0];

        if (top) {
          renderResult(top, result, profile);
        } else {
          renderFallback('No specific destination matched all strict filters. Try broadening your interests or clearing city restrictions.');
        }
      } catch (err) {
        console.error('AI match error:', err);
        renderFallback('Could not calculate a match. Please explore our curated destination directory or full AI Decision Engine.');
      } finally {
        runBtn.textContent = '✦ Find My Hidden Gem';
        runBtn.disabled = false;
      }
    }

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function renderResult(place, fullResult, profile) {
      const photoUrl = getPlacePhoto(place.name);
      const score = Math.round(place.unseenScore || 92);
      const mapsUrl = fullResult.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + (place.city || ''))}`;

      resultPanel.innerHTML = `
        <div class="ug-ai-result-grid">
          <div class="ug-ai-result-media">
            <img src="${photoUrl}" alt="${safeHtml(place.name)}" loading="lazy">
            <span class="ug-ai-result-badge">✦ ${score}/100 Unseen Score</span>
          </div>
          <div class="ug-ai-result-details">
            <div class="ug-kicker emerald">✦ Top AI Match · ${safeHtml(place.category || 'Heritage')}</div>
            <h3>${safeHtml(place.name)}</h3>
            <div class="location">📍 ${safeHtml(place.location || place.city || 'India')}</div>
            <p class="why-text"><strong>Why it matches:</strong> ${safeHtml(place.why || place.description)}</p>
            
            <div class="ug-ai-metrics-row">
              <div class="ug-metric-chip">
                <span class="label">Hiddenness</span>
                <span class="val">${place.hiddenness || 22}/25</span>
              </div>
              <div class="ug-metric-chip">
                <span class="label">Cultural Depth</span>
                <span class="val">${place.culturalValue || 18}/20</span>
              </div>
              <div class="ug-metric-chip">
                <span class="label">Interest Fit</span>
                <span class="val">${place.interestPercent || 95}%</span>
              </div>
              <div class="ug-metric-chip">
                <span class="label">Budget Fit</span>
                <span class="val">${place.budgetFit || 90}%</span>
              </div>
            </div>

            <div class="ug-ai-result-actions">
              <a href="place.html?place=${encodeURIComponent(place.name)}&city=${encodeURIComponent(place.city || '')}" class="ug-btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
                Explore Destination (History, Photos & Reviews) →
              </a>
              <a href="map.html?place=${encodeURIComponent(place.name)}&city=${encodeURIComponent(place.city || '')}" class="ug-btn-secondary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
                🗺️ View on Map
              </a>
              <a href="planner.html?place=${encodeURIComponent(place.name)}&city=${encodeURIComponent(place.city || '')}" class="ug-btn-secondary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
                🤖 Build AI Itinerary
              </a>
            </div>
          </div>
        </div>
      `;

      resultPanel.classList.add('show');
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function renderFallback(message) {
      resultPanel.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
          <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--ug-primary);">Notice</h4>
          <p style="color: var(--ug-text-secondary); max-width: 520px; margin: auto; margin-bottom: 1.25rem;">${safeHtml(message)}</p>
          <a href="india-cities.html" class="ug-btn-secondary" style="padding: 0.6rem 1.2rem;">Browse All Destinations →</a>
        </div>
      `;
      resultPanel.classList.add('show');
    }
  }

  document.addEventListener('DOMContentLoaded', initAiWidget);
})();
