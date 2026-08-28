/* UnseenGo AI — Phase 2C
 * Supabase is the source of truth for city data.
 * Google Places (New) is used through a Supabase Edge Function for live place photos/maps.
 * The Google API key is NEVER exposed in this browser code.
 */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const city = new URLSearchParams(location.search).get('city') || '';
  let dataset = null;
  const photoCache = new Map();
  function getClient() { return window.unseenGoSupabase || null; }
  async function fetchData() { if (!city || !window.UnseenGoData?.loadCity) return null; return await window.UnseenGoData.loadCity(city); }
  function mapSearch(name, placeCity) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' ' + placeCity); }
  function mapEmbed(name, placeCity) { return 'https://www.google.com/maps?q=' + encodeURIComponent(name + ' ' + placeCity) + '&output=embed'; }
  async function googlePlacePhotos(place, placeCity) {
    const key = place + '|' + placeCity;
    if (photoCache.has(key)) return photoCache.get(key);
    const sb = getClient(); if (!sb) return null;
    try {
      const { data, error } = await sb.functions.invoke('google-place-photos', { body: { place, city: placeCity } });
      if (error || !data || !data.place) return null;
      const result = { ...data.place, photos: Array.isArray(data.photos) ? data.photos : [] };
      photoCache.set(key, result); return result;
    } catch (e) { console.warn('UnseenGo AI: Google Places photo lookup failed.', e); return null; }
  }
  function attributionHtml(attributions) {
    if (!Array.isArray(attributions) || !attributions.length) return '';
    return attributions.map(a => { const name=esc(a.displayName||a.uri||'Google Maps contributor'); const uri=a.uri?esc(a.uri):'#'; return a.uri?`<a href="${uri}" target="_blank" rel="noopener">${name}</a>`:name; }).join(', ');
  }
  async function enrichPlace(p, cardIndex) {
    if (!p || p.image_url) return null;
    const result = await googlePlacePhotos(p.name, dataset.city.name); if (!result) return null;
    p.google_place_id=result.id||p.google_place_id; p.latitude=result.latitude??p.latitude; p.longitude=result.longitude??p.longitude; p.map_url=result.mapsUrl||p.map_url; p.google_photos=result.photos||[];
    const first=p.google_photos[0]; const card=document.querySelector(`.city-place-card[data-index="${cardIndex}"] .place-image`);
    if(card&&first?.url) card.innerHTML=`<img src="${esc(first.url)}" alt="${esc(p.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\'image-fallback\'>✦<span>Photo unavailable</span></div>'">`;
    return result;
  }
  function renderReviews(reviews, places) {
    const host=document.getElementById('localReviews'); if(!host)return;
    if(!reviews?.length){host.innerHTML='<div class="review-empty"><div class="review-stars">★★★★★</div><h3>Traveller reviews are coming soon</h3><p>Verified traveller experiences will appear here after approved reviews are submitted.</p></div>';return;}
    const names=Object.fromEntries(places.map(p=>[p.id,p.name]));
    host.innerHTML=reviews.map(r=>`<article class="traveller-review-card"><div class="review-card-top"><span>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>${r.is_verified?'<b>✓ Verified</b>':''}</div><h3>${esc(r.title||names[r.place_id]||'Traveller experience')}</h3><p>${esc(r.body)}</p><small>${esc(names[r.place_id]||'Place')}</small></article>`).join('');
  }
  function render(data) {
    dataset=data; const c=data.city, places=data.places; document.title=c.name+' — UnseenGo AI';
    const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value??'';};
    set('cityName',c.name); set('cityRegion',c.region?c.region+' India':'India'); set('cityIntro',c.description||`Explore ${places.length} places across history, forts, nature, culture, food, adventure and famous landmarks.`); set('cityHistory',c.history||'Discover the architecture, communities, landscapes and traditions that shaped this destination.'); set('placeCount',places.length); set('categoryCount',new Set(places.map(p=>p.category)).size);
    const filters=document.getElementById('categoryFilters'); const cats=['All',...new Set(places.map(p=>p.category).filter(Boolean))]; if(filters)filters.innerHTML=cats.map((x,i)=>`<button class="filter-btn ${i===0?'active':''}" data-filter="${esc(x)}">${esc(x)}</button>`).join('');
    const grid=document.getElementById('cityPlaces');
    if(grid)grid.innerHTML=places.map((p,i)=>`<article class="city-place-card" data-index="${i}" data-category="${esc(p.category)}" data-name="${esc(p.name).toLowerCase()}"><div class="place-image">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`:'<div class="image-fallback">✦<span>Finding place photos…</span></div>'}</div><div class="place-card-body"><div class="place-top"><span>${p.is_famous?'FAMOUS':p.is_hidden_gem?'HIDDEN GEM':'CURATED'}</span>${p.unseen_score!=null?`<b class="unseen-score">✦ ${esc(p.unseen_score)}/100 UNSEEN</b>`:''}</div><small class="place-category">${esc(p.category||'Place')}</small><h3>${esc(p.name)}</h3><p>${esc(p.description||'Explore this destination and its story.')}</p><div class="place-location">⌖ ${esc(c.name)}</div><button class="details-button" data-place="${i}">View history, photos & map →</button></div></article>`).join('');
    document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.city-place-card').forEach(card=>card.hidden=f!=='All'&&card.dataset.category!==f);}));
    document.querySelectorAll('.details-button').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();openPlace(Number(btn.dataset.place));}));
    document.querySelectorAll('.city-place-card').forEach(card=>card.addEventListener('click',e=>{if(!e.target.closest('button'))openPlace(Number(card.dataset.index));}));
    const stays=document.getElementById('cityStays'); if(stays)stays.innerHTML=data.stays.length?data.stays.map(s=>`<article class="city-stay"><span>${esc(s.stay_type)}</span><h3>${esc(s.area)}</h3><b>${esc(s.budget_band||'Budget varies')}</b><p>${esc(s.description||'Explore accommodation options in this area.')}</p><a target="_blank" rel="noopener" href="${esc(s.map_url||('https://www.google.com/maps/search/hotels+in/'+encodeURIComponent(s.area+' '+c.name)))}">Find stays nearby ↗</a></article>`).join(''):'<div class="city-empty">Accommodation data will appear here as stays are added.</div>';
    const search=document.getElementById('placeSearch'); if(search)search.oninput=()=>{const q=search.value.toLowerCase().trim();document.querySelectorAll('.city-place-card').forEach(card=>card.hidden=!!q&&!card.dataset.name.includes(q));};
    renderReviews(data.reviews||[],places); places.forEach((p,i)=>{if(!p.image_url)enrichPlace(p,i);});
  }
  async function openPlace(i) {
    const p=dataset?.places?.[i]; if(!p)return; const c=dataset.city, modal=document.getElementById('placeModal'); if(!modal)return;
    modal.classList.add('open'); document.getElementById('modalTitle').textContent=p.name; document.getElementById('modalCategory').textContent=(p.category||'PLACE').toUpperCase(); document.getElementById('modalLocation').textContent=c.name+(p.latitude&&p.longitude?` · ${Number(p.latitude).toFixed(4)}, ${Number(p.longitude).toFixed(4)}`:''); document.getElementById('modalSummary').textContent=(p.unseen_score!=null?`Unseen Score: ${p.unseen_score}/100 — `:'')+(p.description||''); document.getElementById('modalHistory').textContent=p.history||'Historical information for this place will be added to the destination database.'; document.getElementById('modalPhoto').innerHTML=p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}">`:'<div class="modal-photo-loading">Finding Google Photos…</div>'; document.getElementById('modalGallery').innerHTML=''; document.getElementById('photoCredit').textContent='';
    const result=await googlePlacePhotos(p.name,c.name); if(result){p.google_place_id=result.id||p.google_place_id;p.latitude=result.latitude??p.latitude;p.longitude=result.longitude??p.longitude;p.map_url=result.mapsUrl||p.map_url;p.google_photos=result.photos||[];}
    const photos=p.google_photos||[]; if(p.image_url)document.getElementById('modalPhoto').innerHTML=`<img src="${esc(p.image_url)}" alt="${esc(p.name)}">`; else if(photos[0]?.url)document.getElementById('modalPhoto').innerHTML=`<img src="${esc(photos[0].url)}" alt="${esc(p.name)}">`; else document.getElementById('modalPhoto').innerHTML='<div class="modal-photo-loading">No Google photo was returned for this place.</div>';
    if(photos.length>1)document.getElementById('modalGallery').innerHTML=photos.slice(1,6).map(x=>`<figure><img src="${esc(x.url)}" alt="${esc(p.name)}" loading="lazy"></figure>`).join('');
    const attribution=photos.flatMap(x=>x.attributions||[]); document.getElementById('photoCredit').innerHTML=attribution.length?`Photo attribution: ${attributionHtml(attribution)}`:(photos.length?'Photos provided through Google Places.':'');
    document.getElementById('modalMapLink').href=p.map_url||mapSearch(p.name,c.name); document.getElementById('modalMap').src=p.latitude&&p.longitude?`https://www.google.com/maps?q=${encodeURIComponent(p.latitude+','+p.longitude)}&output=embed`:mapEmbed(p.name,c.name);
  }
  async function start(){const data=await fetchData();if(data&&data.places)render(data);}
  window.addEventListener('unseengo:supabase-ready',start); if(getClient())start();
})();
