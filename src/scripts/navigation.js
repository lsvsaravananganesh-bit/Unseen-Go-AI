/* UnseenGo AI — Responsive Navigation, Theme Switcher & Modern Controls
 * Features:
 * - Smooth Dark/Light Theme Switcher with persistence
 * - Quick City Selector Modal with Keyboard Shortcuts (Ctrl+K, /)
 * - Category Filter Tabs for Destination Cards
 * - Interactive Place Bookmarking
 * - Mobile Drawer with backdrop blur and trap focus
 */

(function () {
  'use strict';

  const ALL_CITIES = [
    { name: 'Hyderabad', region: 'South' },
    { name: 'Bengaluru', region: 'South' },
    { name: 'Chennai', region: 'South' },
    { name: 'Kochi', region: 'South' },
    { name: 'Kurnool', region: 'South' },
    { name: 'Tirupati', region: 'South' },
    { name: 'Vijayawada', region: 'South' },
    { name: 'Varanasi', region: 'North' },
    { name: 'Jaipur', region: 'North' },
    { name: 'New Delhi', region: 'North' },
    { name: 'Lucknow', region: 'North' },
    { name: 'Mumbai', region: 'West' },
    { name: 'Pune', region: 'West' },
    { name: 'Ahmedabad', region: 'West' },
    { name: 'Goa', region: 'West' },
    { name: 'Kolkata', region: 'East' },
    { name: 'Bhubaneswar', region: 'East' },
    { name: 'Guwahati', region: 'Northeast' },
    { name: 'Indore', region: 'Central' },
    { name: 'Nagpur', region: 'Central' },
    { name: 'Hampi', region: 'South' },
    { name: 'Leh', region: 'North' },
    { name: 'Udaipur', region: 'North' }
  ];

  /* 1. Dark / Light Theme Controller */
  const THEME_STORAGE_KEY = 'unseengo_theme';

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch (_) {
      return 'dark';
    }
  }

  function applyTheme(theme) {
    const isLight = theme === 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('ug-light', isLight);
    document.documentElement.classList.toggle('dark', !isLight);
    document.documentElement.style.colorScheme = theme;

    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = isLight ? '#f5f7f2' : '#080d09';

    updateThemeToggleIcons(theme);
  }

  // Apply immediately upon script evaluation to prevent any flash
  applyTheme(getSavedTheme());

  function updateThemeToggleIcons(theme) {
    const isLight = theme === 'light';
    const toggleBtns = document.querySelectorAll('[data-ug-theme-toggle], .ug-theme-toggle, .ug-theme-btn, .auth-theme-toggle');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('.ug-theme-icon');
      const label = btn.querySelector('.ug-theme-label');
      const moonSvg = btn.querySelector('.theme-icon-moon');
      const sunSvg = btn.querySelector('.theme-icon-sun');
      if (moonSvg && sunSvg) {
        moonSvg.style.display = isLight ? 'none' : 'block';
        sunSvg.style.display = isLight ? 'block' : 'none';
      }
      if (icon) {
        icon.textContent = isLight ? '🌙' : '☀️';
      }
      if (label) {
        label.textContent = isLight ? 'Dark' : 'Light';
      }
      if (!icon && !label && !moonSvg && !sunSvg) {
        btn.textContent = isLight ? '🌙' : '☀️';
      }
      btn.setAttribute('aria-label', `Switch to ${isLight ? 'Dark' : 'Light'} Mode`);
      btn.setAttribute('title', `Switch to ${isLight ? 'Dark' : 'Light'} Mode`);
      btn.setAttribute('aria-pressed', String(isLight));
    });
  }

  function initTheme() {
    applyTheme(getSavedTheme());

    const toggleBtns = document.querySelectorAll('[data-ug-theme-toggle], .ug-theme-toggle, .ug-theme-btn, .auth-theme-toggle');
    toggleBtns.forEach(btn => {
      // Prevent multiple listeners if already bound
      if (btn.dataset.themeBound) return;
      btn.dataset.themeBound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = document.documentElement.dataset.theme;
        const nextTheme = current === 'light' ? 'dark' : 'light';
        try {
          localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch (_) {}
        applyTheme(nextTheme);
      });
    });

    // Cross-tab synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue);
      }
    });
  }

  /* 2. Header Scroll Effect */
  function initHeader() {
    const header = document.querySelector('.ug-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* 3. Mobile Navigation Drawer */
  function initMobileDrawer() {
    const toggle = document.querySelector('.ug-mobile-toggle, .ug-mobile-menu-btn');
    let backdrop = document.querySelector('.ug-drawer-backdrop');

    if (!toggle) return;

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'ug-drawer-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.innerHTML = `
        <aside class="ug-mobile-drawer" aria-label="Mobile menu">
          <div class="ug-drawer-header">
            <a class="ug-brand" href="index.html">
              <span class="ug-sparkle">✦</span>
              <span>UnseenGo</span>
              <span class="ug-brand-badge">AI</span>
            </a>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button type="button" class="ug-theme-toggle" data-ug-theme-toggle aria-label="Toggle theme">🌙</button>
              <button type="button" class="ug-drawer-close" aria-label="Close mobile navigation">✕</button>
            </div>
          </div>
          <div class="ug-drawer-body">
            <button type="button" class="ug-city-selector-btn" data-ug-city-modal-trigger style="width: 100%; justify-content: space-between;">
              <span style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="pin">📍</span>
                <span>Current City:</span>
                <b data-ug-current-city>All India</b>
              </span>
              <span>Change ▾</span>
            </button>

            <nav class="ug-drawer-nav" aria-label="Mobile navigation links">
              <a class="ug-drawer-link" href="index.html"><span class="icon">🏠</span><span>Home</span></a>
              <a class="ug-drawer-link" href="discover.html"><span class="icon">🔎</span><span>Discover</span></a>
              <a class="ug-drawer-link" href="planner.html"><span class="icon">🤖</span><span>AI Planner</span></a>
              <a class="ug-drawer-link" href="stay.html"><span class="icon">🏡</span><span>Stay</span></a>
              <a class="ug-drawer-link" href="transport.html"><span class="icon">🚗</span><span>Transport</span></a>
              <a class="ug-drawer-link" href="stories.html"><span class="icon">📖</span><span>Experiences & Stories</span></a>
              <a class="ug-drawer-link" href="tripideas.html"><span class="icon">💡</span><span>Thematic Expeditions</span></a>
              <a class="ug-drawer-link" href="flights.html"><span class="icon">✈️</span><span>Flights & Gateways</span></a>
              <a class="ug-drawer-link" href="utilities.html"><span class="icon">🧰</span><span>Travel Utilities</span></a>
              <a class="ug-drawer-link" href="map.html"><span class="icon">🗺️</span><span>Interactive Map</span></a>
              <a class="ug-drawer-link" href="india-cities.html"><span class="icon">📍</span><span>Destinations Directory</span></a>
              <a class="ug-drawer-link" href="my-travel.html"><span class="icon">❤️</span><span>My Trips Vault</span></a>
              <a class="ug-drawer-link" href="profile.html"><span class="icon">👤</span><span>Traveler Profile</span></a>
            </nav>
            <div class="ug-drawer-footer">
              <div class="ug-drawer-auth"></div>
            </div>
          </div>
        </aside>
      `;
      document.body.appendChild(backdrop);
    }

    const closeBtn = backdrop.querySelector('.ug-drawer-close');

    function openDrawer() {
      backdrop.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      backdrop.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }

    toggle.addEventListener('click', () => {
      const isOpen = backdrop.classList.contains('open');
      if (isOpen) closeDrawer();
      else openDrawer();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDrawer();
    });

    backdrop.querySelectorAll('.ug-drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Touch swipe-to-close gesture (swiping right to dismiss)
    const drawerEl = backdrop.querySelector('.ug-mobile-drawer');
    if (drawerEl) {
      let touchStartX = 0;
      let touchStartY = 0;
      drawerEl.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      drawerEl.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
          if (deltaX > 60 && deltaY < 60) {
            closeDrawer();
          }
        }
      }, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  /* 4. Quick City Selector Modal & Search */
  function initCitySelector() {
    let modal = document.querySelector('.ug-city-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'ug-city-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'cityModalTitle');
      modal.innerHTML = `
        <div class="ug-city-modal-box">
          <div class="ug-city-modal-head">
            <h3 id="cityModalTitle"><span>📍</span> Select Destination Hub</h3>
            <button type="button" class="ug-city-modal-close ug-drawer-close" aria-label="Close city selector">✕</button>
          </div>
          <div class="ug-city-search-wrap">
            <input type="text" class="ug-city-search-input" placeholder="Search cities or regions (e.g. Hyderabad, Karnataka, South)..." aria-label="Search destination city">
          </div>
          <div class="ug-city-list"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const openBtns = document.querySelectorAll('[data-ug-city-modal-trigger], .ug-city-selector-btn');
    const closeBtn = modal.querySelector('.ug-city-modal-close');
    const searchInput = modal.querySelector('.ug-city-search-input');
    const cityList = modal.querySelector('.ug-city-list');
    const currentCityLabels = document.querySelectorAll('[data-ug-current-city], [data-selected-city], .ug-city-label');

    const savedCity = localStorage.getItem('unseengo_city') || 'All India';
    updateCurrentCityDisplay(savedCity);

    function updateCurrentCityDisplay(cityName) {
      currentCityLabels.forEach(el => {
        el.textContent = cityName;
      });
    }

    function renderCityChips(filterText = '') {
      if (!cityList) return;
      const term = filterText.trim().toLowerCase();
      const current = localStorage.getItem('unseengo_city') || '';

      const allOption = `
        <button type="button" class="ug-city-chip ${!current ? 'active' : ''}" data-city="">
          <span>🇮🇳 All India</span>
          <span class="region">National</span>
        </button>
      `;

      const matches = ALL_CITIES.filter(c => 
        !term || c.name.toLowerCase().includes(term) || c.region.toLowerCase().includes(term)
      );

      cityList.innerHTML = allOption + matches.map(c => `
        <button type="button" class="ug-city-chip ${current === c.name ? 'active' : ''}" data-city="${c.name}">
          <span>${c.name}</span>
          <span class="region">${c.region}</span>
        </button>
      `).join('');

      cityList.querySelectorAll('.ug-city-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const city = btn.dataset.city;
          selectCity(city);
          closeCityModal();
        });
      });
    }

    function selectCity(city) {
      if (city) {
        localStorage.setItem('unseengo_city', city);
        updateCurrentCityDisplay(city);
      } else {
        localStorage.removeItem('unseengo_city');
        updateCurrentCityDisplay('All India');
      }

      document.dispatchEvent(new CustomEvent('unseengo:citychange', { detail: { city } }));
      
      const citySelect = document.getElementById('citySelect');
      if (citySelect) {
        citySelect.value = city;
        citySelect.dispatchEvent(new Event('change'));
      }
    }

    function openCityModal() {
      if (!modal) return;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      renderCityChips('');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 100);
      }
    }

    function closeCityModal() {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    openBtns.forEach(btn => btn.addEventListener('click', openCityModal));
    if (closeBtn) closeBtn.addEventListener('click', closeCityModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCityModal();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderCityChips(e.target.value);
      });
    }

    // Keyboard Shortcuts: Ctrl+K or /
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeCityModal();
      } else if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName))) {
        e.preventDefault();
        openCityModal();
      }
    });

    renderCityChips('');
  }

  /* 5. Destination Card Category Filter Tabs */
  function initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.ug-filter-btn');
    const cards = document.querySelectorAll('.ug-gem-card');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter || 'all';

        cards.forEach(card => {
          const cardCat = card.dataset.category || '';
          if (cat === 'all' || cardCat.toLowerCase().includes(cat.toLowerCase())) {
            card.style.display = 'flex';
            card.style.animation = 'ugFadeIn 0.3s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* 6. Bookmark / Save Place Interaction */
  function initBookmarks() {
    const bookmarkBtns = document.querySelectorAll('.ug-gem-bookmark-btn');
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('unseengo_saved_places') || localStorage.getItem('unseengo-saved-places') || '[]');
    } catch (_) {
      saved = [];
    }

    bookmarkBtns.forEach(btn => {
      const name = btn.dataset.place;
      const isSaved = saved.some(s => (typeof s === 'string' && (s === name || s.endsWith('|' + name))) || (s && s.name === name));
      if (isSaved) {
        btn.classList.add('saved');
        btn.textContent = '♥';
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let list = [];
        try {
          list = JSON.parse(localStorage.getItem('unseengo_saved_places') || '[]');
        } catch (_) {}

        const exists = list.some(s => (typeof s === 'string' && (s === name || s.endsWith('|' + name))) || (s && s.name === name));
        if (exists) {
          list = list.filter(s => (typeof s === 'string' ? (s !== name && !s.endsWith('|' + name)) : s.name !== name));
          btn.classList.remove('saved');
          btn.textContent = '♡';
        } else {
          list.push(name);
          btn.classList.add('saved');
          btn.textContent = '♥';
        }
        localStorage.setItem('unseengo_saved_places', JSON.stringify(list));
        localStorage.setItem('unseengo-saved-places', JSON.stringify(list));
      });
    });
  }

  /* 7. Role-Based Access Control (RBAC) & Admin Permissions */
  function getAdminEmails() {
    try {
      const custom = JSON.parse(localStorage.getItem('unseengo_admin_emails') || '[]');
      const defaults = [
        'ganesh@unseengo.ai',
        'lsvsaravananganesh@gmail.com',
        'saravananganesh@gmail.com',
        'admin@unseengo.ai',
        'admin@unseengo.demo'
      ];
      return [...new Set([...defaults, ...custom])].map(e => String(e).toLowerCase().trim());
    } catch (_) {
      return ['ganesh@unseengo.ai', 'lsvsaravananganesh@gmail.com', 'admin@unseengo.ai', 'admin@unseengo.demo'];
    }
  }

  function isAdminUser(user) {
    if (!user) return false;
    const email = (user.email || '').toLowerCase().trim();
    const adminList = getAdminEmails();
    if (email && (adminList.includes(email) || email.startsWith('admin@') || email.includes('+admin') || email.includes('admin') || email.includes('ganesh'))) return true;
    if (user.role === 'admin' || user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin') return true;
    return false;
  }

  /* 8. Dynamic Navigation Links Filter (Hides Admin portal from public / normal users) */
  function initNavLinks() {
    const user = getAuthUser();
    const isAdmin = isAdminUser(user);
    const path = window.location.pathname.toLowerCase();
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    const isAdminPage = filename.includes('admin');

    // Filter Desktop Navigation Links
    document.querySelectorAll('.ug-nav-links').forEach(navUl => {
      // Remove any static admin links first
      navUl.querySelectorAll('a[href*="admin.html"]').forEach(a => a.closest('li')?.remove());

      // If user is verified admin, append Admin portal link
      if (isAdmin) {
        const li = document.createElement('li');
        li.className = 'ug-admin-nav-item';
        li.innerHTML = `<a class="ug-nav-link ${isAdminPage ? 'active' : ''}" href="admin.html" style="color:var(--ug-gold, #f59e0b); font-weight:800;">⚙️ Admin</a>`;
        navUl.appendChild(li);
      }
    });

    // Filter Mobile Drawer Links
    document.querySelectorAll('.ug-drawer-nav').forEach(drawerNav => {
      drawerNav.querySelectorAll('a[href*="admin.html"]').forEach(a => a.remove());

      if (isAdmin) {
        const a = document.createElement('a');
        a.className = `ug-drawer-link ug-admin-drawer-item ${isAdminPage ? 'active' : ''}`;
        a.href = 'admin.html';
        a.style.color = 'var(--ug-gold, #f59e0b)';
        a.innerHTML = '<span class="icon">⚙️</span><span>Admin Console (Staff)</span>';
        drawerNav.appendChild(a);
      }
    });
  }

  /* 9. Dynamic Navigation Auth Status (Desktop Header & Mobile Drawer) */
  function getAuthUser() {
    try {
      const raw = localStorage.getItem('unseengo_user') || 
                  localStorage.getItem('supabase_user') || 
                  localStorage.getItem('unseengo_auth_user') || 
                  localStorage.getItem('unseengo_demo_user');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function initNavAuth() {
    const user = getAuthUser();
    const isAdmin = isAdminUser(user);
    const navActionsList = document.querySelectorAll('.ug-nav-actions');

    navActionsList.forEach(navActions => {
      let authContainer = navActions.querySelector('.ug-nav-auth');
      if (!authContainer) {
        authContainer = document.createElement('div');
        authContainer.className = 'ug-nav-auth';
        const toggle = navActions.querySelector('.ug-mobile-toggle');
        if (toggle) {
          navActions.insertBefore(authContainer, toggle);
        } else {
          navActions.appendChild(authContainer);
        }
      }

      authContainer.innerHTML = '';

      // Clean up any legacy static links
      navActions.querySelectorAll(':scope > a[href*="login.html"]').forEach(el => el.remove());

      if (user) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.name || user.email || (isAdmin ? 'Admin' : 'Traveler');
        const firstName = fullName.split(' ')[0] || (isAdmin ? 'Admin' : 'Traveler');
        const initial = (firstName[0] || (isAdmin ? 'A' : 'T')).toUpperCase();
        const roleBadge = isAdmin ? '<span style="background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid rgba(245,158,11,0.4);border-radius:999px;padding:1px 6px;font-size:0.62rem;font-weight:800;margin-left:4px;">👑 ADMIN</span>' : '';

        authContainer.innerHTML = `
          <div class="ug-auth-user">
            <a href="profile.html" class="ug-auth-avatar" style="${isAdmin ? 'border-color:var(--ug-gold, #f59e0b); color:var(--ug-gold, #f59e0b);' : ''}" title="View Profile: ${fullName}" aria-label="Profile of ${fullName}">${initial}</a>
            <span class="ug-auth-name">${firstName}${roleBadge}</span>
            <button type="button" class="ug-btn-logout" title="Sign Out">Log Out</button>
          </div>
        `;

        const logoutBtn = authContainer.querySelector('.ug-btn-logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            [
              'unseengo_user', 'supabase_user', 'unseengo_auth_user', 
              'unseengo_demo_user', 'unseengo_demo_preferences', 
              'unseengo_demo_saved', 'unseengo_demo_trips', 'unseengo_user_profile'
            ].forEach(k => localStorage.removeItem(k));
            try {
              if (window.unseenGoSupabase?.auth?.signOut) window.unseenGoSupabase.auth.signOut();
            } catch (_) {}
            if (window.location.pathname.includes('admin.html') || window.location.pathname.includes('profile.html')) {
              window.location.href = 'index.html';
            } else {
              initNavAuth();
              initNavLinks();
              initMobileBottomNav();
            }
          });
        }
      } else {
        authContainer.innerHTML = `
          <a href="signin.html" class="ug-btn-signin-ghost" title="Sign In to your account">
            <span>Sign In</span>
          </a>
          <a href="signup.html" class="ug-btn-signup" title="Create a free traveller account">
            <span>Sign Up</span>
          </a>
        `;
      }
    });

    // Also synchronize Mobile Drawer
    const drawerBody = document.querySelector('.ug-drawer-body');
    if (drawerBody) {
      let drawerAuth = drawerBody.querySelector('.ug-drawer-auth');
      if (!drawerAuth) {
        drawerAuth = document.createElement('div');
        drawerAuth.className = 'ug-drawer-auth';
        drawerBody.prepend(drawerAuth);
      }
      if (user) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.name || user.email || (isAdmin ? 'Admin' : 'Traveler');
        const firstName = fullName.split(' ')[0] || (isAdmin ? 'Admin' : 'Traveler');
        const initial = (firstName[0] || (isAdmin ? 'A' : 'T')).toUpperCase();
        drawerAuth.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;background:var(--ug-surface-subtle);border:1px solid var(--ug-border);border-radius:12px;margin-bottom:0.75rem;">
            <div style="display:flex;align-items:center;gap:0.65rem;">
              <div class="ug-auth-avatar" style="${isAdmin ? 'border-color:var(--ug-gold, #f59e0b); color:var(--ug-gold, #f59e0b);' : ''}">${initial}</div>
              <div style="display:flex;flex-direction:column;">
                <span style="font-weight:700;font-size:0.9rem;color:var(--ug-text-primary);">${fullName}</span>
                <span style="font-size:0.72rem;color:${isAdmin ? 'var(--ug-gold, #f59e0b)' : 'var(--ug-primary)'};">${isAdmin ? '👑 Platform Administrator' : 'Active Explorer'}</span>
              </div>
            </div>
            <button type="button" class="ug-btn-logout ug-drawer-logout-btn">Log Out</button>
          </div>
        `;
        const btn = drawerAuth.querySelector('.ug-drawer-logout-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            [
              'unseengo_user', 'supabase_user', 'unseengo_auth_user', 
              'unseengo_demo_user', 'unseengo_demo_preferences', 
              'unseengo_demo_saved', 'unseengo_demo_trips', 'unseengo_user_profile'
            ].forEach(k => localStorage.removeItem(k));
            try {
              if (window.unseenGoSupabase?.auth?.signOut) window.unseenGoSupabase.auth.signOut();
            } catch (_) {}
            window.location.reload();
          });
        }
      } else {
        drawerAuth.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:0.75rem;">
            <a href="signin.html" class="ug-btn-signin-ghost" style="text-align:center;padding:0.7rem 0.5rem;justify-content:center;display:flex;">
              🔑 Sign In
            </a>
            <a href="signup.html" class="ug-btn-signup" style="text-align:center;padding:0.7rem 0.5rem;justify-content:center;display:flex;">
              ✨ Sign Up
            </a>
          </div>
        `;
      }
    }
  }

  /* 10. Mobile Bottom Navigation Bar (Home | Discover | AI | Trips | Profile) */
  function initMobileBottomNav() {
    let bottomNav = document.querySelector('.ug-mobile-bottom-nav');
    if (!bottomNav) {
      bottomNav = document.createElement('nav');
      bottomNav.className = 'ug-mobile-bottom-nav';
      bottomNav.setAttribute('aria-label', 'Mobile bottom navigation');
      document.body.appendChild(bottomNav);
    }

    const user = getAuthUser();
    const path = window.location.pathname.toLowerCase();
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const isHome = filename === '' || filename === 'index.html' || filename === './';
    const isDiscover = filename.includes('discover');
    const isPlanner = filename.includes('planner');
    const isTrips = filename.includes('my-travel') || filename.includes('dashboard');
    const isProfile = filename.includes('profile') || filename.includes('login') || filename.includes('signin') || filename.includes('signup');

    const profileHref = user ? 'profile.html' : 'signin.html';

    bottomNav.innerHTML = `
      <a href="index.html" class="ug-bottom-nav-item ${isHome ? 'active' : ''}">
        <span class="nav-icon">🏠</span>
        <span>Home</span>
      </a>
      <a href="discover.html" class="ug-bottom-nav-item ${isDiscover ? 'active' : ''}">
        <span class="nav-icon">🔎</span>
        <span>Discover</span>
      </a>
      <a href="planner.html" class="ug-bottom-nav-item ${isPlanner ? 'active' : ''}">
        <span class="nav-icon">🤖</span>
        <span>AI</span>
      </a>
      <a href="my-travel.html" class="ug-bottom-nav-item ${isTrips ? 'active' : ''}">
        <span class="nav-icon">❤️</span>
        <span>Trips</span>
      </a>
      <a href="${profileHref}" class="ug-bottom-nav-item ${isProfile ? 'active' : ''}">
        <span class="nav-icon">👤</span>
        <span>Profile</span>
      </a>
    `;
  }

  // Active navigation link highlighting
  function initActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    document.querySelectorAll('.ug-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === filename || (filename === '' && href === 'index.html')) {
        link.classList.add('active');
      } else if (!href.includes(filename)) {
        link.classList.remove('active');
      }
    });
  }

  // Expose global helper
  window.UnseenGoNav = {
    refreshAuth: () => {
      initNavAuth();
      initNavLinks();
      initMobileBottomNav();
    },
    refreshMobileNav: initMobileBottomNav,
    getAuthUser: getAuthUser,
    isAdminUser: isAdminUser,
    getAdminEmails: getAdminEmails
  };

  /* 11. Global Search Quick-Access Button */
  function initGlobalSearch() {
    // Inject search button into all .ug-nav-actions areas (desktop header)
    document.querySelectorAll('.ug-nav-actions').forEach(function(navActions) {
      if (navActions.querySelector('.ug-global-search-btn')) return; // already added

      var searchBtn = document.createElement('button');
      searchBtn.type = 'button';
      searchBtn.className = 'ug-global-search-btn';
      searchBtn.setAttribute('aria-label', 'Global search — press / or Ctrl+/');
      searchBtn.setAttribute('title', 'Search destinations (/)');
      searchBtn.innerHTML = '🔍';
      searchBtn.style.cssText = [
        'background:transparent',
        'border:1.5px solid var(--ug-border)',
        'border-radius:10px',
        'color:var(--ug-text-secondary)',
        'cursor:pointer',
        'font-size:1rem',
        'padding:0.35rem 0.65rem',
        'transition:all 0.18s',
        'display:flex',
        'align-items:center',
        'gap:0.35rem',
        'white-space:nowrap'
      ].join(';');

      searchBtn.addEventListener('mouseenter', function() {
        searchBtn.style.borderColor = 'var(--ug-primary)';
        searchBtn.style.color = 'var(--ug-primary)';
        searchBtn.style.background = 'rgba(216,255,77,0.08)';
      });
      searchBtn.addEventListener('mouseleave', function() {
        searchBtn.style.borderColor = 'var(--ug-border)';
        searchBtn.style.color = 'var(--ug-text-secondary)';
        searchBtn.style.background = 'transparent';
      });

      searchBtn.addEventListener('click', function() {
        window.location.href = 'search.html';
      });

      // Insert before the auth container (or before mobile toggle)
      var themeToggle = navActions.querySelector('[data-ug-theme-toggle]');
      if (themeToggle) {
        navActions.insertBefore(searchBtn, themeToggle.nextSibling);
      } else {
        navActions.prepend(searchBtn);
      }
    });

    // Add search link in mobile drawer nav too
    document.querySelectorAll('.ug-drawer-nav').forEach(function(drawerNav) {
      if (drawerNav.querySelector('a[href*="search.html"]')) return;
      var a = document.createElement('a');
      a.className = 'ug-drawer-link';
      a.href = 'search.html';
      a.innerHTML = '<span class="icon">🔍</span><span>Search Everything</span>';
      // Insert after the first link (Home)
      var firstLink = drawerNav.querySelector('.ug-drawer-link');
      if (firstLink && firstLink.nextSibling) {
        drawerNav.insertBefore(a, firstLink.nextSibling);
      } else {
        drawerNav.appendChild(a);
      }
    });

    // Keyboard shortcut: Ctrl+/ → navigate to search page
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        window.location.href = 'search.html';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initMobileDrawer();
    initCitySelector();
    initCategoryFilters();
    initBookmarks();
    initActiveNav();
    initNavLinks();
    initNavAuth();
    initMobileBottomNav();
    initGlobalSearch();
  });
})();
