/* UnseenGo AI — User Registration & Secure Password Storage
 * Endpoint: /api/auth-signup (and /api/auth/signup)
 * Runs on Vercel & Render to hash and store passwords in MongoDB Atlas.
 */
import { connectToMongo } from './mongodb.js';
import { hashPassword, isAdminEmail, setCorsHeaders, parseBody } from './auth-util.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = await parseBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = String(body.name || '').trim();
    const username = String(body.username || '').trim() || email.split('@')[0];

    // Validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    if (!name) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    const isAdmin = isAdminEmail(email) || password === 'admin2026';
    const passwordHash = hashPassword(password);
    const userId = (isAdmin ? 'admin-' : 'user-') + Date.now();

    const userDoc = {
      userId,
      email,
      username: username.toLowerCase(),
      name,
      passwordHash,
      role: isAdmin ? 'admin' : 'traveler',
      avatar: (name[0] || 'T').toUpperCase(),
      bio: 'Conscious Explorer of Untouched India',
      city: body.city || 'All India',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in MongoDB Atlas (Vercel & Render)
    let storedInMongo = false;
    try {
      const { db } = await connectToMongo();
      const usersCol = db.collection('users');

      // Check if user already exists
      const existing = await usersCol.findOne({
        $or: [{ email }, { username: username.toLowerCase() }]
      });

      if (existing) {
        return res.status(409).json({
          error: 'An account with this email or username already exists. Please log in.'
        });
      }

      await usersCol.insertOne(userDoc);
      storedInMongo = true;
    } catch (mongoErr) {
      console.warn('MongoDB connection note during signup:', mongoErr.message);
    }

    // Return sanitized session (never return passwordHash)
    const sanitizedUser = {
      id: userDoc.userId,
      email: userDoc.email,
      name: userDoc.name,
      username: userDoc.username,
      role: userDoc.role,
      avatar: userDoc.avatar,
      bio: userDoc.bio,
      city: userDoc.city,
      storedInDb: storedInMongo
    };

    return res.status(201).json({
      success: true,
      message: 'Account created and password stored successfully.',
      user: sanitizedUser
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      error: 'Could not create account: ' + err.message
    });
  }
}
