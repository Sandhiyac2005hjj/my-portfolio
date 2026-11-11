   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   declare const process: { env: Record<string, string | undefined> };

   export default defineConfig({
     base: process.env.VERCEL ? '/' : '/my-portfolio/',
     plugins: [react()],
     build: { target: 'es2022' },
   });
