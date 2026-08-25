/* UnseenGo AI — Supabase client bootstrap
 * Uses the public Supabase publishable key from supabase-config.js.
 * Never put a secret/service-role key in this browser file.
 */
(function () {
  function init() {
    if (window.unseenGoSupabase) return;
    if (!window.supabase?.createClient) {
      console.error('UnseenGo AI: Supabase client library unavailable.');
      return;
    }
    const config = window.UNSEENGO_SUPABASE_CONFIG || {};
    const url = config.url || 'https://jpqbvliaaucyqnhcclbz.supabase.co';
    const key = config.publishableKey;
    if (!url || !key) {
      console.error('UnseenGo AI: Supabase URL or publishable key is missing.');
      return;
    }
    window.unseenGoSupabase = window.supabase.createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    window.dispatchEvent(new CustomEvent('unseengo:supabase-ready', { detail: window.unseenGoSupabase }));
  }
  function load() {
    if (window.supabase?.createClient) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload = init;
    s.onerror = () => console.error('UnseenGo AI: Could not load Supabase.');
    document.head.appendChild(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
