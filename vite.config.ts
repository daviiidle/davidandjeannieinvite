import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const previewKey = env.PREVIEW_KEY ?? '';
  const shouldLogPreview = command === 'serve' && mode !== 'production' && previewKey;

  return {
    base: '/',
    plugins: [
      react(),
      {
        name: 'preview-key-log',
        configureServer(server) {
          if (!shouldLogPreview) return;
          server.httpServer?.once('listening', () => {
            const address = server.httpServer?.address();
            if (!address || typeof address === 'string') return;
            const previewUrl = `http://localhost:${address.port}/?preview=${previewKey}`;
            console.info(`Preview URL: ${previewUrl}`);
          });
        },
      },
    ],
    define: {
      'import.meta.env.PREVIEW_KEY': JSON.stringify(previewKey),
    },
    server: {
      host: '0.0.0.0',
    },
  };
});
