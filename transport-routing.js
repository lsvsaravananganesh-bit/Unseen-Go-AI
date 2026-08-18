/* UnseenGo AI — place-to-place transport helper
   Uses Google Maps Directions links for live route, travel time and transit availability.
   No invented distance/time is shown. Google Maps supplies the live result.
*/
(function(){
 const $=id=>document.getElementById(id);
 let destination='',city='';
 function route(mode){
   const origin=$('transportOrigin')?.value.trim();
   if(!destination)return;
   const originText=origin||city||'';
   const url='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(originText)+'&destination='+encodeURIComponent(destination+' '+city)+'&travelmode='+encodeURIComponent(mode);
   $('directionLink').href=url;
   $('directionLink').textContent='Open '+mode+' route in Google Maps ↗';
 }
 function pickup(){
   const q='nearest bus stop OR railway station OR taxi stand near '+destination+' '+city;
   $('pickupLink').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
 }
 function setup(){
   if(!$('placeModal'))return;
   const observer=new MutationObserver(()=>{
     const modal=$('placeModal');
     if(!modal.classList.contains('open'))return;
     destination=$('modalTitle')?.textContent.trim()||'';
     city=$('modalLocation')?.textContent.trim()||new URLSearchParams(location.search).get('city')||'';
     if($('transportDestination'))$('transportDestination').textContent=destination+' · '+city;
     route(document.querySelector('.transport-mode.active')?.dataset.mode||'driving');pickup();
   });
   observer.observe($('placeModal'),{attributes:true,childList:true,subtree:true});
   document.querySelectorAll('.transport-mode').forEach(b=>b.addEventListener('click',()=>{
     document.querySelectorAll('.transport-mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');route(b.dataset.mode);
   }));
   $('transportOrigin')?.addEventListener('input',()=>route(document.querySelector('.transport-mode.active')?.dataset.mode||'driving'));
   $('useLocation')?.addEventListener('click',()=>{
     if(!navigator.geolocation){$('transportOrigin').value='My current location';route('driving');return;}
     navigator.geolocation.getCurrentPosition(pos=>{
       $('transportOrigin').value=pos.coords.latitude+','+pos.coords.longitude;
       route(document.querySelector('.transport-mode.active')?.dataset.mode||'driving');
     },()=>{alert('Location access was not available. Enter your nearest pickup point manually.');},{enableHighAccuracy:true,timeout:8000});
   });
 }
 window.addEventListener('DOMContentLoaded',setup);
})();
