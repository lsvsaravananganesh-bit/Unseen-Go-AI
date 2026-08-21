/* UnseenGo AI — premium competition UI layer */
(function(){
'use strict';
if(window.__UNSEENGO_PREMIUM__) return;
window.__UNSEENGO_PREMIUM__=true;

const css=`
:root{--ue-neon:#d8f36a;--ue-cyan:#62e7c5;--ue-ink:#070a08;--ue-line:rgba(216,243,106,.16)}
body{background:radial-gradient(circle at 8% 8%,rgba(216,243,106,.035),transparent 25%),radial-gradient(circle at 92% 22%,rgba(98,231,197,.025),transparent 24%),#080b09!important}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,black,transparent 78%);opacity:.35}
.nav{height:78px!important;padding-left:6%!important;padding-right:6%!important;border-bottom-color:rgba(216,243,106,.09)!important;box-shadow:0 12px 40px rgba(0,0,0,.12)}
.brand{letter-spacing:-.4px}.brand b{color:var(--ue-neon)}
.nav nav a{position:relative;padding:8px 0}.nav nav a:after{content:"";position:absolute;left:0;right:100%;bottom:1px;height:2px;background:linear-gradient(90deg,var(--ue-neon),var(--ue-cyan));transition:right .25s}.nav nav a:hover:after,.nav nav a.active:after{right:0}
.nav button,.generate,.search button{box-shadow:0 0 0 1px rgba(216,243,106,.1),0 12px 30px rgba(0,0,0,.2)}
.nav button:hover,.generate:hover,.search button:hover{box-shadow:0 0 0 1px rgba(216,243,106,.35),0 16px 40px rgba(216,243,106,.1)!important}
#ue-progress{position:fixed;top:0;left:0;width:0;height:3px;background:linear-gradient(90deg,var(--ue-neon),var(--ue-cyan));box-shadow:0 0 16px rgba(216,243,106,.55);z-index:9999;transition:width .08s linear}
.ue-reveal{opacity:0;transform:translateY(24px);transition:opacity .65s ease,transform .65s ease}.ue-reveal.ue-visible{opacity:1;transform:none}
.ue-glow{position:fixed;width:260px;height:260px;border-radius:50%;pointer-events:none;z-index:-1;background:radial-gradient(circle,rgba(216,243,106,.065),transparent 68%);transform:translate(-50%,-50%);mix-blend-mode:screen}
.ue-dock{position:fixed;right:20px;bottom:20px;z-index:50;display:flex;align-items:center;gap:7px;padding:7px;border:1px solid rgba(216,243,106,.18);border-radius:999px;background:rgba(9,13,10,.84);backdrop-filter:blur(18px);box-shadow:0 18px 45px rgba(0,0,0,.38)}
.ue-dock a{color:#aeb8a9;text-decoration:none;font-size:10px;padding:9px 11px;border-radius:999px;transition:.2s}.ue-dock a:hover{color:#07100b;background:var(--ue-neon)}.ue-dock .ue-dock-brand{color:var(--ue-neon);font-weight:900;letter-spacing:1px}
.ue-page-kicker{display:flex;align-items:center;gap:9px;color:#7f8a7e;font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 18px}.ue-page-kicker i{width:7px;height:7px;border-radius:50%;background:var(--ue-neon);box-shadow:0 0 13px rgba(216,243,106,.8)}
.hero-card,.city-history-card,.planner-card,.card,.panel,.route-card,.nearby,.place,.city-place-grid>*{box-shadow:0 18px 50px rgba(0,0,0,.18)}
.place,.card,.route-card,.nearby,.quick-city,.feature-card,.why-card,.trust-card,.journey-step,.impact-node{position:relative;overflow:hidden}.place:before,.card:before,.route-card:before,.nearby:before,.quick-city:before,.feature-card:before,.why-card:before,.trust-card:before,.journey-step:before,.impact-node:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 35%,rgba(216,243,106,.055),transparent 65%);transform:translateX(-120%);transition:transform .7s ease;pointer-events:none}.place:hover:before,.card:hover:before,.route-card:hover:before,.nearby:hover:before,.quick-city:hover:before,.feature-card:hover:before,.why-card:hover:before,.trust-card:hover:before,.journey-step:hover:before,.impact-node:hover:before{transform:translateX(120%)}
.ue-ai-float{position:absolute;right:4%;bottom:8%;width:220px;padding:16px;border:1px solid rgba(216,243,106,.22);border-radius:18px;background:rgba(9,14,10,.82);backdrop-filter:blur(14px);box-shadow:0 24px 60px rgba(0,0,0,.35);animation:ueFloat 4s ease-in-out infinite}.ue-ai-float small{display:block;color:var(--ue-neon);font-size:9px;letter-spacing:1.8px;font-weight:900}.ue-ai-float strong{display:block;font-size:15px;margin:7px 0}.ue-ai-float span{display:block;color:#8e998d;font-size:10px;line-height:1.5}.ue-ai-score{display:flex;align-items:center;justify-content:space-between;margin-top:11px;padding-top:10px;border-top:1px solid rgba(255,255,255,.07);font-size:10px}.ue-ai-score b{color:var(--ue-neon);font-size:16px}@keyframes ueFloat{50%{transform:translateY(-7px)}}
.ue-discovery-rail{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 28px;padding:10px;border:1px solid rgba(216,243,106,.12);border-radius:16px;background:rgba(255,255,255,.018)}.ue-discovery-rail span{padding:9px 12px;border-radius:10px;color:#8f998e;font-size:10px}.ue-discovery-rail span:first-child{color:#0a100b;background:var(--ue-neon);font-weight:900}.ue-discovery-rail b{margin-left:auto;padding:9px 12px;color:#697368;font-size:9px;letter-spacing:1px}
.ue-section-tag{display:inline-flex;padding:7px 10px;border:1px solid rgba(216,243,106,.18);border-radius:999px;color:var(--ue-neon);font-size:9px;font-weight:900;letter-spacing:1.5px;background:rgba(216,243,106,.035)}
@media(max-width:900px){.ue-dock{right:10px;left:10px;justify-content:center}.ue-dock a{padding:8px 9px}.ue-ai-float{position:relative;right:auto;bottom:auto;width:min(320px,90%);margin:0 auto 18px}.hero-art{overflow:visible}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation:none!important;transition:none!important}.ue-reveal{opacity:1;transform:none}}
`;
const style=document.createElement('style');style.id='unseengo-premium-ui';style.textContent=css;document.head.appendChild(style);

const progress=document.createElement('div');progress.id='ue-progress';document.body.appendChild(progress);
const glow=document.createElement('div');glow.className='ue-glow';document.body.appendChild(glow);
if(!matchMedia('(pointer:coarse)').matches){document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true})}

