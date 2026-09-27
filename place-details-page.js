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
    name:'Konda Reddy Fort',alternate:'Konda Reddy Buruju · Achyutha Devarayala Buruzu',
    location:'Kurnool, Andhra Pradesh',type:'Historical · Heritage',bestTime:'October–February',
    entry:'Not published',rating:'Not yet verified',timings:'Not yet verified',status:'✓ Official source available',
    image:IMG_BASE+'Konda%20Reddy%20Fort%20Kurnool.jpg?width=1600',image2:IMG_BASE+'KONDAREDDY%20FORT.jpg?width=1200',image3:IMG_BASE+'Konda%20Reddy%20Fort%20%2896137%29.jpg?width=1000',
    source:'https://kurnool.ap.gov.in/tourist-place/achyutha-devarayala-buruzukonda-reddy-buruzu/',sourceLabel:'Kurnool District — Government of Andhra Pradesh',
    maps:'https://www.google.com/maps/search/?api=1&query=Konda+Reddy+Fort+Kurnool',lat:15.83379,lng:78.048655,
    history:'Achyutha Devarayala Buruzu, also known as Konda Reddy Buruju, is a historic structure in the heart of Kurnool. The Kurnool district administration describes it as part of the old Kurnool Fort and associates its construction with Achyutha Devaraya of the Vijayanagara period, dated to 1529–1542 AD. The site was used as a prison, and the monument later became associated with Konda Reddy.',
    significance:'A surviving landmark connected with Kurnool’s Vijayanagara-era and later regional history.',
    nearby:[['Kurnool Archaeological Museum','Archaeology · Heritage','Kurnool city'],['Gol Gummaz','History · Architecture','Kurnool city'],['Orvakal Rock Garden','Nature · Scenic','Regional day trip'],['Belum Caves','Natural · Heritage','Regional day trip'],['Yaganti Uma Maheswara Temple','Spiritual · Heritage','Regional day trip'],['Gandikota Fort','Fort · Heritage','Longer regional circuit']],
    food:['Rayalaseema local cuisine','Kurnool city restaurants','Local breakfast & tiffin'],stay:['Kurnool city hotels','City-centre stays','Hotels near major road corridors'],
    reach:[['By air','Kurnool Airport','District source lists approximately 25 km.'],['By train','Kurnool City Railway Station','District source lists approximately 3 km.'],['By road','Kurnool city / bus stand','District source lists approximately 3 km.']],
    note:'Timings, entry fee and live rating are intentionally not invented. Connect these fields to Google Places / official tourism data for production.'
  },
  'gandikota':{
    name:'Gandikota Fort',alternate:'Fort & Penna River Gorge · YSR Kadapa',
    location:'Gandikota, Kadapa, Andhra Pradesh',type:'Historical · Natural · Adventure',bestTime:'October–February',
    entry:'Not published',rating:'Not yet verified',timings:'Not yet verified',status:'✓ Government tourism source available',
    image:'https://kadapa.ap.gov.in/gallery/gandikota/gandikota_viewpoint.jpg',image2:'https://kadapa.ap.gov.in/gallery/gandikota/Penna%20River_View%20Point.jpg',image3:'https://kadapa.ap.gov.in/gallery/gandikota/Masjid%20and%20Temple.jpg',
    source:'https://kadapa.ap.gov.in/gandikota-fort/',sourceLabel:'YSR Kadapa District — Government of Andhra Pradesh',
    maps:'https://www.google.com/maps/search/?api=1&query=Gandikota+Fort+Andhra+Pradesh',lat:14.81358,lng:78.28789,
    history:'Gandikota is a historic fort on a hill above the Penna River gorge. The YSR Kadapa district administration describes the fort as a major stone fortification with a large entrance and numerous bastions, and records temples, Juma Masjid, a granary, palace and other structures inside the fort.',
    significance:'The destination combines a major historic fort precinct with the dramatic Penna gorge and viewpoints. Government tourism material identifies history, natural scenery and adventure as core parts of Gandikota.',
    nearby:[['Penna River Viewpoint','Nature · Viewpoint','Inside the Gandikota landscape'],['Madhavaraya Temple','Vijayanagara · Heritage','Inside fort precinct'],['Juma Masjid','Architecture · Heritage','Inside fort precinct'],['Mini Charminar','Historic Architecture','Inside fort precinct'],['Mylavaram Dam','Nature · Water','Regional attraction'],['Ranganatha Swamy Temple','Temple · Heritage','Fort precinct']],
    food:['Local Andhra meals','Jammalamadugu restaurants','Local snacks & refreshments'],stay:['Gandikota-area stays','Jammalamadugu stays','Kadapa hotels'],
    reach:[['By road','Jammalamadugu','Approximately 15 km from Jammalamadugu.'],['From Kadapa','Kadapa city','Approximately 77 km according to district tourism information.'],['By rail','Jammalamadugu / regional rail access','Use road transfer for the final leg.']],
    note:'Entry fee, exact timings and live ratings should be connected to verified current sources before being presented as operational facts.'
  },
  'lepakshi':{
    name:'Lepakshi',alternate:'Veerabhadra Temple · Hanging Pillar · Monolithic Nandi',
    location:'Lepakshi, Sri Sathya Sai district, Andhra Pradesh',type:'Historical · Spiritual · Architecture',bestTime:'October–February',
    entry:'Not published',rating:'Not yet verified',timings:'Not yet verified',status:'✓ Incredible India / tourism source available',
    image:'https://www.incredibleindia.gov.in/content/dam/incredible-india-v2/images/places/lepakshi/lepakshi-veera-bhadra-temple.jpg',image2:'https://www.incredibleindia.gov.in/content/dam/incredible-india-v2/images/places/lepakshi/lepakshi-hanging-pillar.jpg',image3:'https://www.incredibleindia.gov.in/content/dam/incredible-india-v2/images/places/lepakshi/lepakshi-monolithic-nandi.jpg',
    source:'https://www.incredibleindia.gov.in/en/rural-tourism/lepakshi',sourceLabel:'Incredible India — Ministry of Tourism, Government of India',
    maps:'https://www.google.com/maps/search/?api=1&query=Lepakshi+Veerabhadra+Temple',lat:13.8014,lng:77.6038,
    history:'Lepakshi is renowned for the Veerabhadra Temple and its Vijayanagara-style architecture. The destination is especially known for the Hanging Pillar, large sculptural work and the monolithic Nandi. Its heritage combines architecture, religious traditions and local cultural practices.',
    significance:'Lepakshi is a strong heritage destination because its temple complex preserves distinctive Vijayanagara architectural and sculptural features. Incredible India also highlights its annual Brahmotsavam and cultural traditions.',
    nearby:[['Veerabhadra Temple','Architecture · Spiritual','Main heritage complex'],['Monolithic Nandi','Sculpture · Heritage','Near temple'],['Hanging Pillar','Vijayanagara Architecture','Inside temple'],['Jatayu Theme Park','Culture · Experience','Lepakshi'],['Hindupur','Town · Services','Nearby town'],['Penukonda Fort','Fort · Heritage','Regional circuit']],
    food:['Local Andhra meals','Lepakshi / Hindupur restaurants','South Indian breakfast & tiffin'],stay:['Hindupur stays','Lepakshi-area stays','Anantapur-region hotels'],
    reach:[['By air','Bengaluru International Airport','Incredible India lists approximately 45 km.'],['By train','Hindupur Junction','Incredible India lists approximately 13 km.'],['By road','Andhra Pradesh / Karnataka road network','Well connected by road to nearby towns and cities.']],
    note:'Operational timings, current ticket pricing and ratings should be verified before publication.'
  },
  'araku':{
    name:'Araku Valley',alternate:'Eastern Ghats · Tribal Culture · Borra Caves',
    location:'Araku Valley, Alluri Sitharama Raju district, Andhra Pradesh',type:'Nature · Culture · Adventure',bestTime:'October–February',
    entry:'Destination-wide fee varies by attraction',rating:'Not yet verified',timings:'Attraction-specific',status:'✓ Government tourism source available',
    image:'https://allurisitharamaraju.ap.gov.in/gallery/araku-valley/araku-valley.jpg',image2:'https://allurisitharamaraju.ap.gov.in/gallery/araku-valley/burra-caves.jpg',image3:'https://allurisitharamaraju.ap.gov.in/gallery/araku-valley/araku-tribal-museum.jpg',
    source:'https://allurisitharamaraju.ap.gov.in/tourism/',sourceLabel:'Alluri Sitharamaraju District — Government of Andhra Pradesh',
    maps:'https://www.google.com/maps/search/?api=1&query=Araku+Valley+Andhra+Pradesh',lat:18.3273,lng:82.8740,
    history:'Araku Valley is a major Eastern Ghats destination known for its landscapes and tribal culture. The district tourism information highlights tribal folklore and traditions, Dhimsa dance, the scenic railway journey through tunnels, the Tribal Museum, Padmapuram horticulture and nearby waterfalls. Borra Caves are a major geological attraction in the wider Araku region.',
    significance:'Araku combines nature, indigenous cultural traditions, agriculture, railway experiences and geological attractions in one regional tourism circuit.',
    nearby:[['Borra Caves','Geology · Nature','Ananthagiri Hills'],['Tribal Museum','Culture · Heritage','Araku'],['Padmapuram Gardens','Nature · Horticulture','Araku'],['Ranajilleda Waterfall','Nature · Waterfall','Regional attraction'],['Araku Railway Journey','Scenic · Experience','Eastern Ghats'],['Dhimsa Dance','Culture · Community','Local tradition']],
    food:['Araku coffee','Tribal-inspired local cuisine','Araku town restaurants'],stay:['Araku Valley resorts','Government / tourism accommodation','Homestays and local stays'],
    reach:[['By train','Araku Railway Station','Rail route through Eastern Ghats is a major travel experience.'],['By road','Visakhapatnam → Araku','Road access through the Eastern Ghats.'],['By air','Visakhapatnam Airport','Common gateway for the Araku region.']],
    note:'Araku is a region rather than one ticketed monument, so timings and fees must be displayed per attraction.'
  },
  'hampi':{
    name:'Hampi',alternate:'Vijayanagara Ruins · UNESCO World Heritage Site',
    location:'Hampi, Vijayanagara district, Karnataka',type:'UNESCO · Historical · Heritage',bestTime:'October–February',
    entry:'Attraction-specific',rating:'Not yet verified',timings:'Attraction-specific',status:'✓ Karnataka Tourism source available',
    image:'https://karnatakatourism.org/wp-content/uploads/2020/05/Hampi.jpg',image2:'https://karnatakatourism.org/wp-content/uploads/2020/05/Stone-Chariot-Hampi.jpg',image3:'https://karnatakatourism.org/wp-content/uploads/2020/05/Virupaksha-Temple-Hampi.jpg',
    source:'https://karnatakatourism.org/en/destinations/hampi',sourceLabel:'Karnataka Tourism — Government of Karnataka',
    maps:'https://www.google.com/maps/search/?api=1&query=Hampi+Karnataka',lat:15.3350,lng:76.4600,
    history:'Hampi was the capital of the Vijayanagara Empire and developed into a major historic city between the 14th and 16th centuries. Karnataka Tourism describes its surviving temples, markets, royal structures, water systems and dramatic granite landscape as a vast heritage destination. The monuments were declared a UNESCO World Heritage Site in 1986.',
    significance:'Hampi preserves an unusually large archaeological landscape where temples, royal architecture, markets and natural terrain remain connected. It is recognised internationally for its outstanding historical and architectural significance.',
    nearby:[['Virupaksha Temple','Spiritual · Heritage','Sacred Centre'],['Vijaya Vittala Temple','Architecture · Heritage','Sacred Centre'],['Stone Chariot','Vijayanagara Architecture','Vittala complex'],['Lotus Mahal','Royal Architecture','Royal Centre'],['Matanga Hill','Viewpoint · Adventure','Hampi'],['Hampi Bazaar','Heritage · Culture','Historic market area']],
    food:['Hampi local cafés','South Indian meals','Hospet / Hosapete restaurants'],stay:['Hampi heritage stays','Homestays near Hampi','Hosapete hotels'],
    reach:[['By rail','Hosapete Junction','Karnataka Tourism lists it as the nearest railway station, about 13 km away.'],['By road','Hosapete → Hampi','Regular road access connects the railway town and Hampi.'],['By air','Regional airports','Use regional airport access followed by road transfer.']],
    note:'Hampi is a large heritage landscape, so entrance rules, fees and timings vary by individual monument.'
  },
  'tirupati':{
    name:'Tirupati',alternate:'Temple City · Heritage · Spiritual & Eco Tourism',
    location:'Tirupati, Andhra Pradesh',type:'Spiritual · Heritage · Nature',bestTime:'October–February',
    entry:'Attraction-specific',rating:'Not yet verified',timings:'Attraction-specific',status:'✓ Tirupati District tourism source available',
    image:'https://tirupati.ap.gov.in/wp-content/uploads/2020/06/tirumala.jpg',image2:'https://tirupati.ap.gov.in/wp-content/uploads/2020/06/talakona.jpg',image3:'https://tirupati.ap.gov.in/wp-content/uploads/2020/06/kapila-theertham.jpg',
    source:'https://tirupati.ap.gov.in/tourist-places/',sourceLabel:'Tirupati District — Government of Andhra Pradesh',
    maps:'https://www.google.com/maps/search/?api=1&query=Tirupati+Andhra+Pradesh',lat:13.6288,lng:79.4192,
    history:'Tirupati district combines religious, cultural, eco-tourism, forest, archaeological and engineering attractions. The district tourism portal lists Sri Vari Temple at Tirumala, Sri Kapileswara Swamy Temple, Sri Govindarajaswamy Temple, Talakona waterfall and other destinations across the district.',
    significance:'Tirupati is more than a pilgrimage stop: the district tourism programme covers religious, cultural, eco, forest and archaeological experiences, making it suitable for a broader destination guide.',
    nearby:[['Sri Vari Temple, Tirumala','Spiritual · Pilgrimage','Tirumala'],['Sri Kapileswara Swamy Temple','Spiritual · Heritage','Tirupati'],['Govindarajaswamy Temple','Religious · Heritage','Tirupati city'],['Talakona Waterfall','Nature · Waterfall','Regional attraction'],['Regional Science Centre','Education · Experience','Tirupati'],['Pulicat Lake','Nature · Wetland','Regional attraction']],
    food:['Tirupati local vegetarian cuisine','Traditional Andhra meals','Tiffin & prasadam areas'],stay:['Tirupati city hotels','Pilgrim accommodation','Tirumala-area accommodation'],
    reach:[['By road','Tirupati city','Major road connections serve Tirupati and Tirumala.'],['By rail','Tirupati railway station','Rail access connects the city with major South Indian cities.'],['By air','Tirupati Airport','Airport serves the Tirupati region.']],
    note:'Tirupati contains many separately managed attractions, so fees, timings and booking rules must be shown per attraction.'
  }
}

