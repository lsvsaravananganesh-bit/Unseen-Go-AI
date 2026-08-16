/* UnseenGo AI — Phase 2D authentication */
(function(){
  function show(message,type){const el=document.getElementById('message');if(!el)return;el.textContent=message||'';el.className='msg message'+(type?' '+type:'');}
  function waitForClient(cb){if(window.unseenGoSupabase)return cb(window.unseenGoSupabase);window.addEventListener('unseengo:supabase-ready',e=>cb(e.detail),{once:true});setTimeout(()=>{if(!window.unseenGoSupabase)show('Supabase connection is not ready. Please refresh the page.','error')},5000)}
  function requestedDestination(){const p=new URLSearchParams(location.search).get('redirect');if(!p)return 'index.html';try{const u=new URL(p,location.href);if(u.origin!==location.origin)return 'index.html';return u.pathname.split('/').pop()+(u.search||'')+(u.hash||'')}catch(_){return 'index.html'}}
  function goAfterAuth(){location.href=requestedDestination()}
  async function forgotPassword(email){waitForClient(async sb=>{const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:new URL('reset-password.html',location.href).href});if(error)show(error.message,'error');else show('Password reset link sent. Check your email.','success')})}
  window.UnseenGoAuthForgotPassword=forgotPassword;
  document.addEventListener('DOMContentLoaded',function(){
    const login=document.getElementById('loginForm'),signup=document.getElementById('signupForm');
    waitForClient(sb=>sb.auth.getSession().then(({data})=>{if(data.session&&(login||signup))goAfterAuth()}));
    if(login)login.addEventListener('submit',e=>{e.preventDefault();const b=document.getElementById('loginButton');b.disabled=true;b.textContent='LOGGING IN…';show('');waitForClient(async sb=>{const {error}=await sb.auth.signInWithPassword({email:document.getElementById('email').value.trim(),password:document.getElementById('password').value});b.disabled=false;b.textContent='LOGIN';if(error){show(error.message,'error');return}show('Login successful. Opening UnseenGo AI…','success');setTimeout(goAfterAuth,500)})});
    if(signup)signup.addEventListener('submit',e=>{e.preventDefault();const b=document.getElementById('signupButton'),name=document.getElementById('name').value.trim(),email=document.getElementById('email').value.trim(),password=document.getElementById('password').value,confirm=document.getElementById('confirmPassword').value;if(password!==confirm){show('Passwords do not match.','error');return}if(password.length<6){show('Password must contain at least 6 characters.','error');return}b.disabled=true;b.textContent='CREATING ACCOUNT…';show('');waitForClient(async sb=>{const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});b.disabled=false;b.textContent='CREATE MY ACCOUNT';if(error){show(error.message,'error');return}if(data.session){show('Account created. Opening UnseenGo AI…','success');setTimeout(goAfterAuth,600)}else show('Account created. Check your email to confirm your account, then login.','success')})});
  });
})();
