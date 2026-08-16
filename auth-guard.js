/* UnseenGo AI — authenticated page guard */
(function(){
  function start(sb){sb.auth.getSession().then(({data})=>{if(!data.session){location.href='login.html';return}const user=data.session.user;const name=user.user_metadata?.full_name||user.email?.split('@')[0]||'Traveller';const n=document.getElementById('profileName'),e=document.getElementById('profileEmail'),a=document.getElementById('avatar');if(n)n.textContent=name;if(e)e.textContent=user.email||'';if(a)a.textContent=name.charAt(0).toUpperCase();const logout=document.getElementById('logoutButton');if(logout)logout.onclick=async()=>{await sb.auth.signOut();location.href='index.html'}})}
  if(window.unseenGoSupabase)start(window.unseenGoSupabase);else window.addEventListener('unseengo:supabase-ready',e=>start(e.detail),{once:true});
})();
