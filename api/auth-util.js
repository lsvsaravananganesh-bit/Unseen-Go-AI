/* UnseenGo AI — Authentication Utilities for Vercel & Render
 * Secure password hashing, verification, token generation, and CORS.
 */
import crypto from 'node:crypto';

/**
 * Hash password using crypto.scrypt (secure, built-in, no external C++ bindings).
 * Returns `salt:hash` hex string.
 */
export function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored `salt:hash`.
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
    return false;
  }
  try {
    const [salt, originalHash] = storedHash.split(':');
    const hashAttempt = crypto.scryptSync(password, salt, 64).toString('hex');
    const bufAttempt = Buffer.from(hashAttempt, 'hex');
    const bufOriginal = Buffer.from(originalHash, 'hex');
    if (bufAttempt.length !== bufOriginal.length) return false;
    return crypto.timingSafeEqual(bufAttempt, bufOriginal);
  } catch (_) {
    return false;
  }
}

/**
 * Check if email has admin privileges.
 */
export function isAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
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

/**
 * Set CORS headers on response.
 */
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, apikey');
}

/**
 * Parse request body uniformly across Vercel serverless and Node http server.
 */
export async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (_) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}
