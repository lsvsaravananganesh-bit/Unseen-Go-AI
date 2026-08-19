/* UnseenGo AI — Samarth Foundation: Cultural Economy theme layer */
(function(){
'use strict';
function inject(){
 if(document.getElementById('unseengo-cultural-theme'))return;
 const style=document.createElement('style');style.id='unseengo-cultural-theme';style.textContent=`
 .ue-cultural-strip{max-width:1440px;margin:0 auto;padding:0 7%;}
 .ue-cultural-panel{position:relative;overflow:hidden;margin:0 0 24px;padding:28px 30px;border:1px solid rgba(216,255,77,.24);border-radius:20px;background:linear-gradient(135deg,rgba(22,31,23,.98),rgba(10,15,12,.98));box-shadow:0 18px 50px rgba(0,0,0,.24)}
 .ue-cultural-panel:before{content:"";position:absolute;width:240px;height:240px;right:-90px;top:-130px;border-radius:50%;background:radial-gradient(circle,rgba(216,255,77,.15),transparent 68%);pointer-events:none}
 .ue-cultural-kicker{position:relative;color:#d8ff4d;font-size:10px;font-weight:800;letter-spacing:2.4px;text-transform:uppercase;margin-bottom:10px}
 .ue-cultural-title{position:relative;margin:0 0 8px;color:#f4f6f0;font-size:clamp(22px,3vw,32px);line-height:1.1;letter-spacing:-.8px}
 .ue-cultural-title em{color:#d8ff4d;font-style:italic}
 .ue-cultural-copy{position:relative;max-width:900px;margin:0;color:#aeb7aa;font-size:14px;line-height:1.7}
 .ue-cultural-flow{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:20px}
 .ue-cultural-step{padding:9px 12px;border:1px solid rgba(180,205,150,.2);border-radius:999px;background:#111812;color:#dce3d9;font-size:12px;white-space:nowrap}
 .ue-cultural-arrow{color:#d8ff4d;font-weight:800}
 .ue-cultural-impact{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:20px}
 .ue-cultural-impact>div{padding:15px;border:1px solid rgba(180,205,150,.16);border-radius:14px;background:rgba(255,255,255,.018)}
 .ue-cultural-impact b{display:block;color:#d8ff4d;font-size:12px;letter-spacing:.8px;margin-bottom:5px}.ue-cultural-impact span{color:#98a297;font-size:12px;line-height:1.45}
 .ue-cultural-badge{display:inline-flex;align-items:center;gap:7px;margin-bottom:12px;padding:7px 11px;border-radius:999px;background:rgba(216,255,77,.08);border:1px solid rgba(216,255,77,.22);color:#d8ff4d;font-size:10px;font-weight:800;letter-spacing:1.5px}
 .ue-city-economy{margin-top:24px}
 @media(max-width:800px){.ue-cultural-strip{padding:0 5%}.ue-cultural-panel{padding:23px 20px}.ue-cultural-impact{grid-template-columns:repeat(2,minmax(0,1fr))}.ue-cultural-flow{gap:6px}}
 @media(max-width:480px){.ue-cultural-impact{grid-template-columns:1fr}.ue-cultural-step{font-size:11px}}
 `;document.head.appendChild(style);
 const path=location.pathname.toLowerCase();
 if(path.endsWith('index.html')||path==='/'||path.endsWith('/'))injectHome();
 else if(path.includes('discover'))injectDiscover();
 else if(path.includes('city.html'))injectCity();
 else if(path.includes('transport')||path.includes('stay')||path.includes('planner'))injectUtility();
}
function panel(city){return `<div class="ue-cultural-panel"><div class="ue-cultural-badge">✦ SAMARTH FOUNDATION · CULTURAL ECONOMY</div><div class="ue-cultural-kicker">DISCOVER · PRESERVE · EMPOWER</div><h2 class="ue-cultural-title">Turn cultural heritage into <em>local opportunity.</em></h2><p class="ue-cultural-copy">UnseenGo AI connects hidden heritage, local stories and lesser-known destinations with visitors, accommodation, food, transport, guides, artisans and community experiences. The goal is not only to help people travel, but to increase the visibility and economic value of local cultural assets.</p><div class="ue-cultural-flow"><span class="ue-cultural-step">🏛 Heritage</span><span class="ue-cultural-arrow">→</span><span class="ue-cultural-step">✦ Digital discovery</span><span class="ue-cultural-arrow">→</span><span class="ue-cultural-step">🧭 Visitor interest</span><span class="ue-cultural-arrow">→</span><span class="ue-cultural-step">🏨 Local services</span><span class="ue-cultural-arrow">→</span><span class="ue-cultural-step">💼 Local opportunity</span></div></div>`}
function injectHome(){const hero=document.querySelector('.hero');if(!hero)return;const wrap=document.createElement('section');wrap.className='ue-cultural-strip';wrap.innerHTML=panel();hero.insertAdjacentElement('afterend',wrap)}
function injectDiscover(){const hero=document.querySelector('.discover-hero');if(!hero)return;const wrap=document.createElement('section');wrap.className='ue-cultural-strip';wrap.innerHTML=panel();hero.insertAdjacentElement('afterend',wrap);const h=document.querySelector('.discover-cities h2');if(h)h.insertAdjacentHTML('afterbegin','<span class="ue-cultural-kicker" style="display:block;margin-bottom:10px">CULTURAL ECONOMY · RAYALASEEMA-FIRST PILOT</span>')}
function injectCity(){const hero=document.querySelector('.city-hero');if(!hero)return;const wrap=document.createElement('section');wrap.className='ue-cultural-strip ue-city-economy';wrap.innerHTML=`<div class="ue-cultural-panel"><div class="ue-cultural-badge">✦ CULTURAL ECONOMY · ${((new URLSearchParams(location.search).get('city'))||'DESTINATION').toUpperCase()}</div><h2 class="ue-cultural-title">Explore the place. <em>Support the local story.</em></h2><p class="ue-cultural-copy">This city experience connects heritage and hidden gems with practical local services—stays, food, transport, maps and community experiences—so tourism can create value beyond the headline attractions.</p><div class="ue-cultural-impact"><div><b>HERITAGE</b><span>History, traditions and local identity</span></div><div><b>VISITORS</b><span>Discover lesser-known destinations</span></div><div><b>LOCAL ECONOMY</b><span>Stay, food, transport and experiences</span></div><div><b>SCALABILITY</b><span>Rayalaseema-first, expandable across India</span></div></div></div>`;hero.insertAdjacentElement('afterend',wrap)}
function injectUtility(){const main=document.querySelector('main');if(!main)return;const wrap=document.createElement('section');wrap.className='ue-cultural-strip';wrap.innerHTML=panel();main.insertBefore(wrap,main.firstElementChild)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();
