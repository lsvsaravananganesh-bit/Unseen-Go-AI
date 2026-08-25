/* UnseenGo AI — navigation + Supabase bootstrap + global enhancements */
(function(){
  window.openCityPage=function(city){if(city){localStorage.setItem('unseengo_city',city);location.href='city.html?city='+encodeURIComponent(city)}};
  window.setCity=function(city){if(!city)return;localStorage.setItem('unseengo_city',city);const picker=document.getElementById('cityPickerInput');if(picker)picker.value=city;window.openCityPage(city)};
  document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-city-link]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openCityPage(el.dataset.cityLink)})));
  function loadEnhancements(){if(document.querySelector('script[data-unseengo-enhancements]'))return;const s=document.createElement('script');s.src='unseengo-enhancements.js?v=20260824c';s.dataset.unseengoEnhancements='true';document.body.appendChild(s);const d=document.createElement('script');d.src='direct-connect.js?v=20260824';d.dataset.unseengoDirectConnect='true';document.body.appendChild(d)}
  if(!window.UNSEENGO_SUPABASE_CONFIG){const s=document.createElement('script');s.src='supabase-config.js';s.onload=function(){if(!document.querySelector('script[data-unseengo-supabase-client]')){const c=document.createElement('script');c.src='supabase-client.js';c.dataset.unseengoSupabaseClient='true';c.onload=function(){loadAuthNav();loadEnhancements()};document.head.appendChild(c)}};document.head.appendChild(s)}else{loadAuthNav();loadEnhancements()}
  function loadAuthNav(){if(document.querySelector('script[data-unseengo-auth-nav]'))return;const s=document.createElement('script');s.src='nav-auth.js';s.dataset.unseengoAuthNav='true';document.head.appendChild(s)}
})();
