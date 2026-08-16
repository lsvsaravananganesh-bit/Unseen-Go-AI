/* UnseenGo AI — navigation + Supabase bootstrap */
(function(){
  window.openCityPage=function(city){if(city)location.href='city.html?city='+encodeURIComponent(city)};
  window.setCity=function(city){if(!city)return;const picker=document.getElementById('cityPickerInput');if(picker)picker.value=city;window.openCityPage(city)};
  document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-city-link]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openCityPage(el.dataset.cityLink)})));
  if(!window.UNSEENGO_SUPABASE_CONFIG){const s=document.createElement('script');s.src='supabase-config.js';s.onload=function(){if(!document.querySelector('script[data-unseengo-supabase-client]')){const c=document.createElement('script');c.src='supabase-client.js';c.dataset.unseengoSupabaseClient='true';c.onload=loadAuthNav;document.head.appendChild(c)}};document.head.appendChild(s)}else loadAuthNav();
  function loadAuthNav(){if(document.querySelector('script[data-unseengo-auth-nav]'))return;const s=document.createElement('script');s.src='nav-auth.js';s.dataset.unseengoAuthNav='true';document.head.appendChild(s)}
})();
