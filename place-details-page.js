/* UnseenGo AI — reusable destination detail page
 * Data-first: verified/official facts are separated from unavailable or future API fields.
 */
(function(){
'use strict';

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const q=new URLSearchParams(location.search);
const requested=(q.get('place')||q.get('destination')||q.get('city')||'Konda Reddy Fort').trim();

const IMG_BASE='https://commons.wikimedia.org/wiki/Special:FilePath/';
const places={
  'konda reddy fort':{
    name:'Konda Reddy Fort',
    alternate:'Konda Reddy Buruju · Achyutha Devarayala Buruzu',
    location:'Kurnool, Andhra Pradesh',
    type:'Historical · Heritage',
    bestTime:'October–February',
    entry:'Not published',
    rating:'Not yet verified',
    timings:'Not yet verified',
    status:'✓ Official source available',
    image:IMG_BASE+'Konda%20Reddy%20Fort%20Kurnool.jpg?width=1600',
    image2:IMG_BASE+'KONDAREDDY%20FORT.jpg?width=1200',
    image3:IMG_BASE+'Konda%20Reddy%20Fort%20%2896137%29.jpg?width=1000',
    source:'https://kurnool.ap.gov.in/tourist-place/achyutha-devarayala-buruzukonda-reddy-buruzu/',
    sourceLabel:'Kurnool District — Government of Andhra Pradesh',
    maps:'https://www.google.com/maps/search/?api=1&query=Konda+Reddy+Fort+Kurnool',
    lat:15.83379,lng:78.048655,
    history:'Achyutha Devarayala Buruzu, also known as Konda Reddy Buruju, is a historic structure in the heart of Kurnool. The Kurnool district administration describes it as part of the old Kurnool Fort and associates its construction with Achyutha Devaraya of the Vijayanagara period, dated to 1529–1542 AD. The site was used as a prison, and the monument later became associated with Konda Reddy.',
    significance:'It is a surviving landmark connected with Kurnool’s Vijayanagara-era and later regional history. Wikimedia Commons also identifies it as an Archaeological Survey of India monument of national importance.',
    nearby:[
      ['Orvakal Rock Garden','Nature · Scenic','Regional day trip'],
      ['Kurnool Archaeological Museum','Archaeology · Heritage','Kurnool city'],
      ['Gol Gummaz','History · Architecture','Kurnool city'],
      ['Belum Caves','Natural · Heritage','Regional day trip'],
      ['Yaganti Uma Maheswara Temple','Spiritual · Heritage','Regional day trip'],
      ['Gandikota Fort','Fort · Heritage','Longer regional circuit']
    ],
    food:['Rayalaseema local cuisine','Kurnool city restaurants','Local breakfast & tiffin'],
    stay:['Kurnool city hotels','Railway station / city-centre stays','Hotels near major road corridors'],
    reach:[
      ['By air','Kurnool airport','District source lists approximately 25 km.'],
      ['By train','Kurnool City Railway Station','District source lists approximately 3 km.'],
      ['By road','Kurnool city / bus stand','District source lists approximately 3 km.']
    ],
    note:'Timings, entry fee and live rating are intentionally not invented. Connect these fields to Google Places / official tourism data when the production data layer is added.'
  }
};

function normalise(s){return s.toLowerCase().replace(/[–—]/g,' ').replace(/[^a-z0-9]+/g,' ').trim()}
const place=places[normalise(requested)]||places['konda reddy fort'];
const mapEmbed='https://www.openstreetmap.org/export/embed.html?bbox='+(place.lng-.012)+'%2C'+(place.lat-.009)+'%2C'+(place.lng+.012)+'%2C'+(place.lat+.009)+'&layer=mapnik&marker='+place.lat+'%2C'+place.lng;

function unavailable(label,detail){return '<div class="dp-unavailable"><b>'+esc(label)+'</b>'+esc(detail)+'</div>'}
function render(){
 const app=document.getElementById('placeApp');
 app.innerHTML=
 '<div class="dp-breadcrumb"><a href="index.html">Home</a><span>›</span><a href="discover.html">Discover</a><span>›</span><span>'+esc(place.name)+'</span></div>'+
 '<section class="dp-hero">'+
   '<div class="dp-hero-media"><img src="'+esc(place.image)+'" alt="'+esc(place.name)+'" loading="eager"><span class="dp-photo-credit">Real place photo · Wikimedia Commons</span></div>'+
   '<div class="dp-hero-copy">'+
     '<div class="dp-eyebrow">'+esc(place.type)+'</div>'+
     '<h1>'+esc(place.name)+'</h1>'+
     '<p class="dp-subtitle">'+esc(place.alternate)+'</p>'+
     '<div class="dp-location">📍 '+esc(place.location)+'</div>'+
     '<div class="dp-pills"><span class="dp-pill status">'+esc(place.status)+'</span><span class="dp-pill">Best time · '+esc(place.bestTime)+'</span></div>'+
     '<div class="dp-actions"><a class="primary" href="'+esc(place.maps)+'" target="_blank" rel="noopener">📍 Open in Maps</a><button type="button" id="savePlace">♡ Save place</button></div>'+
   '</div>'+
 '</section>'+

 '<section class="dp-section"><div class="dp-section-head"><div><div class="dp-eyebrow">At a glance</div><h2>Plan before you go.</h2></div><p>Practical fields are shown with their current data status instead of filling gaps with guesses.</p></div>'+
   '<div class="dp-facts">'+
    '<div class="dp-fact"><span>Location</span><strong>'+esc(place.location)+'</strong></div>'+
    '<div class="dp-fact"><span>Type</span><strong>'+esc(place.type)+'</strong></div>'+
    '<div class="dp-fact"><span>Best time</span><strong>'+esc(place.bestTime)+'</strong></div>'+
    '<div class="dp-fact"><span>Entry fee</span><strong>'+esc(place.entry)+'</strong><small>Needs live/official verification</small></div>'+
    '<div class="dp-fact"><span>Rating</span><strong>★ '+esc(place.rating)+'</strong></div>'+
    '<div class="dp-fact"><span>Timings</span><strong>'+esc(place.timings)+'</strong></div>'+
    '<div class="dp-fact"><span>Coordinates</span><strong>'+place.lat.toFixed(5)+', '+place.lng.toFixed(5)+'</strong></div>'+
    '<div class="dp-fact"><span>Data status</span><strong>Official history source</strong><small>Live operational data pending</small></div>'+
   '</div></section>'+

 '<div class="dp-layout">'+
  '<div>'+
   '<section class="dp-card"><div class="dp-section-head"><div><div class="dp-eyebrow">📸 Photos</div><h2>See the place.</h2></div></div>'+
    '<div class="dp-gallery">'+
      '<figure><img src="'+esc(place.image)+'" alt="'+esc(place.name)+' front view" loading="lazy"><figcaption>Wikimedia Commons · CC0</figcaption></figure>'+
      '<figure><img src="'+esc(place.image2)+'" alt="'+esc(place.name)+' view" loading="lazy"><figcaption>Wikimedia Commons · CC0</figcaption></figure>'+
      '<figure><img src="'+esc(place.image3)+'" alt="'+esc(place.name)+' view" loading="lazy"><figcaption>Wikimedia Commons · CC0</figcaption></figure>'+
    '</div>'+
   '</section>'+

   '<section class="dp-card"><div class="dp-eyebrow">📜 History</div><h3>Where the story begins.</h3><p class="dp-history">'+esc(place.history)+'</p><a class="dp-source" href="'+esc(place.source)+'" target="_blank" rel="noopener">Read official source ↗</a></section>'+
   '<section class="dp-card"><div class="dp-eyebrow">🏛 Significance</div><h3>Why this place matters.</h3><p>'+esc(place.significance)+'</p></section>'+

   '<section class="dp-card"><div class="dp-section-head"><div><div class="dp-eyebrow">📍 Map</div><h2>Find the destination.</h2></div><a class="dp-source" href="'+esc(place.maps)+'" target="_blank" rel="noopener">Open full map ↗</a></div>'+
     '<div class="dp-map"><iframe title="Map of '+esc(place.name)+'" src="'+mapEmbed+'" loading="lazy"></iframe></div>'+
   '</section>'+

   '<section class="dp-card"><div class="dp-eyebrow">🌄 Nearby attractions</div><h3>Build a local circuit.</h3><div class="dp-nearby">'+place.nearby.map(x=>'<a class="dp-near-card" href="discover.html?city='+encodeURIComponent('Kurnool')+'"><small>'+esc(x[1])+'</small><strong>'+esc(x[0])+'</strong><span>'+esc(x[2])+' · Explore in UnseenGo →</span></a>').join('')+'</div></section>'+
  '</div>'+

  '<aside class="dp-side-sticky">'+
   '<section class="dp-card"><div class="dp-eyebrow">🕐 Timings</div><h3>Visit information</h3>'+unavailable('Timings','Live/official timing data is not connected yet.')+'</section>'+
   '<section class="dp-card"><div class="dp-eyebrow">💰 Entry fee</div><h3>Ticket information</h3>'+unavailable('Entry fee','No verified current fee is displayed. This prevents outdated pricing from being presented as fact.')+'</section>'+
   '<section class="dp-card"><div class="dp-eyebrow">🍴 Nearby food</div><h3>Eat nearby.</h3><div class="dp-list">'+place.food.map(x=>'<a class="dp-list-item" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(x+' Kurnool')+'" target="_blank" rel="noopener"><strong>'+esc(x)+'</strong><span>Maps ↗</span></a>').join('')+'</div></section>'+
   '<section class="dp-card"><div class="dp-eyebrow">🏨 Nearby stay</div><h3>Stay nearby.</h3><div class="dp-list">'+place.stay.map(x=>'<a class="dp-list-item" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(x+' Kurnool')+'" target="_blank" rel="noopener"><strong>'+esc(x)+'</strong><span>Maps ↗</span></a>').join('')+'</div></section>'+
   '<section class="dp-card"><div class="dp-eyebrow">🚗 How to reach</div><h3>Getting there.</h3><div class="dp-route">'+place.reach.map(x=>'<div><b>'+esc(x[0])+'</b><br>'+esc(x[1])+'<br><span>'+esc(x[2])+'</span></div>').join('')+'</div><p class="dp-disclaimer">'+esc(place.note)+'</p></section>'+
  '</aside>'+
 '</div>';
 const save=document.getElementById('savePlace');
 save.addEventListener('click',()=>{const key='unseengo_saved_places';const list=JSON.parse(localStorage.getItem(key)||'[]');const exists=list.some(x=>x===place.name);if(!exists){list.push(place.name);localStorage.setItem(key,JSON.stringify(list));save.textContent='✓ Saved';}else{save.textContent='✓ Already saved';}});
}
render();
})();