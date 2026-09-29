import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

/**
 * Structure commune à toutes les pages : lien d'évitement, en-tête, contenu et pied de page.
 */
export default function Layout() {
  const { pathname, search } = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);

  // À chaque changement de page : retour en haut et focus sur le contenu (lecteurs d'écran)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, search]);

  return (
    <>
      <a href="#contenu" className="skip-link visually-hidden-focusable">
        Aller au contenu principal
      </a>
      <Header />
      <main id="contenu" ref={mainRef} tabIndex={-1} className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
