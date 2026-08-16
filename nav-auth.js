/* UnseenGo AI — Phase 2D auth-aware navigation */
(function(){
  function render(sb){const host=document.getElementById('authNav');if(!host)return;sb.auth.getSession().then(({data})=>{const s=data.session;if(s){const name=s.user.user_metadata?.full_name||s.user.email?.split('@')[0]||'Traveller';host.innerHTML=`<a href="profile.html" class="auth-profile">${name}</a><button id="navLogout" class="auth-logout" type="button">Logout</button>`;document.getElementById('navLogout').onclick=async()=>{await sb.auth.signOut();location.reload()}}else host.innerHTML='<a href="login.html" class="auth-login">Login</a><a href="signup.html" class="auth-signup">Sign up</a>'})}
  if(window.unseenGoSupabase)render(window.unseenGoSupabase);else window.addEventListener('unseengo:supabase-ready',e=>render(e.detail),{once:true});
})();
