/* UnseenGo AI — Supabase client bootstrap */
(function () {
  const URL='https://jpqbvliaaucyqnhcclbz.supabase.co';
  const KEY='sb_publishable_K-0R9a2lSginTIfxHk-cxQ_joorBonp';
  function init(){
    if(window.unseenGoSupabase)return;
    if(!window.supabase?.createClient){console.error('UnseenGo AI: Supabase client library unavailable.');return;}
    window.unseenGoSupabase=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    window.dispatchEvent(new CustomEvent('unseengo:supabase-ready',{detail:window.unseenGoSupabase}));
  }
  function load(){if(window.supabase?.createClient){init();return;}const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=init;s.onerror=()=>console.error('UnseenGo AI: Could not load Supabase.');document.head.appendChild(s);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
