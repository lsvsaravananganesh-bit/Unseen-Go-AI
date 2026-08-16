/* UnseenGo AI — Phase 2D authentication */
(function () {
  function show(message, type) {
    const el = document.getElementById('message');
    if (!el) return;
    el.textContent = message || '';
    el.className = 'message' + (type ? ' ' + type : '');
  }

  function waitForClient(callback) {
    if (window.unseenGoSupabase) return callback(window.unseenGoSupabase);
    window.addEventListener('unseengo:supabase-ready', function (event) {
      callback(event.detail);
    }, { once: true });
    setTimeout(function () {
      if (!window.unseenGoSupabase) show('Supabase could not be connected. Please refresh the page.', 'error');
    }, 5000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    waitForClient(function (supabase) {
      supabase.auth.getSession().then(function (result) {
        if (result.data && result.data.session) {
          window.location.href = 'index.html';
        }
      });
    });

    if (loginForm) {
      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const button = document.getElementById('loginButton');
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        button.disabled = true;
        button.textContent = 'Logging in...';
        show('');

        waitForClient(async function (supabase) {
          const result = await supabase.auth.signInWithPassword({ email: email, password: password });
          button.disabled = false;
          button.textContent = 'Login to UnseenGo AI';
          if (result.error) {
            show(result.error.message, 'error');
            return;
          }
          show('Login successful. Opening UnseenGo AI...', 'success');
          setTimeout(function () { window.location.href = 'index.html'; }, 600);
        });
      });
    }

    if (signupForm) {
      signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const button = document.getElementById('signupButton');
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (password !== confirm) {
          show('Passwords do not match.', 'error');
          return;
        }
        if (password.length < 6) {
          show('Password must contain at least 6 characters.', 'error');
          return;
        }

        button.disabled = true;
        button.textContent = 'Creating account...';
        show('');

        waitForClient(async function (supabase) {
          const result = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { data: { full_name: name } }
          });
          button.disabled = false;
          button.textContent = 'Create my account';
          if (result.error) {
            show(result.error.message, 'error');
            return;
          }
          if (result.data.session) {
            show('Account created. Opening UnseenGo AI...', 'success');
            setTimeout(function () { window.location.href = 'index.html'; }, 700);
          } else {
            show('Account created. Check your email to confirm your account, then login.', 'success');
          }
        });
      });
    }
  });
})();
