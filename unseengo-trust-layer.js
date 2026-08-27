/* UnseenGo Trust Layer: make curated, verified and live information visibly distinct. */
(function(){'use strict';
  function esc(v){return String(v||'').replace(/[&<>\"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;','\\':'&#39;'}[c])})}
  const path=location.pathname.toLowerCase();
  let page='DISCOVERY';
  if(path.includes('city')||path.includes('place')||path.includes('destination'))page='DESTINATION';
  else if(path.includes('story'))page='STORY';
  else if(path.includes('stay')||path.includes('accommodation'))page='STAY';
  else if(path.includes('transport'))page='TRANSPORT';
  else if(path.includes('planner')||path.includes('personalize'))page='AI PLANNER';
  const descriptions={
    'DISCOVERY':'Curated recommendations are UnseenGo discovery metadata. They are not live popularity or availability claims.',
    'DESTINATION':'Unseen Score and editorial copy are curated. Live hours, routes and availability are shown separately when connected.',
    'STORY':'Historical and cultural stories are editorial content. Factual claims should carry a source/review status where available.',
    'STAY':'Property details are informational unless marked live. Prices and availability can change and require the booking provider.',
    'TRANSPORT':'Routes and travel times can change. Live navigation is provided by the connected map/transport service when available.',
    'AI PLANNER':'AI suggestions are personalized recommendations. Verify live opening hours, transport, weather and bookings before travel.'
  };
  function addStyle(){if(document.getElementById('ugTrustStyle'))return;const s=document.createElement('style');s.id='ugTrustStyle';s.textContent='.ug-trust-bar{width:min(1240px,calc(100% - 28px));margin:18px auto 0;padding:12px 15px;border:1px solid #cfd9c9;border-radius:13px;background:#f5f8f1;color:#32402f;font:500 11px/1.5 system-ui,sans-serif;display:flex;gap:10px;align-items:flex-start;box-sizing:border-box}.ug-trust-bar .ug-trust-title{font-weight:950;letter-spacing:.8px;white-space:nowrap}.ug-trust-legend{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.ug-trust-chip{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:5px 9px;font-weight:800;font-size:9px}.ug-trust-chip.curated{background:#e7f3b8;color:#30410e}.ug-trust-chip.verified{background:#e8f0ff;color:#234a85}.ug-trust-chip.live{background:#e4f6e9;color:#17633a}.ug-trust-chip.ai{background:#eee7ff;color:#5536a0}.ug-trust-note{color:#667363}.ug-score-label{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;background:#e7f3b8;color:#30410e;font:900 9px system-ui,sans-serif}.ug-live-label{display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:999px;background:#e4f6e9;color:#17633a;font:900 9px system-ui,sans-serif}.ug-verified-label{display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:999px;background:#e8f0ff;color:#234a85;font:900 9px system-ui,sans-serif}.ug-ai-label{display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:999px;background:#eee7ff;color:#5536a0;font:900 9px system-ui,sans-serif}';document.head.appendChild(s)}
  function inject(){addStyle();if(document.querySelector('.ug-trust-bar'))return;const bar=document.createElement('aside');bar.className='ug-trust-bar';bar.setAttribute('aria-label','UnseenGo information labels');bar.innerHTML='<div><div class="ug-trust-title">'+esc(page)+' INFORMATION</div><div class="ug-trust-legend"><span class="ug-trust-chip curated">✦ CURATED · UnseenGo</span><span class="ug-trust-chip verified">✓ VERIFIED · source/review status</span><span class="ug-trust-chip live">● LIVE · changing real-world data</span><span class="ug-trust-chip ai">✧ AI · personalized output</span></div></div><div class="ug-trust-note">'+esc(descriptions[page])+'</div>';const main=document.querySelector('main');if(main)main.insertBefore(bar,main.firstElementChild);else document.body.insertBefore(bar,document.body.firstElementChild)}
  function labelScores(){document.querySelectorAll('.score-badge,.unseen-score,.ug-score').forEach(function(el){if(!el.querySelector('.ug-score-label')){el.insertAdjacentHTML('beforeend',' <span class="ug-score-label">CURATED</span>')}})}
  function labelAi(){document.querySelectorAll('[id*="ai" i],[class*="ai" i]').forEach(function(el){if(el.children.length===0&&/recommend|suggest|itinerary|assistant|planner/i.test(el.textContent||'')&&!el.querySelector('.ug-ai-label'))el.insertAdjacentHTML('beforeend',' <span class="ug-ai-label">AI OUTPUT</span>')})}
  document.addEventListener('DOMContentLoaded',function(){inject();setTimeout(function(){labelScores();labelAi()},350)});
})();
