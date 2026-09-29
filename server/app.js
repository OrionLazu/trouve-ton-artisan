import express from 'express';
import { handleContactRequest } from './lib/contactHandler.js';

/**
 * Crée l'API locale utilisée en développement (le front Vite redirige /api vers ce serveur).
 */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  app.post('/api/contact', async (request, response) => {
    response.set('Cache-Control', 'no-store');

    if (!request.is('application/json')) {
      return response.status(415).json({ message: 'Format de requête non pris en charge.' });
    }

    const { status, payload } = await handleContactRequest(request.body);
    return response.status(status).json(payload);
  });

  // Toute autre route de l'API est inconnue
  app.use('/api', (request, response) => {
    response.status(404).json({ message: 'Ressource introuvable.' });
  });

  return app;
}
