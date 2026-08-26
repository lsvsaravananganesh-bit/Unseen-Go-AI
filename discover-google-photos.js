/* Real Google Places photos for Discover cards. Never uses stock/fake imagery. */
(function(){'use strict';
const ENDPOINT='https://jpqbvliaaucyqnhcclbz.supabase.co/functions/v1/google-place-photos';
const cache=new Map();
async function load(card){
 if(!card||card.dataset.googlePhoto==='1')return;
 const holder=card.querySelector('.attraction-image');
 const name=card.querySelector('.attraction-body h3')?.textContent?.trim();
 const city=card.dataset.city||new URLSearchParams(location.search).get('city')||'';
 if(!holder||!name||!city)return;
 card.dataset.googlePhoto='1';
 const key=name+'|'+city;
 try{
  let data=cache.get(key);
  if(!data){const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({place:name,city})});if(!r.ok)throw new Error('Google Places photo service failed');data=await r.json();cache.set(key,data);}
  const photo=Array.isArray(data.photos)?data.photos[0]:null;
  holder.style.backgroundImage='none';
  if(photo&&photo.url){holder.style.backgroundImage=`url("${photo.url.replace(/"/g,'%22')}")`;holder.classList.add('real-google-photo');const s=holder.querySelector('.photo-status');if(s)s.textContent='Google Maps / Places photo';}
  else {holder.classList.add('real-photo-unavailable');const s=holder.querySelector('.photo-status');if(s)s.innerHTML='<b>Real photo unavailable</b><small>No Google Places photo was returned.</small>';}
 }catch(e){holder.style.backgroundImage='none';holder.classList.add('real-photo-unavailable');const s=holder.querySelector('.photo-status');if(s)s.innerHTML='<b>Real photo unavailable</b><small>Google Places photo could not be loaded.</small>';}
}
function scan(){document.querySelectorAll('#attractionGrid .attraction-card').forEach(load);}
function start(){const grid=document.getElementById('attractionGrid');if(!grid)return;new MutationObserver(scan).observe(grid,{childList:true,subtree:true});scan();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();