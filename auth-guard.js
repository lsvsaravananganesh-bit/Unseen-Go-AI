/* UnseenGo AI — authenticated page guard */
(function(){
  'use strict';

  function getDemoUser(){
    try {
      const raw = localStorage.getItem('unseengo_user') || localStorage.getItem('unseengo_demo_user');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function renderProfile(user, onSignOut){
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveller';
    const n = document.getElementById('profileName');
    const e = document.getElementById('profileEmail');
    const a = document.getElementById('avatar');
    if (n) n.textContent = name;
    if (e) e.textContent = user.email || '';
    if (a) a.textContent = name.charAt(0).toUpperCase();

    const logout = document.getElementById('logoutButton');
    if (logout) {
      logout.onclick = async () => {
        if (typeof onSignOut === 'function') await onSignOut();
        location.href = 'index.html';
      };
    }
  }

  // Check local demo session first
  const demoUser = getDemoUser();
  if (demoUser) {
    document.addEventListener('DOMContentLoaded', () => {
      renderProfile(demoUser, async () => {
        ['unseengo_user', 'unseengo_demo_user', 'unseengo_demo_preferences', 'unseengo_demo_saved', 'unseengo_demo_trips', 'unseengo_auth_user'].forEach(k => {
          try { localStorage.removeItem(k); } catch (_) {}
        });
        if (window.unseenGoSupabase) {
          try { await window.unseenGoSupabase.auth.signOut(); } catch (_) {}
        }
      });
    });
    return;
  }

  // Supabase fallback
  function start(sb){
    sb.auth.getSession().then(({ data }) => {
      if (!data?.session) {
        location.href = 'login.html';
        return;
      }
      renderProfile(data.session.user, async () => {
        await sb.auth.signOut();
      });
    }).catch(() => {
      location.href = 'login.html';
    });
  }

  if (window.unseenGoSupabase) start(window.unseenGoSupabase);
  else window.addEventListener('unseengo:supabase-ready', e => start(e.detail), { once: true });
})();
