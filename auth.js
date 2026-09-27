/* UnseenGo AI — Phase 2D authentication + Interactive Demo Experience */
(function(){
  'use strict';

  const DEMO_PERSONAS = {
    arjun: {
      id: 'demo-arjun-01',
      email: 'arjun.sharma@unseengo.demo',
      user_metadata: { full_name: 'Arjun Sharma', persona: 'Heritage & Architecture Enthusiast' },
      preferences: {
        interests: ['Heritage', 'Photography', 'Culture'],
        budget: 'medium',
        pace: 'balanced',
        days: 3,
        city: 'Ahmedabad'
      },
      saved: [
        { id: 'save-1', place_name: 'Gandikota Fort & Gorge', score: 96, reason: 'Dramatic red canyon and 13th-century fort ruins with zero commercial crowds.', location: 'Andhra Pradesh' },
        { id: 'save-2', place_name: 'Lepakshi Temple', score: 94, reason: 'Vijayanagara architectural mastery with monolithic Nandi and hanging pillar mysteries.', location: 'Andhra Pradesh' },
        { id: 'save-3', place_name: 'Sidi Saiyyed Mosque', score: 91, reason: 'Exquisite stone lattice jali work representing the tree of life in the old walled city.', location: 'Gujarat' }
      ],
      trips: [
        { id: 'trip-1', title: 'South India Heritage Loop', destination: 'Gandikota & Lepakshi', trip_data: { days: 3 } }
      ]
    },
    ananya: {
      id: 'demo-ananya-02',
      email: 'ananya.roy@unseengo.demo',
      user_metadata: { full_name: 'Ananya Roy', persona: 'Rainforest & Nature Explorer' },
      preferences: {
        interests: ['Nature', 'Photography'],
        budget: 'low',
        pace: 'slow',
        days: 2,
        city: 'Bengaluru'
      },
      saved: [
        { id: 'save-4', place_name: 'Agumbe Rainforest', score: 98, reason: 'Cherrapunji of the South with quiet canopy treks and endemic biodiversity.', location: 'Karnataka' },
        { id: 'save-5', place_name: 'Gandikota Gorge Viewpoint', score: 92, reason: 'Sunset overlook with panoramic views across the Pennar river gorge.', location: 'Andhra Pradesh' },
        { id: 'save-6', place_name: 'Jog Falls Backwaters', score: 89, reason: 'Lesser-explored serene waters upstream from the iconic cascade.', location: 'Karnataka' }
      ],
      trips: [
        { id: 'trip-2', title: 'Western Ghats Monsoon Trail', destination: 'Agumbe', trip_data: { days: 2 } }
      ]
    },
    vikram: {
      id: 'demo-vikram-03',
      email: 'vikram.malhotra@unseengo.demo',
      user_metadata: { full_name: 'Vikram Malhotra', persona: 'Food, Culture & Roadtripper' },
      preferences: {
        interests: ['Food', 'Culture', 'Adventure'],
        budget: 'high',
        pace: 'fast',
        days: 4,
        city: 'Hyderabad'
      },
      saved: [
        { id: 'save-7', place_name: 'Kurnool Rock Garden & Fort', score: 95, reason: 'Ancient rock formations paired with regional Rayalaseema culinary delights.', location: 'Andhra Pradesh' },
        { id: 'save-8', place_name: 'Shekhawati Painted Havelis', score: 93, reason: 'Open-air art gallery featuring historic fresco murals on merchant mansions.', location: 'Rajasthan' },
        { id: 'save-9', place_name: 'Mandu Ghost Fortresses', score: 90, reason: 'Romantic Afghan ruins, Jahaz Mahal and royal palace grounds.', location: 'Madhya Pradesh' }
      ],
      trips: [
        { id: 'trip-3', title: 'Historic Rayalaseema Roadtrip', destination: 'Kurnool', trip_data: { days: 4 } }
      ]
    },
    ganesh: {
      id: 'admin-ganesh-00',
      email: 'lsvsaravananganesh@gmail.com',
      role: 'admin',
      user_metadata: { full_name: 'Ganesh', role: 'admin', persona: 'Platform Administrator & Lead Curator' },
      preferences: {
        interests: ['Heritage', 'Nature', 'Culture', 'Food'],
        budget: 'high',
        pace: 'balanced',
        days: 5,
        city: 'Hyderabad'
      },
      saved: [
        { id: 'save-10', place_name: 'Gandikota Canyon & Fort', score: 98, reason: 'All-access verified heritage gem', location: 'Andhra Pradesh' },
        { id: 'save-11', place_name: 'Lepakshi Temple', score: 96, reason: 'Vijayanagara architectural mastery', location: 'Andhra Pradesh' }
      ],
      trips: []
    }
  };

  function isAdminEmail(email) {
    if (!email) return false;
    const em = email.toLowerCase().trim();
    return em === 'lsvsaravananganesh@gmail.com' ||
           em === 'ganesh@unseengo.ai' ||
           em === 'saravananganesh@gmail.com' ||
           em === 'admin@unseengo.ai' ||
           em === 'admin@unseengo.demo' ||
           em.startsWith('admin@') ||
           em.includes('admin') ||
           em.includes('ganesh');
  }

  function show(message, type){
    const el = document.getElementById('message');
    if (!el) return;
    el.textContent = message || '';
    el.className = 'msg message' + (type ? ' ' + type : '');
  }

  function waitForClient(cb, timeoutMs){
    if (window.unseenGoSupabase) return cb(window.unseenGoSupabase);
    let resolved = false;
    const handler = e => {
      if (resolved) return;
      resolved = true;
      cb(e.detail);
    };
    window.addEventListener('unseengo:supabase-ready', handler, { once: true });
    setTimeout(() => {
      if (!resolved && !window.unseenGoSupabase) {
        resolved = true;
        cb(null);
      }
    }, timeoutMs || 2500);
  }

  function requestedDestination(){
    const p = new URLSearchParams(location.search).get('redirect');
    if (!p) return 'profile.html';
    try {
      const u = new URL(p, location.href);
      if (u.origin !== location.origin) return 'profile.html';
      return u.pathname.split('/').pop() + (u.search || '') + (u.hash || '');
    } catch (_) {
      return 'profile.html';
    }
  }

  function goAfterAuth(){
    location.href = requestedDestination();
  }

  function loginDemo(personaKey){
    const key = personaKey || 'arjun';
    const persona = DEMO_PERSONAS[key] || DEMO_PERSONAS.arjun;
    const isAdmin = persona.role === 'admin' || key === 'ganesh' || isAdminEmail(persona.email);
    try {
      const sessionUser = {
        id: persona.id,
        email: persona.email,
        role: isAdmin ? 'admin' : 'traveler',
        user_metadata: {
          ...persona.user_metadata,
          role: isAdmin ? 'admin' : 'traveler'
        }
      };
      localStorage.setItem('unseengo_user', JSON.stringify(sessionUser));
      localStorage.setItem('unseengo_auth_user', JSON.stringify(sessionUser));
      localStorage.setItem('unseengo_demo_user', JSON.stringify(sessionUser));
      localStorage.setItem('unseengo_demo_preferences', JSON.stringify(persona.preferences));
      localStorage.setItem('unseengo_demo_saved', JSON.stringify(persona.saved));
      localStorage.setItem('unseengo_demo_trips', JSON.stringify(persona.trips));
      if (persona.preferences?.city) {
        localStorage.setItem('unseengo_city', persona.preferences.city);
      }
      const profileData = {
        name: persona.user_metadata.full_name,
        city: persona.preferences.city || 'Hyderabad',
        email: persona.email,
        role: isAdmin ? 'admin' : 'traveler',
        bio: persona.user_metadata.persona,
        avatar: (persona.user_metadata.full_name || 'A')[0],
        companion: 'solo',
        pace: persona.preferences.pace || 'balanced',
        budget: persona.preferences.budget || 'medium',
        stay: 'heritage',
        updated: Date.now()
      };
      localStorage.setItem('unseengo_user_profile', JSON.stringify(profileData));
      
      if (isAdmin) {
        show(`👑 Welcome Administrator ${persona.user_metadata.full_name}! Opening Admin Console…`, 'success');
        setTimeout(() => location.href = 'admin.html', 400);
      } else {
        show(`✓ Welcome, ${persona.user_metadata.full_name}! Opening your dashboard…`, 'success');
        setTimeout(goAfterAuth, 450);
      }
    } catch (e) {
      show('Could not start session: ' + e.message, 'error');
    }
  }

  function fillDemoCredentials(){
    const e = document.getElementById('email');
    const p = document.getElementById('password');
    if (e) e.value = 'demo@unseengo.ai';
    if (p) p.value = 'unseengo2026';
    show('Traveller credentials filled. Click LOGIN to sign in as regular user.', 'success');
  }

  function fillAdminCredentials(){
    const e = document.getElementById('email');
    const p = document.getElementById('password');
    if (e) e.value = 'lsvsaravananganesh@gmail.com';
    if (p) p.value = 'admin2026';
    show('👑 Admin credentials filled (Ganesh). Click LOGIN to access Admin Console.', 'success');
  }

  async function forgotPassword(email){
    waitForClient(async sb => {
      if (!sb) {
        show('Demo mode active: You can sign in immediately using 1-Click Demo.', 'success');
        return;
      }
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: new URL('reset-password.html', location.href).href
      });
      if (error) show(error.message, 'error');
      else show('Password reset link sent. Check your email.', 'success');
    });
  }

  window.UnseenGoAuth = {
    loginDemo,
    fillDemoCredentials,
    fillAdminCredentials,
    forgotPassword,
    isAdminEmail,
    DEMO_PERSONAS
  };
  window.UnseenGoAuthForgotPassword = forgotPassword;

  document.addEventListener('DOMContentLoaded', function(){
    const login = document.getElementById('loginForm');
    const signup = document.getElementById('signupForm');

    // Check if already authenticated via demo or Supabase
    try {
      const demoUser = localStorage.getItem('unseengo_user') || localStorage.getItem('unseengo_demo_user');
      if (demoUser && (login || signup)) {
        goAfterAuth();
        return;
      }
    } catch (_) {}

    waitForClient(sb => {
      if (!sb) return;
      sb.auth.getSession().then(({ data }) => {
        if (data?.session && (login || signup)) goAfterAuth();
      }).catch(() => {});
    }, 1500);

    // Setup interactive tab navigation if present
    document.querySelectorAll('[data-auth-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.authTab;
        document.querySelectorAll('[data-auth-tab]').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-tab-pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const pane = document.getElementById(targetId);
        if (pane) pane.classList.add('active');
      });
    });

    // Setup persona click handlers
    document.querySelectorAll('[data-demo-persona]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        loginDemo(btn.dataset.demoPersona);
      });
    });

    // Setup master instant demo button
    const instantDemo = document.getElementById('instantDemoButton');
    if (instantDemo) {
      instantDemo.addEventListener('click', e => {
        e.preventDefault();
        loginDemo('arjun');
      });
    }

    // Setup fill credentials button
    const fillBtn = document.getElementById('fillDemoCreds');
    if (fillBtn) {
      fillBtn.addEventListener('click', e => {
        e.preventDefault();
        fillDemoCredentials();
      });
    }

    const fillAdminBtn = document.getElementById('fillAdminCreds');
    if (fillAdminBtn) {
      fillAdminBtn.addEventListener('click', e => {
        e.preventDefault();
        fillAdminCredentials();
      });
    }

    // Login submission with graceful fallback & role recognition
    if (login) {
      login.addEventListener('submit', e => {
        e.preventDefault();
        const b = document.getElementById('loginButton');
        const emailEl = document.getElementById('email');
        const passEl = document.getElementById('password');
        const email = emailEl ? emailEl.value.trim() : '';
        const password = passEl ? passEl.value : '';

        if (!email) {
          show('Please enter your email or use 1-Click Demo.', 'error');
          return;
        }

        const isAdmin = isAdminEmail(email) || password === 'admin2026';

        // Direct local/demo login bypass
        if (isAdmin) {
          const sessionUser = {
            id: 'admin-' + Date.now(),
            email: email || 'lsvsaravananganesh@gmail.com',
            role: 'admin',
            user_metadata: {
              full_name: email.toLowerCase().includes('ganesh') ? 'Ganesh' : (email.split('@')[0] || 'Admin'),
              role: 'admin',
              persona: 'Platform Administrator'
            }
          };
          localStorage.setItem('unseengo_user', JSON.stringify(sessionUser));
          localStorage.setItem('unseengo_auth_user', JSON.stringify(sessionUser));
          localStorage.setItem('unseengo_demo_user', JSON.stringify(sessionUser));
          show('👑 Admin access granted. Opening Admin Console…', 'success');
          setTimeout(() => location.href = 'admin.html', 400);
          return;
        }

        if (email.toLowerCase().includes('demo') || password === 'unseengo2026') {
          loginDemo('arjun');
          return;
        }

        if (b) {
          b.disabled = true;
          b.textContent = 'LOGGING IN…';
        }
        show('');

        waitForClient(async sb => {
          if (!sb) {
            if (b) { b.disabled = false; b.textContent = 'LOGIN'; }
            const sessionUser = {
              id: 'user-' + Date.now(),
              email: email,
              role: 'traveler',
              user_metadata: { full_name: email.split('@')[0] || 'Traveller', role: 'traveler' }
            };
            localStorage.setItem('unseengo_user', JSON.stringify(sessionUser));
            localStorage.setItem('unseengo_auth_user', JSON.stringify(sessionUser));
            localStorage.setItem('unseengo_demo_user', JSON.stringify(sessionUser));
            show(`✓ Welcome, ${sessionUser.user_metadata.full_name}! Opening your dashboard…`, 'success');
            setTimeout(goAfterAuth, 450);
            return;
          }

          try {
            const { data, error } = await sb.auth.signInWithPassword({ email, password });
            if (b) { b.disabled = false; b.textContent = 'LOGIN'; }
            if (error) {
              show(error.message + ' (Tip: You can use 1-Click Demo to explore right away)', 'error');
              return;
            }
            show('Login successful. Opening your UnseenGo dashboard…', 'success');
            setTimeout(goAfterAuth, 500);
          } catch (err) {
            if (b) { b.disabled = false; b.textContent = 'LOGIN'; }
            show('Could not connect to auth service. Logging in as Demo Traveller…', 'success');
            setTimeout(() => loginDemo('arjun'), 600);
          }
        }, 3000);
      });
    }

    // Signup submission
    if (signup) {
      signup.addEventListener('submit', e => {
        e.preventDefault();
        const b = document.getElementById('signupButton');
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const passEl = document.getElementById('password');
        const confirmEl = document.getElementById('confirmPassword');

        const name = nameEl ? nameEl.value.trim() : 'Traveller';
        const email = emailEl ? emailEl.value.trim() : '';
        const password = passEl ? passEl.value : '';
        const confirm = confirmEl ? confirmEl.value : '';

        if (password !== confirm) {
          show('Passwords do not match.', 'error');
          return;
        }
        if (password.length < 6) {
          show('Password must contain at least 6 characters.', 'error');
          return;
        }

        const isAdmin = isAdminEmail(email) || password === 'admin2026';

        if (b) {
          b.disabled = true;
          b.textContent = 'CREATING ACCOUNT…';
        }
        show('');

        waitForClient(async sb => {
          if (!sb) {
            if (b) { b.disabled = false; b.textContent = 'CREATE MY ACCOUNT'; }
            // Create local user in demo mode
            const localUser = {
              id: (isAdmin ? 'admin-' : 'local-') + Date.now(),
              email,
              role: isAdmin ? 'admin' : 'traveler',
              user_metadata: { full_name: name, role: isAdmin ? 'admin' : 'traveler' }
            };
            localStorage.setItem('unseengo_user', JSON.stringify(localUser));
            localStorage.setItem('unseengo_auth_user', JSON.stringify(localUser));
            localStorage.setItem('unseengo_demo_user', JSON.stringify(localUser));
            show(`Account created as ${isAdmin ? 'Admin' : 'Traveller'}. Opening your dashboard…`, 'success');
            setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 600);
            return;
          }

          try {
            const { data, error } = await sb.auth.signUp({
              email,
              password,
              options: { data: { full_name: name, role: isAdmin ? 'admin' : 'traveler' } }
            });
            if (b) { b.disabled = false; b.textContent = 'CREATE MY ACCOUNT'; }
            if (error) {
              show(error.message, 'error');
              return;
            }
            if (data?.session) {
              show('Account created successfully. Opening your dashboard…', 'success');
              setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 600);
              return;
            }
            show('Account created. Please confirm your email, then use Login to continue.', 'success');
          } catch (err) {
            if (b) { b.disabled = false; b.textContent = 'CREATE MY ACCOUNT'; }
            show(err.message || 'Could not complete signup.', 'error');
          }
        }, 3000);
      });
    }
  });
})();