function normalise(s){return s.toLowerCase().replace(/[–—]/g,' ').replace(/[^a-z0-9]+/g,' ').trim()}
const fallbackData={
  'Kurnool':{location:'Kurnool, Andhra Pradesh',type:'Destination · City',bestTime:'October–February'},
  'Hyderabad':{location:'Hyderabad, Telangana',type:'Destination · City',bestTime:'October–February'},
  'Bengaluru':{location:'Bengaluru, Karnataka',type:'Destination · City',bestTime:'October–February'},
  'Chennai':{location:'Chennai, Tamil Nadu',type:'Destination · City',bestTime:'October–February'},
  'Mumbai':{location:'Mumbai, Maharashtra',type:'Destination · City',bestTime:'November–February'},
  'Pune':{location:'Pune, Maharashtra',type:'Destination · City',bestTime:'October–February'},
  'Delhi':{location:'Delhi, India',type:'Destination · City',bestTime:'October–February'},
  'Jaipur':{location:'Jaipur, Rajasthan',type:'Destination · City',bestTime:'October–March'},
  'Kolkata':{location:'Kolkata, West Bengal',type:'Destination · City',bestTime:'October–February'},
  'Ahmedabad':{location:'Ahmedabad, Gujarat',type:'Destination · City',bestTime:'October–February'},
  'Lucknow':{location:'Lucknow, Uttar Pradesh',type:'Destination · City',bestTime:'October–February'},
  'Bhubaneswar':{location:'Bhubaneswar, Odisha',type:'Destination · City',bestTime:'October–February'},
  'Visakhapatnam':{location:'Visakhapatnam, Andhra Pradesh',type:'Destination · City',bestTime:'October–February'},
  'Vijayawada':{location:'Vijayawada, Andhra Pradesh',type:'Destination · City',bestTime:'October–February'},
  'Mysuru':{location:'Mysuru, Karnataka',type:'Destination · City',bestTime:'October–February'},
  'Goa':{location:'Goa, India',type:'Destination · Beach · Culture',bestTime:'November–February'}
};
function makeFallback(name){
  const key=Object.keys(fallbackData).find(k=>normalise(k)===normalise(name));
  const f=fallbackData[key]||{location:name,type:'Destination',bestTime:'October–February'};
  return {name:name,alternate:'Explore this destination with UnseenGo AI',location:f.location,type:f.type,bestTime:f.bestTime,entry:'Needs verification',rating:'Not yet verified',timings:'Needs verification',status:'⚠ Needs destination-data verification',
    image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    image2:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    image3:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80',
    source:'https://www.incredibleindia.gov.in/',sourceLabel:'Incredible India — official tourism portal',
    maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name),
    lat:20,lng:78,
    history:'This destination is present in the UnseenGo destination catalogue. Detailed historical and cultural content should be populated from an official tourism, heritage or local-government source before publication.',
    significance:'UnseenGo uses this same structured destination page for every destination. Verified history, significance, operational details and local recommendations can be attached as destination data becomes available.',
    nearby:[],food:[],stay:[],
    reach:[['By road','Local / regional road network','Open Maps for the current route.'],['By rail','Nearest railway station','Verify the nearest station before travel.'],['By air','Nearest airport','Verify the nearest airport and onward transport.']],
    note:'This is a generated destination shell. Do not treat unavailable ratings, fees, timings or descriptive facts as verified.'
  };
}
const place=places[normalise(requested)]||makeFallback(requested);
const mapEmbed='https://www.openstreetmap.org/export/embed.html?bbox='+(place.lng-.012)+'%2C'+(place.lat-.009)+'%2C'+(place.lng+.012)+'%2C'+(place.lat+.009)+'&layer=mapnik&marker='+place.lat+'%2C'+place.lng;

function unavailable(label,detail){return '<div class="dp-unavailable"><b>'+esc(label)+'</b>'+esc(detail)+'</div>'}
function render(){
 const app=document.getElementById('placeApp');
 app.innerHTML=
 '<div class="dp-breadcrumb"><a href="index.html">Home</a><span>›</span><a href="discover.html">Discover</a><span>›</span><span>'+esc(place.name)+'</span></div>'+
 '<section class="dp-hero">'+
   '<div class="dp-hero-media">'+(place.image?'<img src="'+esc(place.image)+'" alt="'+esc(place.name)+'" loading="eager">':'<div class="dp-photo-placeholder"><strong>📸 Real photos coming soon</strong><span>Verified destination photos will appear here.</span></div>')+'<span class="dp-photo-credit">'+(place.image?'Real place photo · verified source':'Photo verification pending')+'</span></div>'+
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