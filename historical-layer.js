/* UnseenGo AI — historical / cultural economy layer.
 * Adds regionally relevant heritage cards without requiring a Supabase schema change.
 */
(function(){
  'use strict';
  const DATA = window.UNSEENGO_HISTORICAL_PLACES || {};
  const city = new URLSearchParams(location.search).get('city') || '';
  const places = DATA[city] || [];
  if (!places.length) return;

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const maps=(name,loc)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' '+loc);
  const embed=(name,loc)=>'https://www.google.com/maps?q='+encodeURIComponent(name+' '+loc)+'&output=embed';
  const photoEndpoint='https://jpqbvliaaucyqnhcclbz.supabase.co/functions/v1/google-place-photos';

  async function photo(name,loc){
    try{const r=await fetch(photoEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({place:name,city:loc})});if(r.ok){const d=await r.json();if(d?.photos?.[0]?.url)return d.photos[0].url;}}catch(e){}
    return '';
  }

  function addCards(){
    const grid=document.getElementById('cityPlaces');
    if(!grid || grid.dataset.historicalLayer==='1') return !!grid;
    grid.dataset.historicalLayer='1';
    const start=grid.querySelectorAll('.city-place-card').length;
    places.forEach((p,i)=>{
      const card=document.createElement('article');
      card.className='city-place-card historical-place-card';
      card.tabIndex=0; card.dataset.category=p.category; card.dataset.name=p.name.toLowerCase();
      card.innerHTML=`<div class="place-image historical-photo" id="hist-img-${i}"><div class="image-loader">✦<span>Loading heritage photo…</span></div></div><div class="place-card-body"><div class="place-top"><span>HERITAGE</span><b>✦ HISTORY</b></div><small class="place-category">${esc(p.category)}</small><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="place-location">⌖ ${esc(p.location)}</div><div class="card-action-hint">Click anywhere to explore complete heritage details <span>→</span></div></div>`;
      const open=()=>openHeritage(p);
      card.addEventListener('click',open); card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
      grid.appendChild(card);
      photo(p.name,p.location).then(url=>{const box=document.getElementById('hist-img-'+i);if(box&&url){box.innerHTML=`<img src="${esc(url)}" alt="${esc(p.name)}" loading="lazy">`;}});
    });
    const count=document.getElementById('placeCount'); if(count) count.textContent=Number(count.textContent||0)+places.length;
    const cat=document.getElementById('categoryCount'); if(cat) cat.textContent=Number(cat.textContent||0)+new Set(places.map(x=>x.category)).size;
    return true;
  }

  function openHeritage(p){
    const m=document.getElementById('placeModal'); if(!m)return;
    m.style.display='block';m.style.pointerEvents='auto';m.classList.add('open');
    document.getElementById('modalTitle').textContent=p.name;
    document.getElementById('modalCategory').textContent=p.category.toUpperCase();
    document.getElementById('modalLocation').textContent=p.location;
    document.getElementById('modalSummary').textContent=p.description;
    document.getElementById('modalHistory').textContent=p.history;
    document.getElementById('modalPhoto').innerHTML='<div class="modal-photo-loading">Loading heritage photo…</div>';
    document.getElementById('modalGallery').innerHTML='';
    document.getElementById('photoCredit').textContent='';
    document.getElementById('modalMapLink').href=p.maps_url||maps(p.name,p.location);
    document.getElementById('modalMap').src=embed(p.name,p.location);
    const origin=document.getElementById('transportOrigin');
    const dest=document.getElementById('transportDestination');
    if(dest)dest.textContent=p.name;
    if(origin)origin.value='';
    const direction=document.getElementById('directionLink');
    const pickup=document.getElementById('pickupLink');
    const updateRoute=()=>{
      const mode=document.querySelector('.transport-mode.active')?.dataset.mode||'driving';
      const tm=['bus','train','metro'].includes(mode)?'transit':mode==='flight'?'driving':mode;
      if(direction)direction.href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(p.name+' '+p.location)+(origin?.value?'&origin='+encodeURIComponent(origin.value):'')+'&travelmode='+tm;
      if(pickup)pickup.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('transport near '+p.name+' '+p.location);
    };
    document.querySelectorAll('.transport-mode').forEach(b=>{b.onclick=e=>{e.stopPropagation();document.querySelectorAll('.transport-mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');updateRoute();}});
    if(origin)origin.oninput=updateRoute; updateRoute();
    photo(p.name,p.location).then(url=>{if(url&&m.classList.contains('open'))document.getElementById('modalPhoto').innerHTML=`<img src="${esc(url)}" alt="${esc(p.name)}">`;});
  }

  let tries=0;
  const timer=setInterval(()=>{if(addCards()||++tries>80)clearInterval(timer);},250);
})();
