/** Indicateur de chargement annoncé aux lecteurs d'écran. */
export default function Loader() {
  return (
    <div className="loader" role="status">
      <span className="spinner-border text-primary" aria-hidden="true"></span>
      <span className="loader__text">Chargement en cours…</span>
    </div>
  );
}
