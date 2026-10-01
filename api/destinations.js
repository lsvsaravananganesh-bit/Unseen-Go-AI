import { connectToMongo } from './mongodb.js';
import { setCorsHeaders } from './auth-util.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToMongo();
    const { city, category, region, search, limit = 50 } = req.query || {};

    const query = {};

    if (city) {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (region) {
      query.region = { $regex: new RegExp(`^${region}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { history: { $regex: search, $options: 'i' } }
      ];
    }

    const destinations = await db.collection('destinations')
      .find(query)
      .limit(Math.min(100, Math.max(1, Number(limit))))
      .toArray();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      source: 'MongoDB Atlas (unseengo_ai)',
      count: destinations.length,
      destinations
    });
  } catch (err) {
    return res.status(500).json({
      error: 'MongoDB query error',
      details: err.message
    });
  }
}
