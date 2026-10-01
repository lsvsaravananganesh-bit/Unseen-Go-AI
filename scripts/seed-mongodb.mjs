import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Resolve MongoDB URI from .env
let uri = process.env.MONGODB_URI;
if (!uri) {
  try {
    const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) uri = match[1].trim();
  } catch (_) {}
}

if (!uri) {
  console.error('Error: MONGODB_URI not found in environment or .env');
  process.exit(1);
}

console.log('✦ Target MongoDB Cluster:', uri.replace(/:([^@]+)@/, ':****@'));

// 2. Load Datasets from app.js and data/all-india-famous-places.js
console.log('Loading destination datasets from codebase...');

const appJsCode = fs.readFileSync(path.resolve(__dirname, '../app.js'), 'utf8');
const famousPlacesCode = fs.readFileSync(path.resolve(__dirname, '../data/all-india-famous-places.js'), 'utf8');

const sandbox = {
  window: {},
  document: { addEventListener: () => {} },
  console: console
};
vm.createContext(sandbox);

vm.runInContext(appJsCode + '; this.cities = cities;', sandbox);
vm.runInContext(famousPlacesCode, sandbox);

const rawCities = sandbox.cities || {};
const rawFamous = sandbox.window.ALL_INDIA_FAMOUS_PLACES || [];

console.log(`✓ Loaded ${Object.keys(rawCities).length} cities from app.js`);
console.log(`✓ Loaded ${rawFamous.length} famous places from all-india-famous-places.js`);

// 3. Normalize into unified Destinations
const unifiedDestinations = [];
const seenIds = new Set();

