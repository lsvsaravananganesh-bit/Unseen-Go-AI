/* UnseenGo AI — navigation + Supabase bootstrap + global visual/content systems */
(function(){
  if ('serviceWorker' in navigator) window.addEventListener('load',function(){navigator.serviceWorker.getRegistrations().then(function(rs){return Promise.all(rs.map(function(r){return r.unregister();}));}).then(function(){if('caches' in window)return caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k);}))});}).catch(function(){})});
  function css(href,key){if(!document.querySelector('link[data-'+key+']')){const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.dataset[key]='1';document.head.appendChild(l)}}
  function loadGlobalSystem(){
    css('/Unseen-Go-AI/unseengo-system.css?v=20260827','ug-system');
    css('/Unseen-Go-AI/unseengo-redesign.css?v=20260827','ug-redesign');
    css('/Unseen-Go-AI/unseengo-all-pages.css?v=20260827','ug-all-pages');
    css('/Unseen-Go-AI/unseengo-content-layer.css?v=20260827','ug-content');
    if(!document.querySelector('script[data-ug-search]')){const s=document.createElement('script');s.src='/Unseen-Go-AI/unseengo-search.js?v=20260827';s.dataset.ugSearch='1';document.body.appendChild(s)}
  }
  window.openCityPage=function(city){if(city){localStorage.setItem('unseengo_city',city);location.href='city.html?city='+encodeURIComponent(city)}};
  window.setCity=function(city){if(!city)return;localStorage.setItem('unseengo_city',city);const picker=document.getElementById('cityPickerInput');if(picker)picker.value=city;window.openCityPage(city)};
  document.addEventListener('DOMContentLoaded',function(){loadGlobalSystem();document.querySelectorAll('[data-city-link]').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();openCityPage(el.dataset.cityLink)})})});
  function loadEnhancements(){if(document.querySelector('script[data-unseengo-enhancements]'))return;const s=document.createElement('script');s.src='/Unseen-Go-AI/unseengo-enhancements.js?v=20260825d';s.dataset.unseengoEnhancements='true';document.body.appendChild(s);const d=document.createElement('script');d.src='/Unseen-Go-AI/direct-connect.js?v=20260825b';d.dataset.unseengoDirectConnect='true';document.body.appendChild(d)}
  if(!window.UNSEENGO_SUPABASE_CONFIG){const s=document.createElement('script');s.src='/Unseen-Go-AI/supabase-config.js';s.onload=function(){if(!document.querySelector('script[data-unseengo-supabase-client]')){const c=document.createElement('script');c.src='/Unseen-Go-AI/supabase-client.js';c.dataset.unseengoSupabaseClient='true';c.onload=loadEnhancements;document.head.appendChild(c)}};document.head.appendChild(s)}else loadEnhancements();
  loadGlobalSystem();
})();
