/* UnseenGo AI — city stories, famous places and place-history explorer */
const famousPlaces={
  Hyderabad:['Charminar','Golconda Fort','Chowmahalla Palace','Salar Jung Museum','Qutb Shahi Tombs'],
  Bengaluru:['Bangalore Palace','Vidhana Soudha','Tipu Sultan’s Summer Palace','Lalbagh Botanical Garden','ISKCON Temple Bangalore'],
  Chennai:['Marina Beach','Kapaleeshwarar Temple','Fort St. George','San Thome Basilica','Government Museum, Chennai'],
  Mumbai:['Gateway of India','Chhatrapati Shivaji Maharaj Terminus','Marine Drive','Elephanta Caves','Sanjay Gandhi National Park'],
  Pune:['Shaniwar Wada','Aga Khan Palace','Sinhagad Fort','Pataleshwar Cave Temple','Raja Dinkar Kelkar Museum'],
  Kolkata:['Victoria Memorial','Howrah Bridge','Indian Museum','St. Paul’s Cathedral','Dakshineswar Kali Temple'],
  Jaipur:['Amber Fort','Hawa Mahal','City Palace, Jaipur','Jantar Mantar, Jaipur','Nahargarh Fort'],
  Ahmedabad:['Sabarmati Ashram','Adalaj Stepwell','Sidi Saiyyed Mosque','Kankaria Lake','Jama Masjid, Ahmedabad'],
  Lucknow:['Bara Imambara','Chota Imambara','Rumi Darwaza','British Residency','Hazratganj'],
  Bhubaneswar:['Lingaraj Temple','Udayagiri and Khandagiri Caves','Mukteshwar Temple','Rajarani Temple','Dhauli Shanti Stupa'],
  Kochi:['Fort Kochi','Mattancherry Palace','Chinese Fishing Nets','St. Francis Church','Jewish Synagogue, Kochi'],
  Varanasi:['Kashi Vishwanath Temple','Dashashwamedh Ghat','Sarnath','Manikarnika Ghat','Assi Ghat'],
  Goa:['Basilica of Bom Jesus','Fort Aguada','Se Cathedral','Dudhsagar Falls','Fontainhas'],
  Indore:['Rajwada Palace','Lal Bagh Palace','Kanch Mandir','Sarafa Bazaar','Central Museum, Indore'],
  Guwahati:['Kamakhya Temple','Umananda Temple','Assam State Museum','Navagraha Temple','Deepor Beel'],
  'New Delhi':['India Gate','Red Fort','Qutub Minar','Humayun’s Tomb','Rashtrapati Bhavan'],
  Kurnool:['Kondareddy Buruju','Belum Caves','Yaganti Temple','Oravakallu Rock Garden','Srisailam'],
  Tirupati:['Sri Venkateswara Temple','Sri Kapileswara Swamy Temple','Chandragiri Fort','Talakona Waterfalls','Silathoranam'],
  Vijayawada:['Kanaka Durga Temple','Undavalli Caves','Prakasam Barrage','Bhavani Island','Amaravati Stupa'],
  Nagpur:['Deekshabhoomi','Dikshabhoomi','Sitabuldi Fort','Zero Mile Stone','Futala Lake']
};

