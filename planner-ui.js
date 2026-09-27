/* UnseenGo AI — enhanced planner UI */
(function(){
  'use strict';

  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const INDIA_PLANNER_CITIES = [
    'Kurnool','Hyderabad','Vijayawada','Visakhapatnam','Tirupati','Guntur','Nellore','Rajahmundry',
    'Anantapur','Kadapa','Bengaluru','Mysuru','Mangaluru','Hubballi','Belagavi','Chennai','Madurai',
    'Coimbatore','Tiruchirappalli','Salem','Tirunelveli','Kochi','Thiruvananthapuram','Kozhikode',
    'Thrissur','Mumbai','Pune','Nagpur','Nashik','Aurangabad','Ahmedabad','Surat','Vadodara',
    'Jaipur','Jodhpur','Udaipur','Kota','Jaisalmer','Delhi','Agra','Varanasi','Lucknow','Kanpur',
    'Prayagraj','Amritsar','Chandigarh','Dehradun','Rishikesh','Shimla','Manali','Srinagar','Jammu',
    'Kolkata','Darjeeling','Bhubaneswar','Cuttack','Guwahati','Shillong','Patna','Ranchi','Bhopal',
    'Indore','Gwalior','Jabalpur','Raipur','Goa','Panaji','Pondicherry','Hampi','Ajmer','Mathura',
    'Haridwar','Nainital','Leh','Andaman Islands'
  ];

  function showToast(msg, duration = 3200) {
    let toast = $('plannerToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'plannerToast';
      toast.className = 'planner-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  function message(text, type = 'info') {
    const b = $('plannerMessage');
    if (b) {
      b.textContent = text;
      b.dataset.type = type;
      b.className = `planner-message ${type}`;
    }
  }

  async function loadRealDestinationData() {
    const client = window.unseenGoSupabase;
    if (!client) throw new Error('Supabase client unavailable');
    const { data, error } = await client
      .from('places')
      .select('id,city_id,name,category,description,history,latitude,longitude,map_url,is_hidden_gem,is_famous,is_active,source,source_url,verified_at,verification_status,crowd_level,budget_level,pace_level,photography_score,opening_time,closing_time,visit_duration_minutes,wheelchair_access,walking_distance_m,steps,road_access,parking_available,local_experience_score,data_quality_score,verification_notes,cities!inner(name,state)')
      .eq('is_active', true)
      .in('verification_status', ['verified', 'community_verified']);
    if (error) throw error;
    const grouped = {};
    for (const p of data || []) {
      const city = p.cities?.name;
      if (!city || p.latitude == null || p.longitude == null) continue;
      const category = p.category || 'Culture';
      const verification = {
        id: p.id,
        source: p.source,
        sourceUrl: p.source_url,
        verifiedAt: p.verified_at,
        verificationStatus: p.verification_status,
        crowdLevel: p.crowd_level,
        budgetLevel: p.budget_level,
        paceLevel: p.pace_level,
        photographyScore: p.photography_score,
        openingTime: p.opening_time,
        closingTime: p.closing_time,
        visitDurationMinutes: p.visit_duration_minutes,
        wheelchairAccess: p.wheelchair_access,
        walkingDistanceM: p.walking_distance_m,
        steps: p.steps,
        roadAccess: p.road_access,
        parkingAvailable: p.parking_available,
        localExperienceScore: p.local_experience_score,
        dataQualityScore: p.data_quality_score,
        verificationNotes: p.verification_notes
      };
      const baseScore = p.is_hidden_gem ? 90 : (p.is_famous ? 72 : 80);
      (grouped[city] ??= { region: p.cities?.state || '', places: [] }).places.push([
        p.name, city, baseScore, p.description || p.history || 'Verified destination.',
        Number(p.latitude), Number(p.longitude), verification,
        p.crowd_level, p.budget_level, p.pace_level, p.photography_score
      ]);
    }
    window.cities = grouped;
    window.UnseenGoRealData = {
      loadedAt: new Date().toISOString(),
      count: data?.length || 0,
      source: 'Supabase verified_places'
    };
    return grouped;
  }

  function setupCities() {
    const s = $('city');
    if (!s) return;
    let names = [];
    try {
      names = window.UnseenGoAI?.getCityNames?.() || [];
    } catch (_) {
      names = [];
    }
    names = [...new Set([...names, ...INDIA_PLANNER_CITIES])].filter(Boolean).sort((a, b) => a.localeCompare(b));
    s.replaceChildren(
      new Option('All available cities', ''),
      ...names.map(n => new Option(n, n))
    );

    const urlP = new URLSearchParams(location.search);
    const requested = urlP.get('city');
    const reqPlace = urlP.get('place');
    if (requested) {
      const match = names.find(n => n.toLowerCase() === requested.toLowerCase());
      if (match) {
        s.value = match;
        updateCityChips(match);
      }
    }
    if (reqPlace) {
      const t = $('intent');
      if (t && !t.value) {
        t.value = `Explore ${reqPlace} and surrounding heritage, scenic spots, and local food.`;
      }
    }
  }

  function updateCityChips(selectedCity) {
    document.querySelectorAll('.city-chip-btn').forEach(btn => {
      if (btn.dataset.city === selectedCity) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function showUnderstanding(p) {
    const box = $('aiUnderstanding'), tags = $('understoodTags');
    if (!box || !tags) return;
    const items = [
      `🎯 Focus: ${(p.interests.length ? p.interests : ['All experiences']).join(', ')}`,
      `📍 City: ${p.city || 'All available destinations'}`,
      `📅 Duration: ${p.days} Day${p.days === 1 ? '' : 's'}`,
      `⚡ Pace: ${p.pace.toUpperCase()}`,
      `💰 Budget: ${p.budget.toUpperCase()}`,
      `🛡️ Avoid: ${p.avoid.length ? p.avoid.join(', ') : 'None'}`
    ];
    tags.innerHTML = items.map(x => `<span class="tag-pill">${esc(x)}</span>`).join('');
    box.classList.add('show');
  }

  function loadSaved() {
    try { return JSON.parse(localStorage.getItem('unseengo-trip') || '[]'); } catch (_) { return []; }
  }

  async function savePlace(p) {
    const client = window.unseenGoSupabase;
    if (client) {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session && p.id) {
          const { error } = await client.from('saved_places').upsert(
            { user_id: session.user.id, place_id: p.id },
            { onConflict: 'user_id,place_id' }
          );
          if (!error) return true;
        }
      } catch (e) {
        console.warn('Supabase save failed', e);
      }
    }
    const trip = loadSaved();
    if (trip.some(x => x.name === p.name && x.city === p.city)) return false;
    trip.push({
      name: p.name,
      city: p.city,
      category: p.category,
      score: p.unseenScore,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem('unseengo-trip', JSON.stringify(trip));
    return true;
  }

  function pDays(result) {
    return result.requestedDays || 2;
  }

  function copyItineraryText(result, days) {
    const text = [
      `🌟 ${result.city || 'India'} ${pDays(result)}-Day Discovery Plan by UnseenGo AI`,
      `• Summary: ${result.summary}`,
      '',
      ...days.map(d => [
        `📅 DAY ${d.day}:`,
        ...d.places.map(p => `  • ${p.time || 'Visit'} — ${p.name} (${p.category})${p.distanceFromPreviousKm ? ` [${p.distanceFromPreviousKm} km transfer]` : ''}\n    Why: ${p.whyNow || p.why || 'Curated stop'}`),
        ''
      ].join('\n')),
      `🗺️ Navigation: ${$('mapLink')?.href || 'https://unseengo.ai'}`,
      'Crafted with UnseenGo AI (https://unseengo.ai)'
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      showToast('✓ Itinerary copied to clipboard!');
    }).catch(() => {
      showToast('Could not copy. Please select and copy manually.');
    });
  }

  function render(result) {
    const r = $('results'), cards = $('recommendations'), it = $('itinerary');
    if (!result.recommendations.length) {
      r.classList.remove('show');
      message(result.summary, 'warning');
      return;
    }

    $('resultTitle').textContent = `${result.city || 'India'} · AI Discovery Plan`;
    $('resultSummary').textContent = result.summary;

    // Render Recommendations Cards
    cards.innerHTML = result.recommendations.slice(0, 6).map((p, i) => `
      <article class="place-card">
        <div class="place-card-top">
          <span class="place-rank">#${i + 1}</span>
          <span class="place-category-badge">${esc(p.category)}</span>
          <div class="place-score-badge">
            <strong>${p.unseenScore}</strong>
            <small>/100</small>
          </div>
        </div>
        <div class="place-card-body">
          <h3 class="place-name">${esc(p.name)}</h3>
          <p class="place-location">📍 ${esc(p.location)}${result.city === 'All destinations' ? ` · ${esc(p.city)}` : ''}</p>
          <p class="place-description">${esc(p.description || '')}</p>
          
          <div class="score-breakdown-box">
            <div class="factor-row">
              <span>Hidden Gem Score</span>
              <b>${p.hiddenness}/25</b>
            </div>
            <div class="factor-row">
              <span>Cultural Authenticity</span>
              <b>${p.culturalValue}/20</b>
            </div>
            <div class="factor-row">
              <span>Focus Preference Match</span>
              <b>${p.interestMatch}/20</b>
            </div>
            <div class="factor-row">
              <span>Transit & Pacing Ease</span>
              <b>${p.travelEase}/10</b>
            </div>
            <div class="factor-row">
              <span>Local Experience Score</span>
              <b>${p.localExperience}/10</b>
            </div>
          </div>

          <div class="place-why-box">
            <b>✦ Why this place?</b>
            <p>${esc(p.why)}</p>
          </div>

          <div class="place-meta-footer">
            <span class="verified-tag">✓ Verified Record</span>
            <button class="add-trip-btn" type="button" data-name="${esc(p.name)}">
              <span>❤️</span> Add to Trip
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Optimize Route
    const route = window.UnseenGoRoute?.optimize(
      result.recommendations,
      pDays(result),
      window.UnseenGoPlannerPrefs?.pace || 'balanced',
      window.UnseenGoPlannerPrefs?.avoid || []
    ) || { optimized: false, days: result.itinerary, reason: 'Route engine unavailable.' };

    const days = route.optimized ? route.days : result.itinerary;

    // Render Itinerary Timeline
    it.innerHTML = `
      <div class="route-engine-banner">
        <div class="route-badge">
          <span>⚡</span>
          <b>${route.optimized ? 'Route & Time-Aware Itinerary' : 'Preference-Aware Itinerary'}</b>
        </div>
        <p>${route.optimized ? 'Chronologically sequenced by geographical proximity with opening hours and visit times validated.' : 'Standard sequence based on your preferences.'}</p>
      </div>
      <div class="timeline-container">
        ${days.map(d => `
          <div class="timeline-day-block">
            <div class="day-header">
              <span class="day-num-badge">DAY ${d.day}</span>
              <h4>Day ${d.day} Discovery Journey</h4>
            </div>
            <div class="timeline-stops">
              ${d.places.map((p, idx) => `
                <div class="timeline-stop-item">
                  <div class="stop-left">
                    <span class="stop-time-pill">${esc(p.time || 'Anytime')}</span>
                    <span class="stop-dot"></span>
                  </div>
                  <div class="stop-content">
                    <div class="stop-title-row">
                      <h5>${esc(p.name)}</h5>
                      <span class="stop-cat-tag">${esc(p.category)}</span>
                    </div>
                    ${p.distanceFromPreviousKm != null ? `
                      <div class="stop-transit-meta">
                        <span class="transit-chip">🚗 ~${p.distanceFromPreviousKm} km (${p.estimatedTravelMinutes || 15}m drive)</span>
                        ${p.estimatedVisitMinutes ? `<span class="transit-chip">⏱️ ${p.estimatedVisitMinutes} min visit</span>` : ''}
                        ${p.openingHoursApplied ? `<span class="transit-chip ${p.withinOpeningHours ? 'good' : 'warn'}">${p.withinOpeningHours ? '✓ Open during visit' : '⚠ Check venue hours'}</span>` : ''}
                      </div>
                    ` : ''}
                    <p class="stop-why"><strong>Why now:</strong> ${esc(p.whyNow || 'Optimal sequencing for this day.')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Map URL
    $('mapLink').href = window.UnseenGoRoute?.mapsUrl(route.places || result.recommendations) || result.mapsUrl;

    // Save Itinerary Handler
    const saveBtn = $('saveItineraryBtn'), saveMsg = $('saveItinMsg'), openTravelBtn = $('openMyTravelBtn');
    if (saveBtn) {
      saveBtn.innerHTML = '<span>❤️</span> Save Itinerary to My Travel';
      saveBtn.onclick = () => {
        let savedItins = [];
        try { savedItins = JSON.parse(localStorage.getItem('unseengo_saved_itineraries') || '[]'); } catch (_) {}
        const newItin = {
          id: 'itin-' + Date.now(),
          title: `${result.city || 'India'} ${pDays(result)}-Day AI Journey`,
          pace: window.UnseenGoPlannerPrefs?.pace || 'Balanced',
          budget: window.UnseenGoPlannerPrefs?.budget === 'low' ? 'Budget-Friendly' : (window.UnseenGoPlannerPrefs?.budget === 'high' ? 'Premium' : 'Comfort'),
          days: days.map(d => ({
            dayNum: d.day,
            title: `Day ${d.day}: ${d.places?.[0]?.name || 'Exploration'}`,
            stops: (d.places || []).map(p => ({
              time: p.time || 'Morning',
              name: p.name,
              note: p.whyNow || p.category || 'Curated stop'
            }))
          }))
        };
        savedItins.unshift(newItin);
        localStorage.setItem('unseengo_saved_itineraries', JSON.stringify(savedItins));

        let trips = [];
        try { trips = JSON.parse(localStorage.getItem('unseengo_custom_trips') || '[]'); } catch (_) {}
        trips.unshift({
          id: 'trip-' + Date.now(),
          title: newItin.title,
          destination: result.city || 'India',
          days: String(pDays(result)),
          notes: `AI Generated Itinerary (${newItin.pace} pace, ${newItin.budget} budget).`,
          created: 'Just now'
        });
        localStorage.setItem('unseengo_custom_trips', JSON.stringify(trips));

        showToast('✓ Saved to My Travel! Click "Open in My Travel" to view your trip.');
        if (saveMsg) {
          saveMsg.innerHTML = '✓ Saved! <a href="my-travel.html?tab=itineraries" style="color:var(--ug-lime);font-weight:700;text-decoration:underline;">Open in My Travel (Step 5) ↗</a>';
          saveMsg.style.display = 'inline-block';
        }
        if (openTravelBtn) {
          openTravelBtn.style.display = 'inline-flex';
        }
        saveBtn.innerHTML = '<span>♥</span> Saved to My Travel';
      };
    }

    // Copy itinerary button
    const copyBtn = $('copyItineraryBtn');
    if (copyBtn) {
      copyBtn.onclick = () => copyItineraryText(result, days);
    }

    // Print itinerary button
    const printBtn = $('printItineraryBtn');
    if (printBtn) {
      printBtn.onclick = () => window.print();
    }

    // Tab buttons handling
    setupResultsTabs();

    // Show results
    r.classList.add('show');

    // Individual Add to trip buttons
    cards.querySelectorAll('.add-trip-btn').forEach(b => {
      b.addEventListener('click', async () => {
        const p = result.recommendations.find(x => x.name === b.dataset.name);
        if (p) {
          b.disabled = true;
          b.textContent = 'Saving…';
          const ok = await savePlace(p);
          b.innerHTML = ok ? '✓ Saved' : '✓ In Trip';
          showToast(ok ? `✓ Added ${p.name} to My Travel` : `${p.name} is already in your trip`);
        }
      });
    });

    r.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setupResultsTabs() {
    const tabBtns = document.querySelectorAll('.results-tab-btn');
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabKey = btn.dataset.tab;
        document.querySelectorAll('.tab-content-pane').forEach(pane => {
          if (pane.id === `tabPane-${tabKey}`) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      };
    });
  }

  function showDeterministicExplanation(result, p) {
    const box = $('aiExplanation'), text = $('aiExplanationText');
    if (!box || !text) return;
    box.classList.add('show');
    const top = result.recommendations.slice(0, 3).map(x => `${x.name} (${x.unseenScore}/100)`).join(', ');
    text.innerHTML = `These destinations were calculated for your <strong>${p.interests?.length ? p.interests.join(' & ') + ' focus' : 'interests'}</strong>, <strong>${p.pace} pace</strong>, and <strong>${p.budget} budget</strong>. Top matching hidden gems: <em>${top || 'none available'}</em>. Rankings combine historical importance, architectural uniqueness, road accessibility, and verified traveler reviews.`;
    message('✓ UnseenGo generated a realistic, interest-focused discovery plan from verified destinations.', 'success');
  }

  function setupInteractiveControls() {
    // Duration pill selectors
    document.querySelectorAll('.duration-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.duration-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const daysVal = pill.dataset.days;
        if ($('days')) $('days').value = daysVal;
      });
    });

    // Pace selector cards
    document.querySelectorAll('.pace-card-choice').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.pace-card-choice').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const paceVal = card.dataset.pace;
        if ($('pace')) $('pace').value = paceVal;
      });
    });

    // Budget selector cards
    document.querySelectorAll('.budget-card-choice').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.budget-card-choice').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const budgetVal = card.dataset.budget;
        if ($('budget')) $('budget').value = budgetVal;
      });
    });

    // Quick City chips
    document.querySelectorAll('.city-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const cityVal = chip.dataset.city;
        const s = $('city');
        if (s) {
          s.value = cityVal;
          updateCityChips(cityVal);
        }
      });
    });

    // Select change updates city chips
    const citySelect = $('city');
    if (citySelect) {
      citySelect.addEventListener('change', () => {
        updateCityChips(citySelect.value);
      });
    }

    // Select All / Clear Interests
    const selectAllBtn = $('selectAllInterests');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        const inputs = document.querySelectorAll('input[name="focus"]');
        const allChecked = [...inputs].every(i => i.checked);
        inputs.forEach(i => i.checked = !allChecked);
        selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
        updateInterestCount();
      });
    }

    document.querySelectorAll('input[name="focus"]').forEach(input => {
      input.addEventListener('change', updateInterestCount);
    });

    function updateInterestCount() {
      const count = document.querySelectorAll('input[name="focus"]:checked').length;
      const counter = $('interestCounter');
      if (counter) {
        counter.textContent = count ? `${count} selected` : 'None selected';
      }
    }
    updateInterestCount();

    // Quick prompts
    document.querySelectorAll('[data-prompt]').forEach(b => {
      b.addEventListener('click', () => {
        const t = $('intent');
        if (t) {
          t.value = b.dataset.prompt;
          t.focus();
          // Visual highlight
          t.style.borderColor = 'var(--ug-lime)';
          setTimeout(() => t.style.borderColor = '', 1200);
        }
      });
    });
  }

  async function init() {
    const city = $('city'), generate = $('generate');
    if (!city || !generate || !window.UnseenGoAI) return;

    setupInteractiveControls();

    generate.disabled = true;
    generate.innerHTML = '<span class="spin">✦</span> Loading destinations…';
    setupCities();

    try {
      await loadRealDestinationData();
      setupCities();
      message(`✓ Ready — ${city.options.length - 1} Indian destinations loaded.`, 'success');
    } catch (e) {
      console.error(e);
      setupCities();
      message('✓ Indian destinations catalog ready. Local discovery engine active.', 'info');
    } finally {
      generate.disabled = false;
      generate.innerHTML = '<span>✦</span> Generate My AI Discovery Plan';
    }

    generate.addEventListener('click', () => {
      let p = {
        city: city.value,
        days: Number($('days')?.value || 2),
        budget: $('budget')?.value || 'medium',
        pace: $('pace')?.value || 'balanced',
        interests: [...document.querySelectorAll('input[name="focus"]:checked')].map(x => x.value),
        avoid: [...document.querySelectorAll('.avoid-item input:checked')].map(x => x.value),
        diversify: $('diversify')?.checked || false
      };

      const intent = $('intent')?.value.trim();
      if (intent) {
        const n = window.UnseenGoAI.parseNaturalLanguage(intent);
        p = {
          ...p,
          ...n,
          city: p.city || n.city || '',
          interests: [...new Set([...p.interests, ...n.interests])],
          avoid: [...new Set([...p.avoid, ...n.avoid])],
          diversify: $('diversify')?.checked || false
        };
        if (n.city && !p.city) {
          city.value = n.city;
          updateCityChips(n.city);
        }
        if (n.days) {
          p.days = n.days;
          if ($('days')) $('days').value = n.days;
          document.querySelectorAll('.duration-pill').forEach(pill => {
            if (pill.dataset.days === String(n.days)) pill.classList.add('active');
            else pill.classList.remove('active');
          });
        }
      }

      if (!p.interests.length && !intent) {
        message('Please select at least one exploration focus (e.g. Temples, Forts, Nature, Food).', 'warning');
        $('results').classList.remove('show');
        showToast('⚠️ Please select at least one interest to start.');
        return;
      }

      showUnderstanding(p);
      window.UnseenGoPlannerPrefs = p;

      generate.disabled = true;
      generate.innerHTML = '<span class="spin">✦</span> Crafting your personalized plan…';

      setTimeout(() => {
        try {
          const result = window.UnseenGoAI.generate(p.city, p);
          render(result);
          if (result.recommendations.length) {
            showDeterministicExplanation(result, p);
          }
        } catch (e) {
          console.error(e);
          message('Could not build the discovery plan. Please try again.', 'error');
          showToast('❌ Error building plan. Please adjust your criteria.');
        } finally {
          generate.disabled = false;
          generate.innerHTML = '<span>✦</span> Generate My AI Discovery Plan';
        }
      }, 350);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
