import { useCallback } from 'react';
import { useParams } from 'react-router';
import ArtisanResults from '../components/artisans/ArtisanResults.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import useAsyncData from '../hooks/useAsyncData.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { findCategoryBySlug } from '../config/categories.js';
import { getArtisansByCategory } from '../services/artisanService.js';

/** Liste des artisans d'une catégorie (Bâtiment, Services, Fabrication, Alimentation). */
export default function CategoryPage() {
  const { slug } = useParams();
  const category = findCategoryBySlug(slug);

  const loadArtisans = useCallback(
    () => (category ? getArtisansByCategory(category.label) : Promise.resolve([])),
    [category],
  );
  const { status, data: artisans } = useAsyncData(loadArtisans);

  usePageMeta(
    category ? `Artisans – ${category.label}` : null,
    category
      ? `Découvrez les artisans de la catégorie ${category.label} en Auvergne-Rhône-Alpes et contactez-les en ligne.`
      : undefined,
  );

  // Catégorie inconnue : page 404
  if (!category) {
    return <NotFoundPage />;
  }

  return (
    <div className="container section">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: category.label }]} />
      <h1 className="page-title">Artisans – {category.label}</h1>
      <ArtisanResults
        status={status}
        artisans={artisans}
        emptyMessage="Aucun artisan n'est encore référencé dans cette catégorie."
      />
    </div>
  );
}
