import { normalizeText } from '../utils/text.js';

/** Catégories d'artisanat affichées dans le menu principal. */
export const CATEGORIES = Object.freeze([
  { slug: 'batiment', label: 'Bâtiment' },
  { slug: 'services', label: 'Services' },
  { slug: 'fabrication', label: 'Fabrication' },
  { slug: 'alimentation', label: 'Alimentation' },
]);

/**
 * Retrouve une catégorie à partir de son identifiant d'URL.
 * @param {string | undefined} slug
 */
export function findCategoryBySlug(slug) {
  return CATEGORIES.find((category) => category.slug === slug);
}

/**
 * Retrouve une catégorie à partir de son libellé (insensible aux accents).
 * @param {string | undefined} label
 */
export function findCategoryByLabel(label) {
  const normalizedLabel = normalizeText(label);
  return CATEGORIES.find((category) => normalizeText(category.label) === normalizedLabel);
}
