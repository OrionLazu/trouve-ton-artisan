import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import SearchBar from './SearchBar.jsx';
import { CATEGORIES } from '../../config/categories.js';

/** En-tête présent sur toutes les pages : logo, menu des catégories et recherche. */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg" aria-label="Navigation principale">
        <div className="container">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <img
              src="/images/logo.png"
              alt="Trouve ton artisan ! Avec la région Auvergne-Rhône-Alpes – Retour à l’accueil"
              width="480"
              height="108"
              className="site-header__logo"
            />
          </Link>

          {/* Bouton du menu mobile : l'état ouvert/fermé est géré par React */}
          <button
            type="button"
            className="navbar-toggler"
            aria-controls="menu-principal"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <span className="navbar-toggler-icon" aria-hidden="true"></span>
            <span className="visually-hidden">{isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
          </button>

          <div id="menu-principal" className={`collapse navbar-collapse${isMenuOpen ? ' show' : ''}`}>
            <ul className="navbar-nav">
              {CATEGORIES.map((category) => (
                <li key={category.slug} className="nav-item">
                  <NavLink to={`/categorie/${category.slug}`} className="nav-link" onClick={closeMenu}>
                    {category.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <SearchBar onSearch={closeMenu} />
          </div>
        </div>
      </nav>
    </header>
  );
}
