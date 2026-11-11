import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repo at /my-portfolio/. Change if the repo is renamed.
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/my-portfolio/',
  plugins: [react()],
  build: { target: 'es2022' },
});
