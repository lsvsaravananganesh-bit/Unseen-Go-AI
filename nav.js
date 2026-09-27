/* UnseenGo AI — unified professional product shell */
(function(){
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const authPages=['login.html','signup.html','reset-password.html'].includes(page);
  function loadCss(){
    if(!document.querySelector('link[data-ug-professional]')){
      const l=document.createElement('link');l.rel='stylesheet';l.href='unseengo-professional.css?v=20260927';l.dataset.ugProfessional='1';document.head.appendChild(l);
    }
    if(!document.querySelector('link[data-ug-system]')){
      const l=document.createElement('link');l.rel='stylesheet';l.href='unseengo-system.css?v=20260826';l.dataset.ugSystem='1';document.head.appendChild(l);
    }
  }
  function active(target){return target===page?'active':''}
  function buildShell(){
    if(authPages)return;
    const old=document.querySelector('header.nav');
    const shell=document.createElement('header');shell.className='ug-app-shell';
    shell.innerHTML=
      '<div class="ug-shell-inner">'+
      '<button class="ug-mobile-menu" id="ugMenu" aria-label="Open navigation">☰</button>'+
      '<a class="ug-logo" href="index.html"><span class="ug-logo-mark">✦</span>Unseen<span>Go</span></a>'+
      '<nav class="ug-main-nav" id="ugMainNav">'+
      '<a class="'+active('index.html')+'" href="index.html">Home</a>'+
      '<a class="'+active('discover.html')+'" href="discover.html">Discover</a>'+
      '<a class="'+active('planner.html')+'" href="planner.html">AI Planner</a>'+
      '<a class="'+active('india-cities.html')+'" href="india-cities.html">Explore Map</a>'+
      '<a class="'+active('my-trip.html')+'" href="my-trip.html">My Travel</a>'+
      '</nav>'+
      '<div class="ug-shell-actions">'+
      '<a class="ug-shell-icon search" href="discover.html" aria-label="Search">⌕</a>'+
      '<a class="ug-shell-profile" id="ugShellProfile" href="login.html?redirect='+encodeURIComponent(page)+'"><span class="ug-avatar">?</span><span class="ug-profile-name">Sign in</span></a>'+
      '</div></div>';
    if(old)old.replaceWith(shell);else document.body.insertBefore(shell,document.body.firstChild);
    const menu=shell.querySelector('#ugMenu'), nav=shell.querySelector('#ugMainNav');
    menu.addEventListener('click',()=>nav.classList.toggle('open'));
    const bottom=document.createElement('nav');bottom.className='ug-bottom-nav';
    bottom.innerHTML='<a class="'+active('index.html')+'" href="index.html"><span>⌂</span>Home</a><a class="'+active('discover.html')+'" href="discover.html"><span>⌕</span>Discover</a><a class="'+active('planner.html')+'" href="planner.html"><span>✦</span>AI</a><a class="'+active('my-trip.html')+'" href="my-trip.html"><span>♡</span>Trips</a><a class="'+active('profile.html')+'" href="profile.html"><span>◉</span>Profile</a>';
    document.body.appendChild(bottom);
  }
  function authState(){
    const profile=document.getElementById('ugShellProfile');
    const sb=window.unseenGoSupabase;
    if(!profile||!sb)return;
    sb.auth.getSession().then(({data})=>{
      const user=data&&data.session&&data.session.user;
      if(user){
        const name=(user.user_metadata&&user.user_metadata.full_name)||user.email||'Account';
        const initial=name.trim().charAt(0).toUpperCase()||'A';
        profile.href='profile.html';
        profile.innerHTML='<span class="ug-avatar">'+initial+'</span><span class="ug-profile-name">'+name.split(' ')[0]+'</span>';
      }
    }).catch(()=>{});
  }
  function bootstrap(){
    loadCss();buildShell();
    if(!window.UNSEENGO_SUPABASE_CONFIG){
      const s=document.createElement('script');s.src='supabase-config.js';s.onload=loadClient;document.head.appendChild(s);
    }else loadClient();
  }
  function loadClient(){
    if(window.unseenGoSupabase){authState();return}
    const s=document.createElement('script');s.src='supabase-client.js';s.onload=authState;document.head.appendChild(s);
  }
  window.openCityPage=function(city){if(city){localStorage.setItem('unseengo_city',city);location.href='city.html?city='+encodeURIComponent(city)}};
  window.setCity=function(city){if(!city)return;localStorage.setItem('unseengo_city',city);const picker=document.getElementById('cityPickerInput');if(picker)picker.value=city;window.openCityPage(city)};
  document.addEventListener('DOMContentLoaded',bootstrap,{once:true});
})();