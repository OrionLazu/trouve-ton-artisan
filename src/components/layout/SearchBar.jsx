import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { SearchIcon } from '../ui/Icons.jsx';

const MAX_QUERY_LENGTH = 100;

/**
 * Barre de recherche : redirige vers la page de résultats (recherche par nom, spécialité et ville).
 * @param {{ onSearch?: () => void }} props
 */
export default function SearchBar({ onSearch }) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedQuery = query.trim().slice(0, MAX_QUERY_LENGTH);
    if (trimmedQuery === '') return;

    navigate(`/recherche?q=${encodeURIComponent(trimmedQuery)}`);
    onSearch?.();
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <label htmlFor="recherche-artisan" className="visually-hidden">
        Rechercher un artisan par nom, spécialité ou ville
      </label>
      <div className="input-group">
        <input
          id="recherche-artisan"
          type="search"
          name="q"
          className="form-control"
          placeholder="Nom, spécialité, ville…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={MAX_QUERY_LENGTH}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary">
          <SearchIcon />
          <span className="visually-hidden">Lancer la recherche</span>
        </button>
      </div>
    </form>
  );
}
