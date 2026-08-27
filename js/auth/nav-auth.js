/* UnseenGo AI — global auth navigation + persistent light/dark theme */
(function(){
  'use strict';

  const THEME_KEY='unseengo_theme';

  function applyTheme(theme){
    const light=theme==='light';
    document.documentElement.classList.toggle('ug-light',light);
    document.documentElement.dataset.theme=light?'light':'dark';
    const btn=document.querySelector('.ug-theme-toggle');
    if(btn){
      btn.setAttribute('aria-pressed',String(light));
      btn.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');
      const icon=btn.querySelector('.ug-theme-icon');
      const label=btn.querySelector('.ug-theme-label');
      if(icon) icon.textContent=light?'☀':'☾';
      if(label) label.textContent=light?'Light':'Dark';
    }
  }

  function getTheme(){
    try{return localStorage.getItem(THEME_KEY)||'dark';}catch(e){return 'dark';}
  }

  function toggleTheme(){
    const next=document.documentElement.classList.contains('ug-light')?'dark':'light';
    try{localStorage.setItem(THEME_KEY,next);}catch(e){}
    applyTheme(next);
  }

  /* Apply immediately so every page remembers the same choice. */
  applyTheme(getTheme());

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
      .ug-theme-toggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;height:36px!important;min-width:74px!important;padding:0 11px!important;margin-left:8px!important;border:1px solid rgba(216,243,106,.34)!important;border-radius:999px!important;background:rgba(216,243,106,.09)!important;color:#d8f36a!important;font:900 10px/1 system-ui,sans-serif!important;letter-spacing:.35px!important;cursor:pointer!important;white-space:nowrap!important;transition:background .2s,border-color .2s,transform .2s!important}
      .ug-theme-toggle:hover{background:rgba(216,243,106,.18)!important;border-color:#d8f36a!important;transform:translateY(-1px)!important}
      .ug-theme-icon{font-size:14px!important;line-height:1!important}
      .ug-theme-label{font-size:9px!important}
      html.ug-light body{background:#f4f5ef!important;color:#172019!important}
      html.ug-light .ug-theme-toggle{background:#172019!important;border-color:#465449!important;color:#d8f36a!important}
      html.ug-light header,html.ug-light .nav,html.ug-light .top,html.ug-light .discover-nav{background:rgba(255,255,255,.96)!important;color:#172019!important}
      html.ug-light .brand,html.ug-light .nav .brand{color:#172019!important}
      html.ug-light .nav nav a{color:#526056!important}
      html.ug-light .nav nav a:hover,html.ug-light .nav nav a.active{color:#172019!important}
      html.ug-light main,html.ug-light .section,html.ug-light .editorial-section,html.ug-light .catalog-section,html.ug-light .ug-india-explore{background:#f4f5ef!important;color:#172019!important}
      html.ug-light .card,html.ug-light .story,html.ug-light .filters,html.ug-light .attraction-card,html.ug-light .ai-demo-card,html.ug-light .planner-card,html.ug-light .discover-bottom,html.ug-light .india-feature-banner{background:#fff!important;color:#172019!important;border-color:#d8ded7!important}
      html.ug-light h1,html.ug-light h2,html.ug-light h3,html.ug-light h4,html.ug-light .card h3,html.ug-light .story-body h3{color:#172019!important}
      html.ug-light p,html.ug-light .story-body p,html.ug-light .editorial-head p,html.ug-light .discover-hero p{color:#59655d!important}
      html.ug-light input,html.ug-light textarea,html.ug-light select{background:#fff!important;color:#172019!important;border-color:#cbd5cb!important}
      html.ug-light footer.footer{background:#172019!important;color:#dce5dd!important}
      @media(max-width:850px){.ug-theme-toggle{min-width:36px!important;width:36px!important;padding:0!important;margin-left:4px!important}.ug-theme-label{display:none!important}}
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

  function addThemeToggle(nav){
    if(!nav||nav.querySelector('.ug-theme-toggle')) return;
    const button=document.createElement('button');
    button.type='button';
    button.className='ug-theme-toggle';
    button.innerHTML='<span class="ug-theme-icon" aria-hidden="true"></span><span class="ug-theme-label"></span>';
    button.addEventListener('click',toggleTheme);
    nav.appendChild(button);
    applyTheme(getTheme());
  }

  function setup(){
    injectStyles();
    const nav=document.querySelector('.nav');
    if(!nav) return;
    addThemeToggle(nav);
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
