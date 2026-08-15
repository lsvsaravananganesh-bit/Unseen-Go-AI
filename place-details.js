/* UnseenGo AI — richer place details layer */
(function(){
  const escDetail=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const cityNow=()=>document.getElementById('citySelect')?.value||document.getElementById('heroCity')?.value||'';

  function findCuratedPlace(title,city){
    const data=window.cities?.[city];
    if(!data)return null;
    for(const category of Object.keys(data)){
      if(category==='region'||!Array.isArray(data[category]))continue;
      const row=data[category].find(x=>x?.[0]===title);
      if(row)return {category,row};
    }
    return null;
  }

  function ensureDetails(){
    const modal=document.getElementById('placeModal');
    if(!modal||modal.querySelector('.place-extra-details'))return;
    const card=modal.querySelector('.modal-card');
    if(!card)return;
    const block=document.createElement('div');
    block.className='place-extra-details';
    block.innerHTML='<div class="place-detail-grid" id="placeDetailGrid"></div><div class="place-actions" id="placeActions"></div>';
    const note=card.querySelector('.history-note');
    card.insertBefore(block,note||null);
  }

  function renderDetails(title,type){
    ensureDetails();
    const grid=document.getElementById('placeDetailGrid');
    const actions=document.getElementById('placeActions');
    if(!grid||!actions)return;
    const city=cityNow();
    const curated=findCuratedPlace(title,city);
    const category=curated?.category||(/famous/i.test(type)?'Famous landmark':'Hidden gem');
    const row=curated?.row;
    const location=row?.[1]||`${city} · City`;
    const score=row?.[2];
    const blurb=row?.[3]||'Explore the place and discover its local character.';
    const mapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(title+' '+city);
    const stays=(window.stayData?.[city]||[]).slice(0,3);
    grid.innerHTML=`<div><span>TYPE</span><strong>${escDetail(category)}</strong></div><div><span>LOCATION</span><strong>${escDetail(location)}</strong></div>${score?`<div><span>UNSEENGO SCORE</span><strong>✦ ${escDetail(score)}/100</strong></div>`:''}<div><span>WHY VISIT</span><strong>${escDetail(blurb)}</strong></div>`;
    actions.innerHTML=`<a href="${mapUrl}" target="_blank" rel="noopener noreferrer">Open location in Maps ↗</a>`+(stays.length?`<div class="nearby-stays"><span>GOOD AREAS TO STAY</span>${stays.map(s=>`<a href="https://www.google.com/maps/search/hotels+in+${encodeURIComponent(s[0]+' '+city)}" target="_blank" rel="noopener noreferrer">${escDetail(s[0])}</a>`).join('')}</div>`:'');
  }

  function hook(){
    if(typeof window.openPlaceStory!=='function'||window.openPlaceStory.__detailsWrapped)return;
    const original=window.openPlaceStory;
    const wrapped=async function(title,type){
      const result=await original(title,type);
      ensureDetails();
      renderDetails(title,type);
      return result;
    };
    wrapped.__detailsWrapped=true;
    window.openPlaceStory=wrapped;
  }

  document.addEventListener('keydown',e=>{if(e.key==='Escape')window.closePlaceStory?.();});
  window.addEventListener('DOMContentLoaded',hook);
  setTimeout(hook,1200);
})();
