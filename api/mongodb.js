import { MongoClient } from 'mongodb';
import CONFIG from './unseengo-config.js';

let cachedClient = null;
let cachedDb = null;

export async function connectToMongo() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = CONFIG.mongoUri;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured in the environment.');
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000
  });

  await client.connect();
  const db = client.db(CONFIG.mongoDbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default { connectToMongo };
