import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let uri = process.env.MONGODB_URI;
if (!uri) {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const match = fs.readFileSync(envPath, 'utf8').match(/^MONGODB_URI=(.*)$/m);
      if (match) uri = match[1].trim();
    }
  } catch (_) {}
}

if (!uri) {
  console.error('Error: MONGODB_URI not found in environment or .env');
  process.exit(1);
}

console.log('Connecting to MongoDB Atlas Cluster0...');
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 8000
});

try {
  await client.connect();
  const db = client.db('unseengo_ai');
  const ping = await db.command({ ping: 1 });
  console.log('✓ Successfully connected to MongoDB Atlas!');
  console.log('Ping response:', ping);

  const collections = await db.listCollections().toArray();
  console.log('Collections in unseengo_ai:', collections.map(c => c.name));

  // Check stats or insert a healthcheck record
  const healthCol = db.collection('_healthcheck');
  await healthCol.insertOne({
    service: 'UnseenGo AI',
    connectedAt: new Date(),
    user: 'lsvsaravananganesh_db_user'
  });
  console.log('✓ Healthcheck document written successfully to MongoDB Atlas.');

  await healthCol.deleteMany({ service: 'UnseenGo AI' });
  console.log('✓ Temporary healthcheck document cleaned up.');

} catch (err) {
  console.error('Connection failed:', err.message);
} finally {
  await client.close();
  console.log('Connection closed.');
}
