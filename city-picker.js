function initCityPicker(){
 const input=document.getElementById('cityPickerInput');
 const list=document.getElementById('cityPickerList');
 if(!input||!list||typeof cities==='undefined')return;
 const names=Object.keys(cities).sort();
 // Show city names only — no region/state details in the dropdown.
 list.innerHTML=names.map(c=>`<option value="${c}"></option>`).join('');
 input.addEventListener('change',()=>{
   const value=input.value.trim();
   if(cities[value]) setCity(value);
   else if(value==='') setCity('');
 });
 input.addEventListener('keydown',e=>{
   if(e.key==='Enter'){
     e.preventDefault();
     const value=input.value.trim();
     if(cities[value]) setCity(value);
   }
 });
 document.addEventListener('unseengo:citychange',e=>{
   if(e.detail?.city) input.value=e.detail.city;
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initCityPicker);else initCityPicker();
setTimeout(initCityPicker,700);