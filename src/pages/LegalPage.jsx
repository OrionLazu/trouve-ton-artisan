import usePageMeta from '../hooks/usePageMeta.js';

/**
 * Page légale volontairement vide : son contenu sera rédigé par un cabinet spécialisé.
 * @param {{ title: string }} props
 */
export default function LegalPage({ title }) {
  usePageMeta(title, `${title} du site Trouve ton artisan de la région Auvergne-Rhône-Alpes.`);

  return (
    <div className="container section">
      <h1 className="page-title">{title}</h1>
    </div>
  );
}
