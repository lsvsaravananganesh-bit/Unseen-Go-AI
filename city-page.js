/* UnseenGo AI — dedicated city page + place modal */
(function(){
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const params=new URLSearchParams(location.search), city=params.get('city')||'';
 const wikiCache={}, galleryCache={}; const cityData=typeof cities!=='undefined'?cities[city]:null; let placesCache=[];
 const modalEl=()=>document.getElementById('placeModal');
 const mapUrl=(name,c)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name+' '+c);
 const mapEmbed=(name,c)=>'https://www.google.com/maps?q='+encodeURIComponent(name+' '+c)+'&output=embed';
 const photoFunction