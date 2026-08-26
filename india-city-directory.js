/* UnseenGo AI — Full India city/destination browser
 * Uses the existing INDIA_DIRECTORY dataset. It intentionally labels the dataset as
 * the UnseenGo India directory rather than claiming Census-level completeness.
 */
(function(){
  'use strict';
  function init(){
    var d=window.INDIA_DIRECTORY||{};
    var citiesEl=document.getElementById('cities');
    var tabsEl=document.getElementById('tabs');
    if(!citiesEl||!tabsEl||!Object.keys(d).length)return;

    var states=Object.keys(d).sort();
    var rows=[];
    states.forEach(function(state){
      (d[state]||[]).forEach(function(city){
        rows.push({city:String(city),state:state});
      });
    });
    var seen={};
    rows=rows.filter(function(x){var k=x.city.toLowerCase()+'|'+x.state.toLowerCase();if(seen[k])return false;seen[k]=1;return true;});

    var regionStates={
      'South India':['Andhra Pradesh','Telangana','Karnataka','Kerala','Tamil Nadu','Puducherry'],
      'West India':['Goa','Gujarat','Maharashtra','Rajasthan','Dadra and Nagar Haveli and Daman and Diu'],
      'North India':['Delhi','Haryana','Himachal Pradesh','Jammu and Kashmir','Ladakh','Punjab','Uttar Pradesh','Uttarakhand','Chandigarh'],
      'East India':['Bihar','Jharkhand','Odisha','West Bengal','Andaman and Nicobar Islands'],
      'Central India':['Chhattisgarh','Madhya Pradesh'],
      'North East India':['Arunachal Pradesh','Assam','Manipur','Meghalaya','Mizoram','Nagaland','Sikkim','Tripura'],
      'Islands':['Lakshadweep','Andaman and Nicobar Islands']
    };
    var regionByState={};
    Object.keys(regionStates).forEach(function(r){regionStates[r].forEach(function(s){regionByState[s]=r;});});

    var box=document.createElement('div');
    box.className='ug-directory-tools';
    box.innerHTML='<div class="ug-dir-count"><strong>'+rows.length+'</strong> places in the UnseenGo India directory</div><input id="ugDirSearch" type="search" placeholder="Search any city, destination or state…" autocomplete="off"><select id="ugDirState"><option value="">All states & UTs</option>'+states.map(function(s){return '<option value="'+esc(s)+'">'+esc(s)+'</option>';}).join('')+'</select><button id="ugUseLocation" type="button">📍 Use my location</button>';
    tabsEl.parentNode.insertBefore(box,tabsEl);

    var style=document.createElement('style');
    style.textContent='.ug-directory-tools{display:grid;grid-template-columns:auto minmax(240px,1fr) 220px auto;gap:10px;align-items:center;margin:0 0 22px}.ug-dir-count{font-size:12px;color:#aeb9af;white-space:nowrap}.ug-dir-count strong{font-size:22px;color:#ffd21f;margin-right:5px}.ug-directory-tools input,.ug-directory-tools select{min-height:46px;border:1px solid #30362e;border-radius:10px;background:#11150f;color:#fff;padding:0 14px;font:inherit}.ug-directory-tools button{min-height:46px;border:0;border-radius:10px;background:#ffd21f;color:#080808;font-weight:900;padding:0 14px;cursor:pointer}.ug-directory-tools button:hover{transform:translateY(-1px)}.ug-all-cities-note{font-size:12px;color:#a4aaa1;margin:-8px 0 18px}.ug-directory-empty{grid-column:1/-1;padding:35px;text-align:center;border:1px dashed #394238;border-radius:14px;color:#aeb9af}.ug-city-card{position:relative}.ug-city-card .city-region{display:block;font-size:9px;color:#758177;margin-top:5px}.ug-city-card .city-arrow{float:right;color:#ffd21f}@media(max-width:900px){.ug-directory-tools{grid-template-columns:1fr 1fr}.ug-dir-count{grid-column:1/-1}.ug-directory-tools input{grid-column:1/-1}}@media(max-width:600px){.ug-directory-tools{grid-template-columns:1fr}.ug-dir-count{grid-column:auto}.ug-directory-tools input,.ug-directory-tools select,.ug-directory-tools button{width:100%}}';
    document.head.appendChild(style);

    var search=document.getElementById('ugDirSearch');
    var state=document.getElementById('ugDirState');
    var currentRegion='';

    function esc(s){return String(s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}
    function render(){
      var q=(search.value||'').trim().toLowerCase();
      var selected=state.value;
      var filtered=rows.filter(function(x){
        if(selected&&x.state!==selected)return false;
        if(currentRegion&&regionByState[x.state]!==currentRegion)return false;
        return !q||x.city.toLowerCase().indexOf(q)>=0||x.state.toLowerCase().indexOf(q)>=0;
      }).sort(function(a,b){return a.city.localeCompare(b.city)||a.state.localeCompare(b.state);});
      document.getElementById('regionTitle').textContent=currentRegion||'All India';
      document.getElementById('count').textContent=filtered.length+' places shown';
      document.getElementById('desc').textContent=currentRegion?'Browse every UnseenGo-listed city and destination in this region.':'Browse the complete city and destination directory currently included in UnseenGo.';
      citiesEl.innerHTML=filtered.length?filtered.map(function(x){return '<a class="city ug-city-card" href="discover.html?city='+encodeURIComponent(x.city)+'"><strong>'+esc(x.city)+'</strong><span class="city-region">'+esc(x.state)+'</span><span class="city-arrow">Explore →</span></a>';}).join(''):'<div class="ug-directory-empty">No matching city or destination found. Try another spelling or state.</div>';
      var n=document.querySelector('.ug-dir-count strong');if(n)n.textContent=filtered.length;
    }

    // Replace the old region buttons with a full directory tab set.
    tabsEl.innerHTML='';
    var all=document.createElement('button');all.textContent='🇮🇳 All India';all.dataset.r='';tabsEl.appendChild(all);
    Object.keys(regionStates).forEach(function(r){var b=document.createElement('button');b.textContent=r;b.dataset.r=r;tabsEl.appendChild(b);});
    states.forEach(function(s){var b=document.createElement('button');b.textContent=s;b.dataset.state=s;b.className='ug-state-tab';tabsEl.appendChild(b);});
    tabsEl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;state.value=b.dataset.state||'';currentRegion=b.dataset.r||'';tabsEl.querySelectorAll('button').forEach(function(x){x.classList.remove('active');});b.classList.add('active');render();});
    all.classList.add('active');
    search.addEventListener('input',function(){currentRegion='';state.value='';render();});
    state.addEventListener('change',function(){currentRegion='';render();});
    document.getElementById('ugUseLocation').onclick=function(){
      if(!navigator.geolocation){alert('Location is not supported by this browser.');return;}
      navigator.geolocation.getCurrentPosition(function(pos){
        var url='https://www.google.com/maps/search/?api=1&query='+pos.coords.latitude+','+pos.coords.longitude;
        window.open(url,'_blank','noopener');
      },function(){alert('Location access was not allowed. You can enable it in your browser settings.');});
    };
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
