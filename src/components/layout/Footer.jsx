import { Link } from 'react-router';
import { LEGAL_PAGES } from '../../config/legalPages.js';

/** Pied de page identique sur toutes les pages. */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <h2 className="site-footer__title">Antenne de Lyon</h2>
            <address className="site-footer__address">
              101 cours Charlemagne
              <br />
              CS 20033
              <br />
              69269 LYON CEDEX 02
              <br />
              France
              <br />
              <a href="tel:+33426734000">+33 (0)4 26 73 40 00</a>
            </address>
          </div>

          <nav className="col-12 col-md-6" aria-label="Pages légales">
            <h2 className="site-footer__title">Informations légales</h2>
            <ul className="site-footer__links list-unstyled">
              {LEGAL_PAGES.map((page) => (
                <li key={page.path}>
                  <Link to={`/${page.path}`}>{page.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="site-footer__copyright">© {currentYear} Région Auvergne-Rhône-Alpes</p>
      </div>
    </footer>
  );
}
