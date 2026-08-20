/* UnseenGo AI — Google Maps / Places photo enhancement
   Loads photo sets returned by the Google Places proxy without creating
   MutationObserver feedback loops that can freeze the city page.
*/
(function(){
'use strict';
const PHOTO_ENDPOINT='https://jpqbvliaaucyqnhcclbz.supabase.co/functions/v1/google-place-photos';
const cache=new Map();
const inFlight=new Map();
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));

async function photos(place,city){
 const key=place+'|'+city;
 if(cache.has(key))return cache.get(key);
 if(inFlight.has(key))return inFlight.get(key);
 const request=(async()=>{
  try{
   const r=await fetch(PHOTO_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({place,city})});
   if(!r.ok)throw new Error('photo service '+r.status);
   const d=await r.json();
   const out=Array.isArray(d.photos)?d.photos.filter(x=>x&&x.url):[];
   cache.set(key,out);return out;
  }catch(e){cache.set(key,[]);return []}
  finally{inFlight.delete(key)}
 })();
 inFlight.set(key,request);return request;
}

function galleryMarkup(imgs,name){
 return imgs.map((x,i)=>`<figure><img src="${esc(x.url)}" alt="${esc(name)} — photo ${i+1}" loading="lazy" title="${esc(name)} photo ${i+1}"></figure>`).join('');
}

async function enforceCards(cards){
 const list=cards||[...document.querySelectorAll('.city-place-card')];
 await Promise.all(list.map(async card=>{
  if(!card||card.dataset.photoAttempted==='1')return;
  const name=card.querySelector('.place-card-body h3')?.textContent?.trim();
  const city=card.querySelector('.place-location')?.textContent?.replace(/^⌖\s*/,'').split(' · ')[0].trim()||new URLSearchParams(location.search).get('city')||'';
  const holder=card.querySelector('.place-image');
  if(!name||!holder)return;
  card.dataset.photoAttempted='1';
  const existing=holder.querySelector('img');
  const imgs=await photos(name,city);
  if(imgs[0]){
   holder.innerHTML='<img src="'+esc(imgs[0].url)+'" alt="'+esc(name)+' — Google Maps photo" loading="lazy">';
   holder.classList.add('google-photo');
   holder.title='Photo from Google Maps / Places';
  }else if(existing){
   existing.loading='lazy';holder.classList.add('photo-fallback-preserved');
  }else{
   const loader=holder.querySelector('.image-loader');
   if(loader)loader.outerHTML='<div class="google-photo-unavailable"><b>Photo unavailable</b><span>No Google Places photo was returned for this place.</span></div>';
  }
 }));
}

let modalRequestKey='';
async function enforceModal(force){
 const title=document.getElementById('modalTitle'),locationEl=document.getElementById('modalLocation'),holder=document.getElementById('modalPhoto'),gallery=document.getElementById('modalGallery');
 const modal=document.getElementById('placeModal');
 if(!title||!locationEl||!holder||!modal||!modal.classList.contains('open'))return;
 const name=title.textContent.trim(),city=locationEl.textContent.trim()||new URLSearchParams(location.search).get('city')||'';
 if(!name)return;
 const key=name+'|'+city;
 if(!force&&modalRequestKey===key)return;
 modalRequestKey=key;
 const imgs=await photos(name,city);
 if(!modal.classList.contains('open')||modalRequestKey!==key)return;
 if(imgs[0]){
  holder.innerHTML='<img src="'+esc(imgs[0].url)+'" alt="'+esc(name)+' — Google Maps photo" loading="lazy">';
  const credit=document.getElementById('photoCredit');
  if(credit)credit.textContent='Photos from Google Maps / Places. Required attribution is shown when supplied by Google.';
 }else if(!holder.querySelector('img')){
  holder.innerHTML='<div class="image-fallback">✦<span>Photo unavailable</span></div>';
 }
 if(gallery){
  gallery.innerHTML=imgs.length>1?galleryMarkup(imgs.slice(1),name):'';
  gallery.hidden=imgs.length<=1;
  gallery.setAttribute('aria-label',imgs.length>1?`${name} photo gallery`:'');
 }
}

function observe(){
 const grid=document.getElementById('cityPlaces');
 if(grid){
  let scheduled=false;
  const schedule=()=>{
   if(scheduled)return;
   scheduled=true;
   setTimeout(()=>{scheduled=false;enforceCards()},0);
  };
  new MutationObserver(mutations=>{
   const added=[];
   mutations.forEach(m=>m.addedNodes.forEach(node=>{
    if(node.nodeType!==1)return;
    if(node.matches?.('.city-place-card'))added.push(node);
    node.querySelectorAll?.('.city-place-card').forEach(x=>added.push(x));
   }));
   if(added.length)enforceCards(added);
  }).observe(grid,{childList:true});
  schedule();
 }
 const modal=document.getElementById('placeModal');
 if(modal){
  new MutationObserver(mutations=>{
   if(mutations.some(m=>m.type==='attributes'&&m.attributeName==='class')&&modal.classList.contains('open')){
    setTimeout(()=>enforceModal(true),0);
   }
  }).observe(modal,{attributes:true,attributeFilter:['class']});
 }
 setTimeout(()=>enforceCards(),700);
}

window.UnseenGoGooglePhotos={photos,enforceCards,enforceModal};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();
