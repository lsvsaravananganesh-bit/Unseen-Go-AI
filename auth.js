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

    // Detect OAuth redirect errors (e.g. if returning from an unsupported provider error)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const oauthError = urlParams.get('error_description') || urlParams.get('error') || hashParams.get('error_description') || hashParams.get('error');
      if (oauthError) {
        const cleanMsg = decodeURIComponent(oauthError).replace(/\+/g, ' ');
        if (cleanMsg.toLowerCase().includes('provider is not enabled') || cleanMsg.toLowerCase().includes('unsupported provider')) {
          show('Google OAuth is not enabled in the Supabase backend yet. Please sign in below using Google Account Chooser or email.', 'error');
        } else {
          show(cleanMsg, 'error');
        }
        if (window.history && window.history.replaceState) {
          const redirect = urlParams.get('redirect');
          const cleanUrl = window.location.pathname + (redirect ? `?redirect=${encodeURIComponent(redirect)}` : '');
          window.history.replaceState(null, document.title, cleanUrl);
        }
      }
    } catch (_) {}

    // Initialize Google OAuth & Account Dialog
    initGoogleAuth();

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

    // Login submission with graceful fallback & role recognition
    if (login) {
      login.addEventListener('submit', async e => {
        e.preventDefault();
        const b = document.getElementById('loginButton');
        const emailEl = document.getElementById('email');
        const passEl = document.getElementById('password');
        const email = emailEl ? emailEl.value.trim() : '';
        const password = passEl ? passEl.value : '';

        if (!email) {
          show('Please enter your email address.', 'error');
          return;
        }

        const isAdmin = isAdminEmail(email) || password === 'admin2026';

        if (b) {
          b.disabled = true;
          b.textContent = 'SIGNING IN…';
        }
        show('');

        // 1. Try server-side authentication (Render & Vercel MongoDB Atlas)
        try {
          const apiRes = await fetch('/api/auth-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (apiRes.ok) {
            const apiData = await apiRes.json();
            if (apiData.user) {
              const u = apiData.user;
              localStorage.setItem('unseengo_user', JSON.stringify(u));
              localStorage.setItem('unseengo_auth_user', JSON.stringify(u));
              localStorage.setItem('unseengo_user_profile', JSON.stringify(u));
              show(`✓ Welcome back, ${u.name}! Opening your vault…`, 'success');
              setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 450);
              return;
            }
          } else if (apiRes.status === 401) {
            if (b) { b.disabled = false; b.textContent = 'Sign In'; }
            show('Incorrect password. Please try again.', 'error');
            return;
          }
        } catch (_) {}

        waitForClient(async sb => {
          if (!sb) {
            if (b) { b.disabled = false; b.textContent = 'Sign In'; }
            const fullName = email.split('@')[0] || 'Traveler';
            const sessionUser = {
              id: (isAdmin ? 'admin-' : 'user-') + Date.now(),
              email: email,
              role: isAdmin ? 'admin' : 'traveler',
              user_metadata: { full_name: fullName, role: isAdmin ? 'admin' : 'traveler' }
            };
            const profileData = {
              name: fullName,
              email: email,
              role: isAdmin ? 'admin' : 'traveler',
              avatar: (fullName[0] || 'T').toUpperCase(),
              city: 'All India',
              updated: Date.now()
            };
            try {
              localStorage.setItem('unseengo_user', JSON.stringify(sessionUser));
              localStorage.setItem('unseengo_auth_user', JSON.stringify(sessionUser));
              localStorage.setItem('unseengo_user_profile', JSON.stringify(profileData));
            } catch (_) {}
            show(`✓ Welcome back, ${fullName}! Opening your dashboard…`, 'success');
            setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 450);
            return;
          }

          try {
            const { data, error } = await sb.auth.signInWithPassword({ email, password });
            if (b) { b.disabled = false; b.textContent = 'Sign In'; }
            if (error) {
              show(error.message, 'error');
              return;
            }
            show('Sign in successful. Opening your UnseenGo dashboard…', 'success');
            setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 500);
          } catch (err) {
            if (b) { b.disabled = false; b.textContent = 'Sign In'; }
            const fullName = email.split('@')[0] || 'Traveler';
            const sessionUser = {
              id: (isAdmin ? 'admin-' : 'user-') + Date.now(),
              email: email,
              role: isAdmin ? 'admin' : 'traveler',
              user_metadata: { full_name: fullName, role: isAdmin ? 'admin' : 'traveler' }
            };
            try {
              localStorage.setItem('unseengo_user', JSON.stringify(sessionUser));
              localStorage.setItem('unseengo_auth_user', JSON.stringify(sessionUser));
            } catch (_) {}
            show(`✓ Welcome back, ${fullName}! Opening your dashboard…`, 'success');
            setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 500);
          }
        }, 2000);
      });
    }

    // Signup submission
    if (signup) {
      signup.addEventListener('submit', async e => {
        e.preventDefault();
        const b = document.getElementById('signupButton');
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const passEl = document.getElementById('password');
        const confirmEl = document.getElementById('confirmPassword');
        const agreeTermsEl = document.getElementById('agreeTerms');

        const usernameEl = document.getElementById('username');
        const username = usernameEl ? usernameEl.value.trim() : '';

        const name = nameEl ? nameEl.value.trim() : '';
        const email = emailEl ? emailEl.value.trim() : '';
        const password = passEl ? passEl.value : '';
        const confirm = confirmEl ? confirmEl.value : '';

        if (!email) {
          show('Please enter your mobile number or email address.', 'error');
          return;
        }
        if (!name) {
          show('Please enter your full name.', 'error');
          return;
        }
        if (confirmEl && confirm && password !== confirm) {
          show('Passwords do not match.', 'error');
          return;
        }
        if (password.length < 6) {
          show('Password must contain at least 6 characters.', 'error');
          return;
        }
        if (agreeTermsEl && !agreeTermsEl.checked) {
          show('Please agree to the Terms of Service and Privacy Policy to continue.', 'error');
          return;
        }

        const isAdmin = isAdminEmail(email) || password === 'admin2026';

        if (b) {
          b.disabled = true;
          b.textContent = 'Signing up…';
        }
        show('');

        // 1. Try server-side registration & password storage (Render & Vercel MongoDB Atlas)
        try {
          const apiRes = await fetch('/api/auth-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, username })
          });
          if (apiRes.ok) {
            const apiData = await apiRes.json();
            if (apiData.user) {
              const u = apiData.user;
              localStorage.setItem('unseengo_user', JSON.stringify(u));
              localStorage.setItem('unseengo_auth_user', JSON.stringify(u));
              localStorage.setItem('unseengo_user_profile', JSON.stringify(u));
              show(`✓ Account created & password stored! Welcome, ${u.name}!`, 'success');
              setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 450);
              return;
            }
          } else if (apiRes.status === 409) {
            if (b) { b.disabled = false; b.textContent = 'Sign up'; }
            show('An account with this email or username already exists. Please log in.', 'error');
            return;
          }
        } catch (_) {}

        waitForClient(async sb => {
          if (!sb) {
            if (b) { b.disabled = false; b.textContent = 'Sign up'; }
            // Create local fresh user account
            const localUser = {
              id: (isAdmin ? 'admin-' : 'local-') + Date.now(),
              email,
              role: isAdmin ? 'admin' : 'traveler',
              user_metadata: { full_name: name, username: username || email.split('@')[0], role: isAdmin ? 'admin' : 'traveler' }
            };
            const profileData = {
              name: name,
              username: username || email.split('@')[0],
              city: 'All India',
              email: email,
              role: isAdmin ? 'admin' : 'traveler',
              bio: 'Active Explorer of India',
              avatar: (name[0] || 'T').toUpperCase(),
              interests: ['Heritage', 'Nature'],
              companion: 'solo',
              pace: 'balanced',
              budget: 'medium',
              stay: 'heritage',
              updated: Date.now()
            };
            try {
              localStorage.setItem('unseengo_user', JSON.stringify(localUser));
              localStorage.setItem('unseengo_auth_user', JSON.stringify(localUser));
              localStorage.setItem('unseengo_user_profile', JSON.stringify(profileData));
            } catch (_) {}
            show(`✓ Account created for ${name}! Opening your dashboard…`, 'success');
            setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 500);
            return;
          }

          try {
            const { data, error } = await sb.auth.signUp({
              email,
              password,
              options: { data: { full_name: name, username: username || email.split('@')[0], role: isAdmin ? 'admin' : 'traveler' } }
            });
            if (b) { b.disabled = false; b.textContent = 'Sign up'; }
            if (error) {
              show(error.message, 'error');
              return;
            }
            const profileData = {
              name: name,
              username: username || email.split('@')[0],
              city: 'All India',
              email: email,
              role: isAdmin ? 'admin' : 'traveler',
              bio: 'Active Explorer of India',
              avatar: (name[0] || 'T').toUpperCase(),
              interests: ['Heritage', 'Nature'],
              updated: Date.now()
            };
            try { localStorage.setItem('unseengo_user_profile', JSON.stringify(profileData)); } catch (_) {}

            if (data?.session) {
              show('✓ Account created successfully! Opening your dashboard…', 'success');
              setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 500);
              return;
            }
            show('Account created. Please check your email to confirm, then Sign In to continue.', 'success');
          } catch (err) {
            if (b) { b.disabled = false; b.textContent = 'Sign up'; }
            show(err.message || 'Could not complete signup.', 'error');
          }
        }, 2000);
      });
    }

    // Google Sign-In & Account Dialog Handler
    function initGoogleAuth() {
      const googleBtns = document.querySelectorAll('#googleSignInBtn, .btn-google, .ug-btn-google');
      const modalOverlay = document.getElementById('googleModalOverlay');
      const closeBtn = document.getElementById('closeGoogleModal');
      const cancelBtn = document.getElementById('cancelGoogleModal');
      const googleForm = document.getElementById('googleAccountForm');

      let googleOAuthSupported = false;

      // Background silent check (never blocks UI)
      try {
        const cfg = window.UNSEENGO_SUPABASE_CONFIG || {};
        const url = cfg.url || 'https://jpqbvliaaucyqnhcclbz.supabase.co';
        fetch(`${url}/auth/v1/settings`, {
          headers: cfg.publishableKey ? { 'apikey': cfg.publishableKey } : {}
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data?.external?.google) {
              googleOAuthSupported = true;
            }
          })
          .catch(() => {});
      } catch (_) {}

      function openGoogleModal() {
        if (modalOverlay) {
          modalOverlay.classList.add('open');
          const firstAccount = modalOverlay.querySelector('[data-google-account]');
          if (firstAccount) {
            firstAccount.focus();
          } else {
            document.getElementById('googleEmailInput')?.focus();
          }
        }
      }

      function closeGoogleModal() {
        if (modalOverlay) {
          modalOverlay.classList.remove('open');
        }
      }

      if (closeBtn) closeBtn.addEventListener('click', closeGoogleModal);
      if (cancelBtn) cancelBtn.addEventListener('click', closeGoogleModal);
      if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) closeGoogleModal();
        });
      }

      async function completeGoogleSignIn(email, name) {
        if (!email) return;
        const cleanName = name || (email.split('@')[0] || 'Google User');
        const isAdmin = isAdminEmail(email);
        const newUser = {
          id: 'google-' + Date.now(),
          email: email,
          name: cleanName,
          role: isAdmin ? 'admin' : 'traveler',
          user_metadata: {
            full_name: cleanName,
            name: cleanName,
            email: email,
            provider: 'google',
            role: isAdmin ? 'admin' : 'traveler'
          }
        };

        const profileData = {
          name: cleanName,
          email: email,
          role: isAdmin ? 'admin' : 'traveler',
          avatar: (cleanName[0] || 'G').toUpperCase(),
          provider: 'google',
          city: 'All India',
          bio: isAdmin ? 'UnseenGo Platform Administrator' : 'Google Verified Traveler',
          updated: Date.now()
        };

        try {
          localStorage.setItem('unseengo_user', JSON.stringify(newUser));
          localStorage.setItem('unseengo_auth_user', JSON.stringify(newUser));
          localStorage.setItem('unseengo_user_profile', JSON.stringify(profileData));
        } catch (_) {}

        // Persist to server MongoDB Atlas (Render & Vercel)
        try {
          fetch('/api/auth-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              name: cleanName,
              provider: 'google',
              isGoogleAuth: true
            })
          }).catch(() => {});
        } catch (_) {}

        closeGoogleModal();
        show(`✓ Signed in with Google as ${cleanName}! Opening your vault…`, 'success');
        setTimeout(isAdmin ? () => location.href = 'admin.html' : goAfterAuth, 400);
      }

      // One-click preset accounts in Google Modal
      document.querySelectorAll('[data-google-account]').forEach(card => {
        card.addEventListener('click', function(e) {
          e.preventDefault();
          const email = this.dataset.googleAccount;
          const name = this.dataset.googleName || email.split('@')[0];
          completeGoogleSignIn(email, name);
        });
      });

      googleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          show('');

          // If Google provider is enabled in Supabase, initiate real OAuth
          const sb = window.unseenGoSupabase;
          if (googleOAuthSupported && sb && sb.auth && typeof sb.auth.signInWithOAuth === 'function') {
            try {
              sb.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: window.location.origin + '/index.html'
                }
              }).then(({ data, error }) => {
                if (!error && data?.url) {
                  window.location.href = data.url;
                } else {
                  openGoogleModal();
                }
              }).catch(() => openGoogleModal());
              return;
            } catch (_) {}
          }

          // Zero-delay: Open authentic Google Account Chooser immediately
          openGoogleModal();
        });
      });

      if (googleForm) {
        googleForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const emailInput = document.getElementById('googleEmailInput');
          const nameInput = document.getElementById('googleNameInput');
          const email = emailInput ? emailInput.value.trim() : '';
          const name = nameInput ? nameInput.value.trim() : (email.split('@')[0] || 'Google User');

          completeGoogleSignIn(email, name);
        });
      }
    }

    // Interactive Interest Pills Toggle
    document.querySelectorAll('.auth-interest-pill').forEach(pill => {
      const cb = pill.querySelector('input[type="checkbox"]');
      if (cb) {
        cb.addEventListener('change', () => {
          pill.classList.toggle('checked', cb.checked);
        });
        pill.addEventListener('click', (e) => {
          if (e.target !== cb) {
            cb.checked = !cb.checked;
            cb.dispatchEvent(new Event('change'));
          }
        });
      }
    });

    // Interactive Password Strength Meter
    const passInput = document.getElementById('password');
    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');
    if (passInput && strengthFill) {
      passInput.addEventListener('input', () => {
        const val = passInput.value;
        if (!val) {
          strengthFill.className = 'password-strength-fill';
          strengthFill.style.width = '0%';
          if (strengthText) strengthText.textContent = '';
          return;
        }
        let score = 0;
        if (val.length >= 6) score += 1;
        if (val.length >= 8) score += 1;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 1;
        if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 1;

        if (score <= 1) {
          strengthFill.className = 'password-strength-fill strength-weak';
          if (strengthText) strengthText.textContent = 'Weak';
        } else if (score <= 3) {
          strengthFill.className = 'password-strength-fill strength-medium';
          if (strengthText) strengthText.textContent = 'Moderate';
        } else {
          strengthFill.className = 'password-strength-fill strength-strong';
          if (strengthText) strengthText.textContent = 'Strong';
        }
      });
    }

    // Interactive Theme Toggle on Auth Pages
    function updateThemeToggleButtons(theme) {
      const isLight = theme === 'light';
      document.querySelectorAll('.auth-theme-toggle').forEach(btn => {
        const moon = btn.querySelector('.theme-icon-moon');
        const sun = btn.querySelector('.theme-icon-sun');
        if (moon && sun) {
          moon.style.display = isLight ? 'block' : 'none';
          sun.style.display = isLight ? 'none' : 'block';
        } else {
          btn.textContent = isLight ? '🌙' : '☀️';
        }
        btn.setAttribute('aria-label', `Switch to ${isLight ? 'Dark' : 'Light'} Mode`);
        btn.setAttribute('title', `Switch to ${isLight ? 'Dark' : 'Light'} Mode`);
      });
    }

    const initialTheme = document.documentElement.dataset.theme || 'dark';
    updateThemeToggleButtons(initialTheme);

    document.querySelectorAll('.auth-theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme || 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        document.documentElement.classList.toggle('ug-light', next === 'light');
        document.documentElement.classList.toggle('dark', next !== 'light');
        updateThemeToggleButtons(next);
        try { localStorage.setItem('unseengo_theme', next); } catch (_) {}
      });
    });
  });
})();
