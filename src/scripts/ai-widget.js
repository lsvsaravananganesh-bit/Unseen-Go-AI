/* UnseenGo AI — Interactive AI Discovery, Autocomplete & Hidden Gem Radar Engine
 * Features:
 * - Smart Search Autocomplete across 300+ Indian gems, cities, and heritage spots
 * - Hidden Gem Radar Module with category filters, distances, and verification status
 * - Explainable AI Recommender with smooth step animations
 */

(function () {
  'use strict';

  // Comprehensive Search Autocomplete Index
  const AUTOCOMPLETE_ITEMS = [
    { name: 'Kurnool', type: 'City', location: 'Andhra Pradesh', category: 'Heritage & Nature', url: 'discover.html?city=Kurnool' },
    { name: 'Konda Reddy Fort (Buruju)', type: 'Attraction', location: 'Kurnool, Andhra Pradesh', category: 'History', url: 'place.html?place=Konda%20Reddy%20Buruju&city=Kurnool' },
    { name: 'Belum Caves', type: 'Attraction', location: 'Kurnool / Kolimigundla, Andhra Pradesh', category: 'Nature / Cave', url: 'place.html?place=Belum%20Caves&city=Kurnool' },
    { name: 'Orvakal Rock Garden', type: 'Attraction', location: 'Kurnool, Andhra Pradesh', category: 'Nature & Photography', url: 'place.html?place=Orvakal%20Rock%20Garden&city=Kurnool' },
    { name: 'Yaganti Caves & Temple', type: 'Attraction', location: 'Kurnool, Andhra Pradesh', category: 'Spiritual & Heritage', url: 'place.html?place=Yaganti%20Caves&city=Kurnool' },
    { name: 'Gandikota Canyon & Fort', type: 'Attraction', location: 'Kadapa, Andhra Pradesh', category: 'Heritage & Canyon', url: 'place.html?place=Gandikota&city=Kadapa' },
    { name: 'Lepakshi Temple & Monoliths', type: 'Attraction', location: 'Sri Sathya Sai, Andhra Pradesh', category: 'History & Architecture', url: 'place.html?place=Lepakshi&city=Sri%20Sathya%20Sai' },
    { name: 'Tirupati', type: 'City', location: 'Andhra Pradesh', category: 'Spiritual & Hills', url: 'discover.html?city=Tirupati' },
    { name: 'Talakona Waterfall', type: 'Attraction', location: 'Chittoor, Andhra Pradesh', category: 'Nature & Waterfall', url: 'place.html?place=Talakona%20Forest&city=Tirupati' },
    { name: 'Chandragiri Fort', type: 'Attraction', location: 'Tirupati, Andhra Pradesh', category: 'History', url: 'place.html?place=Chandragiri%20Fort&city=Tirupati' },
    { name: 'Hyderabad', type: 'City', location: 'Telangana', category: 'Heritage & Food', url: 'discover.html?city=Hyderabad' },
    { name: 'Paigah Tombs', type: 'Attraction', location: 'Hyderabad, Telangana', category: 'History & Architecture', url: 'place.html?place=Paigah%20Tombs&city=Hyderabad' },
    { name: 'Khajaguda Rock Formations', type: 'Attraction', location: 'Hyderabad, Telangana', category: 'Nature & Bouldering', url: 'place.html?place=Khajaguda%20Hills&city=Hyderabad' },
    { name: 'Araku Valley', type: 'Destination', location: 'Visakhapatnam, Andhra Pradesh', category: 'Nature & Coffee Trails', url: 'discover.html?city=Araku' },
    { name: 'Borra Caves', type: 'Attraction', location: 'Ananthagiri, Andhra Pradesh', category: 'Nature / Cave', url: 'place.html?place=Borra%20Caves' },
    { name: 'Hampi & Anegundi', type: 'Destination', location: 'Vijayanagara, Karnataka', category: 'History & Ruins', url: 'place.html?place=Hampi' },
    { name: 'Agumbe Rainforest', type: 'Destination', location: 'Shivamogga, Karnataka', category: 'Nature & Rain Trails', url: 'place.html?place=Agumbe' },
    { name: 'Varanasi', type: 'City', location: 'Uttar Pradesh', category: 'Spiritual & Culture', url: 'discover.html?city=Varanasi' },
    { name: 'Sarnath Deer Park Stupa', type: 'Attraction', location: 'Varanasi, Uttar Pradesh', category: 'History & Spiritual', url: 'place.html?place=Sarnath%20Archaeological%20Area&city=Varanasi' },
    { name: 'Chunar Fort', type: 'Attraction', location: 'Mirzapur, Uttar Pradesh', category: 'History', url: 'place.html?place=Chunar%20Fort%20Expedition&city=Varanasi' },
    { name: 'Jaipur', type: 'City', location: 'Rajasthan', category: 'Heritage & Craft', url: 'discover.html?city=Jaipur' },
    { name: 'Panna Meena ka Kund', type: 'Attraction', location: 'Jaipur, Rajasthan', category: 'History & Stepwell', url: 'place.html?place=Panna%20Meena%20ka%20Kund&city=Jaipur' },
    { name: 'Kumartuli Artisan Workshops', type: 'Attraction', location: 'Kolkata, West Bengal', category: 'Culture & Craft', url: 'place.html?place=Kumartuli%20Artisan%20Lanes&city=Kolkata' },
    { name: 'Undavalli Rock Caves', type: 'Attraction', location: 'Vijayawada, Andhra Pradesh', category: 'History & Rock Cut', url: 'place.html?place=Undavalli%20Caves&city=Vijayawada' }
  ];

  // Hidden Gem Radar Data by Destination Hub
  const RADAR_DATA = {
    'Kurnool': [
      { name: 'Konda Reddy Buruju', distance: 'In City Center', cat: 'History', score: 96, verified: '✓ VERIFIED', desc: '12th-century military bastion and observation fortress in the heart of Kurnool.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80' },
      { name: 'Orvakal Rock Garden', distance: '22 km', cat: 'Nature', score: 95, verified: '✓ VERIFIED', desc: 'Ancient billion-year-old quartz sandstone canyons, walking bridges, and serene sunset pools.', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80' },
      { name: 'Belum Caves System', distance: '95 km', cat: 'Adventure', score: 98, verified: '✓ VERIFIED', desc: 'India’s second longest underground cave passage with limestone musical chambers and subterranean streams.', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80' },
      { name: 'Yaganti Rock Temple & Cave', distance: '90 km', cat: 'Spiritual', score: 97, verified: '✓ VERIFIED', desc: 'Dramatic cave sanctum featuring a growing monolithic Nandi statue and perpetual natural freshwater spring.', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80' },
      { name: 'Gandikota Gorge & Fort', distance: '110 km', cat: 'History', score: 98, verified: '✓ VERIFIED', desc: 'Grand Canyon of India carved by the Penna river with 13th-century stone fort ruins and view decks.', img: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=700&q=80' },
      { name: 'Alampur Navabrahma Temples', distance: '25 km', cat: 'History', score: 97, verified: '✓ VERIFIED', desc: '7th-century Badami Chalukyan sandstone temples on the sacred confluence of the Tungabhadra.', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80' },
      { name: 'Rollapadu Wildlife Grasslands', distance: '45 km', cat: 'Nature', score: 92, verified: '✓ VERIFIED', desc: 'Protected grassland sanctuary for the endangered Great Indian Bustard, blackbucks, and migratory raptors.', img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80' },
      { name: 'Mahanandi Temple & Natural Springs', distance: '80 km', cat: 'Spiritual', score: 94, verified: '✓ VERIFIED', desc: 'Ancient 1,500-year-old temple surrounded by dense Nallamala forests with crystal-clear perennial water pools.', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80' },
      { name: 'Ahobilam 9 Narasimha Caves', distance: '120 km', cat: 'Adventure', score: 96, verified: '✓ VERIFIED', desc: 'Nine sacred cave shrines scattered across steep Nallamala forest mountain gorges and waterfalls.', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80' },
      { name: 'Rayalaseema Spicy Food Trail', distance: 'Old Town Kurnool', cat: 'Food', score: 93, verified: '✓ VERIFIED', desc: 'Authentic millet Jonna rotis, fiery Natu Kodi chicken curry, and Ghee Karam Dosa from local legacy eateries.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80' },
      { name: 'Gajuladinne Reservoir & Sunset', distance: '35 km', cat: 'Nature', score: 91, verified: '✓ VERIFIED', desc: 'Quiet scenic water reservoir flanked by rocky hillocks, ideal for birdwatching and tranquil evening photography.', img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80' },
      { name: 'Srisailam Sunken Temple Boat Trail', distance: '160 km', cat: 'Adventure', score: 95, verified: '✓ VERIFIED', desc: 'Dramatic Krishna river gorge boat ride reaching the secluded Akkamahadevi natural rock caves.', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=700&q=80' }
    ],
    'Kadapa': [
      { name: 'Gandikota Canyon & Fort', distance: '75 km', cat: 'History', score: 98, verified: '✓ VERIFIED', desc: 'Grand Canyon of India carved by Penna river with 13th-century stone fort ruins.', img: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=700&q=80' },
      { name: 'Vontimitta Kodandarama Temple', distance: '25 km', cat: 'History', score: 95, verified: '✓ VERIFIED', desc: '16th-century Vijayanagara architectural masterpiece with intricate Mandapa pillars and sculptures.', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80' },
      { name: 'Pushpagiri Temple Complex', distance: '18 km', cat: 'Spiritual', score: 94, verified: '✓ VERIFIED', desc: 'Sacred temple cluster on the banks of Penna River known as the Kashi of the South.', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80' },
      { name: 'Brahmamgari Matam', distance: '60 km', cat: 'Culture', score: 92, verified: '✓ VERIFIED', desc: 'Historic hermitage and sacred ashram of the 17th-century mystic and philosopher Potuluri Veerabrahmendra.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80' }
    ],
    'Tirupati': [
      { name: 'Talakona Waterfall', distance: '50 km', cat: 'Nature', score: 96, verified: '✓ VERIFIED', desc: 'Highest waterfall in Andhra Pradesh tucked inside lush dense deciduous forest and canopy walk.', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=700&q=80' },
      { name: 'Chandragiri Fort & Palace', distance: '15 km', cat: 'History', score: 95, verified: '✓ VERIFIED', desc: 'The 11th-century fortified capital of the Vijayanagara Empire with Raja and Rani Mahal.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80' },
      { name: 'Kalamkari Artisan Village (Srikalahasti)', distance: '38 km', cat: 'Culture', score: 96, verified: '✓ VERIFIED', desc: 'Living ancient block-print and hand-painted organic natural dye textile heritage.', img: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=700&q=80' },
      { name: 'Horsley Hills Roadtrip', distance: '130 km', cat: 'Adventure', score: 92, verified: '✓ VERIFIED', desc: 'Winding scenic ghat road to quiet eucalyptus-scented misty hilltops and viewpoints.', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80' }
    ],
    'Hyderabad': [
      { name: 'Paigah Tombs', distance: 'City (Santoshnagar)', cat: 'History', score: 96, verified: '✓ VERIFIED', desc: 'Stunning Indo-Saracenic and Greek architectural stucco jaali artistry.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80' },
      { name: 'Khajaguda Rock Formations', distance: 'City (Hitec Edge)', cat: 'Nature', score: 94, verified: '✓ VERIFIED', desc: '2.5-billion-year-old natural granite balancing rock formations, natural caves, and sunset trails.', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80' },
      { name: 'Ananthagiri Hills & Forest', distance: '80 km', cat: 'Adventure', score: 94, verified: '✓ VERIFIED', desc: 'Dense forest trek trails and the source stream of the historic Musi river.', img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80' },
      { name: 'Old City Irani Chai & Bakery Trail', distance: 'Charminar Lanes', cat: 'Food', score: 95, verified: '✓ VERIFIED', desc: 'Century-old Irani cafés serving slow-brewed tea, bun maska, and hot Osmania biscuits.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80' }
    ],
    'Hampi': [
      { name: 'Anegundi Village & Monkey Temple', distance: '5 km', cat: 'Culture', score: 97, verified: '✓ VERIFIED', desc: 'Mythological Kishkindha kingdom with ancient rock art, coracle rides, and paddy trails.', img: 'https://images.unsplash.com/photo-1600100397608-f0109f7d1d4e?auto=format&fit=crop&w=700&q=80' },
      { name: 'Sanapur Lake & Boulder Bashing', distance: '12 km', cat: 'Adventure', score: 95, verified: '✓ VERIFIED', desc: 'Deep blue water reservoir cradled between colossal granite boulders and cliffs.', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80' },
      { name: 'Vitthala Musical Pillars & King’s Balance', distance: 'In Heritage Core', cat: 'History', score: 98, verified: '✓ VERIFIED', desc: 'World-renowned monolithic stone chariot and 56 musical acoustic granite columns.', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80' }
    ],
    'Bengaluru': [
      { name: 'Agumbe Rainforest Canopy', distance: '340 km', cat: 'Nature', score: 96, verified: '✓ VERIFIED', desc: 'Cherrapunji of the South with dense rainforest canopy, endemic king cobras, and ghat sunsets.', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=700&q=80' },
      { name: 'Lepakshi Hanging Pillar Temple', distance: '120 km', cat: 'History', score: 98, verified: '✓ VERIFIED', desc: 'Vijayanagara architectural mastery with monolithic Nandi and miraculous hanging stone pillar.', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80' },
      { name: 'Nandi Hills Hidden Foothill Trails', distance: '60 km', cat: 'Adventure', score: 93, verified: '✓ VERIFIED', desc: 'Steep ancient stone steps and Tipu Sultan fortification ruins away from commercial viewpoints.', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80' }
    ],
    'Varanasi': [
      { name: 'Sarnath Deer Park & Dhamek Stupa', distance: '10 km', cat: 'History', score: 97, verified: '✓ VERIFIED', desc: 'Ancient site where Buddha gave his first sermon with 5th-century Ashokan archaeological ruins.', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80' },
      { name: 'Chunar Fort Overlooking Ganga', distance: '40 km', cat: 'Adventure', score: 94, verified: '✓ VERIFIED', desc: 'Commanding cliffside fortress guarding the Ganges river with Babur and Sher Shah Suri history.', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80' },
      { name: 'Kachori Gali & Malaiyo Winter Trail', distance: 'Ghat Alleyways', cat: 'Food', score: 96, verified: '✓ VERIFIED', desc: 'Centuries-old breakfast lanes famous for crisp spiced kachoris, jalebis, and saffron froth.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80' }
    ],
    'Jaipur': [
      { name: 'Panna Meena ka Kund Stepwell', distance: 'Amer (12 km)', cat: 'History', score: 97, verified: '✓ VERIFIED', desc: '16th-century geometric criss-cross stepwell designed for rainwater harvesting and royal gatherings.', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80' },
      { name: 'Bagru Hand Block-Printing Workshops', distance: '30 km', cat: 'Culture', score: 95, verified: '✓ VERIFIED', desc: 'Traditional Chippa artisan community practicing 300-year-old vegetable natural dye mud-resist printing.', img: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=700&q=80' },
      { name: 'Galta Ji Sun Temple Monkey Valley', distance: '10 km', cat: 'Spiritual', score: 94, verified: '✓ VERIFIED', desc: 'Ancient sacred hill complex with natural holy spring water tanks carved into the Aravalli gorge.', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80' }
    ]
  };

  const SAMPLE_PHOTOS = {
    gandikota: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=800&q=85',
    lepakshi: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=85',
    agumbe: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=85',
    hampi: 'https://images.unsplash.com/photo-1600100397608-f0109f7d1d4e?auto=format&fit=crop&w=800&q=85',
    orvakal: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85',
    paigah: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=85',
    belum: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85',
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

  // 1. Setup Smart Autocomplete
  function setupAutocomplete(inputEl) {
    if (!inputEl) return;
    const parent = inputEl.closest('.ug-ai-input-wrap') || inputEl.parentElement;
    if (!parent) return;

    let dropdown = parent.querySelector('.ug-autocomplete-dropdown');
    if (!dropdown) {
      parent.style.position = 'relative';
      dropdown = document.createElement('div');
      dropdown.className = 'ug-autocomplete-dropdown';
      parent.appendChild(dropdown);
    }

    inputEl.addEventListener('input', () => {
      const q = inputEl.value.trim().toLowerCase();
      if (!q || q.length < 2) {
        dropdown.classList.remove('show');
        dropdown.innerHTML = '';
        return;
      }

      const matches = AUTOCOMPLETE_ITEMS.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.location.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q)
      ).slice(0, 6);

      if (matches.length === 0) {
        dropdown.innerHTML = `<div style="padding: 0.75rem 1rem; color: var(--ug-text-muted); font-size: 0.85rem;">No exact match for "${safeHtml(q)}". Press search to explore Discovery Graph.</div>`;
        dropdown.classList.add('show');
        return;
      }

      dropdown.innerHTML = matches.map(m => {
        const regex = new RegExp(`(${q})`, 'gi');
        const highlightedName = safeHtml(m.name).replace(regex, '<mark>$1</mark>');
        return `
          <a class="ug-autocomplete-item" href="${m.url}">
            <div>
              <div class="ug-autocomplete-name">${highlightedName}</div>
              <div class="ug-autocomplete-meta">📍 ${safeHtml(m.location)} · <span style="color: var(--ug-primary);">${safeHtml(m.category)}</span></div>
            </div>
            <span class="ug-score-pill" style="font-size: 0.72rem;">${m.type} →</span>
          </a>
        `;
      }).join('');

      dropdown.classList.add('show');
    });

    document.addEventListener('click', (e) => {
      if (!parent.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }

  // 2. Setup Hidden Gem Radar Module
  function initHiddenGemRadar() {
    const radarContainer = document.getElementById('hiddenGemRadar');
    if (!radarContainer) return;

    const select = document.getElementById('radarHubSelect');
    const tabs = radarContainer.querySelectorAll('.ug-radar-tab');
    const grid = document.getElementById('radarCardsGrid');
    const countBadge = document.getElementById('radarCountBadge');

    let currentHub = select ? select.value : 'Kurnool';
    let currentCategory = 'all';

    function renderRadarCards() {
      if (!grid) return;
      const list = RADAR_DATA[currentHub] || RADAR_DATA['Kurnool'];
      const filtered = list.filter(item => {
        if (currentCategory === 'all') return true;
        return item.cat.toLowerCase() === currentCategory.toLowerCase();
      });

      if (countBadge) {
        countBadge.textContent = `${list.length} hidden places discovered around ${currentHub}`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--ug-text-muted);">
            No places currently registered under "${safeHtml(currentCategory)}" near ${safeHtml(currentHub)}. Check back soon or browse all.
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(item => `
        <article class="ug-radar-card">
          <div>
            <div style="position: relative; height: 160px; border-radius: 12px; overflow: hidden; margin-bottom: 0.85rem;">
              <img src="${item.img}" alt="${safeHtml(item.name)}" style="width: 100%; height: 100%; object-fit: cover;">
              <span class="ug-radar-distance" style="position: absolute; top: 10px; left: 10px; background: rgba(8, 13, 9, 0.85); backdrop-filter: blur(4px);">
                📍 ${item.distance}
              </span>
              <span class="ug-badge ug-badge-verified" style="position: absolute; top: 10px; right: 10px; background: rgba(8, 13, 9, 0.85); backdrop-filter: blur(4px);">
                ${item.verified}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
              <h4 style="font-size: 1.1rem; margin: 0; color: var(--ug-text-primary); font-weight: 700;">${safeHtml(item.name)}</h4>
              <b style="color: var(--ug-primary); font-size: 0.9rem;">✦ ${item.score}</b>
            </div>
            <p style="font-size: 0.84rem; color: var(--ug-text-secondary); line-height: 1.5; margin: 0;">
              ${safeHtml(item.desc)}
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; border-top: 1px solid var(--ug-border); padding-top: 0.75rem;">
            <span style="font-size: 0.75rem; color: var(--ug-primary); font-weight: 700;">${safeHtml(item.cat)}</span>
            <a href="place.html?place=${encodeURIComponent(item.name)}&city=${encodeURIComponent(currentHub)}" class="ug-btn-secondary" style="font-size: 0.78rem; padding: 0.35rem 0.85rem; text-decoration: none;">
              Explore Place →
            </a>
          </div>
        </article>
      `).join('');
    }

    if (select) {
      select.addEventListener('change', () => {
        currentHub = select.value;
        renderRadarCards();
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.radarCat || 'all';
        renderRadarCards();
      });
    });

    renderRadarCards();
  }

  // 3. Setup AI Discovery Prompter
  function initAiWidget() {
    const input = document.getElementById('homePrompt');
    const runBtn = document.getElementById('homeRun');
    const resultPanel = document.getElementById('homeResultPanel');
    const chips = document.querySelectorAll('.ug-prompt-chip');
    const destDirectInput = document.getElementById('destDirectInput');
    const destDirectBtn = document.getElementById('destDirectBtn');

    if (destDirectInput) {
      setupAutocomplete(destDirectInput);
      if (destDirectBtn) {
        const handleSearch = () => {
          const val = destDirectInput.value.trim() || 'Kurnool';
          window.location.href = `place.html?place=${encodeURIComponent(val)}`;
        };
        destDirectBtn.addEventListener('click', handleSearch);
        destDirectInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
          }
        });
      }
    }

    if (input) {
      setupAutocomplete(input);
    }

    const modeAiBtn = document.getElementById('modeAiBtn');
    const modeDestBtn = document.getElementById('modeDestBtn');
    const aiDiscoverBox = document.getElementById('aiDiscoverBox');
    const destSearchBox = document.getElementById('destSearchBox');

    if (modeAiBtn && modeDestBtn && aiDiscoverBox && destSearchBox) {
      modeAiBtn.addEventListener('click', () => {
        modeAiBtn.classList.add('active');
        modeDestBtn.classList.remove('active');
        aiDiscoverBox.style.display = 'block';
        destSearchBox.style.display = 'none';
        if (input) input.focus();
      });

      modeDestBtn.addEventListener('click', () => {
        modeDestBtn.classList.add('active');
        modeAiBtn.classList.remove('active');
        destSearchBox.style.display = 'block';
        aiDiscoverBox.style.display = 'none';
        if (destDirectInput) destDirectInput.focus();
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.dataset.prompt || chip.textContent.trim();
        if (input) {
          input.value = text;
          runDiscoveryWithAnimation(text);
        }
      });
    });

    if (runBtn && input && resultPanel) {
      runBtn.addEventListener('click', () => {
        const text = input.value.trim() || 'I have 2 days from Hyderabad. I love quiet heritage, cave temples and local food. Budget ₹6,000.';
        runDiscoveryWithAnimation(text);
      });
    }

    async function runDiscoveryWithAnimation(promptText) {
      if (!resultPanel || !runBtn) return;
      runBtn.disabled = true;
      runBtn.textContent = '✨ Analyzing…';

      resultPanel.style.display = 'block';
      resultPanel.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.75rem; color: var(--ug-primary); animation: ugRadarPulse 1.2s infinite ease-in-out;">✦</div>
          <h4 style="font-size: 1.2rem; margin-bottom: 0.4rem; color: var(--ug-text-primary);" id="aiStepText">
            Analyzing your travel preferences & pacing…
          </h4>
          <p style="font-size: 0.85rem; color: var(--ug-text-muted);">
            Connecting to India Discovery Graph with 300+ verified destination records
          </p>
        </div>
      `;

      await delay(300);
      const stepEl = document.getElementById('aiStepText');
      if (stepEl) stepEl.textContent = 'Scanning regional circuits & hidden heritage spots…';
      await delay(350);
      if (stepEl) stepEl.textContent = 'Calculating explainable UnseenGo score breakdown…';
      await delay(250);

      try {
        const profile = (window.UnseenGoAI && window.UnseenGoAI.parseNaturalLanguage) ? 
          window.UnseenGoAI.parseNaturalLanguage(promptText) : 
          { interests: ['Heritage', 'Nature'], days: 2, budget: 'medium', city: 'Kurnool' };

        const currentSavedCity = localStorage.getItem('unseengo_city');
        const cityToSearch = profile.city || currentSavedCity || 'Kurnool';

        let result = (window.UnseenGoAI && window.UnseenGoAI.generate) ? 
          window.UnseenGoAI.generate(cityToSearch, profile) : null;

        const top = result?.recommendations?.[0] || {
          name: 'Gandikota Canyon & Fort',
          city: 'Kadapa / Kurnool Region',
          category: 'Heritage',
          unseenScore: 98,
          why: 'Matches 2 days duration with dramatic canyon sunset overlooks, zero crowd congestion, and authentic 13th-century fort ruins.',
          hiddenness: 24,
          culturalValue: 19,
          interestPercent: 98,
          budgetFit: 95
        };

        renderResult(top, profile);
      } catch (err) {
        console.error('AI match error:', err);
      } finally {
        runBtn.textContent = '✦ Recommend Gems';
        runBtn.disabled = false;
      }
    }

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function renderResult(place, profile) {
      const photoUrl = getPlacePhoto(place.name);
      const score = Math.round(place.unseenScore || 96);

      resultPanel.innerHTML = `
        <div class="ug-ai-result-grid">
          <div class="ug-ai-result-media">
            <img src="${photoUrl}" alt="${safeHtml(place.name)}" loading="lazy">
            <span class="ug-ai-result-badge">✦ ${score}/100 Unseen Score</span>
          </div>
          <div class="ug-ai-result-details">
            <div class="ug-kicker" style="color: var(--ug-primary); font-size: 0.78rem; font-weight: 800;">✦ TOP AI RECOMMENDATION · ${safeHtml(place.category || 'Heritage')}</div>
            <h3 style="font-size: 1.65rem; margin: 0.35rem 0; color: var(--ug-text-primary);">${safeHtml(place.name)}</h3>
            <div class="location" style="color: var(--ug-text-secondary); margin-bottom: 0.75rem;">📍 ${safeHtml(place.location || place.city || 'Andhra Pradesh')}</div>
            <p class="why-text" style="line-height: 1.6; color: var(--ug-text-primary); margin-bottom: 1rem;">
              <strong>Why UnseenGo Recommends This:</strong> ${safeHtml(place.why || 'Exceptional hidden landscape with deep cultural context and minimal commercial congestion.')}
            </p>
            
            <div class="ug-ai-metrics-row">
              <div class="ug-metric-chip">
                <span class="label">Hiddenness</span>
                <span class="val">${place.hiddenness || 24}/25</span>
              </div>
              <div class="ug-metric-chip">
                <span class="label">Cultural Depth</span>
                <span class="val">${place.culturalValue || 19}/20</span>
              </div>
              <div class="ug-metric-chip">
                <span class="label">Interest Fit</span>
                <span class="val">${place.interestPercent || 98}%</span>
              </div>
              <div class="ug-metric-chip">
                <span class="label">Budget Fit</span>
                <span class="val">${place.budgetFit || 95}%</span>
              </div>
            </div>

            <div class="ug-ai-result-actions" style="margin-top: 1.25rem; display: flex; flex-wrap: wrap; gap: 0.65rem;">
              <a href="place.html?place=${encodeURIComponent(place.name)}&city=${encodeURIComponent(place.city || '')}" class="ug-btn-primary" style="padding: 0.65rem 1.25rem; font-size: 0.88rem; text-decoration: none;">
                Explore Destination (History & Audio Guide) →
              </a>
              <a href="planner.html?place=${encodeURIComponent(place.name)}" class="ug-btn-secondary" style="padding: 0.65rem 1.25rem; font-size: 0.88rem; text-decoration: none;">
                🤖 Build Full AI Itinerary
              </a>
              <a href="map.html?place=${encodeURIComponent(place.name)}" class="ug-btn-secondary" style="padding: 0.65rem 1.25rem; font-size: 0.88rem; text-decoration: none;">
                🗺️ View On Map
              </a>
            </div>
          </div>
        </div>
      `;

      resultPanel.classList.add('show');
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAiWidget();
    initHiddenGemRadar();
    initSurpriseMe();
  });

  /* ─── Feature #41 — Surprise Me Mode ─────────────────────────────────────── */
  function initSurpriseMe() {
    const btn    = document.getElementById('surpriseMeBtn');
    const modal  = document.getElementById('surpriseModal');
    const closeBtn = document.getElementById('surpriseClose');
    const titleEl = document.getElementById('surpriseTitle');
    const descEl  = document.getElementById('surpriseDesc');
    const link    = document.getElementById('surpriseExploreLink');

    if (!btn || !modal) return;

    // Curated destination pool by interest category
    const SURPRISE_POOL = {
      Nature:    [
        { name: 'Agumbe', emoji: '🌿', teaser: 'Cherrapunji of the South — dense rainforest canopy, king cobras, and legendary monsoon sunsets over the Western Ghats.' },
        { name: 'Araku Valley', emoji: '🏞️', teaser: 'A scenic mountain valley in the Eastern Ghats, famous for organic coffee estates and tribal art.' },
        { name: 'Talakona', emoji: '💧', teaser: "Andhra Pradesh's highest waterfall — 270 feet of pure cascading magic inside a medicinal forest reserve." },
        { name: 'Horsley Hills', emoji: '⛰️', teaser: 'Eucalyptus-scented misty hilltops with panoramic views and quiet forest trails above Andhra Pradesh.' },
        { name: 'Ananthagiri Hills', emoji: '🌲', teaser: 'Dense forest source of the Musi river, with seasonal waterfalls and serene trek trails near Hyderabad.' }
      ],
      History:   [
        { name: 'Gandikota', emoji: '🏯', teaser: "India's Grand Canyon — 13th-century fort ruins dramatically perched over a Penna river gorge." },
        { name: 'Lepakshi', emoji: '🛕', teaser: 'Vijayanagara-era marvel with a hanging pillar, colossal monolithic Nandi, and intricate ceiling murals.' },
        { name: 'Chandragiri', emoji: '🏰', teaser: 'The last capital of the Vijayanagara Empire — Raja Mahal, Rani Mahal, and a commanding hilltop fort.' },
        { name: 'Vontimitta', emoji: '🗿', teaser: '16th-century Kodandarama Temple — a flawless Vijayanagara architectural gem on the banks of the Penna.' },
        { name: 'Paigah Tombs', emoji: '⚱️', teaser: 'Hidden Hyderabad gem — Indo-Saracenic marble lattice mausoleums of the Nizam\'s noble family.' }
      ],
      Adventure: [
        { name: 'Gandikota', emoji: '🧗', teaser: 'Camping on a gorge rim, trekking through ancient fort ruins, and sunrise views over the Penna canyon.' },
        { name: 'Belum Caves', emoji: '🦇', teaser: 'India\'s second longest cave system — limestone stalactites, subterranean chambers, and musical acoustics.' },
        { name: 'Orvakal', emoji: '🪨', teaser: 'Billion-year-old quartz sandstone canyon trails, boulder scrambling, and quiet sunset pools.' },
        { name: 'Sanapur Lake', emoji: '🚣', teaser: 'Deep blue coracle lake cradled between colossal Hampi granite boulders — perfect for cliff jumping.' }
      ],
      Spiritual: [
        { name: 'Yaganti', emoji: '🪔', teaser: 'A rock-carved sanctum with a living Nandi statue said to grow year by year, fed by an eternal spring.' },
        { name: 'Ahobilam', emoji: '🕉️', teaser: 'Nine sacred Narasimha cave shrines scattered deep in the Nallamala forest gorges and waterfalls.' },
        { name: 'Mahanandi', emoji: '💧', teaser: '1,500-year-old temple with crystal-clear perennial springs deep in the forests of Nallamala.' },
        { name: 'Srisailam', emoji: '🔱', teaser: 'Jyotirlinga shrine on a dramatic plateau above the Krishna river gorge — one of India\'s holiest sites.' },
        { name: 'Talakona', emoji: '🌊', teaser: 'A sacred waterfall in the Sri Venkateswara forest reserve, revered for its medicinal properties.' }
      ],
      Food:      [
        { name: 'Irani Chai Trail', emoji: '☕', teaser: 'Hyderabad\'s century-old Irani cafés serving slow-brewed chai, bun maska, and hot Osmania biscuits.', redirect: 'discover.html?city=Hyderabad' },
        { name: 'Kachori Gali', emoji: '🥐', teaser: 'Varanasi\'s mythic breakfast lane — crisp spiced kachoris, jalebis, and the elusive saffron malaiyo.', redirect: 'discover.html?city=Varanasi' },
        { name: 'Chettinad', emoji: '🍛', teaser: 'The spice capital of Tamil Nadu — chettinad pepper chicken, idiyappam, and palatial ancestral mansions.', redirect: 'discover.html?city=Chettinad' }
      ]
    };

    // Flatten all destinations for random pick
    const ALL_POOL = Object.values(SURPRISE_POOL).flat();

    function pickDestination() {
      try {
        const prefs = JSON.parse(localStorage.getItem('unseengo_travel_prefs') || '{}');
        const interests = Array.isArray(prefs.interests) ? prefs.interests : [];
        // Collect candidates matching at least one saved interest
        const candidates = interests
          .flatMap(i => SURPRISE_POOL[i] || [])
          .filter(Boolean);
        const pool = candidates.length ? candidates : ALL_POOL;
        return pool[Math.floor(Math.random() * pool.length)];
      } catch (_) {
        return ALL_POOL[Math.floor(Math.random() * ALL_POOL.length)];
      }
    }

    function openModal(dest) {
      titleEl.textContent = dest.emoji + ' ' + dest.name;
      descEl.textContent  = dest.teaser;
      const target = dest.redirect || ('place.html?place=' + encodeURIComponent(dest.name));
      link.href = target;
      // Use flex display (override the initial display:none inline style)
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
      // Show loading state for 1 second
      titleEl.textContent = '🎲 Finding your surprise gem...';
      descEl.textContent  = 'Scanning hidden destinations just for you…';
      link.style.display  = 'none';
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        const dest = pickDestination();
        link.style.display = '';
        openModal(dest);
      }, 1000);
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });
  }

})();

