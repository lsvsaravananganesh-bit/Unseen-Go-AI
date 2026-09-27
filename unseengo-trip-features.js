/* UnseenGo AI — Save/Favorites + travel information + safety layer */
(function(){
'use strict';
const KEY='unseengo_saved_places';
const TRIP_KEY='unseengo-trip';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function read(key,fallback=[]){try{const v=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(v)?v:fallback}catch(_){return fallback}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent('unseengo:storage',{detail:{key,value}}))}
function requestedPlace(){const p=new URLSearchParams(location.search);return(p.get('place')||p.get('destination')||p.get('city')||'').trim()}
function addTripLink(){
 document.querySelectorAll('nav').forEach(nav=>{
   if(nav.querySelector('[data-my-trip-link]'))return;
   const a=document.createElement('a');a.href='my-trip.html';a.textContent='🧳 My Trip';a.dataset.myTripLink='1';nav.appendChild(a);
 });
}
function saveButton(){
 const app=document.getElementById('placeApp');if(!app||document.getElementById('ugSavePlace'))return;
 const name=requestedPlace();if(!name)return;
 const saved=read(KEY).some(x=>String(x).toLowerCase()===name.toLowerCase());
 const b=document.createElement('button');b.type='button';b.id='ugSavePlace';b.className='ug-save-place';b.setAttribute('aria-pressed',saved?'true':'false');
 b.innerHTML=saved?'♥ Saved':'♡ Save';
 b.addEventListener('click',()=>{
   let items=read(KEY);
   const i=items.findIndex(x=>String(x).toLowerCase()===name.toLowerCase());
   if(i>=0){items.splice(i,1);b.innerHTML='♡ Save';b.setAttribute('aria-pressed','false')}
   else{items.unshift(name);b.innerHTML='♥ Saved';b.setAttribute('aria-pressed','true')}
   write(KEY,items);
 });
 const target=app.querySelector('.dp-hero-copy,.dp-hero,.destination-hero');
 if(target)target.appendChild(b);else app.prepend(b);
}
function injectStyles(){
 if(document.getElementById('ugTripFeatureStyle'))return;
 const s=document.createElement('style');s.id='ugTripFeatureStyle';s.textContent=
 '.ug-save-place{display:inline-flex;align-items:center;gap:8px;margin-top:14px;padding:10px 15px;border:1px solid #344237;border-radius:999px;background:#101812;color:#d8f36a;font:800 13px system-ui;cursor:pointer}.ug-save-place:hover{border-color:#c8e66a;transform:translateY(-1px)}.ug-travel-info{margin:28px 0;padding:22px;border:1px solid #29392d;border-radius:18px;background:#0d1510;color:#f5f7f2}.ug-travel-info h2{margin:0 0 7px;font-size:24px}.ug-travel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.ug-travel-card{padding:15px;border:1px solid #29392d;border-radius:13px;background:#121d15}.ug-travel-card b{display:block;margin-bottom:5px}.ug-travel-card span{color:#aab5ab;font-size:12px;line-height:1.5}.ug-travel-card a{color:#d8f36a}.ug-safety{margin:18px 0;padding:20px;border:1px solid #4a3a2a;border-radius:18px;background:#17140f}.ug-safety h2{margin:0 0 6px}.ug-safety p{color:#b9b2a6;font-size:12px}.ug-safety-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:9px}.ug-safety-grid a{padding:12px 8px;text-align:center;border:1px solid #463a2c;border-radius:12px;color:#f5f7f2;text-decoration:none;background:#1d1913;font-weight:800;font-size:11px}.ug-safety-grid a strong{display:block;font-size:16px;margin-bottom:4px}.ug-trip-link{display:inline-flex!important;align-items:center}.ug-trip-page{max-width:1100px;margin:0 auto;padding:120px 22px 60px}.ug-trip-page h1{font-size:clamp(36px,6vw,64px);letter-spacing:-2px;margin:5px 0}.ug-trip-toolbar{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}.ug-trip-toolbar button,.ug-trip-toolbar a{padding:10px 14px;border-radius:10px;border:1px solid #344237;background:#121d15;color:#f5f7f2;text-decoration:none;font-weight:800;cursor:pointer}.ug-trip-toolbar .primary{background:#c8e66a;color:#071006;border-color:#c8e66a}.ug-trip-list{display:grid;gap:12px}.ug-trip-day{border:1px solid #29392d;border-radius:16px;background:#0d1510;padding:18px}.ug-trip-day h2{margin:0 0 12px;color:#d8f36a}.ug-trip-stop{display:grid;grid-template-columns:42px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-top:1px solid #29392d}.ug-trip-stop:first-of-type{border-top:0}.ug-trip-number{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#c8e66a;color:#071006;font-weight:900}.ug-trip-stop small{display:block;color:#9ca89e;margin-top:3px}.ug-trip-stop button{border:1px solid #3a483d;background:#111b14;color:#d8f36a;border-radius:8px;padding:7px 9px;cursor:pointer}.ug-trip-empty{padding:35px;border:1px dashed #3a483d;border-radius:16px;color:#aab5ab;text-align:center}.ug-favorite-list{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.ug-favorite{padding:16px;border:1px solid #29392d;border-radius:14px;background:#0d1510}.ug-favorite a{color:#f5f7f2;text-decoration:none;font-weight:800}.ug-favorite button{margin-top:10px;border:0;background:transparent;color:#d8f36a;cursor:pointer}.ug-weather-live{color:#d8f36a}.ug-travel-note{margin-top:12px;color:#8f9a91;font-size:11px}.ug-safety-source{margin-top:10px;color:#9ca89e;font-size:10px}@media(max-width:760px){.ug-travel-grid,.ug-favorite-list{grid-template-columns:1fr 1fr}.ug-safety-grid{grid-template-columns:1fr 1fr}.ug-trip-page{padding-top:95px}.ug-trip-stop{grid-template-columns:34px 1fr}.ug-trip-stop button{grid-column:2}.ug-trip-stop{align-items:start}}@media(max-width:460px){.ug-travel-grid,.ug-favorite-list{grid-template-columns:1fr}.ug-safety-grid{grid-template-columns:1fr 1fr}.ug-save-place{width:100%;justify-content:center}}';
 document.head.appendChild(s);
}
async function weather(lat,lng,el){
 if(lat==null||lng==null)return;
 try{const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(lat)+'&longitude='+encodeURIComponent(lng)+'&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto');const d=await r.json();const c=d.current||{};const labels={0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Snow',73:'Snow',75:'Heavy snow',80:'Showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm'};el.innerHTML='<span class="ug-weather-live">'+Math.round(c.temperature_2m??0)+'°C · '+(labels[c.weather_code]||'Current conditions')+'</span> · feels '+Math.round(c.apparent_temperature??c.temperature_2m??0)+'°C';}catch(_){el.textContent='Live weather temporarily unavailable'}}
function addDestinationInfo(){
 const app=document.getElementById('placeApp');if(!app||app.dataset.tripFeatures==='1')return;
 const placeName=requestedPlace()||'Destination';const hero=app.querySelector('.dp-hero');
 if(!hero)return;
 app.dataset.tripFeatures='1';saveButton();
 const facts=app.querySelector('.dp-facts,.dp-fact-grid');
 const getText=(label)=>{if(!facts)return'';const nodes=[...facts.querySelectorAll('*')];const n=nodes.find(x=>x.children.length===0&&x.textContent.trim().toLowerCase()===label.toLowerCase());return n?.parentElement?.innerText||''};
 const data=window.UnseenGoDestination||{};
 const weatherId='ugWeather';
 const section=document.createElement('section');section.className='ug-travel-info';section.innerHTML=`<h2>🌦 Important Travel Information</h2><p>Practical travel information is separated from AI recommendations.</p><div class="ug-travel-grid"><div class="ug-travel-card"><b>🌦 Weather</b><span id="${weatherId}">Loading live weather…</span></div><div class="ug-travel-card"><b>🌤 Best visiting season</b><span>${esc(data.bestTime||'Needs verification')}</span></div><div class="ug-travel-card"><b>🕒 Opening hours</b><span>${esc(data.timings||'Needs verification')}</span></div><div class="ug-travel-card"><b>🎟 Entry fee</b><span>${esc(data.entry||'Needs verification')}</span></div><div class="ug-travel-card"><b>♿ Accessibility</b><span>Needs verification unless explicitly supplied by the destination record.</span></div><div class="ug-travel-card"><b>🛣 Road conditions</b><span>Current road conditions are not stored as verified data. Open Maps for live routing.</span></div><div class="ug-travel-card"><b>🍛 Nearby facilities</b><span><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName+' restaurants')}">Restaurants</a> · <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName+' hotels')}">Hotels</a> · <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName+' pharmacy')}">Pharmacy</a></span></div><div class="ug-travel-card"><b>🗺 Directions</b><span><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}">Open destination in Maps →</a></span></div></div><div class="ug-travel-note">⚠ Operational details such as live hours, fees, road conditions and accessibility should be verified before travel.</div>`;
 app.appendChild(section);
 const safety=document.createElement('section');safety.className='ug-safety';safety.innerHTML='<h2>🚨 Emergency & Safety</h2><p>For an actual emergency in India, use the official emergency response system. UnseenGo is providing quick-access information, not dispatching emergency services.</p><div class="ug-safety-grid"><a href="tel:112"><strong>🚨</strong>112<br><small>Police · Fire · Medical</small></a><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(placeName+' police station')+'"><strong>🚓</strong>Police<br><small>Find nearby</small></a><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(placeName+' ambulance')+'"><strong>🚑</strong>Ambulance<br><small>Find nearby</small></a><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(placeName+' hospital')+'"><strong>🏥</strong>Hospitals<br><small>Find nearby</small></a><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(placeName+' fire station')+'"><strong>🔥</strong>Fire<br><small>Find nearby</small></a><a href="tel:1800111363"><strong>📞</strong>Tourist Helpline<br><small>1800-11-1363</small></a></div><div class="ug-safety-source">Official emergency number: 112 · Ministry of Tourism multilingual tourist helpline: 1800-11-1363 / 1363.</div></section>';
 app.appendChild(safety);
 const img=placeName;
 const lat=hero.querySelector('[data-lat]')?.dataset.lat;
 const coord=window.UnseenGoPlaceCoordinates;
 if(coord) weather(coord.lat,coord.lng,document.getElementById(weatherId));
 else { const iframe=app.querySelector('iframe[src*="marker="]'); const m=iframe?.src.match(/marker=([-0-9.]+)%2C([-0-9.]+)/); if(m) weather(Number(m[1]),Number(m[2]),document.getElementById(weatherId)); }
}
function observePlace(){
 const app=document.getElementById('placeApp');if(!app)return;
 const run=()=>addDestinationInfo();
 if(app.querySelector('.dp-hero'))run();
 new MutationObserver(()=>{if(app.querySelector('.dp-hero'))run()}).observe(app,{childList:true,subtree:true});
}
function renderTripPage(){
 const root=document.getElementById('myTripApp');if(!root)return;
 const trip=read(TRIP_KEY).map((x,i)=>({...x,day:Number(x.day)||Math.floor(i/3)+1}));
 const fav=read(KEY);
 root.innerHTML='<p class="ug-kicker2">YOUR TRAVEL SPACE</p><h1>My Trip</h1><p>Build and edit your journey from the places you save.</p><div class="ug-trip-toolbar"><button class="primary" id="ugAddSaved">＋ Add saved places</button><a href="planner.html">✦ Open AI Planner</a><a href="index.html">← Explore more</a></div><section><h2>❤️ My Hidden Gems</h2><div id="ugFavs" class="ug-favorite-list"></div></section><section style="margin-top:32px"><h2>🧳 My Itinerary</h2><div id="ugTripList" class="ug-trip-list"></div></section>';
 const favs=document.getElementById('ugFavs');favs.innerHTML=fav.length?fav.map((n,i)=>'<article class="ug-favorite"><a href="place.html?place='+encodeURIComponent(n)+'">'+esc(n)+'</a><br><button data-fav="'+i+'">Remove from favorites</button><button data-add="'+i+'">Add to trip</button></article>').join(''):'<div class="ug-trip-empty">No saved places yet. Open a destination and tap ♡ Save.</div>';
 favs.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const a=read(KEY);a.splice(Number(b.dataset.fav),1);write(KEY,a);renderTripPage()});
 favs.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const n=fav[Number(b.dataset.add)];const a=read(TRIP_KEY);if(!a.some(x=>x.name===n))a.push({name:n,city:'',category:'Saved place',score:null,day:Math.max(1,Math.ceil((a.length+1)/3)),addedAt:new Date().toISOString()});write(TRIP_KEY,a);renderTripPage()});
 document.getElementById('ugAddSaved').onclick=()=>{fav.forEach(n=>{const a=read(TRIP_KEY);if(!a.some(x=>x.name===n))a.push({name:n,city:'',category:'Saved place',day:Math.max(1,Math.ceil((a.length+1)/3)),addedAt:new Date().toISOString()});write(TRIP_KEY,a)});renderTripPage()};
 const list=document.getElementById('ugTripList');
 if(!trip.length){list.innerHTML='<div class="ug-trip-empty">Your itinerary is empty. Generate a plan or add saved places.</div>';return}
 const days={};trip.forEach((x,i)=>(days[x.day]??=[]).push({...x,_i:i}));
 list.innerHTML=Object.keys(days).sort((a,b)=>a-b).map(day=>'<article class="ug-trip-day"><h2>Day '+day+'</h2>'+days[day].map((x,i)=>'<div class="ug-trip-stop"><span class="ug-trip-number">'+(i+1)+'</span><div><b>'+esc(x.name)+'</b><small>'+esc(x.city||'Saved destination')+'</small></div><button data-up="'+x._i+'">↑</button><button data-down="'+x._i+'">↓</button><button data-remove="'+x._i+'">Remove</button></div>').join('')+'</article>').join('');
 list.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const a=read(TRIP_KEY);a.splice(Number(b.dataset.remove),1);write(TRIP_KEY,a);renderTripPage()});
 list.querySelectorAll('[data-up],[data-down]').forEach(b=>b.onclick=()=>{const a=read(TRIP_KEY),i=Number(b.dataset.up??b.dataset.down),j=b.dataset.up!=null?i-1:i+1;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];a.forEach((x,k)=>x.day=Math.floor(k/3)+1);write(TRIP_KEY,a);renderTripPage()});
}
function init(){injectStyles();addTripLink();if(document.getElementById('placeApp'))observePlace();if(document.getElementById('myTripApp'))renderTripPage()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.UnseenGoTrip={read,write,keys:{favorites:KEY,trip:TRIP_KEY}};
})();