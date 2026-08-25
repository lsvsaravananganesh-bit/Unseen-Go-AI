/* UnseenGo AI — live traffic route enhancement */
(function(){'use strict';
const SUPABASE_URL='https://jpqbvliaaucyqnhcclbz.supabase.co';
const SUPABASE_KEY='sb_publishable_K-0R9a2lSginTIfxHk-cxQ_joorBonp';
const ROUTE_URL=`${SUPABASE_URL}/functions/v1/route`;
const $=id=>document.getElementById(id);
let lastSignature='';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function getLiveRoute(result){
 const places=(result?.recommendations||[]).filter(p=>Number.isFinite(+p.latitude)&&Number.isFinite(+p.longitude)).slice(0,10);
 if(places.length<2)return null;
 const client=window.unseenGoSupabase;if(!client)return null;
 const {data:{session}}=await client.auth.getSession();if(!session)return null;
 const r=await fetch(ROUTE_URL,{method:'POST',headers:{'content-type':'application/json','apikey':SUPABASE_KEY,'Authorization':`Bearer ${session.access_token}`},body:JSON.stringify({points:places.map(p=>({lat:+p.latitude,lng:+p.longitude}))})});
 const data=await r.json().catch(()=>({}));if(!r.ok||!data.order)throw new Error(data.error||'Live route unavailable');
 data.places=places;return data;
}
function reorderCards(order,places){const box=$('recommendations');if(!box)return;const cards=[...box.querySelectorAll('.place')];const byName=new Map(cards.map(c=>[c.querySelector('h3')?.textContent,c]));order.forEach(i=>{const c=byName.get(places[i]?.name);if(c)box.appendChild(c)});cards.forEach(c=>c.style.opacity='.82');order.forEach((_,i)=>{const c=box.children[i];if(c)c.style.opacity='1'});}
function applyRoute(data){const meta=document.querySelector('#itinerary .route-meta');if(!meta)return;const total=data.legs.reduce((s,l)=>s+(l.durationSeconds||0),0);const km=data.legs.reduce((s,l)=>s+(l.distanceMeters||0),0)/1000;const traffic=data.trafficAware;meta.innerHTML=`<span>✦ ${traffic?'Live-traffic aware route':'Road-time route fallback'}</span><span>${km.toFixed(1)} km transfer distance</span><span>~${Math.round(total/60)} min transfer time</span><span>${traffic?'Current + historical traffic':'No live traffic provider configured'}</span>`;if(traffic)meta.dataset.type='live';reorderCards(data.order,data.places);}
async function run(){const result=window.UnseenGoLastResult;if(!result)return;const sig=(result.city||'')+'|'+(result.recommendations||[]).map(p=>p.name).join('|');if(sig===lastSignature)return;lastSignature=sig;try{const data=await getLiveRoute(result);if(data){result.liveRoute=data;applyRoute(data);const b=document.querySelector('#plannerMessage');if(b){b.textContent=data.trafficAware?'✓ Route updated using live + historical traffic data.':'✓ Route updated with road-network travel times; live traffic provider is not configured.';b.dataset.type=data.trafficAware?'info':'warning'}}}catch(e){console.warn('Live route unavailable',e)}}
function watch(){const r=$('results');if(!r)return;new MutationObserver(()=>{if(r.classList.contains('show'))setTimeout(run,250)}).observe(r,{attributes:true,childList:true,subtree:true});setTimeout(run,1000)}
function wrapGenerator(){if(!window.UnseenGoAI||window.UnseenGoAI.__liveRouteWrapped)return;const original=window.UnseenGoAI.generate.bind(window.UnseenGoAI);window.UnseenGoAI.generate=function(){const result=original(...arguments);window.UnseenGoLastResult=result;return result};window.UnseenGoAI.__liveRouteWrapped=true}
function init(){wrapGenerator();watch();setTimeout(()=>{wrapGenerator();watch()},500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
