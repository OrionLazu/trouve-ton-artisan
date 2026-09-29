import ArtisanCard from './ArtisanCard.jsx';

/**
 * Grille responsive de fiches artisans (1 colonne sur mobile, 2 sur tablette, 3 sur ordinateur).
 * @param {{ artisans: object[], headingLevel?: 2 | 3 }} props
 */
export default function ArtisanList({ artisans, headingLevel = 2 }) {
  return (
    <ul className="artisan-list row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 list-unstyled">
      {artisans.map((artisan) => (
        <li key={artisan.id} className="col">
          <ArtisanCard artisan={artisan} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