const cityStoryFallback={
 Hyderabad:'A Deccan city shaped by the Qutb Shahi and Nizam eras, Hyderabad blends Indo-Islamic architecture, Telugu culture, food traditions and a modern technology economy.',
 Bengaluru:'Bengaluru grew from a historic fortified settlement into a major modern city, while its old neighbourhoods, markets, gardens and palaces preserve layers of Karnataka history.',
 Chennai:'Chennai grew around historic coastal settlements and colonial-era Fort St. George, later becoming a major centre for Tamil culture, music, dance, education and industry.',
 Mumbai:'Mumbai developed from a group of islands into a major port and commercial metropolis. Its caves, colonial buildings, neighbourhoods and waterfronts preserve many different chapters of its past.',
 Pune:'Pune became an important centre of Maratha political and cultural history and later an influential educational and industrial city.',
 Kolkata:'Kolkata developed as a major colonial-era port and intellectual centre, with Bengali literature, art, reform movements and historic neighbourhoods shaping its identity.',
 Jaipur:'Jaipur was founded in 1727 by Maharaja Sawai Jai Singh II as a planned city, combining Rajput traditions with organised urban design.',
 Ahmedabad:'Ahmedabad has centuries of mercantile, architectural and craft history, with the old city’s pols, mosques, stepwells and textile traditions revealing its past.',
 Lucknow:'Lucknow is closely associated with Awadhi court culture, architecture, poetry, music, cuisine and the distinctive idea of tehzeeb or refined social culture.',
 Bhubaneswar:'Bhubaneswar is one of Odisha’s great temple cities, where ancient rock-cut caves and stone temples sit alongside a modern planned capital.',
 Kochi:'Kochi developed as a maritime trading centre on the Malabar Coast, bringing together Indian, Arab, Chinese, Portuguese, Dutch and other influences.',
 Varanasi:'Varanasi is one of South Asia’s oldest continuously inhabited cities and has long been a major centre of pilgrimage, learning, music and craft.',
 Goa:'Goa combines older Indian traditions with centuries of maritime trade and Portuguese influence, visible in its churches, forts, villages and coastal culture.',
 Indore:'Indore grew as an important trading centre under the Holkar dynasty and later developed into a major commercial city of central India.',
 Guwahati:'Guwahati sits beside the Brahmaputra and has long been an important cultural and religious centre of Assam and the wider Northeast.',
 'New Delhi':'New Delhi was planned as the imperial capital of British India and today forms part of a much older Delhi urban landscape filled with monuments from many periods.',
 Kurnool:'Kurnool lies in the Rayalaseema region and is surrounded by forts, temples, caves, rock formations and landscapes connected with the Deccan and local traditions.',
 Tirupati:'Tirupati is a major pilgrimage destination in the Tirumala hills, with temple traditions, historic forts and natural landscapes extending beyond the main shrine.',
 Vijayawada:'Vijayawada sits on the Krishna River and has long been connected with pilgrimage, river trade, Buddhist heritage and the cultural history of coastal Andhra.',
 Nagpur:'Nagpur developed under the Gond and later Maratha rulers and became an important geographic and administrative centre in central India.'
};

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function currentCity(){return (document.getElementById('citySelect')?.value||document.getElementById('heroCity')?.value||'').trim();}
function wikiTitle(title){return title.replace(/\s*\([^)]*\)/g,'').replace(/’/g,"'");}
async function wikipediaSummary(title){
  try{
    const url='https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(wikiTitle(title).replace(/ /g,'_'));
    const r=await fetch(url,{headers:{Accept:'application/json'}});
    if(!r.ok) throw new Error('not found');
    const d=await r.json();
    if(d.type==='disambiguation') return null;
    return {extract:d.extract||'',description:d.description||'',thumbnail:d.thumbnail?.source||''};
  }catch(e){return null;}
}

function ensureStoryUI(){
  if(!document.getElementById('cityStorySection')){
    const discover=document.getElementById('discover');
    const section=document.createElement('section');
    section.className='section story-section'; section.id='cityStorySection';
    section.innerHTML='<div class="city-story-head"><div><p class="eyebrow">THE STORY OF THE CITY</p><h2 id="cityStoryTitle">Choose a city.<br><em>Then uncover its story.</em></h2></div><p id="cityStoryText" class="muted">Select a city to see its history, famous landmarks and lesser-known places.</p></div><div class="story-layout"><div class="story-box"><span>✦ CITY HISTORY</span><p id="cityHistory">Choose a city above.</p></div><div class="story-box"><span>✦ WHAT TO EXPLORE</span><div id="famousPlaces" class="famous-grid"></div></div></div>';
    discover.insertAdjacentElement('afterend',section);
  }
  if(!document.getElementById('placeModal')){
    const modal=document.createElement('div'); modal.id='placeModal'; modal.className='place-modal';
    modal.innerHTML='<div class="modal-backdrop" onclick="closePlaceStory()"></div><article class="modal-card"><button class="modal-close" onclick="closePlaceStory()">×</button><div class="modal-kicker">✦ PLACE STORY</div><h2 id="modalTitle">Place</h2><p id="modalDesc" class="modal-desc"></p><div id="modalImage"></div><div class="history-block"><span>HISTORY & SIGNIFICANCE</span><p id="modalHistory">Loading the story…</p></div><p class="history-note">Historical summaries are sourced from Wikipedia when an article is available. Folklore and legends are presented separately when identified.</p></article></div>';
    document.body.appendChild(modal);
  }
}

