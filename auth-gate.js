/* UnseenGo AI — authentication gate for protected destinations */
(function(){
  function withHomepageCity(target){
    const value = document.getElementById('heroCity')?.value?.trim();
    if (!value || !/^discover\.html(?:\?|$)/.test(target)) return target;

    const [path, query = ''] = target.split('?');
    const params = new URLSearchParams(query);
    if (!params.has('city')) params.set('city', value);
    return `${path}?${params.toString()}`;
  }

  function goLogin(next){
    const target = withHomepageCity(next || 'discover.html');
    const returnTo = target + (target.includes('?') ? '&' : '?') + 'from=auth';
    location.href = 'login.html?redirect=' + encodeURIComponent(returnTo);
  }

  async function isLoggedIn(){
    if(window.unseenGoSupabase){
      try {
        const {data} = await window.unseenGoSupabase.auth.getSession();
        return !!data.session;
      } catch (_) {
        return false;
      }
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
    const destination = withHomepageCity(target || 'discover.html');
    if(await isLoggedIn()) location.href=destination;
    else goLogin(destination);
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
