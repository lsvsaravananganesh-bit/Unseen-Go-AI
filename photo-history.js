/* UnseenGo AI — live place-history + photo layer
   Uses Wikimedia/Wikipedia's public API for place summaries and article thumbnails.
   This keeps the site lightweight while giving each destination a real image + history source.
*/
const PHOTO_CACHE={};

async function getPlaceRecord(title){
  const key=title.trim().toLowerCase();
  if(PHOTO_CACHE[key]) return PHOTO_CACHE[key];
  try{
    const endpoint='https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title.trim().replace(/ /g,'_'));
    const response=await fetch(endpoint,{headers:{Accept:'application/json'}});
    if(!response.ok) throw new Error('not found');
    const data=await response.json();
    if(data.type==='disambiguation') throw new Error('disambiguation');
    const record={
      title:data.title||title,
      history:data.extract||'Historical information is not available for this exact place yet.',
      description:data.description||'Indian destination',
      image:data.thumbnail?.source||data.originalimage?.source||'',
      article:data.content_urls?.desktop?.page||('https://en.wikipedia.org/wiki/'+encodeURIComponent(data.title||title).replace(/%20/g,'_'))
    };
    PHOTO_CACHE[key]=record;
    return record;
  }catch(error){
    PHOTO_CACHE[key]={title,history:'A verified article for this exact place was not found yet.',description:'Place story pending',image:'',article:'https://en.wikipedia.org/wiki/'+encodeURIComponent(title).replace(/%20/g,'_')};
    return PHOTO_CACHE[key];
  }
}

function safeText(value){return String(value).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

async function decorateFamousCards(){
  document.querySelectorAll('.famous-card').forEach(async(card)=>{
    if(card.dataset.photoLoaded) return;
    card.dataset.photoLoaded='1';
    const title=card.querySelector('strong')?.textContent?.trim();
    if(!title) return;
    const record=await getPlaceRecord(title);
    const oldInfo=card.querySelector('strong');
    const number=card.querySelector('span')?.textContent||'';
    card.innerHTML=`${record.image?`<img class="place-photo" src="${safeText(record.image)}" alt="${safeText(title)}" loading="lazy">`:''}<div class="place-info"><span class="num">${safeText(number)}</span><strong>${safeText(title)}</strong><small>View photo, history & story →</small></div>`;
    card.title=record.description;
  });
}

async function decorateHiddenCards(){
  document.querySelectorAll('#places .place').forEach(async(card)=>{
    if(card.dataset.photoLoaded) return;
    card.dataset.photoLoaded='1';
    const title=card.querySelector('h3')?.textContent?.trim();
    if(!title) return;
    const record=await getPlaceRecord(title);
    if(record.image && !card.querySelector('.card-photo')){
      const img=document.createElement('img');
      img.className='card-photo'; img.loading='lazy'; img.alt=title; img.src=record.image;
      card.prepend(img);
    }
    if(!card.querySelector('.story-cta')){
      const cta=document.createElement('div'); cta.className='story-cta'; cta.textContent='✦ Open place history & photo →'; card.appendChild(cta);
    }
  });
}

async function decorateAllPlaceCards(){
  await decorateFamousCards();
  await decorateHiddenCards();
}

/* Add a source line to the existing story modal so the visitor knows where the history/photo came from. */
const originalOpenPlaceStory=window.openPlaceStory;
window.openPlaceStory=async function(title,type){
  if(typeof originalOpenPlaceStory==='function') await originalOpenPlaceStory(title,type);
  const record=await getPlaceRecord(title);
  const modal=document.getElementById('placeModal');
  if(!modal) return;
  const block=modal.querySelector('.history-note');
  if(block) block.innerHTML=`History and photo: <a href="${safeText(record.article)}" target="_blank" rel="noopener noreferrer">Wikipedia / Wikimedia source ↗</a>`;
};
window.openPlaceStory=window.openPlaceStory;

const photoObserver=new MutationObserver(()=>decorateAllPlaceCards());
window.addEventListener('DOMContentLoaded',()=>{
  decorateAllPlaceCards();
  const places=document.getElementById('places');
  if(places) photoObserver.observe(places,{childList:true,subtree:true});
  setTimeout(decorateAllPlaceCards,700);
});
setTimeout(decorateAllPlaceCards,1200);
