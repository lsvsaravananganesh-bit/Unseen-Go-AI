/* UnseenGo AI — Samarth Foundation: Cultural Economy experience layer */
(function(){
'use strict';
function inject(){
 if(document.getElementById('unseengo-cultural-theme'))return;
 const style=document.createElement('style');style.id='unseengo-cultural-theme';style.textContent=`
 .ue-cultural-strip{max-width:1440px;margin:0 auto;padding:0 7%;}
 .ue-cultural-panel{position:relative;overflow:hidden;margin:0 0 24px;padding:30px 32px;border:1px solid rgba(216,255,77,.24);border-radius:24px;background:linear-gradient(135deg,rgba(22,31,23,.98),rgba(7,12,9,.98));box-shadow:0 22px 60px rgba(0,0,0,.28)}
 .ue-cultural-panel:before{content:"";position:absolute;width:320px;height:320px;right:-120px;top:-170px;border-radius:50%;background:radial-gradient(circle,rgba(216,255,77,.16),transparent 68%);pointer-events:none}
 .ue-cultural-kicker{position:relative;color:#d8ff4d;font-size:10px;font-weight:800;letter-spacing:2.4px;text-transform:uppercase;margin-bottom:10px}
 .ue-cultural-title{position:relative;margin:0 0 9px;color:#f4f6f0;font-size:clamp(24px,3.3vw,38px);line-height:1.06;letter-spacing:-1px}.ue-cultural-title em{color:#d8ff4d;font-style:italic}
 .ue-cultural-copy{position:relative;max-width:980px;margin:0;color:#aeb7aa;font-size:14px;line-height:1.7}
 .ue-cultural-journey{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:23px}
 .ue-cultural-node{position:relative;display:flex;align-items:center;gap:11px;min-height:58px;padding:11px 13px;border:1px solid rgba(180,205,150,.18);border-radius:15px;background:rgba(255,255,255,.025);color:#dce3d9;text-decoration:none;transition:transform .22s ease,border-color .22s ease,background .22s ease,box-shadow .22s ease}
 .ue-cultural-node:hover{transform:translateY(-3px);border-color:rgba(216,255,77,.58);background:rgba(216,255,77,.055);box-shadow:0 12px 28px rgba(0,0,0,.22)}
 .ue-cultural-node b{display:grid;place-items:center;width:31px;height:31px;flex:0 0 31px;border-radius:10px;background:rgba(216,255,77,.1);color:#d8ff4d;font-size:15px}.ue-cultural-node strong{display:block;font-size:12px}.ue-cultural-node span{display:block;margin-top:2px;color:#7f897f;font-size:10px;line-height:1.35}
 .ue-cultural-node.is-static{cursor:default}.ue-cultural-node.is-static:hover{transform:none}
 .ue-cultural-impact{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:16px}
 .ue-cultural-impact>div{padding:15px;border:1px solid rgba(180,205,150,.14);border-radius:14px;background:rgba(255,255,255,.018)}
 .ue-cultural-impact b{display:block;color:#d8ff4d;font-size:10px;letter-spacing:1.2px;margin-bottom:5px}.ue-cultural-impact span{color:#98a297;font-size:11px;line-height:1.45}
 .ue-cultural-badge{display:inline-flex;align-items:center;gap:7px;margin-bottom:12px;padding:7px 11px;border-radius:999px;background:rgba(216,255,77,.08);border:1px solid rgba(216,255,77,.22);color:#d8ff4d;font-size:10px;font-weight:800;letter-spacing:1.5px}
 .ue-cultural-note{position:relative;margin-top:14px;color:#6f786f;font-size:10px;line-height:1.5}.ue-cultural-note b{color:#aab3a7}
 .ue-city-economy{margin-top:24px}
 @media(max-width:900px){.ue-cultural-strip{padding:0 5%}.ue-cultural-panel{padding:25px 21px}.ue-cultural-journey{grid-template-columns:repeat(2,minmax(0,1fr))}.ue-cultural-impact{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:520px){.ue-cultural-journey,.ue-cultural-impact{grid-template-columns:1fr}.ue-cultural-node{min-height:52px}}
 `;document.head.appendChild(style);
 const path=location.pathname.toLowerCase();
 if(path.endsWith('index.html')||path==='/'||path.endsWith('/'))injectHome();
 else if(path.includes('discover'))injectDiscover();
 else if(path.includes('city.html'))injectCity();
 else if(path.includes('transport')||path.includes('stay')||path.includes('planner'))injectUtility();
}
function node(icon,title,desc,href){return href?`<a class="ue-cultural-node" href="${href}"><b>${icon}</b><div><strong>${title}</strong><span>${desc}</span></div></a>`:`<div class="ue-cultural-node is-static"><b>${icon}</b><div><strong>${title}</strong><span>${desc}</span></div></div>`}
function journey(){return `<div class="ue-cultural-journey">
 ${node('🏛','Regional heritage','Explore India region → state → city.','discover.html')}
 ${node('✦','Hidden places','Surface lesser-known and under-discovered destinations.','discover.html')}
 ${node('✓','Verified history','Use researched historical and cultural records where available.',null)}
 ${node('📷','Real photographs','Show the actual place imagery attached to verified destination records.',null)}
 ${node('🚌','Transport','Connect visitors to practical car, bus, train, walking, bike, flight and metro options.','transport.html')}
 ${node('🧑‍🤝‍🧑','Local guides & artisans','Create visibility for community-led experiences and local craft.',null)}
 ${node('🍲','Local food & stays','Connect discovery with local food, accommodation and experiences.','stay.html')}
 ${node('🧭','Visitor interest','Turn discovery into visits through maps, planning and personalized exploration.','planner.html')}
 ${node('💼','Local opportunity','Help visitor demand reach local services, cultural assets and communities.',null)}
 </div>`}
function panel(){return `<div class="ue-cultural-panel"><div class="ue-cultural-badge">✦ SAMARTH FOUNDATION · CULTURAL ECONOMY</div><div class="ue-cultural-kicker">DISCOVER · PRESERVE · EMPOWER</div><h2 class="ue-cultural-title">Turn cultural heritage into <em>local opportunity.</em></h2><p class="ue-cultural-copy">UnseenGo AI is designed as a discovery-to-local-economy journey: people find heritage and hidden places, understand their history, see real destination imagery, plan transport and connect their visit with local food, stays, guides, artisans and community experiences.</p>${journey()}<div class="ue-cultural-impact"><div><b>HERITAGE</b><span>Preserve visibility for places, stories and traditions.</span></div><div><b>DISCOVERY</b><span>Move beyond only famous tourist attractions.</span></div><div><b>LOCAL ECONOMY</b><span>Connect visitor interest with local services and experiences.</span></div><div><b>SCALABILITY</b><span>Start with verified city records and expand region by region.</span></div></div><p class="ue-cultural-note"><b>Data integrity:</b> existing verified UnseenGo destination records remain authoritative. New directory cities are not presented as having verified places until their content is researched and added.</p></div>`}
function injectHome(){const hero=document.querySelector('.hero');if(!hero)return;const wrap=document.createElement('section');wrap.className='ue-cultural-strip';wrap.innerHTML=panel();hero.insertAdjacentElement('afterend',wrap)}
function injectDiscover(){const hero=document.querySelector('.discover-hero');if(!hero)return;const wrap=document.createElement('section');wrap.className='ue-cultural-strip';wrap.innerHTML=panel();hero.insertAdjacentElement('afterend',wrap)}
function injectCity(){const hero=document.querySelector('.city-hero');if(!hero)return;const city=((new URLSearchParams(location.search).get('city'))||'DESTINATION');const wrap=document.createElement('section');wrap.className='ue-cultural-strip ue-city-economy';wrap.innerHTML=`<div class="ue-cultural-panel"><div class="ue-cultural-badge">✦ CULTURAL ECONOMY · ${city.toUpperCase()}</div><h2 class="ue-cultural-title">Explore the place. <em>Support the local story.</em></h2><p class="ue-cultural-copy">Connect this destination with heritage, hidden gems, verified history, real imagery, transport, local food, stays and community opportunities.</p>${journey()}<div class="ue-cultural-impact"><div><b>HERITAGE</b><span>History, traditions and local identity.</span></div><div><b>VISITORS</b><span>Discover lesser-known destinations.</span></div><div><b>LOCAL ECONOMY</b><span>Food, stays, transport and experiences.</span></div><div><b>SCALABILITY</b><span>City-first pilot, expandable across India.</span></div></div></div>`;hero.insertAdjacentElement('afterend',wrap)}
function injectUtility(){const main=document.querySelector('main');if(!main)return;const wrap=document.createElement('section');wrap.className='ue-cultural-strip';wrap.innerHTML=panel();main.insertBefore(wrap,main.firstElementChild)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();