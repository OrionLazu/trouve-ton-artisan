import express from 'express';
import helmet from 'helmet';
import { handleContactRequest } from './lib/contactHandler.js';
import { isRateLimited, isSameOrigin, MAX_BODY_SIZE } from './lib/security.js';

/**
 * Crée l'API locale utilisée en développement (le front Vite redirige /api vers ce serveur).
 */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: MAX_BODY_SIZE }));

  app.post('/api/contact', async (request, response) => {
    response.set('Cache-Control', 'no-store');

    if (!request.is('application/json')) {
      return response.status(415).json({ message: 'Format de requête non pris en charge.' });
    }

    if (!isSameOrigin(request.get('origin'), request.get('host'))) {
      return response.status(403).json({ message: 'Origine de la requête non autorisée.' });
    }

    if (isRateLimited(request.ip)) {
      return response
        .status(429)
        .json({ message: 'Trop de messages envoyés. Veuillez réessayer dans quelques minutes.' });
    }

    const { status, payload } = await handleContactRequest(request.body);
    return response.status(status).json(payload);
  });

  // Toute autre route de l'API est inconnue
  app.use('/api', (request, response) => {
    response.status(404).json({ message: 'Ressource introuvable.' });
  });

  // Gestion centralisée des erreurs (JSON mal formé, corps trop volumineux…)
  app.use((error, request, response, _next) => {
    const status = error.status === 400 || error.status === 413 ? error.status : 500;
    if (status === 500) {
      console.error('[api] Erreur inattendue :', error.message);
    }
    response.status(status).json({ message: 'La requête n’a pas pu être traitée.' });
  });

  return app;
}
