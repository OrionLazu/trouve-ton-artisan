import { normalizeText } from '../utils/text.js';

/** Source des données. Sera remplacée par l'URL de l'API une fois celle-ci livrée. */
const DATA_URL = '/data/datas.json';

/** Nombre d'artisans mis en avant sur la page d'accueil. */
const TOP_ARTISANS_LIMIT = 3;

/** Promesse mise en cache pour ne télécharger les données qu'une seule fois. */
let artisansPromise = null;

/**
 * Accepte uniquement les liens http(s) pour éviter les URL dangereuses (javascript:, data:…).
 * @param {unknown} value
 * @returns {string} URL valide ou chaîne vide
 */
function toSafeUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return '';

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

/**
 * Transforme une entrée brute en objet fiable (programmation défensive).
 * L'adresse e-mail n'est volontairement pas conservée côté client.
 * @param {Record<string, unknown>} raw
 */
function toArtisan(raw) {
  const note = Number.parseFloat(raw.note);

  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    specialty: String(raw.specialty ?? ''),
    note: Number.isFinite(note) ? Math.min(Math.max(note, 0), 5) : 0,
    location: String(raw.location ?? ''),
    about: String(raw.about ?? '').trim(),
    website: toSafeUrl(raw.website),
    category: String(raw.category ?? ''),
    top: raw.top === true,
  };
}

/**
 * Récupère la liste complète des artisans de manière asynchrone.
 * @returns {Promise<ReturnType<typeof toArtisan>[]>}
 */
export function getArtisans() {
  if (!artisansPromise) {
    artisansPromise = fetch(DATA_URL, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Format de données inattendu');
        }
        return data
          .filter((item) => item && typeof item === 'object' && item.id !== undefined)
          .map(toArtisan);
      })
      .catch((error) => {
        // En cas d'échec, on vide le cache pour permettre une nouvelle tentative
        artisansPromise = null;
        throw error;
      });
  }

  return artisansPromise;
}

/** Artisans du mois (propriété `top`). */
export async function getTopArtisans() {
  const artisans = await getArtisans();
  return artisans.filter((artisan) => artisan.top).slice(0, TOP_ARTISANS_LIMIT);
}

/**
 * Artisans d'une catégorie donnée.
 * @param {string} categoryLabel Libellé de la catégorie (ex. « Bâtiment »)
 */
export async function getArtisansByCategory(categoryLabel) {
  const artisans = await getArtisans();
  const expectedCategory = normalizeText(categoryLabel);
  return artisans.filter((artisan) => normalizeText(artisan.category) === expectedCategory);
}

/**
 * Recherche d'artisans dans le nom, la spécialité et la ville uniquement.
 * Chaque mot saisi doit être présent dans l'un de ces trois champs.
 * @param {string} query
 */
export async function searchArtisans(query) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const artisans = await getArtisans();

  return artisans.filter((artisan) => {
    const searchableText = normalizeText(`${artisan.name} ${artisan.specialty} ${artisan.location}`);
    return terms.every((term) => searchableText.includes(term));
  });
}

/**
 * Récupère un artisan par son identifiant.
 * @param {string | undefined} id
 * @returns {Promise<ReturnType<typeof toArtisan> | null>}
 */
export async function getArtisanById(id) {
  const artisans = await getArtisans();
  return artisans.find((artisan) => artisan.id === id) ?? null;
}
