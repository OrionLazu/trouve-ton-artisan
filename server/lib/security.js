/** Nombre maximal de messages par adresse IP sur la fenêtre de temps. */
const RATE_LIMIT_MAX = 5;

/** Fenêtre de limitation : 15 minutes. */
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Taille maximale acceptée pour le corps de la requête (10 Ko). */
export const MAX_BODY_SIZE = 10 * 1024;

const requestsByIp = new Map();

/**
 * Limite le nombre d'envois par adresse IP (protection contre le spam et les abus).
 * @param {string} ip
 * @returns {boolean} `true` si la limite est dépassée
 */
export function isRateLimited(ip) {
  const now = Date.now();

  // Nettoyage des entrées expirées pour ne pas saturer la mémoire
  if (requestsByIp.size > 1000) {
    for (const [key, entry] of requestsByIp) {
      if (now > entry.resetAt) requestsByIp.delete(key);
    }
  }

  const entry = requestsByIp.get(ip);
  if (!entry || now > entry.resetAt) {
    requestsByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

/**
 * Vérifie que la requête provient bien du site lui-même (protection CSRF).
 * @param {string | undefined} origin En-tête Origin envoyé par le navigateur
 * @param {string | undefined} host En-tête Host de la requête
 */
export function isSameOrigin(origin, host) {
  if (!origin) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
