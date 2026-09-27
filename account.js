/* UnseenGo AI — Phase 2D account & personalization service */
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

  function ready(fn){
    if (window.unseenGoSupabase) {
      fn(window.unseenGoSupabase);
    } else {
      window.addEventListener('unseengo:supabase-ready', function(e){
        fn(e.detail);
      }, { once: true });
    }
  }

  window.UnseenGoAccount = {
    ready,

    async user(){
      const demo = getDemoUser();
      if (demo) return demo;
      return new Promise(resolve => {
        ready(async s => {
          try {
            const { data } = await s.auth.getUser();
            resolve(data?.user || null);
          } catch (_) {
            resolve(null);
          }
        });
      });
    },

    async savePreferences(p){
      const demo = getDemoUser();
      if (demo) {
        const prefs = {
          interests: p.interests || [],
          budget: p.budget || 'medium',
          pace: p.pace || 'balanced',
          updated_at: new Date().toISOString()
        };
        try {
          localStorage.setItem('unseengo_demo_preferences', JSON.stringify(prefs));
        } catch (_) {}
        return { data: prefs, error: null };
      }

      return new Promise(resolve => {
        ready(async s => {
          try {
            const { data: { user } } = await s.auth.getUser();
            if (!user) return resolve({ error: new Error('Please sign in first.') });
            const result = await s.from('user_preferences').upsert({
              user_id: user.id,
              interests: p.interests || [],
              budget: p.budget || 'moderate',
              pace: p.pace || 'balanced',
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
            resolve(result);
          } catch (e) {
            resolve({ error: e });
          }
        });
      });
    },

    async getPreferences(){
      const demo = getDemoUser();
      if (demo) {
        try {
          const raw = localStorage.getItem('unseengo_demo_preferences');
          return raw ? JSON.parse(raw) : (demo.preferences || null);
        } catch (_) {
          return demo.preferences || null;
        }
      }

      return new Promise(resolve => {
        ready(async s => {
          try {
            const { data: { user } } = await s.auth.getUser();
            if (!user) return resolve(null);
            const { data } = await s.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle();
            resolve(data || null);
          } catch (_) {
            resolve(null);
          }
        });
      });
    },

    async saveRecommendation(rec){
      const demo = getDemoUser();
      if (demo) {
        try {
          const list = JSON.parse(localStorage.getItem('unseengo_demo_saved') || '[]');
          const item = {
            id: 'save-' + Date.now(),
            place_name: rec.name,
            score: rec.score || 0,
            reason: rec.why || '',
            place_data: rec.place || {},
            created_at: new Date().toISOString()
          };
          list.unshift(item);
          localStorage.setItem('unseengo_demo_saved', JSON.stringify(list));
          return { data: item, error: null };
        } catch (e) {
          return { error: e };
        }
      }

      return new Promise(resolve => {
        ready(async s => {
          try {
            const { data: { user } } = await s.auth.getUser();
            if (!user) return resolve({ error: new Error('Please sign in to save places.') });
            const result = await s.from('saved_recommendations').insert({
              user_id: user.id,
              place_name: rec.name,
              score: rec.score || 0,
              reason: rec.why || '',
              place_data: rec.place || {}
            });
            resolve(result);
          } catch (e) {
            resolve({ error: e });
          }
        });
      });
    },

    async savedRecommendations(){
      const demo = getDemoUser();
      if (demo) {
        try {
          const raw = localStorage.getItem('unseengo_demo_saved');
          return raw ? JSON.parse(raw) : (demo.saved || []);
        } catch (_) {
          return demo.saved || [];
        }
      }

      return new Promise(resolve => {
        ready(async s => {
          try {
            const { data: { user } } = await s.auth.getUser();
            if (!user) return resolve([]);
            const { data } = await s.from('saved_recommendations').select('*').order('created_at', { ascending: false });
            resolve(data || []);
          } catch (_) {
            resolve([]);
          }
        });
      });
    },

    async saveTrip(title, destination, tripData){
      const demo = getDemoUser();
      if (demo) {
        try {
          const trips = JSON.parse(localStorage.getItem('unseengo_demo_trips') || '[]');
          const item = {
            id: 'trip-' + Date.now(),
            title: title || 'UnseenGo Trip',
            destination: destination || 'India',
            trip_data: tripData || {},
            created_at: new Date().toISOString()
          };
          trips.unshift(item);
          localStorage.setItem('unseengo_demo_trips', JSON.stringify(trips));
          return { data: item, error: null };
        } catch (e) {
          return { error: e };
        }
      }

      return new Promise(resolve => {
        ready(async s => {
          try {
            const { data: { user } } = await s.auth.getUser();
            if (!user) return resolve({ error: new Error('Please sign in to save trips.') });
            const result = await s.from('saved_trips').insert({
              user_id: user.id,
              title,
              destination,
              trip_data: tripData || {}
            });
            resolve(result);
          } catch (e) {
            resolve({ error: e });
          }
        });
      });
    },

    async signOut(){
      ['unseengo_user', 'unseengo_demo_user', 'unseengo_demo_preferences', 'unseengo_demo_saved', 'unseengo_demo_trips', 'unseengo_auth_user'].forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });
      return new Promise(resolve => {
        if (window.unseenGoSupabase) {
          window.unseenGoSupabase.auth.signOut().then(resolve).catch(() => resolve({}));
        } else {
          resolve({});
        }
      });
    },

    async signInEmail(email, password){
      return new Promise(resolve => {
        ready(async s => {
          try {
            resolve(await s.auth.signInWithPassword({ email, password }));
          } catch (e) {
            resolve({ error: e });
          }
        });
      });
    },

    async signUp(email, password, name){
      return new Promise(resolve => {
        ready(async s => {
          try {
            resolve(await s.auth.signUp({ email, password, options: { data: { full_name: name || '' } } }));
          } catch (e) {
            resolve({ error: e });
          }
        });
      });
    },

    async google(){
      return new Promise(resolve => {
        ready(async s => {
          try {
            resolve(await s.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'dashboard.html' }
            }));
          } catch (e) {
            resolve({ error: e });
          }
        });
      });
    }
  };
})();