function reveal(){
 document.querySelectorAll('main section,main article,.section,.feature-card,.place,.card,.route-card,.nearby,.quick-city').forEach((el,i)=>{if(!el.classList.contains('ue-reveal')){el.classList.add('ue-reveal');el.style.transitionDelay=Math.min((i%5)*55,220)+'ms'}});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ue-visible');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.ue-reveal').forEach(x=>io.observe(x));
}
function addDock(){if(document.querySelector('.ue-dock'))return;const d=document.createElement('div');d.className='ue-dock';d.innerHTML='<span class="ue-dock-brand">UNSEENGO</span><a href="discover.html">Discover</a><a href="planner.html">AI Plan</a><a href="transport.html">Transport</a>';document.body.appendChild(d)}
function addHomeFloat(){const art=document.querySelector('.hero-art');if(!art||art.querySelector('.ue-ai-float'))return;const x=document.createElement('div');x.className='ue-ai-float';x.innerHTML='<small>✦ AI DISCOVERY ENGINE</small><strong>Personalized hidden-gem match</strong><span>History + culture + time + location + transport</span><div class="ue-ai-score"><span>UnseenGo Match</span><b>94</b></div>';art.appendChild(x)}
function addDiscoverRail(){const host=document.querySelector('.discover-cities .heading');if(!host||document.querySelector('.ue-discovery-rail'))return;const r=document.createElement('div');r.className='ue-discovery-rail';r.innerHTML='<span>✦ All India</span><span>Heritage</span><span>Hidden places</span><span>Culture</span><span>Nature</span><span>Food</span><span>Adventure</span><b>STATE → CITY → STORY</b>';host.parentNode.insertBefore(r,host.nextElementSibling)}
function addKicker(){const main=document.querySelector('main');if(!main||document.querySelector('.ue-page-kicker'))return;const k=document.createElement('p');k.className='ue-page-kicker';k.innerHTML='<i></i> Live cultural discovery platform · 2026';main.insertBefore(k,main.firstElementChild)}
function progressBar(){const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?(scrollY/h)*100:0)+'%'}
function init(){
 addKicker();addDock();
 const p=location.pathname.toLowerCase();if(p.endsWith('index.html')||p==='/'||p.endsWith('/'))addHomeFloat();if(p.includes('discover'))addDiscoverRail();
 reveal();progressBar();addEventListener('scroll',progressBar,{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
