/* UnseenGo AI — navigation + Supabase bootstrap + global enhancements */
(function(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.getRegistrations().then(function(registrations){return Promise.all(registrations.map(function(r){return r.unregister();}));}).then(function(){if('caches' in window)return caches.keys().then(function(keys){return Promise.all(keys.map(function(k){return caches.delete(k);}));});}).catch(function(){});
    });
  }
  function loadGlobalSystem(){
    if(!document.querySelector('link[data-ug-system]')){const l=document.createElement('link');l.rel='stylesheet';l.href='../../unseengo-system.css?v=20260826';l.dataset.ugSystem='1';document.head.appendChild(l)}
    if(!document.querySelector('script[data-ug-search]')){const s=document.createElement('script');s.src='../../unseengo-search.js?v=20260826';s.dataset.ugSearch='1';document.body.appendChild(s)}
  }
  window.openCityPage=function(city){if(city){localStorage.setItem('unseengo_city',city);location.href='city.html?city='+encodeURIComponent(city)}};
  window.setCity=function(city){if(!city)return;localStorage.setItem('unseengo_city',city);const picker=document.getElementById('cityPickerInput');if(picker)picker.value=city;window.openCityPage(city)};
  document.addEventListener('DOMContentLoaded',()=>{loadGlobalSystem();document.querySelectorAll('[data-city-link]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openCityPage(el.dataset.cityLink)}))});
  function loadEnhancements(){if(document.querySelector('script[data-unseengo-enhancements]'))return;const s=document.createElement('script');s.src='../../unseengo-enhancements.js?v=20260825d';s.dataset.unseengoEnhancements='true';document.body.appendChild(s);const d=document.createElement('script');d.src='../../direct-connect.js?v=20260825b';d.dataset.unseengoDirectConnect='true';document.body.appendChild(d)}
  if(!window.UNSEENGO_SUPABASE_CONFIG){const s=document.createElement('script');s.src='../../supabase-config.js';s.onload=function(){if(!document.querySelector('script[data-unseengo-supabase-client]')){const c=document.createElement('script');c.src='../../supabase-client.js';c.dataset.unseengoSupabaseClient='true';c.onload=loadEnhancements;document.head.appendChild(c)}};document.head.appendChild(s)}else loadEnhancements();
  loadGlobalSystem();
})();
