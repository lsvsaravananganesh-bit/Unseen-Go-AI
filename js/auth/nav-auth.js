/* UnseenGo AI — Phase 2D auth-aware navigation */
(function(){
  'use strict';

  function injectStyles(){
    if(document.getElementById('authNavStyles')) return;
    const st=document.createElement('style');
    st.id='authNavStyles';
    st.textContent=`
      .nav{display:flex!important;align-items:center;justify-content:space-between;gap:24px!important}
      .nav nav{display:flex!important;align-items:center;gap:18px;flex-wrap:wrap}
      .nav nav a{display:inline-flex!important;align-items:center;white-space:nowrap}
      .auth-user{display:inline-flex;align-items:center;gap:8px;margin-left:8px;font-weight:700}
      .auth-user button{cursor:pointer;border:0;border-radius:10px;padding:8px 12px;font-weight:700}
    `;
    document.head.appendChild(st);
  }

  function getUser(){
    try{
      const raw=localStorage.getItem('unseengo_user')||localStorage.getItem('supabase_user')||localStorage.getItem('unseengo_auth_user');
      return raw?JSON.parse(raw):null;
    }catch(e){return null;}
  }

  function logout(){
    ['unseengo_user','supabase_user','unseengo_auth_user'].forEach(k=>localStorage.removeItem(k));
    location.href='index.html';
  }

  function setup(){
    injectStyles();
    const nav=document.querySelector('.nav');
    if(!nav) return;
    const old=document.querySelector('.auth-user');
    if(old) old.remove();
    const user=getUser();
    if(!user) return;
    const name=user.user_metadata?.full_name||user.user_metadata?.name||user.name||user.email||'Account';
    const box=document.createElement('div');
    box.className='auth-user';
    const label=document.createElement('span');
    label.textContent='👤 '+name;
    const button=document.createElement('button');
    button.type='button';
    button.textContent='Logout';
    button.addEventListener('click',logout);
    box.append(label,button);
    nav.appendChild(box);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();
