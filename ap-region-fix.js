/* Keep Andhra Pradesh city pages state-labelled; regional labels are intentionally retired. */
(function(){'use strict';function boot(){const r=window.UNSEENGO_AP_RESEARCH||{};if(typeof cities!=='undefined')Object.keys(r).forEach(k=>{if(cities[k])cities[k].region='Andhra Pradesh'});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot()})();
