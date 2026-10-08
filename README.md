# Trouve ton artisan

Plateforme de la région **Auvergne-Rhône-Alpes** permettant aux particuliers de trouver un artisan
et de le contacter via un formulaire (réponse sous 48h).

- **Site en ligne :** <https://trouve-ton-artisan-sage.vercel.app>
- **Dépôt GitHub :** <https://github.com/OrionLazu/trouve-ton-artisan>
- **Maquettes Figma :** <https://www.figma.com/design/LGnOyKcVU0WRGVn4IzYrOo/Trouve-ton-artisan-%E2%80%93-Maquettes>

## Technologies

| Rôle | Outils |
| --- | --- |
| Front-end | React 19, React Router, Vite |
| Mise en forme | HTML5, Bootstrap 5.3, Sass |
| Envoi des e-mails | Node.js, Express, Nodemailer (fonction serverless sur Vercel) |
| E-mails de développement | maildev |
| Qualité | Oxlint |
| Versionnement / hébergement | Git, GitHub, Vercel |

## Prérequis

- [Node.js](https://nodejs.org/) **22.22 ou supérieur** (npm est fourni avec Node.js)
- [Git](https://git-scm.com/)
- Un navigateur récent

## Installation

```bash
git clone https://github.com/OrionLazu/trouve-ton-artisan.git
cd trouve-ton-artisan
npm install
```

Créez ensuite le fichier des variables d'environnement à partir de l'exemple :

```bash
cp .env.example .env
```

| Variable | Description | Valeur de développement |
| --- | --- | --- |
| `API_PORT` | Port de l'API locale | `3001` |
| `SMTP_HOST` / `SMTP_PORT` | Serveur SMTP | `localhost` / `1025` (maildev) |
| `SMTP_SECURE` | Connexion TLS | `false` |
| `SMTP_USER` / `SMTP_PASS` | Identifiants SMTP | vides |
| `MAIL_FROM` | Expéditeur des e-mails | `Trouve ton artisan <no-reply@trouve-ton-artisan.fr>` |
| `CONTACT_RECIPIENT` | Adresse qui reçoit les messages du formulaire | `artisans@trouve-ton-artisan.local` |

## Lancement en développement

```bash
npm run dev
```

Cette commande démarre en parallèle :

| Service | Adresse |
| --- | --- |
| Site (Vite) | http://localhost:5173 |
| API d'envoi des e-mails (Express) | http://localhost:3001 |
| Boîte de réception maildev | http://localhost:1080 |

Les messages envoyés depuis le formulaire de contact sont capturés par maildev : aucun artisan n'est dérangé
pendant le développement.

## Autres commandes

| Commande | Rôle |
| --- | --- |
| `npm run client` | Lance uniquement le site |
| `npm run server` | Lance uniquement l'API |
| `npm run maildev` | Lance uniquement maildev |
| `npm run build` | Génère la version de production dans `dist/` |
| `npm run preview` | Prévisualise la version de production |
| `npm run lint` | Analyse la qualité du code |

## Structure du projet

```text
├── api/contact.js          # Fonction serverless Vercel (envoi des e-mails en production)
├── public/
│   ├── data/datas.json     # Données des artisans (en attendant l'API)
│   └── images/             # Logo et illustration 404
├── server/                 # API Express locale + logique d'envoi partagée
├── shared/                 # Validation du formulaire (client et serveur)
└── src/
    ├── components/         # Composants réutilisables (layout, cartes, formulaire…)
    ├── config/             # Catégories, pages légales, informations du site
    ├── hooks/              # Chargement asynchrone et métadonnées SEO
    ├── pages/              # Pages associées aux routes
    ├── services/           # Accès aux données (AJAX) et envoi du formulaire
    └── styles/             # Sass : variables, Bootstrap et styles par composant
```

## Pages et routes

| Route | Page |
| --- | --- |
| `/` | Accueil (« Comment trouver mon artisan ? » et artisans du mois) |
| `/categorie/batiment`, `/services`, `/fabrication`, `/alimentation` | Artisans d'une catégorie |
| `/recherche?q=…` | Résultats de recherche (nom, spécialité, ville) |
| `/artisan/:id` | Fiche artisan et formulaire de contact |
| `/mentions-legales`, `/donnees-personnelles`, `/accessibilite`, `/cookies` | Pages légales (vides) |
| toute autre adresse | Page 404 |

## Déploiement sur Vercel

Le site est déployé à l'adresse <https://trouve-ton-artisan-sage.vercel.app>.

Pour reproduire le déploiement :

1. Importer le dépôt GitHub sur [vercel.com](https://vercel.com) (préréglage **Vite** détecté automatiquement).
2. Renseigner les variables d'environnement `SMTP_*`, `MAIL_FROM` et `CONTACT_RECIPIENT` dans
   **Settings → Environment Variables**, pour les environnements *Production* et *Preview*.
3. Déployer après chaque fusion sur la branche `main`.

Le fichier `vercel.json` redirige toutes les routes vers React Router (page 404 incluse) et ajoute les en-têtes de sécurité HTTP.

En production, les messages du formulaire sont expédiés vers une **boîte e-mail de test** : aucun artisan n'est
contacté tant que le site n'est pas raccordé à un service d'envoi réel.

## Workflow Git

- `main` : version en production, **aucun commit direct**
- `develop` : branche d'intégration
- `feature/…` : une branche par fonctionnalité, liée à une issue GitHub

Chaque fonctionnalité fait l'objet d'une **pull request** vers `develop`, puis `develop` est fusionnée dans `main`
par pull request.
