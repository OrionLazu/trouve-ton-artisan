import nodemailer from 'nodemailer';

/** Transporteur SMTP créé à la première utilisation puis réutilisé. */
let transporter = null;

/**
 * Configure le transporteur à partir des variables d'environnement.
 * En développement, les e-mails sont capturés par maildev (localhost:1025).
 */
function getTransporter() {
  if (!transporter) {
    const user = process.env.SMTP_USER;

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number.parseInt(process.env.SMTP_PORT || '1025', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: user ? { user, pass: process.env.SMTP_PASS } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return transporter;
}

/**
 * Envoie un e-mail avec l'expéditeur défini dans l'environnement.
 * @param {import('nodemailer').SendMailOptions} options
 */
export function sendMail(options) {
  return getTransporter().sendMail({
    from: process.env.MAIL_FROM || 'Trouve ton artisan <no-reply@trouve-ton-artisan.fr>',
    ...options,
  });
}
