/** Étapes de fonctionnement du site, affichées dans l'ordre. */
const STEPS = [
  "Choisir la catégorie d'artisanat dans le menu.",
  'Choisir un artisan.',
  'Le contacter via le formulaire de contact.',
  'Une réponse sera apportée sous 48h.',
];

/** Rubrique « Comment trouver mon artisan ? » de la page d'accueil. */
export default function HowItWorks() {
  return (
    <section className="section" aria-labelledby="comment-trouver-titre">
      <div className="container">
        <h2 id="comment-trouver-titre" className="section-title">
          Comment trouver mon artisan ?
        </h2>
        <ol className="steps row g-4 list-unstyled">
          {STEPS.map((step, index) => (
            <li key={step} className="col-12 col-md-6 col-lg-3">
              <div className="step">
                <span className="step__number">
                  <span className="visually-hidden">Étape </span>
                  {index + 1}
                </span>
                <p className="step__text">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
