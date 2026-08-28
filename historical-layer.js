/* UnseenGo AI — historical / cultural economy layer.
 * Adds regionally relevant heritage cards without requiring a Supabase schema change.
 * Unseen Score is a curated discovery score, not a live popularity metric.
 */
(function(){
  'use strict';
  const DATA = window.UNSEENGO_HISTORICAL_PLACES || {};
  const AP_HIDDEN = [
    {name:'Salihundam Buddhist Heritage Site',location:'Salihundam, Srikakulam district, Andhra Pradesh',category:'Buddhist Heritage',description:'An ancient Buddhist archaeological complex with stupas, monasteries, sculptures and inscriptions.',history:'Salihundam preserves multiple phases of Buddhist activity and is one of Andhra Pradesh’s important lesser-known archaeological landscapes.',unseen_score:95,maps_url:'https://www.google.com/maps/search/?api=1&query=Salihundam+Buddhist+Site+Andhra+Pradesh'},
    {name:'Guntupalli Buddhist Caves',location:'Guntupalli, Eluru district, Andhra Pradesh',category:'Buddhist Heritage',description:'Ancient rock-cut Buddhist caves, a chaitya hall and groups of stupas in a quiet hill setting.',history:'The Guntupalli group preserves an important Buddhist monastic and architectural landscape with rock-cut and structural remains.',unseen_score:94,maps_url:'https://www.google.com/maps/search/?api=1&query=Guntupalli+Buddhist+Caves+Andhra+Pradesh'},
    {name:'Konakondla — Rasasiddula Gutta',location:'Konakondla, Anantapur district, Andhra Pradesh',category:'Jain Heritage',description:'A lesser-known Jain archaeological landscape containing caves, rock beds, sculptures and Nishidhi stones.',history:'Konakondla is associated with Jain heritage and traditions connected with Acharya Kundakunda. Its archaeological remains make it a strong hidden-history destination.',unseen_score:96,maps_url:'https://www.google.com/maps/search/?api=1&query=Konakondla+Rasasiddula+Gutta+Andhra+Pradesh'},
    {name:'Rayadurgam Fort',location:'Rayadurgam, Anantapur district, Andhra Pradesh',category:'Fort & Heritage',description:'A dramatic hill-fort landscape with layers of Vijayanagara and regional Rayalaseema history.',history:'Rayadurgam developed as a fortified regional center and preserves fortifications associated with the historic political landscape of Rayalaseema.',unseen_score:92,maps_url:'https://www.google.com/maps/search/?api=1&query=Rayadurgam+Fort+Andhra+Pradesh'},
    {name:'Bojjannakonda Buddhist Heritage',location:'Sankaram, near Anakapalle, Andhra Pradesh',category:'Buddhist Heritage',description:'A hilltop archaeological complex of stupas, caves and Buddhist sculptures.',history:'Bojjannakonda forms part of the Sankaram Buddhist archaeological landscape and preserves evidence of ancient monastic activity.',unseen_score:91,maps_url:'https://www.google.com/maps/search/?api=1&query=Bojjannakonda+Buddhist+Site+Andhra+Pradesh'},
    {name:'Pavurallakonda Buddhist Heritage Site',location:'Bheemunipatnam, Visakhapatnam district, Andhra Pradesh',category:'Buddhist Archaeology',description:'A lesser-known hilltop Buddhist archaeological site overlooking the coastal landscape.',history:'Pavurallakonda preserves archaeological remains associated with ancient Buddhist activity along the northern Andhra coast.',unseen_score:93,maps_url:'https://www.google.com/maps/search/?api=1&query=Pavurallakonda+Buddhist+Site+Andhra+Pradesh'},
    {name:'Bavikonda Buddhist Complex',location:'Visakhapatnam, Andhra Pradesh',category:'Buddhist Heritage',description:'An ancient Buddhist monastic complex on a hill overlooking the coast.',history:'Bavikonda contains stupas, viharas, halls and other archaeological remains demonstrating the importance of Buddhism in ancient coastal Andhra.',unseen_score:88,maps_url:'https://www.google.com/maps/search/?api=1&query=Bavikonda+Buddhist+Site+Visakhapatnam'},
    {name:'Kondaveedu Fort',location:'Kondaveedu, Guntur district, Andhra Pradesh',category:'Fort & Medieval Heritage',description:'A historic hill fortress associated with the medieval Reddy kingdom and later Deccan powers.',history:'Kondaveedu was a major medieval fortified center and preserves extensive hilltop fortifications, gateways and associated heritage remains.',unseen_score:89,maps_url:'https://www.google.com/maps/search/?api=1&query=Kondaveedu+Fort+Andhra+Pradesh'},
    {name:'Ramayapatnam Coastal Heritage',location:'Ramayapatnam, Prakasam district, Andhra Pradesh',category:'Coastal & Maritime Heritage',description:'A quieter coastal heritage landscape with a historic lighthouse and maritime associations.',history:'Ramayapatnam forms part of the maritime heritage landscape of the Andhra coast and offers a less conventional historical travel experience.',unseen_score:86,maps_url:'https://www.google.com/maps/search/?api=1&query=Ramayapatnam+Lighthouse+Andhra+Pradesh'},
    {name:'Gandikota Fort & Heritage Landscape',location:'Gandikota, Kadapa district, Andhra Pradesh',category:'Fort & Heritage Landscape',description:'A historic fort landscape above the Pennar gorge with temples, mosques and massive defensive walls.',history:'Gandikota developed under several Deccan and South Indian powers and preserves a layered medieval fort, religious architecture and the famous Pennar gorge landscape.',unseen_score:82,maps_url:'https://www.google.com/maps/search/?api=1&query=Gandikota+Fort+Andhra+Pradesh'}
  ];
  const city = new URLSearchParams(location.search).get('city') || '';
  const places = DATA[city] || (city.toLowerCase()==='andhra pradesh' ? AP_HIDDEN : []);
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
    places.forEach((p,i)=>{
      const card=document.createElement('article');
      card.className='city-place-card historical-place-card';
      card.tabIndex=0; card.dataset.category=p.category; card.dataset.name=p.name.toLowerCase();
      const score = Number.isFinite(Number(p.unseen_score)) ? `<b class="unseen-score">✦ ${esc(p.unseen_score)}/100 UNSEEN</b>` : '<b>✦ HISTORY</b>';
      card.innerHTML=`<div class="place-image historical-photo" id="hist-img-${i}"><div class="image-loader">✦<span>Loading heritage photo…</span></div></div><div class="place-card-body"><div class="place-top"><span>HERITAGE</span>${score}</div><small class="place-category">${esc(p.category)}</small><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="place-location">⌖ ${esc(p.location)}</div><div class="card-action-hint">Click anywhere to explore complete heritage details <span>→</span></div></div>`;
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
    const origin=document.getElementById('transportOrigin'); const dest=document.getElementById('transportDestination');
    if(dest)dest.textContent=p.name; if(origin)origin.value='';
    const direction=document.getElementById('directionLink'); const pickup=document.getElementById('pickupLink');
    const updateRoute=()=>{const mode=document.querySelector('.transport-mode.active')?.dataset.mode||'driving';const tm=['bus','train','metro'].includes(mode)?'transit':mode==='flight'?'driving':mode;if(direction)direction.href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(p.name+' '+p.location)+(origin?.value?'&origin='+encodeURIComponent(origin.value):'')+'&travelmode='+tm;if(pickup)pickup.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('transport near '+p.name+' '+p.location);};
    document.querySelectorAll('.transport-mode').forEach(b=>{b.onclick=e=>{e.stopPropagation();document.querySelectorAll('.transport-mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');updateRoute();}});
    if(origin)origin.oninput=updateRoute; updateRoute();
    photo(p.name,p.location).then(url=>{if(url&&m.classList.contains('open'))document.getElementById('modalPhoto').innerHTML=`<img src="${esc(url)}" alt="${esc(p.name)}">`;});
  }

  let tries=0; const timer=setInterval(()=>{if(addCards()||++tries>80)clearInterval(timer);},250);
})();
