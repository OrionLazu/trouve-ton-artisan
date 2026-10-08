import { createApp } from './app.js';

// API_PORT (et non PORT) pour ne pas entrer en conflit avec le port du serveur Vite
const PORT = Number.parseInt(process.env.API_PORT || '3001', 10);

createApp().listen(PORT, () => {
  console.info(`API de contact démarrée sur http://localhost:${PORT}`);
});
