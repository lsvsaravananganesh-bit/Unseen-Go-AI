import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function directCssPlugin() {
  return {
    name: 'direct-css-plugin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          try {
            const url = new URL(req.url, 'http://localhost');
            if (
              url.pathname.endsWith('.css') &&
              !url.searchParams.has('import') &&
              !url.searchParams.has('raw') &&
              !url.searchParams.has('inline') &&
              !url.searchParams.has('direct')
            ) {
              url.searchParams.set('direct', '');
              req.url = url.pathname + '?' + url.searchParams.toString();
            }
          } catch (e) {
            // ignore
          }
        }
        next();
      });
    },
    transformIndexHtml(html) {
      return html.replace(
        /<link([^>]*rel=["']stylesheet["'][^>]*href=["'])([^"']+\.css)(["'][^>]*>)/gi,
        (match, p1, href, p3) => {
          if (!href.includes('?') && !href.startsWith('http')) {
            return `<link${p1}${href}?direct${p3}`;
          }
          return match;
        }
      );
    }
  };
}

function apiMiddlewarePlugin() {
  return {
    name: 'api-middleware-plugin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost:5173');
        const pathname = urlObj.pathname.replace(/\/$/, '') || '/';

        let handlerModule = null;
        try {
          if (pathname === '/api/auth-login' || pathname === '/api/auth/login') {
            handlerModule = await import('./api/auth-login.js');
          } else if (pathname === '/api/auth-signup' || pathname === '/api/auth/signup') {
            handlerModule = await import('./api/auth-signup.js');
          } else if (pathname === '/api/destinations') {
            handlerModule = await import('./api/destinations.js');
          } else if (pathname === '/api/ai-itinerary') {
            handlerModule = await import('./api/ai-itinerary.js');
          } else if (pathname === '/api/ai-plan') {
            handlerModule = await import('./api/ai-plan.js');
          } else if (pathname === '/api/places-search') {
            handlerModule = await import('./api/places-search.js');
          } else if (pathname === '/api/places') {
            handlerModule = await import('./api/places.js');
          } else if (pathname === '/api/stays') {
            handlerModule = await import('./api/stays.js');
          } else if (pathname === '/api/transport') {
            handlerModule = await import('./api/transport.js');
          } else if (pathname === '/api/weather') {
            handlerModule = await import('./api/weather.js');
          } else if (pathname === '/api/india-verify') {
            handlerModule = await import('./api/india-verify.js');
          }
        } catch (err) {
          console.error(`Error loading API handler for ${pathname}:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: err.message }));
        }

        if (handlerModule && typeof handlerModule.default === 'function') {
          res.status = function(code) {
            res.statusCode = code;
            return res;
          };
          res.json = function(data) {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
            }
            res.end(JSON.stringify(data));
            return res;
          };

          req.query = Object.fromEntries(urlObj.searchParams.entries());

          try {
            await handlerModule.default(req, res);
          } catch (handlerErr) {
            console.error(`API execution error on ${pathname}:`, handlerErr);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: handlerErr.message }));
            }
          }
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [tailwindcss(), directCssPlugin(), apiMiddlewarePlugin()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        discover: resolve(__dirname, 'discover.html'),
        planner: resolve(__dirname, 'planner.html'),
        place: resolve(__dirname, 'place.html'),
        profile: resolve(__dirname, 'profile.html'),
        personalize: resolve(__dirname, 'personalize.html'),
        'stay-local': resolve(__dirname, 'stay-local.html'),
        'india-cities': resolve(__dirname, 'india-cities.html'),
        'connect-travel': resolve(__dirname, 'connect-travel.html'),
        'decision-engine': resolve(__dirname, 'decision-engine.html'),
        stories: resolve(__dirname, 'stories.html'),
        tripideas: resolve(__dirname, 'tripideas.html'),
        map: resolve(__dirname, 'map.html'),
        'my-travel': resolve(__dirname, 'my-travel.html'),
        admin: resolve(__dirname, 'admin.html'),
        login: resolve(__dirname, 'login.html'),
        signin: resolve(__dirname, 'signin.html'),
        signup: resolve(__dirname, 'signup.html'),
        search: resolve(__dirname, 'search.html'),
        stay: resolve(__dirname, 'stay.html'),
        flights: resolve(__dirname, 'flights.html'),
        transport: resolve(__dirname, 'transport.html'),
        utilities: resolve(__dirname, 'utilities.html')
      }
    }
  }
});
