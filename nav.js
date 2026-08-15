/* UnseenGo AI — simple multi-page navigation */
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
})();