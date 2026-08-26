import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tailwindcss()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        discover: resolve(__dirname, 'discover.html'),
        planner: resolve(__dirname, 'planner.html'),
        stay: resolve(__dirname, 'stay.html'),
        transport: resolve(__dirname, 'transport.html'),
        tripideas: resolve(__dirname, 'tripideas.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html')
      }
    }
  }
});
