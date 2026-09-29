import { Route, Routes } from 'react-router';

/** Routage provisoire : les pages sont ajoutées au fur et à mesure du projet. */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<p className="container section">Site en cours de construction.</p>} />
    </Routes>
  );
}
