(function(){
function initHomeAuth(){
 const sb=window.unseenGoSupabase;
 const signIn=document.getElementById('homeSignIn');
 const banner=document.getElementById('homeAuthBanner');
 const userEl=document.getElementById('homeAuthUser');
 if(!sb)return;
 sb.auth.getSession().then(async function(result){
   const session=result.data&&result.data.session;
   if(session&&session.user){
     const email=session.user.email||'Signed in';
     if(signIn){signIn.textContent='My account';signIn.href='dashboard.html';signIn.classList.remove('primary');}
     if(banner)banner.classList.remove('show');
     if(userEl){userEl.textContent='✓ '+email;userEl.classList.add('show');}
   }else{
     if(banner)banner.classList.add('show');
   }
 });
 sb.auth.onAuthStateChange(function(event,session){
   if(session&&session.user){
     if(signIn){signIn.textContent='My account';signIn.href='dashboard.html';signIn.classList.remove('primary');}
     if(banner)banner.classList.remove('show');
     if(userEl){userEl.textContent='✓ '+(session.user.email||'Signed in');userEl.classList.add('show');}
   }else{
     if(signIn){signIn.textContent='Sign in';signIn.href='login.html?redirect=index.html';signIn.classList.add('primary');}
     if(banner)banner.classList.add('show');
     if(userEl)userEl.classList.remove('show');
   }
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initHomeAuth);else initHomeAuth();
})();