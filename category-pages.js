const categoryPages={
 Heritage:{title:'Heritage & History',icon:'🏛️',intro:'Historic places, monuments, old quarters and the stories that shaped the city.'},
 Nature:{title:'Nature & Hidden Escapes',icon:'🌿',intro:'Green spaces, lakes, hills, forests, waterfalls and peaceful escapes.'},
 Food:{title:'Local Food & Flavours',icon:'🍜',intro:'Local dishes, food streets, markets and neighbourhood food experiences.'},
 Culture:{title:'Culture & Local Life',icon:'🎭',intro:'Arts, crafts, traditions, communities, performances and living culture.'},
 Adventure:{title:'Adventure & Road Trips',icon:'🧗',intro:'Treks, cycling routes, wildlife escapes, water activities and nearby adventures.'}
};
function openCategoryPage(category){
 const city=window.selectedCity||'';
 if(!city){alert('Please select a city first.');return;}
 sessionStorage.setItem('unseengoCity',city);sessionStorage.setItem('unseengoCategory',category);
 window.location.href=`category.html?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`;
}
function categoryPageData(city,category){
 const c=window.opener?.cities?.[city]||null;
 return c?.[category]||[];
}
function renderCategoryPage(){
 const params=new URLSearchParams(location.search);const city=params.get('city')||sessionStorage.getItem('unseengoCity')||'Kurnool';const category=params.get('category')||sessionStorage.getItem('unseengoCategory')||'Heritage';
 const meta=categoryPages[category]||categoryPages.Heritage;const data=window.cityData?.[city]?.[category]||[];
 document.getElementById('categoryTitle').textContent=`${meta.icon} ${meta.title}`;document.getElementById('categoryCity').textContent=city;document.getElementById('categoryIntro').textContent=meta.intro;
 const cards=document.getElementById('categoryCards');
 cards.innerHTML=(data.length?data.map((p,i)=>`<article class="category-card"><div class="category-photo">${meta.icon}</div><div class="category-card-body"><span>${p[1]}</span><h2>${p[0]}</h2><div class="rating">★ ${(4.2+(p[2]%8)/10).toFixed(1)} <small>UnseenGo rating</small></div><p>${p[3]}</p><button onclick="alert('Details for ${p[0].replace(/'/g,"\\'")} coming soon')">View details →</button></div></article>`).join(''):'<div class="no-data">No places have been added for this category yet.</div>');
 document.getElementById('backLink').href='index.html#discover';
}
