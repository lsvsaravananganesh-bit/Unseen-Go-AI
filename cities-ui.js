/* UnseenGo AI — improved All Cities selector */
(function(){
 const allCities=[['South','Hyderabad'],['South','Bengaluru'],['South','Chennai'],['South','Kochi'],['South','Kurnool'],['South','Tirupati'],['South','Vijayawada'],['West','Mumbai'],['West','Pune'],['West','Ahmedabad'],['West','Goa'],['West','Indore'],['West','Nagpur'],['East','Kolkata'],['East','Bhubaneswar'],['North','Jaipur'],['North','Lucknow'],['North','New Delhi'],['Northeast','Guwahati']];
 const byRegion={}; allCities.forEach(([r,c])=>(byRegion[r]??=[]).push(c));
 function cityChooser(){
  const original=document.getElementById('citySelect'); if(!original||document.getElementById('allCitiesChooser')) return;
  original.style.display='none'; const wrap=document.createElement('div'); wrap.id='allCitiesChooser'; wrap.className='all-cities-chooser';
  wrap.innerHTML='<button type="button" class="city-picker-trigger" id="cityPickerTrigger"><span class="city-picker-icon">⌖</span><span><small>EXPLORE INDIA</small><strong id="cityPickerValue">Choose a city...</strong></span><span class="city-picker-arrow">⌄</span></button><div class="city-picker-menu" id="cityPickerMenu"><div class="city-picker-search"><span>⌕</span><input id="cityPickerSearch" placeholder="Search any Indian city..."></div><div class="city-picker-top"><b>All Cities</b><span>'+allCities.length+' destinations</span></div><div class="city-region-tabs" id="cityRegionTabs"><button class="active" data-region="All">All</button>'+Object.keys(byRegion).map(r=>'<button data-region="'+r+'">'+r+'</button>').join('')+'</div><div class="city-picker-grid" id="cityPickerGrid"></div></div>';
  original.parentElement.replaceChild(wrap,original);
  const grid=wrap.querySelector('#cityPickerGrid'),menu=wrap.querySelector('#cityPickerMenu'),trigger=wrap.querySelector('#cityPickerTrigger'),search=wrap.querySelector('#cityPickerSearch'),value=wrap.querySelector('#cityPickerValue'); let active='All';
  function render(){const q=search.value.trim().toLowerCase();const list=allCities.filter(([r,c])=>(active==='All'||r===active)&&(!q||c.toLowerCase().includes(q)||r.toLowerCase().includes(q)));grid.innerHTML=list.length?list.map(([r,c])=>'<button type="button" class="city-option" data-city="'+c+'"><span class="city-pin">⌖</span><span><strong>'+c+'</strong><small>'+r+' India</small></span><i>→</i></button>').join(''):'<div class="no-city">No city found. Try another name.</div>';grid.querySelectorAll('.city-option').forEach(btn=>btn.addEventListener('click',()=>choose(btn.dataset.city)));}
  function choose(city){const option=[...original.options].find(o=>o.value===city);if(option) original.value=city;else{const o=new Option(city,city);original.add(o);original.value=city;}value.textContent=city;menu.classList.remove('open');trigger.classList.add('selected');original.dispatchEvent(new Event('change',{bubbles:true}));if(typeof window.setCity==='function')window.setCity(city);}
  trigger.addEventListener('click',()=>{menu.classList.toggle('open');if(menu.classList.contains('open'))search.focus();});search.addEventListener('input',render);
  wrap.querySelectorAll('.city-region-tabs button').forEach(b=>b.addEventListener('click',()=>{wrap.querySelectorAll('.city-region-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');active=b.dataset.region;render();}));
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))menu.classList.remove('open');}); render();
 }
 window.addEventListener('DOMContentLoaded',()=>setTimeout(cityChooser,300)); setTimeout(cityChooser,800);
})();
