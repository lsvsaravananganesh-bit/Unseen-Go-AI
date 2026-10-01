/* Server-side provider configuration. Values come from deployment environment variables or local .env */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEnvVar(key, fallback = '') {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
      if (match) return match[1].trim();
    }
  } catch (_) {}
  return fallback;
}

const CONFIG = {
  weatherBaseUrl: getEnvVar('WEATHER_BASE_URL', 'https://api.open-meteo.com/v1/forecast'),
  placesApiKey: getEnvVar('GOOGLE_MAPS_API_KEY', ''),
  geminiApiKey: getEnvVar('GEMINI_API_KEY', ''),
  supabaseUrl: getEnvVar('SUPABASE_URL', 'https://jpqbvliaaucyqnhcclbz.supabase.co'),
  supabaseServiceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''),
  mongoUri: getEnvVar('MONGODB_URI', ''),
  mongoDbName: getEnvVar('MONGODB_DB_NAME', 'unseengo_ai')
};

export { CONFIG };
export default CONFIG;
