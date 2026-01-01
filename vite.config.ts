import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const GITHUB_PAGES_BASE = '/davidandjeannieinvite/';
const LAUNCH_SITE = process.env.LAUNCH_SITE ?? 'true';
const PREVIEW_KEY = process.env.PREVIEW_KEY ?? '';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? GITHUB_PAGES_BASE : '/',
  plugins: [react()],
  define: {
    'import.meta.env.LAUNCH_SITE': JSON.stringify(LAUNCH_SITE),
    'import.meta.env.PREVIEW_KEY': JSON.stringify(PREVIEW_KEY),
  },
  server: {
    host: '0.0.0.0',
  },
}));
