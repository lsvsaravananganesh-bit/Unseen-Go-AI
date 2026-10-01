/* UnseenGo AI — Feature #40: Weekend Getaway Mode
 * Pure vanilla JS. No external dependencies.
 * Factual distances sourced from approximate road distances.
 */
(function () {
  'use strict';

  // ─── Factual distance/time data (approximate road distances) ──────────────
  const GETAWAY_DATA = {
    Hyderabad: [
      {
        name: 'Nagarjuna Sagar',
        emoji: '🏛️',
        distance: '150 km',
        time: '2.5 hr',
        transport: 'Car / State Bus (TSRTC)',
        category: ['Nature', 'History', 'Spiritual'],
        activities: ['Visit the dam viewpoint', 'Explore Nagarjunakonda island museum', 'Buddhist stupa ruins walk', 'Evening boat ride on Krishna reservoir'],
        budget: { budget: '₹800–1,200/person', moderate: '₹1,500–2,500/person', premium: '₹3,000–5,000/person' },
        budgetDetails: { budget: 'State buses + dorm/budget lodge', moderate: 'Cab + mid-range hotel + meals', premium: 'Private car + resort stay + guided tour' }
      },
      {
        name: 'Belum Caves',
        emoji: '🦇',
        distance: '340 km',
        time: '5.5 hr',
        transport: 'Car / Overnight bus',
        category: ['Nature', 'Adventure'],
        activities: ['Spelunking through 3.5 km cave passages', 'Limestone stalactite and stalagmite viewing', 'Photography of subterranean chambers', 'Visit nearby Yaganti temple (30 km further)'],
        budget: { budget: '₹1,200–2,000/person', moderate: '₹2,500–4,000/person', premium: '₹5,000–8,000/person' },
        budgetDetails: { budget: 'Bus + budget guesthouse + local meals', moderate: 'Pooled car + hotel + restaurant', premium: 'Private cab + heritage stay' }
      },
      {
        name: 'Gandikota',
        emoji: '🏯',
        distance: '370 km',
        time: '6 hr',
        transport: 'Car / Overnight train + local cab',
        category: ['History', 'Adventure', 'Nature'],
        activities: ['Canyon rim sunrise walk', 'Fort ruins exploration', 'Camping by the Penna gorge', 'Photography at the "Grand Canyon of India"'],
        budget: { budget: '₹1,500–2,500/person', moderate: '₹3,000–5,000/person', premium: '₹6,000–10,000/person' },
        budgetDetails: { budget: 'Bus + tent camping (AP Tourism)', moderate: 'Car + AP Tourism cottages', premium: 'Private cab + glamping setup' }
      },
      {
        name: 'Hampi',
        emoji: '🗿',
        distance: '375 km',
        time: '6 hr',
        transport: 'Car / Overnight train (Hospet Junction)',
        category: ['History', 'Culture', 'Adventure'],
        activities: ['Vitthala Temple musical pillars', 'Coracle ride on Tungabhadra', 'Matanga Hill sunrise trek', 'Anegundi village walk'],
        budget: { budget: '₹1,200–2,000/person', moderate: '₹2,500–4,500/person', premium: '₹5,000–9,000/person' },
        budgetDetails: { budget: 'Train + guesthouse + local food', moderate: 'Car + heritage guesthouse', premium: 'Private car + boutique stay' }
      },
      {
        name: 'Araku Valley',
        emoji: '🏞️',
        distance: '680 km',
        time: '10 hr',
        transport: 'Overnight train (Visakhapatnam Araku Toy Train)',
        category: ['Nature', 'Culture', 'Food'],
        activities: ['Araku Valley scenic train journey', 'Tribal museum visit', 'Coffee estate tour', 'Waterfalls and valley viewpoints'],
        budget: { budget: '₹2,000–3,000/person', moderate: '₹4,000–6,000/person', premium: '₹8,000–12,000/person' },
        budgetDetails: { budget: 'Train + tribal guesthouse', moderate: 'Train + resort + guided activities', premium: 'AC cab + premium resort + curated tour' }
      }
    ],
    Bengaluru: [
      {
        name: 'Nandi Hills',
        emoji: '⛰️',
        distance: '60 km',
        time: '1 hr',
        transport: 'Car / Bike',
        category: ['Nature', 'Adventure'],
        activities: ['Sunrise viewpoint at Brahmashrama', 'Tipu Sultan\'s summer palace walk', 'Fort ruins exploration', 'Paragliding (seasonal)'],
        budget: { budget: '₹500–800/person', moderate: '₹1,200–2,000/person', premium: '₹2,500–4,000/person' },
        budgetDetails: { budget: 'Day trip by bike/bus', moderate: 'Car day trip + good lunch', premium: 'Overnight resort at foothills' }
      },
      {
        name: 'Lepakshi',
        emoji: '🛕',
        distance: '120 km',
        time: '2.5 hr',
        transport: 'Car / KSRTC Bus',
        category: ['History', 'Culture', 'Spiritual'],
        activities: ['Hanging pillar wonder', 'Colossal monolithic Nandi (tallest in India)', 'Intricate Vijayanagara ceiling murals', 'Local handicraft market'],
        budget: { budget: '₹600–1,000/person', moderate: '₹1,500–2,500/person', premium: '₹3,000–5,000/person' },
        budgetDetails: { budget: 'Day trip by bus + packed meals', moderate: 'Car day trip + restaurant lunch', premium: 'Private cab + guided art tour' }
      },
      {
        name: 'Coorg',
        emoji: '🌿',
        distance: '270 km',
        time: '5 hr',
        transport: 'Car / KSRTC Volvo Bus',
        category: ['Nature', 'Food', 'Culture'],
        activities: ['Abbey Falls trek', 'Coffee and spice plantation tour', 'Raja\'s Seat sunset', 'Namdroling Monastery (Golden Temple)'],
        budget: { budget: '₹1,500–2,500/person', moderate: '₹3,500–6,000/person', premium: '₹8,000–15,000/person' },
        budgetDetails: { budget: 'Bus + homestay + local meals', moderate: 'Car + mid-range homestay', premium: 'Private car + luxury plantation stay' }
      },
      {
        name: 'Hampi',
        emoji: '🗿',
        distance: '340 km',
        time: '6 hr',
        transport: 'Car / Overnight bus / Train to Hospet',
        category: ['History', 'Culture', 'Adventure'],
        activities: ['Vitthala Temple stone chariot', 'Sanapur Lake coracle ride', 'Matanga Hill trek', 'Bazaar ruins walk'],
        budget: { budget: '₹1,200–2,000/person', moderate: '₹2,500–4,500/person', premium: '₹5,000–9,000/person' },
        budgetDetails: { budget: 'Bus + guesthouse + street food', moderate: 'Car + heritage lodge', premium: 'Private cab + boutique resort' }
      },
      {
        name: 'Agumbe',
        emoji: '🌧️',
        distance: '360 km',
        time: '6 hr',
        transport: 'Car',
        category: ['Nature', 'Adventure'],
        activities: ['Rainforest canopy trail', 'King cobra habitat walk (guided)', 'Barkana Waterfalls hike', 'Sunset point at Agumbe Ghat'],
        budget: { budget: '₹1,500–2,500/person', moderate: '₹3,000–5,000/person', premium: '₹6,000–10,000/person' },
        budgetDetails: { budget: 'Car pool + budget homestay', moderate: 'Car + nature homestay', premium: 'Private car + eco-lodge package' }
      }
    ],
    Chennai: [
      {
        name: 'Mahabalipuram',
        emoji: '🗿',
        distance: '50 km',
        time: '1 hr',
        transport: 'Car / MTC Bus / MRTS + Auto',
        category: ['History', 'Culture', 'Nature'],
        activities: ['Shore Temple sunrise', 'Arjuna\'s Penance rock carving', 'Five Rathas (rock-cut chariots)', 'Beach and seafood lunch'],
        budget: { budget: '₹400–700/person', moderate: '₹1,200–2,000/person', premium: '₹3,000–5,000/person' },
        budgetDetails: { budget: 'Day trip by bus + street food', moderate: 'Car + beachside restaurant', premium: 'Private cab + boutique resort' }
      },
      {
        name: 'Vellore',
        emoji: '🏰',
        distance: '145 km',
        time: '2.5 hr',
        transport: 'Car / SETC Bus / Train',
        category: ['History', 'Spiritual', 'Culture'],
        activities: ['Vellore Fort and moat walk', 'Jalakandeswarar Temple inside fort', 'Golden Temple (Sri Narayani Peedam)', 'Archaeological museum'],
        budget: { budget: '₹500–900/person', moderate: '₹1,500–2,500/person', premium: '₹3,000–5,500/person' },
        budgetDetails: { budget: 'Bus + budget lodging', moderate: 'Car + mid-range hotel + meals', premium: 'Private cab + quality hotel' }
      },
      {
        name: 'Pondicherry',
        emoji: '🇫🇷',
        distance: '150 km',
        time: '3 hr',
        transport: 'Car / SETC Bus / Train',
        category: ['Culture', 'Food', 'History'],
        activities: ['French Quarter heritage walk', 'Aurobindo Ashram visit', 'Promenade Beach sunrise', 'Seaside café and fusion cuisine'],
        budget: { budget: '₹1,000–1,800/person', moderate: '₹2,500–4,500/person', premium: '₹5,000–10,000/person' },
        budgetDetails: { budget: 'Bus + budget guesthouse', moderate: 'Car + French Quarter hotel', premium: 'Private cab + heritage boutique hotel' }
      },
      {
        name: 'Yelagiri',
        emoji: '🏔️',
        distance: '240 km',
        time: '4 hr',
        transport: 'Car / SETC Bus',
        category: ['Nature', 'Adventure'],
        activities: ['Swamimalai Hill trek', 'Punganoor Lake boating', 'Jalagamparai Waterfalls', 'Rose garden and orchid farm'],
        budget: { budget: '₹800–1,500/person', moderate: '₹2,000–3,500/person', premium: '₹4,000–7,000/person' },
        budgetDetails: { budget: 'Bus + budget resort', moderate: 'Car + mid-range hill resort', premium: 'Private car + premium resort' }
      }
    ],
    Kurnool: [
      {
        name: 'Belum Caves',
        emoji: '🦇',
        distance: '75 km',
        time: '1.5 hr',
        transport: 'Car / Local Bus (via Owk)',
        category: ['Nature', 'Adventure'],
        activities: ['Subterranean cave exploration', 'Stalactite & stalagmite corridors', 'Cave photography', 'Nearby Yaganti temple combo visit'],
        budget: { budget: '₹400–700/person', moderate: '₹1,000–1,800/person', premium: '₹2,500–4,000/person' },
        budgetDetails: { budget: 'Day trip by local bus', moderate: 'Car day trip + meals', premium: 'Private cab + overnight stay' }
      },
      {
        name: 'Gandikota',
        emoji: '🏯',
        distance: '85 km',
        time: '1.5 hr',
        transport: 'Car / AP Tourism Bus',
        category: ['History', 'Adventure', 'Nature'],
        activities: ['Canyon sunrise from fort ramparts', 'Fort ruins exploration (13th century)', 'Camping by Penna gorge', 'Sunset photography at the gorge viewpoint'],
        budget: { budget: '₹500–900/person', moderate: '₹1,500–2,500/person', premium: '₹3,000–5,000/person' },
        budgetDetails: { budget: 'AP Tourism package (budget tent)', moderate: 'Car + AP Tourism cottages', premium: 'Private cab + glamping' }
      },
      {
        name: 'Yaganti',
        emoji: '🪔',
        distance: '80 km',
        time: '1.5 hr',
        transport: 'Car / Local Bus',
        category: ['Spiritual', 'History', 'Nature'],
        activities: ['Uma Maheshwara cave temple darshan', 'Growing Nandi monolith viewing', 'Pushkarani sacred pond walk', 'Nearby Orvakal Rock Garden (40 km)'],
        budget: { budget: '₹350–600/person', moderate: '₹900–1,500/person', premium: '₹2,000–3,500/person' },
        budgetDetails: { budget: 'Day trip by bus', moderate: 'Car day trip + temple meals', premium: 'Private cab + village homestay' }
      },
      {
        name: 'Srisailam',
        emoji: '🔱',
        distance: '180 km',
        time: '3 hr',
        transport: 'Car / AP Tourism Bus',
        category: ['Spiritual', 'Nature', 'Adventure'],
        activities: ['Mallikarjuna Jyotirlinga temple', 'Boat ride on Krishna Gorge', 'Akkamahadevi caves trek', 'Nallamala forest wildlife zone'],
        budget: { budget: '₹700–1,200/person', moderate: '₹1,800–3,000/person', premium: '₹4,000–6,500/person' },
        budgetDetails: { budget: 'Bus + dharamshala stay', moderate: 'Car + AP Tourism guest house', premium: 'Private cab + heritage hotel' }
      }
    ],
    Mumbai: [
      {
        name: 'Matheran',
        emoji: '🌿',
        distance: '90 km',
        time: '2.5 hr',
        transport: 'Car + Toy Train (from Neral)',
        category: ['Nature', 'Adventure'],
        activities: ['Echo Point sunrise', 'Panorama Point viewpoint', 'Toy train ride', 'Horse riding through forest paths'],
        budget: { budget: '₹700–1,200/person', moderate: '₹2,000–3,500/person', premium: '₹4,500–8,000/person' },
        budgetDetails: { budget: 'Train + budget lodge', moderate: 'Car + mid-range resort', premium: 'Private car + heritage hotel' }
      },
      {
        name: 'Alibaug',
        emoji: '🏖️',
        distance: '100 km',
        time: '2 hr (via ferry: 1 hr)',
        transport: 'Car / Ferry from Gateway of India',
        category: ['Nature', 'History'],
        activities: ['Kolaba Fort (accessible at low tide)', 'Alibaug beach walk', 'Varsoli and Nagaon beaches', 'Seafood lunch at beachside shacks'],
        budget: { budget: '₹800–1,400/person', moderate: '₹2,200–4,000/person', premium: '₹5,000–9,000/person' },
        budgetDetails: { budget: 'Ferry + budget beach stay', moderate: 'Ferry + sea-facing hotel', premium: 'Private car + beach resort' }
      },
      {
        name: 'Lonavala',
        emoji: '🌧️',
        distance: '80 km',
        time: '1.5 hr',
        transport: 'Car / Train (Central Railway)',
        category: ['Nature', 'Adventure'],
        activities: ['Tiger Point & Rajmachi viewpoint', 'Bhushi Dam waterfall walk', 'Karla and Bhaja caves', 'Chikki and fudge shopping'],
        budget: { budget: '₹600–1,000/person', moderate: '₹1,500–3,000/person', premium: '₹4,000–7,500/person' },
        budgetDetails: { budget: 'Train + budget resort', moderate: 'Car + mid-range hotel', premium: 'Private car + hill resort' }
      }
    ],
    Delhi: [
      {
        name: 'Agra',
        emoji: '🕌',
        distance: '200 km',
        time: '3 hr',
        transport: 'Car / Gatimaan Express (1.5 hr)',
        category: ['History', 'Culture'],
        activities: ['Taj Mahal sunrise visit', 'Agra Fort exploration', 'Mehtab Bagh moonlight view', 'Mughlai cuisine experience'],
        budget: { budget: '₹1,000–1,800/person', moderate: '₹2,500–4,500/person', premium: '₹6,000–12,000/person' },
        budgetDetails: { budget: 'Train + budget lodge', moderate: 'Car + heritage hotel + meals', premium: 'Premium train + 5-star hotel' }
      },
      {
        name: 'Rishikesh',
        emoji: '🕉️',
        distance: '240 km',
        time: '5 hr',
        transport: 'Car / Volvo Bus / Train to Haridwar + cab',
        category: ['Spiritual', 'Adventure', 'Nature'],
        activities: ['Ganga Aarti at Triveni Ghat', 'River rafting on Ganga', 'Beatles Ashram walk', 'Lakshman Jhula bridge'],
        budget: { budget: '₹1,200–2,000/person', moderate: '₹2,800–5,000/person', premium: '₹6,000–11,000/person' },
        budgetDetails: { budget: 'Bus + ashram stay + local food', moderate: 'Car + guesthouse + activities', premium: 'Private car + riverside resort' }
      },
      {
        name: 'Mathura & Vrindavan',
        emoji: '🪔',
        distance: '160 km',
        time: '2.5 hr',
        transport: 'Car / Train',
        category: ['Spiritual', 'Culture'],
        activities: ['Banke Bihari Temple darshan', 'ISKCON temple visit', 'Prem Mandir evening lights', 'Mathura ghats walk'],
        budget: { budget: '₹700–1,200/person', moderate: '₹1,800–3,000/person', premium: '₹4,000–7,000/person' },
        budgetDetails: { budget: 'Train + dharamshala', moderate: 'Car + budget hotel', premium: 'Private cab + quality hotel' }
      }
    ],
    Tirupati: [
      {
        name: 'Mahabalipuram',
        emoji: '🗿',
        distance: '170 km',
        time: '3 hr',
        transport: 'Car / Bus',
        category: ['History', 'Culture', 'Nature'],
        activities: ['Shore Temple UNESCO site', 'Arjuna\'s Penance carving', 'Five Rathas', 'Beach walk'],
        budget: { budget: '₹600–1,000/person', moderate: '₹1,800–3,000/person', premium: '₹3,500–6,000/person' },
        budgetDetails: { budget: 'Bus + budget stay', moderate: 'Car + mid-range hotel', premium: 'Private cab + boutique resort' }
      },
      {
        name: 'Vellore',
        emoji: '🏰',
        distance: '100 km',
        time: '2 hr',
        transport: 'Car / Bus / Train',
        category: ['History', 'Spiritual'],
        activities: ['Vellore Fort walk', 'Jalakandeswarar Temple', 'Golden Temple (Sri Narayani Peedam)', 'Fort Museum'],
        budget: { budget: '₹400–700/person', moderate: '₹1,200–2,000/person', premium: '₹2,500–4,000/person' },
        budgetDetails: { budget: 'Bus day trip', moderate: 'Car + good restaurant', premium: 'Private cab + quality hotel' }
      }
    ],
    Vijayawada: [
      {
        name: 'Nagarjuna Sagar',
        emoji: '🏛️',
        distance: '150 km',
        time: '2.5 hr',
        transport: 'Car / State Bus',
        category: ['History', 'Nature', 'Spiritual'],
        activities: ['Dam viewpoint', 'Nagarjunakonda island museum (Buddhist ruins)', 'Boat ride on reservoir', 'Ethipothala Waterfall (45 km further)'],
        budget: { budget: '₹700–1,200/person', moderate: '₹1,800–3,000/person', premium: '₹3,500–6,000/person' },
        budgetDetails: { budget: 'State bus + budget lodge', moderate: 'Car + guesthouse + meals', premium: 'Private car + AP Tourism resort' }
      },
      {
        name: 'Amaravati',
        emoji: '🕌',
        distance: '40 km',
        time: '1 hr',
        transport: 'Car / Local Bus',
        category: ['History', 'Spiritual', 'Culture'],
        activities: ['Amaravati Archaeological Museum', 'Dhyana Buddha statue', 'Amaralingeswaraswamy Temple', 'Stupa remains walk'],
        budget: { budget: '₹300–600/person', moderate: '₹900–1,500/person', premium: '₹2,000–3,500/person' },
        budgetDetails: { budget: 'Day trip by bus', moderate: 'Car day trip + lunch', premium: 'Private car + restaurant meals' }
      }
    ]
  };

  // Budget ranges in rupees per person per day (approx)
  const BUDGET_RANGES = {
    Budget: { accommodation: '₹300–600', food: '₹150–250', travel: '₹200–400', misc: '₹100–200' },
    Moderate: { accommodation: '₹800–1,500', food: '₹400–700', travel: '₹500–900', misc: '₹250–450' },
    Premium: { accommodation: '₹2,500–5,000', food: '₹900–1,500', travel: '₹1,200–2,000', misc: '₹500–1,000' }
  };

  // ─── Main init ──────────────────────────────────────────────────────────────
  function initWeekendGetaway() {
    const tab    = document.getElementById('wgTab');
    const panel  = document.getElementById('wgPanel');
    const form   = document.getElementById('wgForm');
    const output = document.getElementById('wgOutput');

    if (!tab || !panel || !form || !output) return;

    // Tab switching
    tab.addEventListener('click', () => {
      // Deactivate all planner mode tabs
      document.querySelectorAll('.planner-mode-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.planner-mode-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      panel.classList.add('active');
    });

    // Interest chip toggling
    panel.querySelectorAll('.wg-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
      });
    });

    // Duration pills
    panel.querySelectorAll('.wg-duration-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        panel.querySelectorAll('.wg-duration-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      generateGetaway();
    });

    function generateGetaway() {
      const origin   = form.querySelector('#wgOrigin').value;
      const days     = parseInt(panel.querySelector('.wg-duration-pill.active')?.dataset.days || '2', 10);
      const budget   = form.querySelector('#wgBudget').value;
      const interests = [...panel.querySelectorAll('.wg-chip.active')].map(c => c.dataset.interest);

      if (!origin) {
        showWgError('Please select your starting location.');
        return;
      }

      const pool = GETAWAY_DATA[origin] || [];
      if (!pool.length) {
        showWgError('No getaway data available for this starting location yet. Try Hyderabad, Bengaluru, Kurnool or Chennai.');
        return;
      }

      // Filter by interests (if any selected), fall back to full pool
      let candidates = pool;
      if (interests.length) {
        candidates = pool.filter(dest =>
          interests.some(i => dest.category.includes(i))
        );
        if (!candidates.length) candidates = pool; // fallback
      }

      // Pick top 3 (score by interest match count)
      const scored = candidates.map(dest => ({
        dest,
        score: interests.length ? interests.filter(i => dest.category.includes(i)).length : 0
      }));
      scored.sort((a, b) => b.score - a.score);
      const picks = scored.slice(0, 3).map(s => s.dest);

      renderGetawayResults(picks, { origin, days, budget, interests });
    }

    function renderGetawayResults(picks, params) {
      const budgetKey = params.budget; // 'Budget' | 'Moderate' | 'Premium'
      const budgetRanges = BUDGET_RANGES[budgetKey] || BUDGET_RANGES.Moderate;

      output.innerHTML = `
        <div class="wg-results-header">
          <div class="wg-results-label">✦ AI GENERATED · DISTANCES ARE APPROXIMATE ROAD ESTIMATES</div>
          <h3 class="wg-results-title">🏕️ Your Weekend Getaway Options from ${params.origin}</h3>
          <p class="wg-results-sub">${params.days}-day trip · ${params.budget} budget · ${params.interests.length ? params.interests.join(', ') : 'All interests'}</p>
        </div>

        <div class="wg-cards-grid">
          ${picks.map((dest, idx) => renderDestCard(dest, idx, budgetKey, budgetRanges, params.days)).join('')}
        </div>

        <div class="wg-budget-summary">
          <div class="wg-budget-title">💰 Estimated Budget Breakdown (per person · ${params.days} day${params.days > 1 ? 's' : ''})</div>
          <div class="wg-budget-grid">
            <div class="wg-budget-item">
              <span class="wg-budget-icon">🏠</span>
              <div class="wg-budget-detail">
                <span class="wg-budget-label">Accommodation/night</span>
                <span class="wg-budget-value">${budgetRanges.accommodation}</span>
              </div>
            </div>
            <div class="wg-budget-item">
              <span class="wg-budget-icon">🍛</span>
              <div class="wg-budget-detail">
                <span class="wg-budget-label">Meals/day</span>
                <span class="wg-budget-value">${budgetRanges.food}</span>
              </div>
            </div>
            <div class="wg-budget-item">
              <span class="wg-budget-icon">🚗</span>
              <div class="wg-budget-detail">
                <span class="wg-budget-label">Local transport/day</span>
                <span class="wg-budget-value">${budgetRanges.travel}</span>
              </div>
            </div>
            <div class="wg-budget-item">
              <span class="wg-budget-icon">🎟️</span>
              <div class="wg-budget-detail">
                <span class="wg-budget-label">Entry fees & misc/day</span>
                <span class="wg-budget-value">${budgetRanges.misc}</span>
              </div>
            </div>
          </div>
          <p class="wg-budget-note">⚠ NEEDS VERIFICATION — Budget estimates are ✦ AI GENERATED approximations. Prices vary by season, group size, and actual availability. Always verify before booking.</p>
        </div>
      `;

      output.style.display = 'block';
      output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function renderDestCard(dest, idx, budgetKey, ranges, days) {
      const destBudget = dest.budget?.[budgetKey.toLowerCase()] || 'Varies';
      const destBudgetDetail = dest.budgetDetails?.[budgetKey.toLowerCase()] || '';
      const activitiesToShow = days === 1
        ? dest.activities.slice(0, 2)
        : days === 2
          ? dest.activities.slice(0, 3)
          : dest.activities;

      const catBadges = dest.category.map(c =>
        `<span class="wg-cat-badge">${c}</span>`
      ).join('');

      return `
        <div class="wg-dest-card">
          <div class="wg-dest-rank">${idx + 1}</div>
          <div class="wg-dest-header">
            <div class="wg-dest-emoji">${dest.emoji}</div>
            <div class="wg-dest-info">
              <h4 class="wg-dest-name">${dest.name}</h4>
              <div class="wg-dest-meta">
                <span class="wg-dist-badge">📍 ${dest.distance}</span>
                <span class="wg-time-badge">⏱ ${dest.time}</span>
              </div>
            </div>
          </div>

          <div class="wg-dest-transport">
            <span class="wg-transport-label">🚗 How to get there:</span>
            <span class="wg-transport-value">${dest.transport}</span>
          </div>

          <div class="wg-dest-cats">${catBadges}</div>

          <div class="wg-activities-section">
            <div class="wg-activities-title">✦ Suggested Activities${days < 3 ? ' (for ' + days + ' day' + (days > 1 ? 's' : '') + ')' : ''}:</div>
            <ul class="wg-activities-list">
              ${activitiesToShow.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>

          <div class="wg-dest-budget">
            <span class="wg-budget-pill">${budgetKey}: ${destBudget}</span>
            ${destBudgetDetail ? `<span class="wg-budget-pill-note">${destBudgetDetail}</span>` : ''}
          </div>

          <a href="place.html?place=${encodeURIComponent(dest.name)}" class="wg-explore-btn">
            Explore ${dest.name} →
          </a>
        </div>
      `;
    }

    function showWgError(msg) {
      output.innerHTML = `<div class="wg-error-state">⚠️ ${msg}</div>`;
      output.style.display = 'block';
    }
  }

  document.addEventListener('DOMContentLoaded', initWeekendGetaway);
})();
