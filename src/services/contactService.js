/** Point d'entrée de l'API d'envoi des messages. */
const CONTACT_ENDPOINT = '/api/contact';

/** Délai maximal d'attente de la réponse du serveur (en millisecondes). */
const REQUEST_TIMEOUT = 15000;

const DEFAULT_ERROR_MESSAGE = "L'envoi du message a échoué. Veuillez réessayer plus tard.";

/**
 * Envoie le message du formulaire de contact au serveur, qui se charge d'expédier l'e-mail.
 * @param {{ artisanId: string, name: string, email: string, subject: string, message: string, fax: string }} payload
 * @throws {Error & { fieldErrors?: Record<string, string> }}
 */
export async function sendContactMessage(payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok) {
      const error = new Error(typeof body?.message === 'string' ? body.message : DEFAULT_ERROR_MESSAGE);
      error.fieldErrors = body?.errors;
      throw error;
    }

    return body;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Le serveur met trop de temps à répondre. Veuillez réessayer plus tard.');
    }
    if (error instanceof TypeError) {
      // Erreur réseau (serveur injoignable, connexion coupée…)
      throw new Error(DEFAULT_ERROR_MESSAGE);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
