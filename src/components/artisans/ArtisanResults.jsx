import ArtisanList from './ArtisanList.jsx';
import Loader from '../ui/Loader.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';

/**
 * Affiche l'état d'une liste d'artisans : chargement, erreur, aucun résultat ou résultats.
 * @param {{ status: 'loading' | 'success' | 'error', artisans: object[] | null, emptyMessage: string }} props
 */
export default function ArtisanResults({ status, artisans, emptyMessage }) {
  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'error') {
    return <ErrorMessage>Impossible de charger les artisans pour le moment. Veuillez réessayer plus tard.</ErrorMessage>;
  }

  if (!artisans || artisans.length === 0) {
    return (
      <p className="alert alert-info" role="status">
        {emptyMessage}
      </p>
    );
  }

  const plural = artisans.length > 1 ? 's' : '';

  return (
    <>
      <p className="results-count" role="status">
        {artisans.length} artisan{plural} trouvé{plural}
      </p>
      <ArtisanList artisans={artisans} headingLevel={2} />
    </>
  );
}
