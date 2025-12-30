import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const GITHUB_PAGES_BASE = '/davidandjeannieinvite/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? GITHUB_PAGES_BASE : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
}));
