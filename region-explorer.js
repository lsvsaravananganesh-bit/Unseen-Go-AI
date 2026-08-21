/* UnseenGo AI — hierarchical India explorer
   IMPORTANT: this file only changes how existing city records are presented.
   It does not modify the existing cities/place dataset in app.js.
*/
(function(){
  const REGION_META = {
    South: { name:'Dakshina Bharat', english:'South India', icon:'✦', desc:'Southern India · living heritage, temples, crafts, coast and culture' },
    West:  { name:'Paschima Bharat', english:'West India',  icon:'◈', desc:'Western India · forts, trade heritage, crafts, food and landscapes' },
    East:  { name:'Purva Bharat', english:'East India',  icon:'◇', desc:'Eastern India · ancient heritage, living traditions, rivers and arts' },
    North: { name:'Uttara Bharat', english:'North India', icon:'✧', desc:'Northern India · royal heritage, historic cities, monuments and culture' }
  };

  const CITY_STATE = {
    Hyderabad:'Telangana', Bengaluru:'Karnataka', Chennai:'Tamil Nadu',
    Mumbai:'Maharashtra', Pune:'Maharashtra', Nagpur:'Maharashtra',
    Kolkata:'West Bengal', Jaipur:'Rajasthan', Ahmedabad:'Gujarat',
    Lucknow:'Uttar Pradesh', Varanasi:'Uttar Pradesh', Bhubaneswar:'Odisha',
    Kochi:'Kerala', Goa:'Goa', Indore:'Madhya Pradesh', Guwahati:'Assam',
    'New Delhi':'Delhi', Kurnool:'Andhra Pradesh', Tirupati:'Andhra Pradesh',
    Vijayawada:'Andhra Pradesh', Kadapa:'Andhra Pradesh', Anantapur:'Andhra Pradesh',
    Nellore:'Andhra Pradesh', Visakhapatnam:'Andhra Pradesh',
    Belagavi:'Karnataka', Mysuru:'Karnataka', Madurai:'Tamil Nadu',
    Coimbatore:'Tamil Nadu', Thanjavur:'Tamil Nadu',
    Aurangabad:'Maharashtra', Nashik:'Maharashtra', Surat:'Gujarat',
    Vadodara:'Gujarat', Bhopal:'Madhya Pradesh', Jodhpur:'Rajasthan',
    Udaipur:'Rajasthan', Amritsar:'Punjab', Chandigarh:'Chandigarh',
    Agra:'Uttar Pradesh', Prayagraj:'Uttar Pradesh', Patna:'Bihar',
    Ranchi:'Jharkhand', Cuttack:'Odisha', Mysore:'Karnataka'
  };

  const STATE_REGION = {
    'Andhra Pradesh':'South','Telangana':'South','Karnataka':'South','Tamil Nadu':'South','Kerala':'South','Goa':'West',
    'Maharashtra':'West','Gujarat':'West','Madhya Pradesh':'West','Rajasthan':'West',
    'West Bengal':'East','Odisha':'East','Assam':'East','Bihar':'East','Jharkhand':'East',
    'Uttar Pradesh':'North','Delhi':'North','Punjab':'North','Chandigarh':'North'
  };

  function esc(value){
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function placeCount(data){
    return Object.keys(data||{}).filter(k=>k!=='region' && Array.isArray(data[k]))
      .reduce((sum,k)=>sum+(data[k]?.length||0),0);
  }

  function render(){
    const root=document.getElementById('regionExplorer');
    if(!root || typeof cities==='undefined') return;

    const grouped={South:{},West:{},East:{},North:{}};
    Object.keys(cities).forEach(city=>{
      const data=cities[city]||{};
      const state=CITY_STATE[city] || 'Other locations';
      const region=data.region || STATE_REGION[state] || 'South';
      if(!grouped[region]) grouped[region]={};
      if(!grouped[region][state]) grouped[region][state]=[];
      grouped[region][state].push(city);
    });

    const regionOrder=['South','West','East','North'];
    root.innerHTML=regionOrder.map((region,ri)=>{
      const meta=REGION_META[region];
      const states=grouped[region]||{};
      const stateNames=Object.keys(states).sort((a,b)=>a.localeCompare(b));
      const totalCities=stateNames.reduce((n,s)=>n+states[s].length,0);
      const open=ri===0 ? ' open' : '';

      const statesHtml=stateNames.map(state=>{
        const cityNames=states[state].sort((a,b)=>a.localeCompare(b));
        const statePlaces=cityNames.reduce((n,c)=>n+placeCount(cities[c]),0);
        return `<details class="state-group">
          <summary><span class="state-name">${esc(state)}</span><span class="state-meta">${cityNames.length} ${cityNames.length===1?'city':'cities'} · ${statePlaces}+ places</span></summary>
          <div class="state-cities">
            ${cityNames.map(city=>{
              const data=cities[city]||{};
              const count=placeCount(data);
              const cats=Object.keys(data).filter(k=>k!=='region' && Array.isArray(data[k]));
              return `<a class="city-explorer-card" href="city.html?city=${encodeURIComponent(city)}">
                <span class="city-card-region">${esc(state)} · ${esc(region)}</span>
                <strong>${esc(city)}</strong>
                <span class="city-card-detail">${String(count).padStart(2,'0')}+ places · ${esc(cats.slice(0,3).join(' · ')||'Explore')}</span>
                <span class="city-card-arrow">Explore city ↗</span>
              </a>`;
            }).join('')}
          </div>
        </details>`;
      }).join('');

      return `<details class="region-panel${open}"${open}>
        <summary class="region-summary">
          <span class="region-symbol">${meta.icon}</span>
          <span class="region-copy"><small>${esc(meta.english)}</small><strong>${esc(meta.name)}</strong><em>${esc(meta.desc)}</em></span>
          <span class="region-count">${totalCities} cities <b>↓</b></span>
        </summary>
        <div class="region-content">
          <div class="region-rule"><span>STATES & UNION TERRITORIES</span><i>Choose a state to explore its cities</i></div>
          <div class="state-list">${statesHtml}</div>
        </div>
      </details>`;
    }).join('');
  }

  document.addEventListener('DOMContentLoaded',render);
})();
