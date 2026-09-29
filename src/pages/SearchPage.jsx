import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import ArtisanResults from '../components/artisans/ArtisanResults.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import useAsyncData from '../hooks/useAsyncData.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { searchArtisans } from '../services/artisanService.js';

/** Résultats de la recherche (nom, spécialité ou ville). */
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') ?? '').trim();

  const loadResults = useCallback(() => searchArtisans(query), [query]);
  const { status, data: artisans } = useAsyncData(loadResults);

  usePageMeta(
    query ? `Recherche « ${query} »` : 'Recherche',
    'Recherchez un artisan de la région Auvergne-Rhône-Alpes par nom, spécialité ou ville.',
  );

  return (
    <div className="container section">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Recherche' }]} />
      <h1 className="page-title">
        {query ? `Résultats pour « ${query} »` : 'Rechercher un artisan'}
      </h1>

      {query ? (
        <ArtisanResults
          status={status}
          artisans={artisans}
          emptyMessage="Aucun artisan ne correspond à votre recherche. Essayez avec un autre nom, une autre spécialité ou une autre ville."
        />
      ) : (
        <p>Saisissez un nom, une spécialité ou une ville dans la barre de recherche.</p>
      )}
    </div>
  );
}
