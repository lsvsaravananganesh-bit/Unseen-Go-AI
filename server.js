/* UnseenGo AI — Unified Production Server for Render & Cloud Platforms
 * Pure Node.js ESM server — serves frontend static bundle and mounts /api/* routes.
 * Zero external server dependencies required.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// API Handlers
import authSignupHandler from './api/auth-signup.js';
import authLoginHandler from './api/auth-login.js';
import destinationsHandler from './api/destinations.js';
import aiItineraryHandler from './api/ai-itinerary.js';
import aiPlanHandler from './api/ai-plan.js';
import placesSearchHandler from './api/places-search.js';
import placesHandler from './api/places.js';
import staysHandler from './api/stays.js';
import transportHandler from './api/transport.js';
import weatherHandler from './api/weather.js';
import indiaVerifyHandler from './api/india-verify.js';
import { setCorsHeaders } from './api/auth-util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.join(__dirname, 'dist');
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const API_ROUTER = {
  '/api/auth-signup': authSignupHandler,
  '/api/auth/signup': authSignupHandler,
  '/api/auth-login': authLoginHandler,
  '/api/auth/login': authLoginHandler,
  '/api/destinations': destinationsHandler,
  '/api/ai-itinerary': aiItineraryHandler,
  '/api/ai-plan': aiPlanHandler,
  '/api/places-search': placesSearchHandler,
  '/api/places': placesHandler,
  '/api/stays': staysHandler,
  '/api/transport': transportHandler,
  '/api/weather': weatherHandler,
  '/api/india-verify': indiaVerifyHandler
};

// Polyfill express-like req/res helpers for standard handlers
function enhanceResponse(res) {
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
}

const server = http.createServer(async (req, res) => {
  enhanceResponse(res);
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let urlObj;
  try {
    const cleanUrl = (req.url || '/').replace(/^\/+/, '/');
    urlObj = new URL(cleanUrl, `http://${req.headers.host || 'localhost'}`);
  } catch (_) {
    urlObj = new URL('/', `http://${req.headers.host || 'localhost'}`);
  }
  const pathname = urlObj.pathname.replace(/\/$/, '') || '/';

  // 1. API Routes
  const apiHandler = API_ROUTER[pathname];
  if (apiHandler) {
    req.query = Object.fromEntries(urlObj.searchParams.entries());
    try {
      await apiHandler(req, res);
    } catch (err) {
      console.error(`API Error on ${pathname}:`, err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
      }
    }
    return;
  }

  // 2. Static File Serving (dist first, then root fallback)
  if (req.method === 'GET' || req.method === 'HEAD') {
    let filePath;
    const requestedFile = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');

    // Check in dist/ first
    const distCandidate = path.join(DIST_DIR, requestedFile);
    if (fs.existsSync(distCandidate) && fs.statSync(distCandidate).isFile()) {
      filePath = distCandidate;
    } else {
      // Check in root directory
      const rootCandidate = path.join(ROOT_DIR, requestedFile);
      if (fs.existsSync(rootCandidate) && fs.statSync(rootCandidate).isFile()) {
        filePath = rootCandidate;
      } else if (fs.existsSync(distCandidate + '.html')) {
        filePath = distCandidate + '.html';
      } else if (fs.existsSync(rootCandidate + '.html')) {
        filePath = rootCandidate + '.html';
      } else {
        // Fallback to index.html for SPA/HTML navigation
        const fallback = fs.existsSync(path.join(DIST_DIR, 'index.html'))
          ? path.join(DIST_DIR, 'index.html')
          : path.join(ROOT_DIR, 'index.html');
        filePath = fallback;
      }
    }

    if (filePath && fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);

      if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (ext === '.js' || ext === '.css' || ext === '.svg' || ext === '.webp') {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }

      const stream = fs.createReadStream(filePath);
      return stream.pipe(res);
    }
  }

  res.status(404).json({ error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`✓ UnseenGo AI Server listening on port ${PORT}`);
  console.log(`✓ Serving on Render / Cloud at http://localhost:${PORT}`);
});
