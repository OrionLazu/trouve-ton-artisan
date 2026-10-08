import HowItWorks from '../components/home/HowItWorks.jsx';
import TopArtisans from '../components/home/TopArtisans.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

/** Page d'accueil. */
export default function HomePage() {
  usePageMeta(undefined);

  return (
    <>
      <section className="hero" aria-labelledby="accueil-titre">
        <div className="container">
          <h1 id="accueil-titre" className="hero__title">
            Trouvez l’artisan qu’il vous faut, près de chez vous
          </h1>
          <p className="hero__lead">
            Plombier, boulanger, menuisier ou fleuriste : la région Auvergne-Rhône-Alpes vous met en relation avec
            les artisans de son territoire.
          </p>
        </div>
      </section>

      <HowItWorks />
      <TopArtisans />
    </>
  );
}
