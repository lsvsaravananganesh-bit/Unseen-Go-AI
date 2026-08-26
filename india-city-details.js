/* UnseenGo AI — India city history + live map detail layer */
(()=>{
  'use strict';
  const css=`
  .ug-city-modal{position:fixed;inset:0;z-index:99999;display:none;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);padding:20px;overflow:auto}
  .ug-city-modal.open{display:flex;align-items:center;justify-content:center}
  .ug-city-dialog{width:min(1120px,100%);max-height:92vh;overflow:auto;background:#0d0d0b;color:#fff;border:1px solid #333;border-radius:24px;box-shadow:0 30px 100px rgba(0,0,0,.45)}
  .ug-city-head{display:flex;justify-content:space-between;gap:20px;padding:28px 30px;border-bottom:1px solid #292923;position:sticky;top:0;background:#0d0d0bee;backdrop-filter:blur(12px);z-index:2}
  .ug-city-kicker{font-size:10px;letter-spacing:2px;font-weight:900;color:#ffd21f}.ug-city-head h2{margin:7px 0 4px;font-size:clamp(30px,5vw,54px);letter-spacing:-2px}.ug-city-sub{color:#a8aaa0;font-size:13px}.ug-city-close{width:40px;height:40px;border:1px solid #45453d;background:#181814;color:#fff;border-radius:50%;font-size:22px;cursor:pointer}
  .ug-city-body{display:grid;grid-template-columns:1.05fr .95fr}.ug-city-history{padding:30px}.ug-city-history h3,.ug-city-map h3{font-size:20px;margin:0 0 12px}.ug-city-history p{color:#c2c4bc;line-height:1.8;font-size:14px}.ug-city-facts{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:22px 0}.ug-city-fact{padding:15px;border:1px solid #2c2c26;border-radius:13px;background:#12120f}.ug-city-fact span{display:block;color:#7f8279;font-size:9px;font-weight:900;letter-spacing:1px}.ug-city-fact strong{display:block;margin-top:5px;font-size:13px}.ug-city-map{padding:30px;background:#090908;border-left:1px solid #292923}.ug-city-map iframe{width:100%;height:390px;border:0;border-radius:16px;margin-top:10px;background:#171713}.ug-city-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}.ug-city-actions a,.ug-city-actions button{border:0;border-radius:9px;padding:12px 14px;background:#ffd21f;color:#080808;font-size:11px;font-weight:900;text-decoration:none;cursor:pointer}.ug-city-actions a.secondary,.ug-city-actions button.secondary{background:#20201b;color:#fff;border:1px solid #393930}.ug-city-source{margin-top:18px;color:#777a72;font-size:10px;line-height:1.6}.ug-city-loading{padding:55px 20px;text-align:center;color:#a8aaa0}.ug-city-spinner{width:30px;height:30px;border:3px solid #333;border-top-color:#ffd21f;border-radius:50%;margin:0 auto 14px;animation:ugspin .8s linear infinite}@keyframes ugspin{to{transform:rotate(360deg)}}
  @media(max-width:760px){.ug-city-body{grid-template-columns:1fr}.ug-city-map{border-left:0;border-top:1px solid #292923}.ug-city-head,.ug-city-history,.ug-city-map{padding:22px}.ug-city-facts{grid-template-columns:1fr 1fr}.ug-city-map iframe{height:300px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const modal=document.createElement('div');modal.className='ug-city-modal';modal.innerHTML=`<div class="ug-city-dialog" role="dialog" aria-modal="true"><div class="ug-city-head"><div><div class="ug-city-kicker">INDIA · CITY STORY</div><h2 id="ugCityTitle">Loading…</h2><div class="ug-city-sub" id="ugCitySub"></div></div><button class="ug-city-close" id="ugCityClose" aria-label="Close">×</button></div><div id="ugCityContent" class="ug-city-loading"><div class="ug-city-spinner"></div>Loading history and location…</div></div>`;document.body.appendChild(modal);
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const wikiTitle=name=>encodeURIComponent(name.trim().replace(/\s+/g,'_'));
  function openModal(city,state){
    $('ugCityTitle').textContent=city;$('ugCitySub').textContent=state?`${state} · India`:'India';modal.classList.add('open');document.body.style.overflow='hidden';
    $('ugCityContent').className='ug-city-loading';$('ugCityContent').innerHTML='<div class="ug-city-spinner"></div>Loading history, coordinates and live map…';
    loadCity(city,state);
  }
  async function loadCity(city,state){
    let data=null,error=null;
    try{const r=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle(city)}`,{headers:{Accept:'application/json'}});if(!r.ok)throw new Error('History unavailable');data=await r.json();}catch(e){error=e;}
    const lat=data?.coordinates?.lat;const lon=data?.coordinates?.lon;const mapQuery=encodeURIComponent(`${city}${state?', '+state:''}, India`);const mapSrc=`https://www.google.com/maps?q=${mapQuery}&output=embed`;
    const history=data?.extract||`We could not load the city history automatically right now. Open the source below or use Maps to explore the destination.`;
    const short=history.length>1400?history.slice(0,1400).replace(/\s+\S*$/,'')+'…':history;
    const wikiUrl=data?.content_urls?.desktop?.page||`https://en.wikipedia.org/wiki/${wikiTitle(city)}`;
    const coordText=lat&&lon?`${Number(lat).toFixed(5)}, ${Number(lon).toFixed(5)}`:'Coordinates from live map';
    $('ugCityContent').className='ug-city-body';$('ugCityContent').innerHTML=`<section class="ug-city-history"><div class="ug-city-kicker">HISTORY</div><h3>About ${esc(city)}</h3><p>${esc(short)}</p><div class="ug-city-facts"><div class="ug-city-fact"><span>LOCATION</span><strong>${esc(state||'India')}</strong></div><div class="ug-city-fact"><span>COORDINATES</span><strong>${esc(coordText)}</strong></div><div class="ug-city-fact"><span>DATA STATUS</span><strong>⚠ Needs verification</strong></div><div class="ug-city-fact"><span>MAP</span><strong>Live Google Maps view</strong></div></div><div class="ug-city-actions"><a href="${wikiUrl}" target="_blank" rel="noopener noreferrer">Read full history ↗</a><a class="secondary" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a><button class="secondary" id="ugUseMyLocation">Use my location</button></div><div class="ug-city-source">History is loaded from the public Wikipedia REST API for broad city coverage. Coordinates/map are shown from the destination search. UnseenGo does not label this content as verified unless a verified source is attached to the underlying record.</div></section><section class="ug-city-map"><div class="ug-city-kicker">REAL-TIME MAP</div><h3>Where is ${esc(city)}?</h3><iframe title="Map of ${esc(city)}" src="${mapSrc}" loading="lazy" allowfullscreen></iframe><div class="ug-city-source">The map is interactive. You can zoom, pan and open the destination in Google Maps for directions. “Real-time” here means a live map interface; the city's geographic coordinates do not move.</div></section>`;
    $('ugUseMyLocation')?.addEventListener('click',()=>useLocation(city,state));
  }
  function useLocation(city,state){
    if(!navigator.geolocation){alert('Your browser does not support location access.');return;}
    navigator.geolocation.getCurrentPosition(pos=>{const dest=encodeURIComponent(`${city}${state?', '+state:''}, India`);const origin=`${pos.coords.latitude},${pos.coords.longitude}`;window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${dest}&travelmode=driving`,'_blank','noopener');},()=>alert('Location permission was not granted. You can still open the destination directly in Google Maps.')); 
  }
  function close(){modal.classList.remove('open');document.body.style.overflow='';}
  document.addEventListener('click',e=>{const cityLink=e.target.closest('.city');if(!cityLink)return;e.preventDefault();const city=cityLink.querySelector('strong')?.textContent?.trim()||'';const state=(cityLink.querySelector('span')?.textContent||'').split('·')[0].trim();if(city)openModal(city,state);});
  $('ugCityClose').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close();});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
