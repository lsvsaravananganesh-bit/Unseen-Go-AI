/* UnseenGo Direct Connect — renders only verified providers with supplied WhatsApp data. */
(function(){
  window.UnseenGoDirectConnect=window.UnseenGoDirectConnect||{};
  window.UnseenGoDirectConnect.render=function(target,providers){
    const el=typeof target==='string'?document.querySelector(target):target;
    if(!el)return;
    el.innerHTML='';
    const list=(Array.isArray(providers)?providers:[]).filter(p=>p&&p.verified===true&&p.whatsapp);
    if(!list.length){
      el.innerHTML='<article class="ue-connect-card"><span class="ue-verified">✓ VERIFIED PROVIDER</span><h3>Local experiences</h3><p>No verified contact is available yet. Add trusted provider data to enable Direct Connect.</p></article>';
      return;
    }
    list.forEach(p=>{
      const card=document.createElement('article'); card.className='ue-connect-card';
      const badge=document.createElement('span'); badge.className='ue-verified'; badge.textContent='✓ VERIFIED PROVIDER';
      const name=document.createElement('h3'); name.textContent=p.name||'Local provider';
      const desc=document.createElement('p'); desc.textContent=p.description||'Verified local experience';
      const link=document.createElement('a'); link.className='ue-wa'; link.target='_blank'; link.rel='noopener'; link.textContent='WhatsApp ↗';
      const digits=String(p.whatsapp).replace(/\D/g,'');
      if(digits)link.href='https://wa.me/'+digits; else link.setAttribute('aria-disabled','true');
      card.append(badge,name,desc,link); el.appendChild(card);
    });
  };
})();
