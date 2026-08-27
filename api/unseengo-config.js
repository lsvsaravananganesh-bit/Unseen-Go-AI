/* Server-side provider configuration. Values come from deployment environment variables. */
module.exports = {
  weatherBaseUrl: process.env.WEATHER_BASE_URL || 'https://api.open-meteo.com/v1/forecast',
  placesApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
};
