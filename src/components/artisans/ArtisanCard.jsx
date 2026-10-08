import { Link } from 'react-router';
import StarRating from '../ui/StarRating.jsx';
import { LocationIcon, ToolIcon } from '../ui/Icons.jsx';

/**
 * Fiche résumée d'un artisan, entièrement cliquable vers sa fiche complète.
 * @param {{ artisan: { id: string, name: string, note: number, specialty: string, location: string }, headingLevel?: 2 | 3 }} props
 */
export default function ArtisanCard({ artisan, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;

  return (
    <article className="artisan-card card h-100">
      <div className="card-body">
        <Heading className="artisan-card__name">
          <Link to={`/artisan/${encodeURIComponent(artisan.id)}`} className="stretched-link">
            {artisan.name}
          </Link>
        </Heading>
        <StarRating note={artisan.note} />
        <p className="artisan-card__detail">
          <ToolIcon />
          <span className="visually-hidden">Spécialité : </span>
          {artisan.specialty}
        </p>
        <p className="artisan-card__detail">
          <LocationIcon />
          <span className="visually-hidden">Localisation : </span>
          {artisan.location}
        </p>
      </div>
    </article>
  );
}
