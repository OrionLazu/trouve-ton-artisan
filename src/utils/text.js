/**
 * Normalise un texte pour les comparaisons : minuscules, sans accents
 * et sans espaces superflus (« Chambéry » devient « chambery »).
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
