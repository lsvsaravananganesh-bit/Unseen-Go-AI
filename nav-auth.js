/* UnseenGo AI — Phase 2D auth-aware navigation */
(function(){
  function injectStyles(){
    if(document.getElementById('authNavStyles'))return;
    const st=document.createElement('style');
    st.id='authNavStyles';
    st.textContent=`
      .nav nav{
        display:flex!important;align-items:center;justify-content:center;gap:6px!important;
        padding:5px!important;border:1px solid #252c26;border-radius:15px;background:#0d110e;
      }
      .nav nav a,.nav .home-link{
        display:flex!important;align-items:center;justify-content:center;min-height:40px;
        padding:9px 15px!important;border:1px solid transparent;border-radius:11px;
        color:#9da69b!important;text-decoration:none!important;font-size:13px!important;
        font-weight:500;white-space:nowrap;cursor:pointer;
        background:transparent!important;box-shadow:none!important;
        transition:color .25s ease,background .25s ease,border-color .25s ease,transform .25s ease,box-shadow .25s ease!important;
      }
      .nav nav a:hover,.nav nav a.active,.nav nav a[aria-current="page"],.nav .home-link:hover{
        color:#d8f36a!important;background:#182016!important;border-color:#56683e!important;
        transform:translateY(-2px);box-shadow:0 8px 22px #0006!important;
      }
      #authNav{display:flex;align-items:center;gap:6px;margin-left:6px;white-space:nowrap}
      #authNav a,#authNav button{display:flex;align-items:center;justify-content:center;min-height:40px;padding:9px 13px;border-radius:11px;cursor:pointer;text-decoration:none;font:inherit;font-size:13px;transition:all .25s ease}
      #authNav .auth-profile{color:#d8f36a;border:1px solid #3a4930;background:#182016}
      #authNav .auth-profile:hover{transform:translateY(-2px);box-shadow:0 8px 22px #0006}
      #authNav .auth-login,#authNav .auth-logout{color:#aab2aa;border:1px solid #29332b;background:transparent}
      #authNav .auth-login:hover,#authNav .auth-logout:hover{color:#d8f36a;background:#182016;border-color:#56683e;transform:translateY(-2px)}
      #authNav .auth-signup{color:#10140d;background:#d8f36a;border:1px solid #d8f36a;font-weight:800}
      #authNav .auth-signup:hover{transform:translateY(-2px);box-shadow:0 10px 25px #d8f36a22}
      @media(max-width:900px){
        .nav{padding:0 4%!important;gap:8px}
        .nav nav{gap:3px!important;overflow-x:auto;scrollbar-width:none;max-width:62vw}
        .nav nav::-webkit-scrollbar{display:none}
        .nav nav a,.nav .home-link{padding:8px 11px!important;font-size:12px!important}
      }
      @media(max-width:700px){
        .nav{height:auto!important;min-height:68px;flex-wrap:wrap;padding:10px 12px!important}
        .brand{font-size:18px!important}
        .nav nav{order:3;width:100%;max-width:none;justify-content:flex-start}
        .nav .home-link{margin-left:auto}
      }
      @media(max-width:430px){
        .nav nav a,.nav .home-link{padding:7px 9px!important;font-size:11px!important}
        #authNav .auth-profile{max-width:90px;overflow:hidden;text-overflow:ellipsis}
      }
    `;
    document.head.appendChild(st);
  }
  function makeHomeWord(){
    const nav=document.querySelector('.nav');
    if(!nav)return;
    const old=nav.querySelector(':scope > button');
    if(old && !nav.querySelector('.home-link')){
      const a=document.createElement('a');
      a.className='home-link';a.href='index.html';a.textContent='Home';
      old.replaceWith(a);
    }
  }
  function render(sb){
    const nav=document.querySelector('.nav');if(!nav)return;
    injectStyles();makeHomeWord();
    let host=document.getElementById('authNav');
    if(!host){host=document.createElement('div');host.id='authNav';nav.appendChild(host)}
    sb.auth.getSession().then(({data})=>{
      const s=data.session;
      if(s){
        const name=s.user.user_metadata?.full_name||s.user.email?.split('@')[0]||'Traveller';
        host.innerHTML=`<a href="profile.html" class="auth-profile">${name}</a><button id="navLogout" class="auth-logout" type="button">Logout</button>`;
        const logout=document.getElementById('navLogout');
        if(logout)logout.onclick=async()=>{await sb.auth.signOut();location.href='index.html'};
      }else{
        host.innerHTML='<a href="login.html" class="auth-login">Login</a><a href="signup.html" class="auth-signup">Sign up</a>';
      }
    });
  }
  if(window.unseenGoSupabase)render(window.unseenGoSupabase);
  else window.addEventListener('unseengo:supabase-ready',e=>render(e.detail),{once:true});
})();
