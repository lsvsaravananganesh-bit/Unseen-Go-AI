function initCityPicker(){
 const input=document.getElementById('cityPickerInput');
 const list=document.getElementById('cityPickerList');
 if(!input||!list||typeof cities==='undefined'||input.dataset.initialized==='1')return;
 input.dataset.initialized='1';
 const names=Object.keys(cities).sort((a,b)=>a.localeCompare(b));
 const esc=value=>String(value).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
 list.innerHTML=names.map(c=>`<button type="button" class="city-option" data-city="${esc(c)}" role="option">${esc(c)}</button>`).join('');
 const options=[...list.querySelectorAll('.city-option')];
 const goToCity=city=>{ if(city) window.location.href='city.html?city='+encodeURIComponent(city); };
 const filterOptions=()=>{const value=input.value.trim().toLowerCase();options.forEach(btn=>{btn.hidden=!!value&&!btn.dataset.city.toLowerCase().includes(value);});list.classList.add('open');};
 options.forEach(btn=>btn.addEventListener('click',()=>goToCity(btn.dataset.city)));
 input.addEventListener('input',filterOptions);
 input.addEventListener('focus',filterOptions);
 input.addEventListener('keydown',e=>{
   if(e.key==='Enter'){
     e.preventDefault();
     const value=input.value.trim();
     const exact=names.find(c=>c.toLowerCase()===value.toLowerCase());
     const first=options.find(btn=>!btn.hidden);
     if(exact)goToCity(exact);else if(first)goToCity(first.dataset.city);
   }
   if(e.key==='Escape')list.classList.remove('open');
 });
 const requested=new URLSearchParams(location.search).get('city');
 if(requested){
   const match=names.find(c=>c.toLowerCase()===requested.trim().toLowerCase());
   if(match){input.value=match;filterOptions();}
 }
 document.addEventListener('click',e=>{if(!e.target.closest('.city-picker'))list.classList.remove('open');});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initCityPicker);else initCityPicker();
setTimeout(initCityPicker,700);
