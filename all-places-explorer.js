/* UnseenGo AI — All Places Explorer */
(function(){
  const TYPES={Nature:'Nature & Outdoors',Heritage:'Historical Places & Forts',Food:'Food & Local Life',Culture:'Culture & Museums',Adventure:'Adventure & Day Trips'};
  const ICONS={Nature:'🌿',Heritage:'🏛️',Food:'🍽️',Culture:'🎭',Adventure:'⛰️'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let active='All Places';
  function city(){return document.getElementById('citySelect')?.value||'';}
  function getPlaces(){
    const c=window.cities?.[city()]; if(!c)return [];
    return Object.keys(TYPES).flatMap(k=>(Array.isArray(c[k])?c[k]:[]).map(p=>({type:k,name:p[0],location:p[1],score:p[2],desc:p[3]})));
  }
  function ensure(){
    const results=document.querySelector('.results'); if(!results||document.getElementById('allPlacesExplorer'))return;
    const box=document.createElement('div'); box.id='allPlacesExplorer'; box.className='all-places-explorer';
    box.innerHTML=`<div class="all-places-heading"><div><p class="eyebrow">EXPLORE THE COMPLETE CITY</p><h3>All places in <em id="allPlacesCity">your city</em></h3><p>Historical places, forts, temples, nature spots, museums, food trails, culture and adventure — all organized in one place.</p></div><span id="allPlacesCount" class="place-count">0 places</span></div><div class="place-filters" id="placeFilters"></div><div class="all-place-grid" id="allPlaceGrid"></div>`;
    results.parentNode.insertBefore(box,results);
  }
  function render(){
    ensure(); const c=city(); const places=getPlaces();
    const cityLabel=document.getElementById('allPlacesCity'); const count=document.getElementById('allPlacesCount'); const filters=document.getElementById('placeFilters'); const grid=document.getElementById('allPlaceGrid');
    if(!cityLabel||!filters||!grid)return;
    cityLabel.textContent=c||'your city';
    const cats=['All Places',...Object.keys(TYPES)];
    filters.innerHTML=cats.map(x=>`<button class="place-filter ${active===x?'active':''}" data-filter="${x}">${x==='All Places'?'✦':ICONS[x]||''} ${x}</button>`).join('');
    filters.querySelectorAll('button').forEach(b=>b.onclick=()=>{active=b.dataset.filter;render();});
    const visible=active==='All Places'?places:places.filter(p=>p.type===active);
    count.textContent=`${visible.length} ${visible.length===1?'place':'places'}`;
    grid.innerHTML=visible.length?visible.map(p=>`<article class="all-place-card" data-place="${esc(p.name)}"><div class="place-card-top"><span>${ICONS[p.type]} ${esc(TYPES[p.type])}</span><b>✦ ${esc(p.score)}/100</b></div><h4>${esc(p.name)}</h4><small>📍 ${esc(p.location)}</small><p>${esc(p.desc)}</p><button type="button" class="view-place">View story & details →</button></article>`).join(''):`<div class="no-places">No places found in this category yet.</div>`;
    grid.querySelectorAll('.view-place').forEach(btn=>btn.onclick=()=>{const card=btn.closest('.all-place-card');window.openPlaceStory?.(card.dataset.place,card.querySelector('.place-card-top span').textContent);});
  }
  function hook(){
    ensure();
    const original=window.setCity;
    if(typeof original==='function'&&!original.__allPlacesWrapped){
      const wrapped=function(v){const r=original.apply(this,arguments);active='All Places';setTimeout(render,80);return r;}; wrapped.__allPlacesWrapped=true;window.setCity=wrapped;
    }
    render();
  }
  window.addEventListener('DOMContentLoaded',hook); setTimeout(hook,1000); setTimeout(render,1800);
})();