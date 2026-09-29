import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import LegalPage from './pages/LegalPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { LEGAL_PAGES } from './config/legalPages.js';

/**
 * Déclaration des routes du site.
 * Toute URL non prévue affiche la page 404 (route « * »).
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<p className="container section">Page d’accueil à venir.</p>} />
        {LEGAL_PAGES.map((page) => (
          <Route key={page.path} path={page.path} element={<LegalPage title={page.title} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
