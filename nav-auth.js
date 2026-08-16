/* UnseenGo AI — Phase 2D auth-aware navigation */
(function(){
  function render(sb){
    const nav=document.querySelector('.nav');if(!nav)return;
    let host=document.getElementById('authNav');
    if(!host){
      host=document.createElement('div');
      host.id='authNav';
      nav.appendChild(host);
    }
    if(!document.getElementById('authNavStyles')){
      const st=document.createElement('style');
      st.id='authNavStyles';
      st.textContent=`
        /* Main navigation: flexbox word menu */
        .nav nav{
          display:flex!important;
          align-items:center;
          justify-content:center;
          gap:8px!important;
          padding:6px;
          border:1px solid #252c26;
          border-radius:16px;
          background:#0d110e;
          box-shadow:inset 0 0 0 1px #ffffff03;
        }
        .nav nav a{
          display:flex;
          align-items:center;
          justify-content:center;
          min-height:40px;
          padding:9px 15px!important;
          border:1px solid transparent;
          border-radius:11px;
          color:#9da69b!important;
          text-decoration:none;
          font-size:13px!important;
          font-weight:500;
          white-space:nowrap;
          transition:color .25s ease,background .25s ease,border-color .25s ease,transform .25s ease,box-shadow .25s ease;
        }
        .nav nav a:hover{
          color:#d8f36a!important;
          background:#182016;
          border-color:#3a4930;
          transform:translateY(-2px);
          box-shadow:0 8px 22px #0006;
        }
        .nav nav a.active,
        .nav nav a[aria-current="page"]{
          color:#d8f36a!important;
          background:#182016;
          border-color:#56683e;
        }
        /* Home/Explore button becomes another navigation word */
        .nav>button{
          background:transparent!important;
          color:#aab2aa!important;
          border:1px solid #29332b!important;
          border-radius:11px!important;
          padding:9px 15px!important;
          min-height:40px;
          font-size:13px!important;
          font-weight:500!important;
          box-shadow:none!important;
          transform:none!important;
          white-space:nowrap;
          transition:color .25s ease,background .25s ease,border-color .25s ease,transform .25s ease,box-shadow .25s ease!important;
        }
        .nav>button:hover{
          color:#d8f36a!important;
          background:#182016!important;
          border-color:#56683e!important;
          transform:translateY(-2px)!important;
          box-shadow:0 8px 22px #0006!important;
        }
        #authNav{
          display:flex;
          align-items:center;
          gap:8px;
          margin-left:8px;
          white-space:nowrap;
        }
        #authNav a,#authNav button{
          display:flex;
          align-items:center;
          justify-content:center;
          min-height:40px;
          font:inherit;
          font-size:13px;
          text-decoration:none;
          padding:9px 13px;
          border-radius:11px;
          cursor:pointer;
          transition:all .25s ease;
        }
        #authNav .auth-profile{
          color:#d8f36a;
          border:1px solid #3a4930;
          background:#182016;
        }
        #authNav .auth-profile:hover{
          transform:translateY(-2px);
          box-shadow:0 8px 22px #0006;
        }
        #authNav .auth-login{
          color:#aab2aa;
          border:1px solid #29332b;
          background:transparent;
        }
        #authNav .auth-login:hover{
          color:#d8f36a;
          background:#182016;
          border-color:#56683e;
          transform:translateY(-2px);
        }
        #authNav .auth-signup{
          color:#10140d;
          background:#d8f36a;
          border:1px solid #d8f36a;
          font-weight:800;
        }
        #authNav .auth-signup:hover{
          transform:translateY(-2px);
          box-shadow:0 10px 25px #d8f36a22;
        }
        #authNav .auth-logout{
          background:transparent;
          color:#aab2aa;
          border:1px solid #29332b;
        }
        #authNav .auth-logout:hover{
          color:#d8f36a;
          background:#182016;
          border-color:#56683e;
          transform:translateY(-2px);
        }
        @media(max-width:900px){
          .nav{padding:0 4%!important;gap:10px;}
          .nav nav{gap:4px!important;overflow-x:auto;scrollbar-width:none;max-width:60vw;}
          .nav nav::-webkit-scrollbar{display:none;}
          .nav nav a,.nav>button{padding:8px 11px!important;font-size:12px!important;}
        }
        @media(max-width:700px){
          .nav{height:auto!important;min-height:68px;flex-wrap:wrap;padding:10px 12px!important;}
          .brand{font-size:18px!important;}
          .nav nav{order:3;width:100%;max-width:none;justify-content:flex-start;}
          .nav>button{margin-left:auto;}
          #authNav{margin-left:0;}
        }
        @media(max-width:430px){
          .nav nav a{padding:7px 9px!important;font-size:11px!important;}
          .nav>button{padding:7px 9px!important;font-size:11px!important;}
          #authNav .auth-profile{max-width:90px;overflow:hidden;text-overflow:ellipsis;}
        }
      `;
      document.head.appendChild(st);
    }
    sb.auth.getSession().then(({data})=>{
      const s=data.session;
      if(s){
        const name=s.user.user_metadata?.full_name||s.user.email?.split('@')[0]||'Traveller';
        host.innerHTML=`<a href="profile.html" class="auth-profile">${name}</a><button id="navLogout" class="auth-logout" type="button">Logout</button>`;
        document.getElementById('navLogout').onclick=async()=>{await sb.auth.signOut();location.reload()};
      }else{
        host.innerHTML='<a href="login.html" class="auth-login">Login</a><a href="signup.html" class="auth-signup">Sign up</a>';
      }
    });
  }
  if(window.unseenGoSupabase)render(window.unseenGoSupabase);
  else window.addEventListener('unseengo:supabase-ready',e=>render(e.detail),{once:true});
})();
