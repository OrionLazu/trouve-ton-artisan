import ArtisanList from '../artisans/ArtisanList.jsx';
import Loader from '../ui/Loader.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import useAsyncData from '../../hooks/useAsyncData.js';
import { getTopArtisans } from '../../services/artisanService.js';

/** Rubrique des trois artisans du mois. */
export default function TopArtisans() {
  const { status, data: artisans } = useAsyncData(getTopArtisans);

  return (
    <section className="section section--light" aria-labelledby="artisans-du-mois-titre">
      <div className="container">
        <h2 id="artisans-du-mois-titre" className="section-title">
          Les artisans du mois
        </h2>

        {status === 'loading' && <Loader />}

        {status === 'error' && (
          <ErrorMessage>Impossible de charger les artisans du mois pour le moment.</ErrorMessage>
        )}

        {status === 'success' && artisans.length > 0 && <ArtisanList artisans={artisans} headingLevel={3} />}

        {status === 'success' && artisans.length === 0 && (
          <p>Aucun artisan n'est mis en avant ce mois-ci.</p>
        )}
      </div>
    </section>
  );
}
