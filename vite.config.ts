import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: '[folder]__[local]--[hash:base64:5]',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.eco-track.site/api/v1',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
});
