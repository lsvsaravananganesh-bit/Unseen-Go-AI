import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [tailwindcss()],
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
        'connect-travel': resolve(__dirname, 'connect-travel.html')
      }
    }
  }
});
