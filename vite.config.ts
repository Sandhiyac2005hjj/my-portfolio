import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repo at /my-portfolio/. Change if the repo is renamed.
export default defineConfig({
  base: '/my-portfolio/',
  plugins: [react()],
  build: { target: 'es2022' },
});
