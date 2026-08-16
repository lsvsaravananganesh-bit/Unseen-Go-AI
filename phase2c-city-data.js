/* UnseenGo AI — Phase 2C
 * Supabase becomes the source of truth for a city page when matching rows exist.
 * Existing city-page.js remains the fallback renderer.
 */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const city = new URLSearchParams(location.search).get('city') || '';
  let dataset = null;

  function getClient() { return window.unseenGoSupabase || null; }
  async function fetchData() { if (!city || !window.UnseenGoData?.loadCity) return null; return await window.UnseenGoData.loadCity(city); }
  function mapSearch(name, placeCity) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' ' + placeCity); }
  function mapEmbed(name, placeCity) { return 'https://www.google.com/maps?q=' + encodeURIComponent(name + ' ' + placeCity) + '&output=embed'; }

  function renderReviews(reviews, places) {
    const host = document.getElementById('localReviews');
    if (!host) return;
    if (!reviews?.length) {
      host.innerHTML = '<div class="review-empty"><div class="review-stars">★★★★★</div><h3>Traveller reviews are coming soon</h3><p>Verified traveller experiences will appear here after approved reviews are submitted.</p></div>';
      return;
    }
    const names = Object.fromEntries(places.map(p => [p.id, p.name]));
    host.innerHTML = reviews.map(r => `<article class="traveller-review-card"><div class="review-card-top"><span>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>${r.is_verified ? '<b>✓ Verified</b>' : ''}</div><h3>${esc(r.title || names[r.place_id] || 'Traveller experience')}</h3><p>${esc(r.body)}</p><small>${esc(names[r.place_id] || 'Place')}</small></article>`).join('');
  }

  function render(data) {
    dataset = data;
    const c = data.city, places = data.places;
    document.title = c.name + ' — UnseenGo AI';
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value ?? ''; };
    set('cityName', c.name); set('cityRegion', c.region ? c.region + ' India' : 'India');
    set('cityIntro', c.description || `Explore ${places.length} places across history, forts, nature, culture, food, adventure and famous landmarks.`);
    set('cityHistory', c.history || 'Discover the architecture, communities, landscapes and traditions that shaped this destination.');
    set('placeCount', places.length); set('categoryCount', new Set(places.map(p => p.category)).size);

    const filters = document.getElementById('categoryFilters');
    const cats = ['All', ...new Set(places.map(p => p.category).filter(Boolean))];
    if (filters) filters.innerHTML = cats.map((x,i) => `<button class="filter-btn ${i===0?'active':''}" data-filter="${esc(x)}">${esc(x)}</button>`).join('');

    const grid = document.getElementById('cityPlaces');
    if (grid) grid.innerHTML = places.map((p,i) => `<article class="city-place-card" data-index="${i}" data-category="${esc(p.category)}" data-name="${esc(p.name).toLowerCase()}"><div class="place-image">${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">` : '<div class="image-fallback">✦<span>Photo coming soon</span></div>'}</div><div class="place-card-body"><div class="place-top"><span>${p.is_famous ? 'FAMOUS' : p.is_hidden_gem ? 'HIDDEN GEM' : 'CURATED'}</span></div><small class="place-category">${esc(p.category || 'Place')}</small><h3>${esc(p.name)}</h3><p>${esc(p.description || 'Explore this destination and its story.')}</p><div class="place-location">⌖ ${esc(c.name)}</div><button class="details-button" data-place="${i}">View history, photo & map →</button></div></article>`).join('');

    document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active')); btn.classList.add('active'); const f=btn.dataset.filter; document.querySelectorAll('.city-place-card').forEach(card => card.hidden=f!=='All'&&card.dataset.category!==f); }));
    document.querySelectorAll('.details-button').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); openPlace(Number(btn.dataset.place)); }));
    document.querySelectorAll('.city-place-card').forEach(card => card.addEventListener('click', e => { if (!e.target.closest('button')) openPlace(Number(card.dataset.index)); }));

    const stays=document.getElementById('cityStays');
    if(stays) stays.innerHTML=data.stays.length?data.stays.map(s=>`<article class="city-stay"><span>${esc(s.stay_type)}</span><h3>${esc(s.area)}</h3><b>${esc(s.budget_band||'Budget varies')}</b><p>${esc(s.description||'Explore accommodation options in this area.')}</p><a target="_blank" rel="noopener" href="${esc(s.map_url||('https://www.google.com/maps/search/hotels+in+'+encodeURIComponent(s.area+' '+c.name)))}">Find stays nearby ↗</a></article>`).join(''):'<div class="city-empty">Accommodation data will appear here as stays are added.</div>';
    const search=document.getElementById('placeSearch'); if(search) search.oninput=()=>{const q=search.value.toLowerCase().trim();document.querySelectorAll('.city-place-card').forEach(card=>card.hidden=!!q&&!card.dataset.name.includes(q));};
    renderReviews(data.reviews || [], places);
  }

  function openPlace(i) {
    const p=dataset?.places?.[i]; if(!p)return; const c=dataset.city, modal=document.getElementById('placeModal'); if(!modal)return;
    modal.classList.add('open'); document.getElementById('modalTitle').textContent=p.name; document.getElementById('modalCategory').textContent=(p.category||'PLACE').toUpperCase(); document.getElementById('modalLocation').textContent=c.name+(p.latitude&&p.longitude?` · ${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}`:''); document.getElementById('modalSummary').textContent=p.description||''; document.getElementById('modalHistory').textContent=p.history||'Historical information for this place will be added to the destination database.'; document.getElementById('modalPhoto').innerHTML=p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}">`:'<div class="modal-photo-loading">Photo coming soon.</div>'; const link=p.map_url||mapSearch(p.name,c.name); document.getElementById('modalMapLink').href=link; document.getElementById('modalMap').src=p.latitude&&p.longitude?`https://www.google.com/maps?q=${p.latitude},${p.longitude}&output=embed`:mapEmbed(p.name,c.name);
  }

  async function start(){const data=await fetchData();if(data&&data.places)render(data);}
  window.addEventListener('unseengo:supabase-ready',start); if(getClient()) start();
})();
