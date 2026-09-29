import { StarIcon } from './Icons.jsx';

const MAX_STARS = 5;

const noteFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

/**
 * Détermine le remplissage de chaque étoile : la note est arrondie à la demi-étoile.
 * Exemple : 3,8 → 4 étoiles pleines ; 4,2 → 4 pleines ; 4,5 → 4 pleines et une demie.
 * @param {number} note
 * @returns {('full' | 'half' | 'empty')[]}
 */
function getStarTypes(note) {
  const roundedNote = Math.round(note * 2) / 2;
  const types = [];

  for (let position = 1; position <= MAX_STARS; position += 1) {
    if (roundedNote >= position) {
      types.push('full');
    } else if (roundedNote >= position - 0.5) {
      types.push('half');
    } else {
      types.push('empty');
    }
  }

  return types;
}

/**
 * Note sur cinq représentée par des étoiles, avec un équivalent textuel.
 * @param {{ note: number }} props
 */
export default function StarRating({ note }) {
  const formattedNote = noteFormatter.format(note);

  return (
    <p className="star-rating">
      <span className="star-rating__stars" aria-hidden="true">
        {getStarTypes(note).map((type, index) => (
          <span key={index} className={`star star--${type}`}>
            <span className="star__empty">
              <StarIcon />
            </span>
            <span className="star__fill">
              <StarIcon />
            </span>
          </span>
        ))}
      </span>
      <span className="star-rating__value">
        <span className="visually-hidden">Note : </span>
        {formattedNote}
        <span aria-hidden="true">/5</span>
        <span className="visually-hidden"> sur 5</span>
      </span>
    </p>
  );
}
