import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Redirection des appels /api vers le serveur Express local (voir server/index.js). */
const apiProxy = {
  '/api': {
    target: 'http://localhost:3001',
    // L'en-tête Host d'origine est conservé pour la vérification de l'origine côté serveur
    changeOrigin: false,
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 utilise encore @import : on masque les avertissements liés au framework
        quietDeps: true,
        silenceDeprecations: ['import'],
      },
    },
  },
});