function renderFamous(city){
  const box=document.getElementById('famousPlaces'); if(!box) return;
  const list=famousPlaces[city]||[];
  box.innerHTML=list.length?list.map((p,i)=>`<button class="famous-card" onclick="openPlaceStory('${esc(p).replace(/'/g,"\\'")}','Famous place')"><span>0${i+1}</span><strong>${esc(p)}</strong><small>View history & story →</small></button>`).join(''):'<p class="muted">Famous landmarks for this city are being added.</p>';
}

async function updateCityStory(city){
  ensureStoryUI();
  if(!city){document.getElementById('cityStoryTitle').innerHTML='Choose a city.<br><em>Then uncover its story.</em>';document.getElementById('cityStoryText').textContent='Select a city to see its history, famous landmarks and lesser-known places.';document.getElementById('cityHistory').textContent='Choose a city above.';document.getElementById('famousPlaces').innerHTML='';return;}
  document.getElementById('cityStoryTitle').innerHTML=esc(city)+'<br><em>has more stories to tell.</em>';
  document.getElementById('cityStoryText').textContent='Explore famous landmarks alongside the lesser-known places already curated for this city.';
  document.getElementById('cityHistory').textContent=cityStoryFallback[city]||'This city has a rich local history shaped by its people, architecture, trade, culture and surrounding landscape.';
  renderFamous(city);
}

function attachPlaceClicks(){
  document.querySelectorAll('#places .place').forEach(card=>{
    if(card.dataset.storyBound) return;
    card.dataset.storyBound='1'; card.classList.add('clickable-place');
    card.addEventListener('click',()=>{
      const title=card.querySelector('h3')?.textContent||'Place';
      const meta=card.querySelector('small')?.textContent||'';
      openPlaceStory(title,'Hidden gem · '+meta);
    });
  });
}

async function openPlaceStory(title,type){
  ensureStoryUI();
  const modal=document.getElementById('placeModal'); modal.classList.add('open');
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalDesc').textContent=type;
  document.getElementById('modalHistory').textContent='Finding the historical story…';
  document.getElementById('modalImage').innerHTML='';
  const data=await wikipediaSummary(title);
  if(data){
    document.getElementById('modalHistory').textContent=data.extract||'A historical summary is not available for this exact place.';
    document.getElementById('modalDesc').textContent=data.description||type;
    if(data.thumbnail) document.getElementById('modalImage').innerHTML=`<img class="story-image" src="${esc(data.thumbnail)}" alt="${esc(title)}">`;
  }else{
    document.getElementById('modalHistory').textContent='A dedicated historical article was not found for this exact name. The place card description above provides the curated discovery context; future versions can add a verified local history entry here.';
  }
}
function closePlaceStory(){document.getElementById('placeModal')?.classList.remove('open');}
window.openPlaceStory=openPlaceStory; window.closePlaceStory=closePlaceStory;

function bindStoryRefresh(){
  ensureStoryUI();
  const select=document.getElementById('citySelect');
  if(select&&!select.dataset.storyBound){select.addEventListener('change',()=>setTimeout(()=>{updateCityStory(select.value);attachPlaceClicks();},50));select.dataset.storyBound='1';}
  const hero=document.getElementById('heroCity');
  if(hero&&!hero.dataset.storyBound){hero.addEventListener('change',()=>{const city=hero.value.trim();if(city) updateCityStory(city);});hero.dataset.storyBound='1';}
  attachPlaceClicks();
  const city=currentCity(); if(city&&city!==hero?.value) updateCityStory(city);
}

const oldSetCity=window.setCity;
window.setCity=function(city){ if(typeof oldSetCity==='function') oldSetCity(city); setTimeout(()=>{updateCityStory(city);attachPlaceClicks();},80); };

const observer=new MutationObserver(()=>attachPlaceClicks());
window.addEventListener('DOMContentLoaded',()=>{bindStoryRefresh();observer.observe(document.getElementById('places'),{childList:true,subtree:true});});
setTimeout(bindStoryRefresh,400);
