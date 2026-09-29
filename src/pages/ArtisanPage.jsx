import { useCallback } from 'react';
import { useParams } from 'react-router';
import ContactForm from '../components/contact/ContactForm.jsx';
import Breadcrumb from '../components/ui/Breadcrumb.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import Loader from '../components/ui/Loader.jsx';
import StarRating from '../components/ui/StarRating.jsx';
import { GlobeIcon, LocationIcon, ToolIcon } from '../components/ui/Icons.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import useAsyncData from '../hooks/useAsyncData.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { findCategoryByLabel } from '../config/categories.js';
import { getArtisanById } from '../services/artisanService.js';

/** Fiche complète d'un artisan avec son formulaire de contact. */
export default function ArtisanPage() {
  const { id } = useParams();

  const loadArtisan = useCallback(() => getArtisanById(id), [id]);
  const { status, data: artisan } = useAsyncData(loadArtisan);
  const isNotFound = status === 'success' && !artisan;

  let pageTitle = 'Fiche artisan';
  let pageDescription;
  if (isNotFound) {
    pageTitle = null;
  } else if (artisan) {
    pageTitle = `${artisan.name}, ${artisan.specialty} à ${artisan.location}`;
    pageDescription = `Contactez ${artisan.name}, ${artisan.specialty.toLowerCase()} à ${artisan.location}, via le formulaire en ligne. Réponse sous 48h.`;
  }
  usePageMeta(pageTitle, pageDescription);

  if (status === 'loading') {
    return (
      <div className="container section">
        <Loader />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container section">
        <ErrorMessage>Impossible de charger la fiche de cet artisan pour le moment. Veuillez réessayer plus tard.</ErrorMessage>
      </div>
    );
  }

  // Identifiant inconnu : page 404
  if (isNotFound) {
    return <NotFoundPage />;
  }

  const category = findCategoryByLabel(artisan.category);
  const breadcrumbItems = [{ label: 'Accueil', to: '/' }];
  if (category) {
    breadcrumbItems.push({ label: category.label, to: `/categorie/${category.slug}` });
  }
  breadcrumbItems.push({ label: artisan.name });

  return (
    <article>
      <header className="artisan-hero">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="artisan-hero__name">{artisan.name}</h1>
          <StarRating note={artisan.note} />
          <ul className="artisan-hero__details list-unstyled">
            <li>
              <ToolIcon />
              <span className="visually-hidden">Spécialité : </span>
              {artisan.specialty}
            </li>
            <li>
              <LocationIcon />
              <span className="visually-hidden">Localisation : </span>
              {artisan.location}
            </li>
            {artisan.website && (
              <li>
                <GlobeIcon />
                <a href={artisan.website} target="_blank" rel="noopener noreferrer">
                  Site web : {new URL(artisan.website).hostname}
                  <span className="visually-hidden"> (s’ouvre dans un nouvel onglet)</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </header>

      <div className="container section">
        <div className="row g-5">
          <section className="col-12 col-lg-5" aria-labelledby="a-propos-titre">
            <h2 id="a-propos-titre" className="section-title">
              À propos
            </h2>
            <p className="artisan-about">{artisan.about}</p>
          </section>

          <section className="col-12 col-lg-7" aria-labelledby="contact-titre">
            <h2 id="contact-titre" className="section-title">
              Contacter {artisan.name}
            </h2>
            <ContactForm artisanId={artisan.id} artisanName={artisan.name} />
          </section>
        </div>
      </div>
    </article>
  );
}
