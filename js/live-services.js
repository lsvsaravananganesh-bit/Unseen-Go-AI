/* UnseenGo live-service bridge. Safe for GitHub Pages: provider secrets stay server-side. */
(function(){'use strict';
 async function json(url,options){const r=await fetch(url,options);const d=await r.json();if(!r.ok)throw new Error(d.error||'Service unavailable');return d;}
 window.UnseenGoLive={
  weather:(lat,lng,city)=>json(`/api/weather?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&city=${encodeURIComponent(city||'')}`),
  places:(q,lat,lng)=>json(`/api/places?textQuery=${encodeURIComponent(q)}${lat!=null?`&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`:''}`),
  stays:(city,lat,lng)=>json(`/api/stays?city=${encodeURIComponent(city||'')}${lat!=null?`&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`:''}`),
  transport:(a,b,mode='DRIVE')=>json(`/api/transport?originLat=${a.lat}&originLng=${a.lng}&destinationLat=${b.lat}&destinationLng=${b.lng}&mode=${encodeURIComponent(mode)}`),
  aiPlan:(request,context)=>json('/api/ai-plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({request,context})})
 };
})();
