/* UnseenGo AI — Phase 2D auth-aware navigation */
(function(){
  function render(sb){
    const nav=document.querySelector('.nav');if(!nav)return;
    let host=document.getElementById('authNav');
    if(!host){host=document.createElement('div');host.id='authNav';host.style.cssText='display:flex;align-items:center;gap:8px;margin-left:12px;white-space:nowrap';nav.appendChild(host)}
    if(!document.getElementById('authNavStyles')){const st=document.createElement('style');st.id='authNavStyles';st.textContent='#authNav a,#authNav button{font:inherit;font-size:13px;text-decoration:none;padding:9px 13px;border-radius:10px;cursor:pointer}#authNav .auth-profile{color:#d9ff54;border:1px solid #303830}#authNav .auth-login{color:#fff;border:1px solid #394239}#authNav .auth-signup{background:#d9ff54;color:#080b08;font-weight:800}#authNav .auth-logout{background:transparent;color:#aab2aa;border:1px solid #394239}#authNav .auth-logout:hover,#authNav .auth-login:hover{color:#d9ff54}@media(max-width:800px){#authNav{margin-left:4px!important}.nav nav{display:none}}';document.head.appendChild(st)}
    sb.auth.getSession().then(({data})=>{const s=data.session;if(s){const name=s.user.user_metadata?.full_name||s.user.email?.split('@')[0]||'Traveller';host.innerHTML=`<a href="profile.html" class="auth-profile">${name}</a><button id="navLogout" class="auth-logout" type="button">Logout</button>`;document.getElementById('navLogout').onclick=async()=>{await sb.auth.signOut();location.reload()}}else host.innerHTML='<a href="login.html" class="auth-login">Login</a><a href="signup.html" class="auth-signup">Sign up</a>'})
  }
  if(window.unseenGoSupabase)render(window.unseenGoSupabase);else window.addEventListener('unseengo:supabase-ready',e=>render(e.detail),{once:true});
})();
