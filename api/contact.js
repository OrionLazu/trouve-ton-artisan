import { handleContactRequest } from '../server/lib/contactHandler.js';

/**
 * Fonction serverless Vercel : même traitement que l'API Express locale.
 * @param {import('http').IncomingMessage & { body: unknown }} request
 * @param {import('http').ServerResponse & { status: Function, json: Function }} response
 */
export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Méthode non autorisée.' });
  }

  if (!String(request.headers['content-type'] ?? '').includes('application/json')) {
    return response.status(415).json({ message: 'Format de requête non pris en charge.' });
  }

  const { status, payload } = await handleContactRequest(request.body);
  return response.status(status).json(payload);
}
