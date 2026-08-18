/* UnseenGo AI — Google Maps / Places photo enforcement
   Uses the existing Supabase Google Places photo proxy so the Google API key stays server-side.
   Every displayed place image is replaced with a Google Places photo when one is available.
*/
(function(){
 const PHOTO_ENDPOINT='https://jpqbvliaaucyqnhcclbz.supabase.co/functions/v1/google-place-photos';
 const cache=new Map();
 const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
 async function photos(place,city){
   const key=place+'|'+city;if(cache.has(key))return cache.get(key);
   try{const r=await fetch(PHOTO_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({place,city})});if(!r.ok)throw new Error('photo request failed');const d=await r.json();const out=Array.isArray(d.photos)?d.photos.filter(x=>x&&x.url):[];cache.set(key,out);return out;}catch(e){cache.set(key,[]);return []}
 }
 async function enforceCards(){
   const cards=[...document.querySelectorAll('.city-place-card')];
   await Promise.all(cards.map(async card=>{
     const name=card.querySelector('.place-card-body h3')?.textContent?.trim();
     const city=card.querySelector('.place-location')?.textContent?.replace(/^⌖\s*/,'').split(' · ')[0].trim()||new URLSearchParams(location.search).get('city')||'';
     const holder=card.querySelector('.place-image');if(!name||!holder)return;
     holder.classList.add('google-photo-loading');
     const imgs=await photos(name,city);
     if(imgs[0]){holder.innerHTML='<img src="'+esc(imgs[0].url)+'" alt="'+esc(name)+' — Google Maps photo" loading="lazy">';holder.classList.add('google-photo');holder.title='Photo from Google Maps / Places';}
     else{holder.innerHTML='<div class="google-photo-unavailable"><b>Photo unavailable</b><span>Google Maps has no photo for this place</span></div>';holder.classList.add('google-photo-missing');}
   }));
 }
 async function enforceModal(){
   const title=document.getElementById('modalTitle');const locationEl=document.getElementById('modalLocation');const holder=document.getElementById('modalPhoto');
   if(!title||!locationEl||!holder)return;
   const name=title.textContent.trim();const city=locationEl.textContent.trim()||new URLSearchParams(location.search).get('city')||'';
   if(!name)return;const imgs=await photos(name,city);
   if(imgs[0]){holder.innerHTML='<img src="'+esc(imgs[0].url)+'" alt="'+esc(name)+' — Google Maps photo" loading="lazy">';document.getElementById('photoCredit').textContent='Photo from Google Maps / Places. Required attribution is shown when supplied by Google.';}
   else{holder.innerHTML='<div class="google-photo-unavailable modal-google-photo-unavailable"><b>No Google Maps photo available</b><span>This place has no photo returned by Google Places.</span></div>';document.getElementById('photoCredit').textContent='Google Places returned no photo for this place.';}
 }
 function observe(){
   const grid=document.getElementById('cityPlaces');if(grid){new MutationObserver(()=>{if(grid.querySelector('.city-place-card'))enforceCards();}).observe(grid,{childList:true});}
   const modal=document.getElementById('placeModal');if(modal){new MutationObserver(()=>{if(modal.classList.contains('open'))enforceModal();}).observe(modal,{attributes:true,childList:true,subtree:true});}
   setTimeout(enforceCards,1200);
 }
 window.addEventListener('DOMContentLoaded',observe);
})();
