import { createRequire } from 'node:module';
import { validateContact } from '../../shared/contactValidation.js';
import { sendMail } from './mailer.js';

// Les données sont lues côté serveur : l'adresse de l'artisan n'est jamais fournie par le navigateur
const require = createRequire(import.meta.url);
const artisans = require('../../public/data/datas.json');

const ARTISAN_ID_PATTERN = /^\d{1,10}$/;

const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Échappe le HTML pour empêcher toute injection dans le corps de l'e-mail. */
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

/**
 * Traite une demande de contact, indépendamment du serveur utilisé (Express ou Vercel).
 * @param {unknown} body Corps JSON de la requête
 * @returns {Promise<{ status: number, payload: { message: string, errors?: Record<string, string> } }>}
 */
export async function handleContactRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { status: 400, payload: { message: 'Requête invalide.' } };
  }

  // Pot de miel rempli : il s'agit d'un robot, on simule un succès sans rien envoyer
  if (typeof body.fax === 'string' && body.fax.trim() !== '') {
    return { status: 200, payload: { message: 'Message envoyé.' } };
  }

  const artisanId = typeof body.artisanId === 'string' ? body.artisanId : '';
  const artisan = ARTISAN_ID_PATTERN.test(artisanId)
    ? artisans.find((item) => String(item.id) === artisanId)
    : undefined;

  if (!artisan) {
    return { status: 404, payload: { message: "L'artisan demandé est introuvable." } };
  }

  const { data, errors, isValid } = validateContact(body);
  if (!isValid) {
    return { status: 422, payload: { message: 'Certains champs du formulaire sont invalides.', errors } };
  }

  // Adresse définie dans l'environnement (ex. boîte maildev en développement), sinon celle de l'artisan
  const recipient = process.env.CONTACT_RECIPIENT?.trim() || artisan.email;

  try {
    await sendMail({
      to: recipient,
      replyTo: { name: data.name, address: data.email },
      subject: `[Trouve ton artisan] ${data.subject}`,
      text: [
        `Bonjour ${artisan.name},`,
        '',
        'Vous avez reçu un nouveau message via la plateforme Trouve ton artisan.',
        '',
        `Nom : ${data.name}`,
        `E-mail : ${data.email}`,
        `Objet : ${data.subject}`,
        '',
        data.message,
      ].join('\n'),
      html: `
        <p>Bonjour ${escapeHtml(artisan.name)},</p>
        <p>Vous avez reçu un nouveau message via la plateforme <strong>Trouve ton artisan</strong>.</p>
        <ul>
          <li><strong>Nom :</strong> ${escapeHtml(data.name)}</li>
          <li><strong>E-mail :</strong> ${escapeHtml(data.email)}</li>
          <li><strong>Objet :</strong> ${escapeHtml(data.subject)}</li>
        </ul>
        <p>${escapeHtml(data.message).replace(/\r?\n/g, '<br>')}</p>
      `,
    });
  } catch (error) {
    // Le détail technique reste dans les journaux du serveur, jamais renvoyé au client
    console.error("[contact] Échec de l'envoi de l'e-mail :", error.message);
    return {
      status: 502,
      payload: { message: "L'envoi du message a échoué. Veuillez réessayer plus tard." },
    };
  }

  return { status: 200, payload: { message: 'Message envoyé.' } };
}
