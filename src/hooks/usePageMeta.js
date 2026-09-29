import { useEffect } from 'react';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME } from '../config/site.js';

/**
 * Met à jour le titre de l'onglet et la méta description de la page
 * (référencement) sans dupliquer les balises présentes dans index.html.
 *
 * @param {string | null | undefined} title Titre de la page ; `null` laisse
 *   un composant enfant (ex. page 404) définir lui-même les métadonnées.
 * @param {string} [description]
 */
export default function usePageMeta(title, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    if (title === null) return;

    document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
}
