/* UnseenGo AI — Global Auth Navigation + Mobile Bottom Nav Bar (Black + Lime) */
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

  applyTheme(getTheme());

  function injectStyles(){
    if(document.getElementById('authNavStyles')) return;
    const st=document.createElement('style');
    st.id='authNavStyles';
    st.textContent=`
      .nav{display:flex!important;align-items:center;justify-content:space-between;gap:20px!important}
      .nav nav{display:flex!important;align-items:center;gap:18px;flex-wrap:wrap}
      .nav nav a{display:inline-flex!important;align-items:center;white-space:nowrap}
      .auth-user{display:inline-flex;align-items:center;gap:8px;margin-left:8px;font-weight:700}
      .ug-auth-avatar-pill{width:32px;height:32px;border-radius:50%;background:#152115;border:1.5px solid #d8ff4d;color:#d8ff4d;font-weight:800;font-size:13px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(216,255,77,0.25);text-decoration:none}
      .ug-auth-user-name{color:#f5f7f3;font-size:13px;font-weight:600;white-space:nowrap}
      .auth-user button.ug-btn-logout-pill{cursor:pointer;border:1px solid #1e2820;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;background:rgba(255,255,255,0.06);color:#a8b4aa;transition:0.2s}
      .auth-user button.ug-btn-logout-pill:hover{color:#ef4444;border-color:rgba(239,68,68,0.4);background:rgba(239,68,68,0.08)}
      .ug-nav-signin-btn{display:inline-flex;align-items:center;gap:6px;background:#d8ff4d;color:#080d09!important;font-weight:800;font-size:13px;padding:6px 14px;border-radius:8px;text-decoration:none;box-shadow:0 2px 10px rgba(216,255,77,0.25);transition:0.2s}
      .ug-nav-signin-btn:hover{background:#c4ec3e;transform:translateY(-1px)}
      .ug-theme-toggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;height:36px!important;min-width:40px!important;padding:0 10px!important;margin-left:6px!important;border:1px solid rgba(216,255,77,0.3)!important;border-radius:999px!important;background:rgba(216,255,77,0.08)!important;color:#d8ff4d!important;font:900 11px/1 system-ui,sans-serif!important;letter-spacing:.35px!important;cursor:pointer!important;white-space:nowrap!important;transition:0.2s!important}
      .ug-theme-toggle:hover{background:rgba(216,255,77,0.18)!important;border-color:#d8ff4d!important;transform:scale(1.05)!important}
      .ug-theme-icon{font-size:14px!important;line-height:1!important}
      .ug-theme-label{font-size:9px!important}
      @media(max-width:850px){.ug-theme-label{display:none!important}}
      @media(max-width:768px){body{padding-bottom:70px!important}}
    `;
    document.head.appendChild(st);
  }

  function getUser(){
    try{
      const raw=localStorage.getItem('unseengo_user')||localStorage.getItem('supabase_user')||localStorage.getItem('unseengo_auth_user')||localStorage.getItem('unseengo_demo_user');
      return raw?JSON.parse(raw):null;
    }catch(e){return null;}
  }

  function logout(){
    ['unseengo_user','supabase_user','unseengo_auth_user','unseengo_demo_user','unseengo_demo_preferences','unseengo_demo_saved','unseengo_demo_trips','unseengo_user_profile'].forEach(k=>localStorage.removeItem(k));
    try{if(window.unseenGoSupabase?.auth?.signOut) window.unseenGoSupabase.auth.signOut();}catch(e){}
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

  function ensureMobileBottomNav(){
    if(document.querySelector('.ug-mobile-bottom-nav')) return;
    const user=getUser();
    const path=window.location.pathname.toLowerCase();
    const filename=path.substring(path.lastIndexOf('/')+1)||'index.html';

    const isHome=filename===''||filename==='index.html'||filename==='./';
    const isDiscover=filename.includes('discover');
    const isPlanner=filename.includes('planner');
    const isTrips=filename.includes('my-travel')||filename.includes('dashboard');
    const isProfile=filename.includes('profile')||filename.includes('login')||filename.includes('signin')||filename.includes('signup');

    const profileHref=user?'profile.html':'signin.html';

    const nav=document.createElement('nav');
    nav.className='ug-mobile-bottom-nav';
    nav.setAttribute('aria-label','Mobile navigation');
    nav.innerHTML=`
      <a href="index.html" class="ug-bottom-nav-item ${isHome?'active':''}">
        <span class="nav-icon">🏠</span>
        <span>Home</span>
      </a>
      <a href="discover.html" class="ug-bottom-nav-item ${isDiscover?'active':''}">
        <span class="nav-icon">🔎</span>
        <span>Discover</span>
      </a>
      <a href="planner.html" class="ug-bottom-nav-item ${isPlanner?'active':''}">
        <span class="nav-icon">🤖</span>
        <span>AI</span>
      </a>
      <a href="my-travel.html" class="ug-bottom-nav-item ${isTrips?'active':''}">
        <span class="nav-icon">❤️</span>
        <span>Trips</span>
      </a>
      <a href="${profileHref}" class="ug-bottom-nav-item ${isProfile?'active':''}">
        <span class="nav-icon">👤</span>
        <span>Profile</span>
      </a>
    `;
    document.body.appendChild(nav);
  }

  function setup(){
    injectStyles();
    ensureMobileBottomNav();
    const nav=document.querySelector('.nav');
    if(!nav) return;
    addThemeToggle(nav);
    const old=nav.querySelector('.auth-user');
    if(old) old.remove();

    const user=getUser();
    const box=document.createElement('div');
    box.className='auth-user';

    if(user){
      const name=user.user_metadata?.full_name||user.user_metadata?.name||user.name||user.email||'Explorer';
      const firstName=name.split(' ')[0]||'Explorer';
      const initial=(firstName[0]||'A').toUpperCase();

      const avatar=document.createElement('a');
      avatar.href='profile.html';
      avatar.className='ug-auth-avatar-pill';
      avatar.textContent=initial;
      avatar.title='View Profile';

      const label=document.createElement('span');
      label.className='ug-auth-user-name';
      label.textContent=firstName;

      const button=document.createElement('button');
      button.type='button';
      button.className='ug-btn-logout-pill';
      button.textContent='Log Out';
      button.addEventListener('click',logout);

      box.append(avatar,label,button);
    } else {
      const signinBtn=document.createElement('a');
      signinBtn.href='signin.html';
      signinBtn.className='ug-nav-signin-ghost';
      signinBtn.textContent='Sign In';
      signinBtn.style.cssText='border:1px solid rgba(255,255,255,0.2);padding:6px 12px;border-radius:8px;text-decoration:none;color:inherit;font-size:13px;font-weight:700;';

      const signupBtn=document.createElement('a');
      signupBtn.href='signup.html';
      signupBtn.className='ug-nav-signin-btn';
      signupBtn.textContent='Sign Up';

      box.appendChild(signinBtn);
      box.appendChild(signupBtn);
    }
    nav.appendChild(box);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();
