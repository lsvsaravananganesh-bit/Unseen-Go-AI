/* UnseenGo AI — Phase 2B Supabase client bootstrap */
(function () {
  const cfg = window.UNSEENGO_SUPABASE_CONFIG;
  if (!cfg || !cfg.url || cfg.url.startsWith("YOUR_") || !cfg.publishableKey || cfg.publishableKey.startsWith("YOUR_")) {
    console.info("UnseenGo AI: Supabase is not configured yet. Phase 2B is waiting for the project URL and publishable key.");
    return;
  }

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  script.onload = function () {
    window.unseenGoSupabase = window.supabase.createClient(cfg.url, cfg.publishableKey);
    window.dispatchEvent(new CustomEvent("unseengo:supabase-ready", { detail: window.unseenGoSupabase }));
    console.info("UnseenGo AI: Supabase client connected.");

    // City pages load the Supabase client directly rather than nav.js.
    // Ensure the same authenticated Login/Profile navigation is available there too.
    if (document.querySelector('.nav') && !/^(login|signup)\.html$/i.test(location.pathname.split('/').pop() || '')) {
      if (!document.querySelector('script[data-unseengo-auth-nav]')) {
        const navAuth = document.createElement('script');
        navAuth.src = 'nav-auth.js?v=20260819';
        navAuth.dataset.unseengoAuthNav = 'true';
        document.head.appendChild(navAuth);
      }
    }
  };
  script.onerror = function () {
    console.error("UnseenGo AI: Could not load the Supabase client library.");
  };
  document.head.appendChild(script);
})();
