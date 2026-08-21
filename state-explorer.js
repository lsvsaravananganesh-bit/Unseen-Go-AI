/* UnseenGo AI — India state/UT navigation. */
(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function render(){
 const root=document.getElementById('stateExplorer'); if(!root)return;
 const d=window.INDIA_DIRECTORY||{};
 const states=Object.keys(d).sort((a,b)=>a.localeCompare(b));
 root.innerHTML=states.map(state=>{
   const list=[...new Set(d[state]||[])].sort();
   return `<a class="region-panel state-first" href="state.html?state=${encodeURIComponent(state)}" aria-label="Explore ${esc(state)} and its cities"><div class="region-summary"><span class="region-symbol">✦</span><span class="region-copy"><small>${state==='Andhra Pradesh'?'PRIORITY RESEARCH STATE':'STATE / UNION TERRITORY'}</small><strong>${esc(state)}</strong><em>${list.length} cities and destinations</em></span><span class="region-count">Explore cities <b>→</b></span></div></a>`;
 }).join('');
 root.classList.add('region-explorer-ready');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
