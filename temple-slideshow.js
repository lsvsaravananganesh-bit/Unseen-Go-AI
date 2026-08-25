/* UnseenGo AI — India temple hero slideshow */
(function(){
  const slides = [
    {name:'Virupaksha Temple',place:'Hampi, Karnataka',story:'Ancient Vijayanagara architecture and timeless stories.',file:'Virupaksha Temple Hampi Vijayanagar Karnataka.jpg'},
    {name:'Meenakshi Amman Temple',place:'Madurai, Tamil Nadu',story:'A living masterpiece of colourful Dravidian gopurams.',file:'Meenakshi Temple of Madurai, India.jpg'},
    {name:'Brihadeeswarar Temple',place:'Thanjavur, Tamil Nadu',story:'A monumental Chola temple built in granite.',file:'Brihadeeswara Temple Thanjavur.png'},
    {name:'Jagannath Temple',place:'Puri, Odisha',story:'A major pilgrimage landmark on India’s eastern coast.',file:'Jagannath Temple Puri.jpg'},
    {name:'Kedarnath Temple',place:'Uttarakhand',story:'A Himalayan shrine framed by the high mountains.',file:'Kedarnath Temple in Uttarakhand, India, by Yogabrata Chakraborty.jpg'},
    {name:'Somnath Temple',place:'Somnath, Gujarat',story:'A celebrated coastal temple overlooking the Arabian Sea.',file:'Somnath temple Gujarat India.jpg'},
    {name:'Konark Sun Temple',place:'Konark, Odisha',story:'A 13th-century architectural marvel shaped as the Sun God’s chariot.',file:'KONARK SUN TEMPLE.jpg'},
    {name:'Golden Temple',place:'Amritsar, Punjab',story:'The luminous Harmandir Sahib beside the sacred Amrit Sarovar.',file:'The Golden Temple in Amritsar.jpg'},
    {name:'Kashi Vishwanath Temple',place:'Varanasi, Uttar Pradesh',story:'One of India’s most revered Shiva pilgrimage sites.',file:'Kashi vishwanath temple varanasi.jpg'},
    {name:'Ramanathaswamy Temple',place:'Rameswaram, Tamil Nadu',story:'Famous for its vast corridors and sacred island setting.',file:'Ramanathaswamy Temple, Rameswaram.jpg'},
    {name:'Tirumala Venkateswara Temple',place:'Tirupati, Andhra Pradesh',story:'A major pilgrimage destination in the Tirumala hills.',file:'Tirumala Venkateswara Temple, Tirupati (24312092216).jpg'}
  ];

  const css = `
    .temple-showcase{position:absolute;inset:0;overflow:hidden;border-radius:0 0 0 28px;background:#080c0a;isolation:isolate}
    .temple-showcase .temple-slide{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity .8s ease,visibility .8s ease}
    .temple-showcase .temple-slide.active{opacity:1;visibility:visible}
    .temple-showcase .temple-photo{position:absolute;inset:-3%;width:106%;height:106%;object-fit:cover;filter:brightness(.66) saturate(1.08);transform:translate3d(calc(var(--mx,0px) * -1),calc(var(--my,0px) * -1),0) scale(1.02);transition:filter .45s ease,transform .18s ease}
    .temple-showcase:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,7,5,.03) 0%,rgba(4,7,5,.08) 40%,rgba(4,7,5,.78) 100%),linear-gradient(90deg,rgba(4,7,5,.03),rgba(4,7,5,.08));z-index:2;pointer-events:none}
    .temple-showcase:hover .temple-photo{filter:brightness(1.08) saturate(1.22);transform:translate3d(calc(var(--mx,0px) * -1.35),calc(var(--my,0px) * -1.35),0) scale(1.06)}
    .temple-card{position:absolute;left:4%;right:4%;bottom:5%;z-index:4;display:flex;align-items:center;gap:14px;padding:12px 14px;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:rgba(8,11,9,.82);backdrop-filter:blur(12px);box-shadow:0 24px 60px rgba(0,0,0,.48);color:#fff}
    .temple-thumb{width:84px;height:68px;object-fit:cover;border-radius:11px;flex:none;box-shadow:0 8px 24px rgba(0,0,0,.28)}
    .temple-meta{min-width:0}.temple-meta strong{display:block;font-size:16px;line-height:1.2}.temple-meta span{display:block;color:#c1c8bf;font-size:12px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.temple-meta small{display:block;color:#9aa49a;font-size:10px;margin-top:4px}
    .temple-controls{display:flex;align-items:center;gap:8px;margin-left:auto}.temple-arrow{width:34px;height:34px;border:1px solid rgba(255,255,255,.14);border-radius:50%;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;font-size:17px;transition:.25s ease}.temple-arrow:hover{background:#d8f36a;color:#10140d;transform:scale(1.08)}
    .temple-dots{display:flex;gap:6px;margin-left:5px}.temple-dot{width:7px;height:7px;border:0;border-radius:50%;padding:0;background:#69716b;cursor:pointer;transition:.25s ease}.temple-dot.active{width:20px;border-radius:999px;background:#d8f36a}
    .temple-progress{position:absolute;left:0;bottom:0;height:3px;width:100%;z-index:5;background:rgba(255,255,255,.08)}.temple-progress i{display:block;height:100%;width:0;background:#d8f36a;box-shadow:0 0 14px rgba(216,243,106,.7)}
    .temple-index{position:absolute;top:24px;right:26px;z-index:4;color:#fff;font-size:10px;font-weight:900;letter-spacing:2px;padding:8px 10px;border-radius:999px;background:rgba(8,11,9,.56);border:1px solid rgba(255,255,255,.13);backdrop-filter:blur(8px)}
    .temple-credit{position:absolute;left:26px;top:24px;z-index:4;color:#fff;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding:8px 10px;border-radius:999px;background:rgba(8,11,9,.48);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(8px)}
    @media(max-width:700px){.temple-showcase{border-radius:18px}.temple-card{left:10px;right:10px;bottom:10px;padding:9px}.temple-thumb{width:64px;height:55px}.temple-meta strong{font-size:13px}.temple-meta span{font-size:10px}.temple-meta small{display:none}.temple-controls{gap:5px}.temple-arrow{width:29px;height:29px;font-size:14px}.temple-dots{display:none}.temple-index,.temple-credit{top:12px;font-size:8px;padding:6px 8px}.temple-credit{left:12px}.temple-index{right:12px}}
  `;

  function init(){
    const visual=document.querySelector('.home-visual');
    if(!visual || visual.dataset.templeReady==='true') return;
    visual.dataset.templeReady='true';
    const oldCard=visual.querySelector('.home-place-card');
    if(oldCard) oldCard.remove();
    const style=document.createElement('style'); style.id='unseengo-temple-showcase-style'; style.textContent=css; document.head.appendChild(style);
    const showcase=document.createElement('div'); showcase.className='temple-showcase';
    showcase.innerHTML=slides.map((s,i)=>`<div class="temple-slide${i===0?' active':''}" data-index="${i}"><img class="temple-photo" alt="${s.name}, ${s.place}" src="${img(s.file)}" loading="${i<3?'eager':'lazy'}"></div>`).join('');
    const card=document.createElement('div'); card.className='temple-card';
    const thumb=document.createElement('img'); thumb.className='temple-thumb'; thumb.alt='';
    const meta=document.createElement('div'); meta.className='temple-meta';
    const strong=document.createElement('strong'); const place=document.createElement('span'); const story=document.createElement('small');
    meta.append(strong,place,story);
    const controls=document.createElement('div'); controls.className='temple-controls';
    const prev=button('‹','Previous temple'); const next=button('›','Next temple');
    const dots=document.createElement('div'); dots.className='temple-dots';
    slides.forEach((_,i)=>{const d=document.createElement('button');d.className='temple-dot'+(i===0?' active':'');d.setAttribute('aria-label','Show temple '+(i+1));d.addEventListener('click',e=>{e.stopPropagation();go(i)});dots.appendChild(d)});
    controls.append(prev,next,dots); card.append(thumb,meta,controls); showcase.append(card);
    const progress=document.createElement('div'); progress.className='temple-progress'; progress.innerHTML='<i></i>'; showcase.append(progress);
    const index=document.createElement('div'); index.className='temple-index'; showcase.append(index);
    const credit=document.createElement('div'); credit.className='temple-credit'; credit.textContent='Famous temples of India'; showcase.append(credit);
    visual.prepend(showcase);

    let current=0,timer=null,started=0,duration=5000;
    function img(file){return 'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(file)}
    function button(text,label){const b=document.createElement('button');b.className='temple-arrow';b.type='button';b.textContent=text;b.setAttribute('aria-label',label);return b}
    function render(i){current=(i+slides.length)%slides.length;const data=slides[current];showcase.querySelectorAll('.temple-slide').forEach((el,n)=>el.classList.toggle('active',n===current));showcase.querySelectorAll('.temple-dot').forEach((el,n)=>el.classList.toggle('active',n===current));thumb.src=img(data.file);strong.textContent=data.name;place.textContent=data.place;story.textContent=data.story;index.textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');restartProgress();}
    function go(i){render(i);restartTimer()}
    function restartProgress(){const bar=progress.firstElementChild;bar.style.transition='none';bar.style.width='0';requestAnimationFrame(()=>{bar.style.transition=`width ${duration}ms linear`;bar.style.width='100%'})}
    function restartTimer(){clearInterval(timer);timer=setInterval(()=>render(current+1),duration)}
    prev.addEventListener('click',e=>{e.stopPropagation();go(current-1)}); next.addEventListener('click',e=>{e.stopPropagation();go(current+1)});
    showcase.addEventListener('mouseenter',()=>{clearInterval(timer)}); showcase.addEventListener('mouseleave',()=>restartTimer());
    showcase.addEventListener('mousemove',e=>{const r=showcase.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;showcase.style.setProperty('--mx',(x*18).toFixed(1)+'px');showcase.style.setProperty('--my',(y*14).toFixed(1)+'px')});
    showcase.addEventListener('mouseleave',()=>{showcase.style.setProperty('--mx','0px');showcase.style.setProperty('--my','0px')});
    let touchX=null; showcase.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true}); showcase.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)go(current+(dx<0?1:-1));touchX=null},{passive:true});
    render(0); restartTimer();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
