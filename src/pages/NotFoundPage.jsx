import { Link } from 'react-router';
import usePageMeta from '../hooks/usePageMeta.js';

/** Page 404 affichée pour toute adresse inconnue. */
export default function NotFoundPage() {
  usePageMeta('Page introuvable', "La page que vous recherchez n'existe pas ou a été déplacée.");

  return (
    <section className="not-found container section" aria-labelledby="erreur-404-titre">
      <img
        src="/images/404.svg"
        alt="Illustration d’une loupe au-dessus d’une boîte à outils vide"
        width="320"
        height="240"
        className="not-found__image"
      />
      <h1 id="erreur-404-titre" className="not-found__code">
        404
      </h1>
      <p className="not-found__text">Oups ! La page que vous recherchez est introuvable.</p>
      <Link to="/" className="btn btn-primary btn-lg">
        Retour à l’accueil
      </Link>
    </section>
  );
}
