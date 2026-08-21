/* UnseenGo AI — transport result UI */
(function(){
'use strict';
const city=()=>new URLSearchParams(location.search).get('city')||'';
const typeMeta={
 bus:{label:'Bus stands',icon:'🚌',query:'bus stands'},
 train:{label:'Railway stations',icon:'🚆',query:'railway stations'},
 airport:{label:'Airports',icon:'✈️',query:'airports'},
 metro:{label:'Metro stations',icon:'🚇',query:'metro stations'},
 taxi:{label:'Taxi / cab pickups',icon:'🚕',query:'taxi cab'},
 parking:{label:'Parking',icon:'🅿️',query:'parking'}
};
const link=(name,c)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' '+c);
function host(){return document.getElementById('transportResults')}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fallback(type){const m=typeMeta[type];return `<div class="transport-results-head"><b>${m.icon} ${m.label}</b><span>Live Google Maps search</span></div><a class="transport-result fallback" target="_blank" rel="noopener" href="${link(m.query,city())}"><strong>Find ${esc(m.label.toLowerCase())} near ${esc(city())}</strong><small>Open Google Maps for current nearby results, availability and directions.</small><span>↗</span></a>`}
async function database(type){
  const c=city();
  try{
    const sb=window.unseenGoSupabase;
    if(sb){
      const r=await sb.from('transport_hubs').select('name,transport_type,description,latitude,longitude,maps_url').eq('city',c).eq('transport_type',type).order('name');
      if(!r.error&&Array.isArray(r.data)&&r.data.length)return r.data.map(x=>({name:x.name,detail:x.description||'',url:x.maps_url||link(x.name,c)}));
    }
  }catch(e){}
  if(window.UnseenGoTransport?.get){const rows=window.UnseenGoTransport.get(c,type);if(rows.length)return rows.map(x=>({name:x.name,detail:x.detail,url:link(x.name,c)}))}
  return [];
}
async function show(type){
 const h=host(),m=typeMeta[type];if(!h||!m)return;
 h.innerHTML=`<div class="transport-results-head"><b>${m.icon} ${m.label}</b><span>Checking UnseenGo database…</span></div>`;
 const rows=await database(type);
 if(!rows.length){h.innerHTML=fallback(type);return}
 h.innerHTML=`<div class="transport-results-head"><b>${m.icon} ${m.label}</b><span>${rows.length} option${rows.length===1?'':'s'} in ${esc(city())}</span></div>`+rows.map(x=>`<a class="transport-result" target="_blank" rel="noopener" href="${esc(x.url)}"><strong>${esc(x.name)}</strong><small>${esc(x.detail||('Available near '+city()))}</small><span>Open ↗</span></a>`).join('');
}
function init(){
 document.addEventListener('click',e=>{
  const nearby=e.target.closest('.transport-nearby a');
  if(nearby){e.preventDefault();e.stopPropagation();const id=nearby.id;const map={busLink:'bus',railLink:'train',airportLink:'airport',metroLink:'metro',taxiLink:'taxi',parkingLink:'parking'};if(map[id])show(map[id]);return}
  const mode=e.target.closest('.transport-mode');
  if(mode){const map={bus:'bus',train:'train',flight:'airport',metro:'metro',driving:'taxi'};const t=map[mode.dataset.mode];if(t)show(t);}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();