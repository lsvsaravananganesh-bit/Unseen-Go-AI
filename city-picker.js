function initCityPicker(){
 const input=document.getElementById('cityPickerInput');
 const list=document.getElementById('cityPickerList');
 if(!input||!list||typeof cities==='undefined')return;
 const names=Object.keys(cities).sort();
 list.innerHTML=names.map(c=>`<button type="button" class="city-option" data-city="${c}">${c}</button>`).join('');
 list.querySelectorAll('.city-option').forEach(btn=>btn.addEventListener('click',()=>setCity(btn.dataset.city)));
 input.addEventListener('input',()=>{
   const value=input.value.trim().toLowerCase();
   list.querySelectorAll('.city-option').forEach(btn=>{btn.hidden=!!value&&!btn.dataset.city.toLowerCase().includes(value);});
 });
 input.addEventListener('focus',()=>list.classList.add('open'));
 input.addEventListener('keydown',e=>{
   if(e.key==='Enter'){
     e.preventDefault();
     const value=input.value.trim();
     const exact=names.find(c=>c.toLowerCase()===value.toLowerCase());
     if(exact)setCity(exact);
   }
   if(e.key==='Escape')list.classList.remove('open');
 });
 document.addEventListener('click',e=>{if(!e.target.closest('.city-picker'))list.classList.remove('open');});
 document.addEventListener('unseengo:citychange',e=>{if(e.detail?.city){input.value=e.detail.city;list.classList.remove('open');}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initCityPicker);else initCityPicker();
setTimeout(initCityPicker,700);