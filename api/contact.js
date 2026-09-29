import { handleContactRequest } from '../server/lib/contactHandler.js';
import { isRateLimited, isSameOrigin, MAX_BODY_SIZE } from '../server/lib/security.js';

/**
 * Fonction serverless Vercel : même traitement que l'API Express locale.
 * @param {import('http').IncomingMessage & { body: unknown }} request
 * @param {import('http').ServerResponse & { status: Function, json: Function }} response
 */
export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Méthode non autorisée.' });
  }

  if (!String(request.headers['content-type'] ?? '').includes('application/json')) {
    return response.status(415).json({ message: 'Format de requête non pris en charge.' });
  }

  if (Number(request.headers['content-length'] ?? 0) > MAX_BODY_SIZE) {
    return response.status(413).json({ message: 'Requête trop volumineuse.' });
  }

  if (!isSameOrigin(request.headers.origin, request.headers.host)) {
    return response.status(403).json({ message: 'Origine de la requête non autorisée.' });
  }

  // Vercel transmet l'adresse IP réelle du visiteur dans x-forwarded-for
  const ip = String(request.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'inconnue';
  if (isRateLimited(ip)) {
    return response
      .status(429)
      .json({ message: 'Trop de messages envoyés. Veuillez réessayer dans quelques minutes.' });
  }

  const { status, payload } = await handleContactRequest(request.body);
  return response.status(status).json(payload);
}
