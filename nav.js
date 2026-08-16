/* UnseenGo AI — navigation + Phase 2B Supabase bootstrap */
(function(){
  window.openCityPage=function(city){if(city) location.href='city.html?city='+encodeURIComponent(city);};
  window.setCity=function(city){
    if(!city)return;
    const picker=document.getElementById('cityPickerInput');
    if(picker)picker.value=city;
    window.openCityPage(city);
  };
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-city-link]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openCityPage(el.dataset.cityLink);}));
  });

  // Load the Phase 2B Supabase configuration once on pages that include nav.js.
  // The publishable key is intended for browser use; privileged secret keys are never loaded.
  if(!window.UNSEENGO_SUPABASE_CONFIG){
    const configScript=document.createElement('script');
    configScript.src='supabase-config.js';
    configScript.onload=function(){
      if(!document.querySelector('script[data-unseengo-supabase-client]')){
        const clientScript=document.createElement('script');
        clientScript.src='supabase-client.js';
        clientScript.dataset.unseengoSupabaseClient='true';
        document.head.appendChild(clientScript);
      }
    };
    document.head.appendChild(configScript);
  }
})();
