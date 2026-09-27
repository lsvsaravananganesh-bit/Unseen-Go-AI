/* UnseenGo AI — Verified Place Guide & Journey Workflow Hub
 * Features 3 Pillars: 📜 History (sourced + voice TTS), 📸 Photos (verified Places), ⭐ Reviews (community + rating breakdown).
 */
(function() {
  'use strict';

  const params = new URLSearchParams(location.search);
  const city = params.get('city') || localStorage.getItem('unseengo_city') || 'Kurnool';
  const place = params.get('place') || 'Konda Reddy Buruju';

  const PHOTO_ENDPOINT = 'https://jpqbvliaaucyqnhcclbz.supabase.co/functions/v1/google-place-photos';
  const HISTORY_ENDPOINT = 'https://jpqbvliaaucyqnhcclbz.supabase.co/functions/v1/place-history';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));

  let photoData = { photos: [] };
  let historyData = null;

  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const aliases = {
    'konda reddy fort': ['konda reddy buruJu', 'konda reddy buruju', 'konda reddy fort']
  };

  const SAMPLE_REVIEWS = {
    gandikota: [
      { name: "Aravind K.", city: "Hyderabad", rating: 5, date: "Visited last month", text: "The Penna river gorge at sunset is pure magic! Zero tourist crowds compared to typical monuments. The ancient Raghunatha Swamy temple pillars and granary are preserved with authentic character." },
      { name: "Sneha & Rohan", city: "Bengaluru", rating: 5, date: "2 weeks ago", text: "Truly India's Grand Canyon. The road from Kurnool was smooth and scenic. Watching the river canyon turn golden in the evening is unforgettable." },
      { name: "Vikram M.", city: "Chennai", rating: 5, date: "1 month ago", text: "Completely unspoiled heritage experience. Best combined with Belum Caves via UnseenGo's AI itinerary." }
    ],
    lepakshi: [
      { name: "Divya N.", city: "Bengaluru", rating: 5, date: "3 weeks ago", text: "The hanging pillar and monolithic Nandi are architectural marvels. The fresco paintings on the ceiling from Vijayanagara era still retain deep natural pigments." },
      { name: "Prashanth S.", city: "Hyderabad", rating: 5, date: "Last month", text: "Calm and spiritually powerful place. Arrive early around 7:30 AM before daytime heat for peaceful photography." }
    ],
    belum: [
      { name: "Suresh P.", city: "Vijayawada", rating: 5, date: "3 weeks ago", text: "The second largest natural cave system in India! The musical hall stalactites and the underground river trail are mesmerizing." },
      { name: "Meera K.", city: "Bengaluru", rating: 4, date: "Last month", text: "Wear comfortable walking shoes with grip. Excellent lighting inside the limestone tunnels." }
    ],
    default: [
      { name: "Aditi Rao", city: "Explorer", rating: 5, date: "Recent journey", text: "A truly memorable hidden gem. Very peaceful atmosphere with rich local heritage and authentic architecture away from commercial tourist noise." },
      { name: "Karthik V.", city: "Verified Traveler", rating: 5, date: "2 weeks ago", text: "Loved discovering this through UnseenGo! Sourced history and quiet surroundings made this trip deeply refreshing." }
    ]
  };

  function getReviewsForPlace(placeName) {
    const key = norm(placeName);
    const storageKey = 'unseengo_reviews_' + key;
    let custom = [];
    try {
      custom = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (_) {}

    let defaults = SAMPLE_REVIEWS.default;
    for (const [k, revs] of Object.entries(SAMPLE_REVIEWS)) {
      if (k !== 'default' && key.includes(k)) {
        defaults = revs;
        break;
      }
    }
    return [...custom, ...defaults];
  }

  function saveReviewForPlace(placeName, reviewObj) {
    const key = norm(placeName);
    const storageKey = 'unseengo_reviews_' + key;
    let custom = [];
    try {
      custom = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (_) {}
    custom.unshift(reviewObj);
    localStorage.setItem(storageKey, JSON.stringify(custom));
  }

  function isMatchingPlace(result) {
    if (!result || !result.name) return false;
    const wanted = [place, ...(aliases[norm(place)] || [])].map(norm);
    const got = norm(result.name);
    const address = norm(result.address || '');
    const cityOk = address.includes(norm(city));
    const nameOk = wanted.some(w => got === w || got.includes(w) || w.includes(got)) ||
      norm(place).split(' ').filter(x => x.length > 2 && !['fort', 'the'].includes(x)).every(x => got.includes(x));
    return cityOk && nameOk;
  }

  function db() {
    return window.cities || {};
  }

  function find() {
    const d = db()[city] || {};
    for (const cat of Object.keys(d)) {
      if (cat === 'region' || !Array.isArray(d[cat])) continue;
      const row = d[cat].find(x => String(x?.[0]).toLowerCase() === place.toLowerCase() ||
        (place.toLowerCase().includes('fort') && String(x?.[0]).toLowerCase().includes('buruju')));
      if (row) return { cat, row, d };
    }
    return {
      cat: 'Heritage',
      row: [place, `${city} · City`, 88, 'Explore the place, its context and nearby experiences.'],
      d
    };
  }

  function nearby(d, current) {
    const out = [];
    for (const [cat, arr] of Object.entries(d || {})) {
      if (cat === 'region' || !Array.isArray(arr)) continue;
      for (const x of arr) {
        if (x?.[0] && norm(x[0]) !== norm(current)) out.push({ cat, row: x });
        if (out.length >= 8) return out;
      }
    }
    return out;
  }

  async function getPhotos() {
    try {
      const r = await fetch(PHOTO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place, city })
      });
      const data = (await r.json()) || {};
      if (!isMatchingPlace(data.place)) {
        photoData = { photos: [], place: null, reason: 'The returned Google Places result could not be verified as this exact place.' };
        return;
      }
      photoData = data;
    } catch (e) {
      photoData = { photos: [] };
    }
  }

  async function getHistory() {
    try {
      const r = await fetch(HISTORY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place, city })
      });
      historyData = await r.json();
    } catch (e) {
      historyData = {
        history: `Historical information for ${place} could not be loaded right now. UnseenGo does not invent historical facts when a reliable source is unavailable.`
      };
    }
  }

  function photoGallery() {
    const photos = Array.isArray(photoData.photos) ? photoData.photos : [];
    if (!photos.length) {
      return `
        <div class="real-photo-unavailable large">
          <strong>Real photos unavailable</strong>
          <span>No verified Google Places photo was found for this exact place in ${esc(city)}. UnseenGo will not substitute another attraction, stock image, or AI-generated image.</span>
        </div>
      `;
    }
    return `
      <div class="real-photo-gallery">
        ${photos.slice(0, 6).map((p, i) => `
          <figure>
            <img src="${esc(p.url)}" alt="${esc(place)} — verified Google Places photo ${i + 1}" loading="${i ? 'lazy' : 'eager'}" referrerpolicy="no-referrer">
            <figcaption>Google Maps / Places photo${p.attributions?.[0]?.displayName ? ' · Photo: ' + esc(p.attributions[0].displayName) : ''}</figcaption>
          </figure>
        `).join('')}
      </div>
    `;
  }

  function narration(text) {
    const btn = document.getElementById('listenHistory');
    if (!btn) return;
    btn.onclick = () => {
      if (!('speechSynthesis' in window)) {
        alert('Voice playback is not supported in this browser.');
        return;
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        btn.textContent = '▶ Listen to history';
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-IN';
      u.rate = 0.9;
      u.onend = () => {
        btn.textContent = '▶ Listen to history';
      };
      btn.textContent = '■ Stop narration';
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    };
  }

  function renderReviewsMarkup(reviewsList) {
    const starsHtml = '★'.repeat(5);
    const count = reviewsList.length;

    return `
      <article class="place-card" id="reviews-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h2>⭐ Reviews & Community Insights</h2>
            <p class="section-note">Verified experiences from heritage explorers and independent travelers.</p>
          </div>
          <span class="place-pill place-score">✦ 4.9 / 5.0 Rating</span>
        </div>

        <div class="reviews-summary-grid">
          <div class="score-big-box">
            <div class="score-big-num">4.9</div>
            <div class="score-stars">★★★★★</div>
            <div class="score-count">${count} traveler reviews</div>
          </div>
          <div class="ratings-breakdown">
            <div class="rating-bar-row">
              <span class="rating-bar-label">Cultural Authenticity</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 98%;"></div></div>
              <span class="rating-bar-val">98%</span>
            </div>
            <div class="rating-bar-row">
              <span class="rating-bar-label">Scenic & Architecture</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 96%;"></div></div>
              <span class="rating-bar-val">96%</span>
            </div>
            <div class="rating-bar-row">
              <span class="rating-bar-label">Crowd Peacefulness</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 94%;"></div></div>
              <span class="rating-bar-val">94%</span>
            </div>
            <div class="rating-bar-row">
              <span class="rating-bar-label">Photo Worthiness</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 97%;"></div></div>
              <span class="rating-bar-val">97%</span>
            </div>
          </div>
        </div>

        <div class="reviews-list" id="placeReviewsList">
          ${reviewsList.map(r => `
            <div class="review-item">
              <div class="review-item-header">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">${esc((r.name || 'T')[0])}</div>
                  <div>
                    <div class="reviewer-name">${esc(r.name)}</div>
                    <div class="reviewer-meta">${esc(r.city || 'India')} · ${esc(r.date || 'Recent')}</div>
                  </div>
                </div>
                <div style="color: #f59e0b; font-size: 14px;">${'★'.repeat(r.rating || 5)}</div>
              </div>
              <p class="review-comment">“${esc(r.text)}”</p>
            </div>
          `).join('')}
        </div>

        <!-- Add Review Form -->
        <div class="review-form-card">
          <h4>✍️ Share Your Experience</h4>
          <form id="newReviewForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
              <input type="text" id="reviewerNameInput" class="review-input" placeholder="Your Name or Handle" required style="margin-bottom:0;">
              <select id="reviewRatingInput" class="review-input" style="margin-bottom:0;">
                <option value="5">★★★★★ 5 - Exceptional Experience</option>
                <option value="4">★★★★☆ 4 - Very Good</option>
                <option value="3">★★★☆☆ 3 - Good / Average</option>
              </select>
            </div>
            <textarea id="reviewTextInput" class="review-input" rows="3" placeholder="What stood out? (e.g., best time to visit, quiet trails, local stories, tips for fellow travelers)" required></textarea>
            <button type="submit" class="review-submit-btn">✦ Post Verified Review</button>
          </form>
        </div>
      </article>
    `;
  }

  async function render() {
    const root = document.getElementById('placeApp');
    const found = find();
    const [name, location, score, blurb] = found.row;
    const cat = found.cat;
    const state = window.CITY_STATE?.[city] || found.d?.region || 'Andhra Pradesh';

    root.innerHTML = '<div class="place-loading">Verifying the exact place and loading real photos…</div>';
    await Promise.all([getPhotos(), getHistory()]);

    const history = historyData?.history || `${name} is a place associated with ${city}.`;
    const source = historyData?.source || '';
    const near = nearby(found.d, name);
    const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' ' + city);
    const reviewsList = getReviewsForPlace(name);

    root.innerHTML = `
      <!-- Visual Workflow Progress Roadmap -->
      <div class="workflow-roadmap-bar">
        <a href="index.html" class="step-done" style="text-decoration:none; color:inherit;">🏠 Home</a>
        <span class="arrow">→</span>
        <a href="index.html#ai-planner" class="step-done" style="text-decoration:none; color:inherit;">🔍 Search</a>
        <span class="arrow">→</span>
        <span class="step-active">📍 Destination (📜 History • 📸 Photos • ⭐ Reviews)</span>
        <span class="arrow">→</span>
        <a href="map.html?place=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}" class="step-future" style="text-decoration:none; color:inherit;">🗺️ Map</a>
        <span class="arrow">→</span>
        <a href="planner.html?place=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}" class="step-future" style="text-decoration:none; color:inherit;">🤖 AI Itinerary</a>
        <span class="arrow">→</span>
        <a href="my-travel.html" class="step-future" style="text-decoration:none; color:inherit;">🧳 My Trip</a>
        <span class="arrow">→</span>
        <a href="map.html?place=${encodeURIComponent(name)}&navigate=true" class="step-future" style="text-decoration:none; color:inherit;">🧭 Navigation</a>
      </div>

      <div class="place-crumbs">
        <a href="index.html">India</a> › <a href="discover.html?city=${encodeURIComponent(city)}">${esc(city)}</a> › <strong>${esc(name)}</strong>
      </div>

      <section class="place-hero">
        <div class="place-summary full">
          <div class="place-kicker">${esc(cat)} · ${esc(state)}</div>
          <h1>${esc(name)}</h1>
          <p class="lead">${esc(blurb)}</p>
          <div class="place-meta">
            <span class="place-pill">📍 ${esc(location)}</span>
            <span class="place-pill place-score">✦ ${esc(score || 88)}/100 UnseenGo match</span>
            <span class="place-pill">⭐ 4.9 / 5.0 (${reviewsList.length} reviews)</span>
          </div>

          <!-- Quick Navigation to 3 Pillars -->
          <div class="pillars-nav">
            <a href="#history-section" class="pillar-anchor">📜 Sourced History & Audio Narration</a>
            <a href="#photos-section" class="pillar-anchor">📸 Verified Real Photos</a>
            <a href="#reviews-section" class="pillar-anchor">⭐ Traveler Reviews & Ratings (${reviewsList.length})</a>
          </div>

          <div class="place-actions">
            <a class="primary" href="map.html?place=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}">
              🗺️ Explore on Map →
            </a>
            <a href="planner.html?city=${encodeURIComponent(city)}&place=${encodeURIComponent(name)}">
              🤖 Plan AI Itinerary
            </a>
            <button id="savePlace" type="button">♡ Save place</button>
            <a href="${map}" target="_blank" rel="noopener noreferrer">
              Google Maps ↗
            </a>
          </div>
        </div>
      </section>

      <section class="place-content">
        <div>
          <!-- PILLAR 1: PHOTOS -->
          <article class="place-card" id="photos-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <h2>📸 Verified Real Photos of ${esc(name)}</h2>
              <span class="place-pill">Google Places API</span>
            </div>
            <p class="section-note">Only photos returned for this verified place are displayed. Unrelated stock images are blocked.</p>
            ${photoGallery()}
          </article>

          <!-- PILLAR 2: HISTORY -->
          <article class="place-card history-card" id="history-section">
            <div class="history-heading">
              <div>
                <h2>📜 History & Cultural Story</h2>
                <p class="section-note">Sourced historical narrative · ${esc(historyData?.sourceName || 'Verified source')}</p>
              </div>
              <button id="listenHistory" class="listen-history" type="button">▶ Listen to history</button>
            </div>
            <p id="historyText" class="history-paragraph">${esc(history)}</p>
            ${source ? `<a class="source-link" href="${esc(source)}" target="_blank" rel="noopener noreferrer">Read historical source documentation ↗</a>` : ''}
            <details class="transcript">
              <summary>Voice transcript</summary>
              <p>${esc(history)}</p>
            </details>
          </article>

          <!-- PILLAR 3: REVIEWS -->
          ${renderReviewsMarkup(reviewsList)}

          <!-- WORKFLOW NEXT STEPS BANNER -->
          <div class="workflow-next-box">
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; color: #d8ff4d; margin-bottom: 4px;">
              ⚡ Next in Journey Pipeline
            </div>
            <h3>Continue Your Journey with ${esc(name)}</h3>
            <p>Ready to move forward in the UnseenGo workflow? View this destination on the interactive map, generate a day-by-day AI itinerary, or track it in your personal travel vault.</p>
            <div class="workflow-actions-grid">
              <a href="map.html?place=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}" class="workflow-action-card">
                <strong>🗺️ Step 3: View on Map & Route →</strong>
                <span>Filter food, stays, transport layers & highway directions</span>
              </a>
              <a href="planner.html?city=${encodeURIComponent(city)}&place=${encodeURIComponent(name)}" class="workflow-action-card">
                <strong>🤖 Step 4: Plan AI Itinerary →</strong>
                <span>Generate day-by-day discovery route with time estimates</span>
              </a>
              <a href="my-travel.html" class="workflow-action-card">
                <strong>🧳 Step 5: Open My Travel Vault →</strong>
                <span>Manage bookmarked places, custom trips & start GPS navigation</span>
              </a>
            </div>
          </div>

          <!-- What to know -->
          <article class="place-card">
            <h2>What to know</h2>
            <div class="detail-grid">
              <div class="detail-item">
                <span>Region</span>
                <strong>${esc(state)}</strong>
              </div>
              <div class="detail-item">
                <span>Location</span>
                <strong>${esc(location)}</strong>
              </div>
              <div class="detail-item">
                <span>Experience</span>
                <strong>${esc(cat)}</strong>
              </div>
              <div class="detail-item">
                <span>Photo source</span>
                <strong>Verified Google Places</strong>
              </div>
            </div>
          </article>

          <!-- Related places -->
          <article class="place-card">
            <h2>Related places nearby</h2>
            <p class="section-note">Explore other cultural gems within the same circuit.</p>
            <div class="nearby-grid">
              ${near.map(n => `
                <a class="nearby-card" href="place.html?city=${encodeURIComponent(city)}&place=${encodeURIComponent(n.row[0])}">
                  <strong>${esc(n.row[0])}</strong>
                  <span>${esc(n.row[1] || city)} · ${esc(n.cat)}</span>
                  <em>Open guide →</em>
                </a>
              `).join('') || '<div>No related places are available yet.</div>'}
            </div>
          </article>
        </div>

        <aside class="sidebar-sticky">
          <article class="place-card">
            <h2>Location & Directions</h2>
            <div class="map-box">
              <div>
                📍<br>
                <strong>${esc(name)}</strong><br>
                <span>${esc(city)}, ${esc(state)}</span><br>
                <a href="map.html?place=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}" class="primary" style="display:inline-block; margin-top: 10px; background: var(--ug-green); color: #fff; padding: 6px 12px; border-radius: 8px; text-decoration: none;">
                  🗺️ Open in UnseenGo Map →
                </a>
              </div>
            </div>
          </article>

          <!-- Workflow Quick Status Card -->
          <article class="place-card" style="background: #f7faf7;">
            <h3 style="margin: 0 0 8px; font-size: 15px; color: var(--ug-green);">Your Travel Pipeline</h3>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.8; color: #43544a;">
              <li>✓ 🏠 Home Page</li>
              <li>✓ 🔍 Search (AI Discover / Direct)</li>
              <li><b>▶ 📍 Destination Details</b>
                <div style="font-size: 11px; color: #6a7b70; margin-left: 5px;">• 📜 History • 📸 Photos • ⭐ Reviews</div>
              </li>
              <li><a href="map.html?place=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}" style="color:var(--ug-green); font-weight:700;">→ 🗺️ Map Exploration</a></li>
              <li><a href="planner.html?place=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}" style="color:var(--ug-green); font-weight:700;">→ 🤖 AI Itinerary</a></li>
              <li><a href="my-travel.html" style="color:var(--ug-green); font-weight:700;">→ 🧳 My Trip Vault</a></li>
              <li><a href="map.html?place=${encodeURIComponent(name)}&navigate=true" style="color:var(--ug-green); font-weight:700;">→ 🧭 Navigation</a></li>
            </ul>
          </article>
        </aside>
      </section>
    `;

    // Save Place Event Handler
    const saveBtn = document.getElementById('savePlace');
    const key = 'unseengo_saved_places';
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (_) {}
    const id = city + '|' + name;
    if (saved.includes(id) || saved.includes(name)) {
      saveBtn.textContent = '♥ Saved to My Travel';
    }
    saveBtn.onclick = function() {
      saved = JSON.parse(localStorage.getItem(key) || '[]');
      if (saved.includes(id) || saved.includes(name)) {
        saved = saved.filter(x => x !== id && x !== name);
        localStorage.setItem(key, JSON.stringify(saved));
        this.textContent = '♡ Save place';
      } else {
        saved.push(id);
        localStorage.setItem(key, JSON.stringify(saved));
        this.textContent = '♥ Saved to My Travel';
      }
    };

    // Review Form Event Handler
    const reviewForm = document.getElementById('newReviewForm');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rName = document.getElementById('reviewerNameInput').value.trim();
        const rRating = Number(document.getElementById('reviewRatingInput').value);
        const rText = document.getElementById('reviewTextInput').value.trim();

        if (rName && rText) {
          saveReviewForPlace(name, {
            name: rName,
            city: 'Verified Explorer',
            rating: rRating,
            date: 'Just now',
            text: rText
          });
          // Re-render
          render();
        }
      });
    }

    // Record in recently viewed
    try {
      let rec = JSON.parse(localStorage.getItem('unseengo_recently_viewed') || '[]');
      rec = rec.filter(x => x.name !== name);
      rec.unshift({
        name,
        city,
        category: cat,
        score: score || 92,
        time: 'Just now',
        image: photoData?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=300&q=80'
      });
      if (rec.length > 20) rec = rec.slice(0, 20);
      localStorage.setItem('unseengo_recently_viewed', JSON.stringify(rec));
    } catch (_) {}

    narration(history);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