function slug(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Add All-India Famous Places (223 monuments with deep history & legends)
rawFamous.forEach(p => {
  const destId = p.id || `famous-${slug(p.name)}`;
  seenIds.add(destId);
  unifiedDestinations.push({
    id: destId,
    name: p.name,
    city: p.city || 'India',
    state: p.state || null,
    region: p.region || 'India',
    category: p.category || 'Heritage',
    type: p.type || 'heritage',
    tags: Array.isArray(p.tags) ? p.tags : [],
    coordinates: (p.lat && p.lng) ? { lat: Number(p.lat), lng: Number(p.lng) } : null,
    score: Number(p.score) || 90,
    image: p.image || null,
    description: p.desc || p.description || '',
    era: p.era || null,
    dynasty: p.dynasty || null,
    history: p.history || null,
    legend: p.legend || null,
    source: 'UnseenGo Verified All-India Discovery Graph',
    isFamous: true,
    isHiddenGem: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
});

// Add City-specific Hidden Gems (300 places across 20 cities)
Object.entries(rawCities).forEach(([cityName, cityData]) => {
  if (!cityData || typeof cityData !== 'object') return;
  const region = cityData.region || 'India';

  Object.entries(cityData).forEach(([category, rows]) => {
    if (category === 'region' || !Array.isArray(rows)) return;
    rows.forEach(r => {
      if (!Array.isArray(r)) return;
      const name = r[0];
      const destId = `gem-${slug(cityName)}-${slug(name)}`;
      if (seenIds.has(destId)) return;
      seenIds.add(destId);

      unifiedDestinations.push({
        id: destId,
        name: name,
        location: r[1] || cityName,
        city: cityName,
        region: region,
        category: category,
        score: Number(r[2]) || 80,
        description: r[3] || 'A distinctive local experience.',
        coordinates: (r[4] && r[5]) ? { lat: Number(r[4]), lng: Number(r[5]) } : null,
        source: 'UnseenGo Curated Hidden-Gem Registry',
        isFamous: false,
        isHiddenGem: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  });
});

console.log(`\n✦ Prepared ${unifiedDestinations.length} total destinations to seed.`);

// 4. Run Seed against MongoDB Atlas
async function seedMongoDB() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000
  });

  try {
    console.log('\nConnecting to MongoDB Atlas Cluster0...');
    await client.connect();
    console.log('✓ Successfully connected to MongoDB Atlas!');

    const db = client.db('unseengo_ai');

    // ── 1. Seed Destinations ──
    const destCol = db.collection('destinations');
    await destCol.createIndex({ id: 1 }, { unique: true });
    await destCol.createIndex({ city: 1 });
    await destCol.createIndex({ category: 1 });
    await destCol.createIndex({ region: 1 });

    console.log('Upserting destinations...');
    const destOps = unifiedDestinations.map(d => ({
      updateOne: {
        filter: { id: d.id },
        update: { $set: d },
        upsert: true
      }
    }));

    const destResult = await destCol.bulkWrite(destOps);
    console.log(`✓ Seeded ${destResult.upsertedCount + destResult.modifiedCount} destinations into 'destinations' collection.`);

    // ── 2. Seed Cities ──
    const cityCol = db.collection('cities');
    await cityCol.createIndex({ name: 1 }, { unique: true });
    const cityNames = Object.keys(rawCities);
    const cityOps = cityNames.map(name => {
      const cityData = rawCities[name];
      const count = unifiedDestinations.filter(d => d.city === name).length;
      return {
        updateOne: {
          filter: { name },
          update: {
            $set: {
              name,
              region: cityData?.region || 'India',
              destinationCount: count,
              updatedAt: new Date()
            }
          },
          upsert: true
        }
      };
    });

    const cityResult = await cityCol.bulkWrite(cityOps);
    console.log(`✓ Seeded ${cityResult.upsertedCount + cityResult.modifiedCount} cities into 'cities' collection.`);

    // ── 3. Seed Reviews ──
    const reviewsCol = db.collection('reviews');
    await reviewsCol.createIndex({ city: 1 });
    await reviewsCol.createIndex({ createdAt: -1 });

    const sampleReviews = [
      {
        city: 'Kurnool',
        placeName: 'Gandikota Canyon & Belum Caves',
        reviewerName: 'Saravana Ganesh',
        rating: 5,
        reviewText: 'The sunrise over the Pennar river gorge in Gandikota is unmatched. Followed by the deep subterranean walk into Belum Caves, this is the ultimate hidden gem weekend trail.',
        createdAt: new Date('2026-09-15')
      },
      {
        city: 'Hampi',
        placeName: 'Vittala Temple Musical Pillars',
        reviewerName: 'Ananya Sharma',
        rating: 5,
        reviewText: 'The acoustic craftsmanship of the 56 granite pillars is unbelievable. A quiet, contemplative paradise away from commercial city bustle.',
        createdAt: new Date('2026-09-20')
      },
      {
        city: 'Varanasi',
        placeName: 'Assi Ghat Sunrise & Sarnath',
        reviewerName: 'Devendra Rao',
        rating: 5,
        reviewText: 'Taking the dawn boat on the Ganga followed by a peaceful afternoon in Sarnath Deer Park gave us a deeply spiritual experience beyond the crowded main ghats.',
        createdAt: new Date('2026-09-24')
      }
    ];

    for (const r of sampleReviews) {
      await reviewsCol.updateOne(
        { reviewerName: r.reviewerName, city: r.city },
        { $set: r },
        { upsert: true }
      );
    }
    console.log(`✓ Seeded ${sampleReviews.length} traveler reviews into 'reviews' collection.`);

    // ── 4. Summary Stats ──
    const totalDests = await destCol.countDocuments();
    const totalCities = await cityCol.countDocuments();
    const totalReviews = await reviewsCol.countDocuments();

    console.log('\n======================================================');
    console.log('✦ MongoDB Atlas Seeding Complete!');
    console.log(`  Database:     unseengo_ai`);
    console.log(`  Destinations: ${totalDests} records`);
    console.log(`  Cities:       ${totalCities} records`);
    console.log(`  Reviews:      ${totalReviews} records`);
    console.log('======================================================');

  } catch (err) {
    console.error('\n✕ MongoDB Seeding Error:', err.message);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

seedMongoDB();
