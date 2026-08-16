/* UnseenGo AI — authentication gate for protected destinations */
(function(){
  function goLogin(next){
    const target = next || 'discover.html';
    const returnTo = target + (target.includes('?') ? '&' : '?') + 'from=auth';
    location.href = 'login.html?redirect=' + encodeURIComponent(returnTo);
  }

  async function isLoggedIn(){
    if(window.unseenGoSupabase){
      const {data} = await window.unseenGoSupabase.auth.getSession();
      return !!data.session;
    }
    return new Promise(resolve=>{
      let finished=false;
      const done=value=>{if(finished)return;finished=true;resolve(value)};
      window.addEventListener('unseengo:supabase-ready',async e=>{
        try{const {data}=await e.detail.auth.getSession();done(!!data.session)}catch(_){done(false)}
      },{once:true});
      setTimeout(()=>done(false),3000);
    });
  }

  window.requireAuthAndGo=async function(target){
    if(await isLoggedIn()) location.href=target || 'discover.html';
    else goLogin(target || 'discover.html');
  };

  document.addEventListener('click',async e=>{
    const link=e.target.closest('a[href]');
    if(!link)return;
    const href=link.getAttribute('href');
    if(!href || !href.startsWith('discover.html'))return;
    e.preventDefault();
    await window.requireAuthAndGo(href);
  },true);
})();
