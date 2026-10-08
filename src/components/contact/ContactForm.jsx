import { useId, useRef, useState } from 'react';
import { CONTACT_LIMITS, validateContact } from '../../../shared/contactValidation.js';
import { sendContactMessage } from '../../services/contactService.js';

const INITIAL_VALUES = { name: '', email: '', subject: '', message: '', fax: '' };

/** Champs visibles du formulaire, dans l'ordre d'affichage. */
const FIELDS = [
  { name: 'name', label: 'Nom', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Adresse e-mail', type: 'email', autoComplete: 'email' },
  { name: 'subject', label: 'Objet', type: 'text', autoComplete: 'off' },
  { name: 'message', label: 'Message', type: 'textarea', autoComplete: 'off' },
];

/**
 * Formulaire de contact d'un artisan.
 * Le message est transmis au serveur à la soumission, qui envoie l'e-mail.
 * @param {{ artisanId: string, artisanName: string }} props
 */
export default function ContactForm({ artisanId, artisanName }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [feedback, setFeedback] = useState('');
  const formRef = useRef(null);
  const idPrefix = useId();

  const getFieldId = (fieldName) => `${idPrefix}-${fieldName}`;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previousValues) => ({ ...previousValues, [name]: value }));

    if (errors[name]) {
      setErrors((previousErrors) => ({ ...previousErrors, [name]: undefined }));
    }
  }

  /** Place le focus sur le premier champ en erreur pour guider l'utilisateur. */
  function focusFirstInvalidField(fieldErrors) {
    const firstInvalidField = FIELDS.find((field) => fieldErrors[field.name]);
    if (firstInvalidField) {
      formRef.current?.elements.namedItem(firstInvalidField.name)?.focus();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending') return;

    const { data, errors: validationErrors, isValid } = validateContact(values);
    setErrors(validationErrors);

    if (!isValid) {
      setStatus('idle');
      setFeedback('');
      focusFirstInvalidField(validationErrors);
      return;
    }

    setStatus('sending');
    setFeedback('');

    try {
      await sendContactMessage({ ...data, artisanId, fax: values.fax });
      setValues(INITIAL_VALUES);
      setStatus('success');
      setFeedback(`Votre message a bien été envoyé à ${artisanName}. Une réponse vous sera apportée sous 48h.`);
    } catch (error) {
      setStatus('error');
      setFeedback(error.message);

      if (error.fieldErrors && typeof error.fieldErrors === 'object') {
        setErrors(error.fieldErrors);
        focusFirstInvalidField(error.fieldErrors);
      }
    }
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
      <p className="contact-form__required-note">
        Tous les champs marqués d'un astérisque (<span className="required-mark">*</span>) sont obligatoires.
      </p>

      {FIELDS.map((field) => {
        const fieldId = getFieldId(field.name);
        const errorId = `${fieldId}-erreur`;
        const hasError = Boolean(errors[field.name]);
        const commonProps = {
          id: fieldId,
          name: field.name,
          className: `form-control${hasError ? ' is-invalid' : ''}`,
          value: values[field.name],
          onChange: handleChange,
          maxLength: CONTACT_LIMITS[field.name].max,
          autoComplete: field.autoComplete,
          required: true,
          'aria-invalid': hasError,
          'aria-describedby': hasError ? errorId : undefined,
        };

        return (
          <div key={field.name} className="mb-3">
            <label htmlFor={fieldId} className="form-label">
              {field.label} <span className="required-mark" aria-hidden="true">*</span>
            </label>
            {field.type === 'textarea' ? (
              <textarea {...commonProps} rows={6} />
            ) : (
              <input {...commonProps} type={field.type} />
            )}
            {hasError && (
              <p id={errorId} className="invalid-feedback">
                {errors[field.name]}
              </p>
            )}
          </div>
        );
      })}

      {/* Pot de miel anti-robots : invisible pour les visiteurs, ignoré par les lecteurs d'écran */}
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor={getFieldId('fax')}>Ne pas remplir ce champ</label>
        <input
          id={getFieldId('fax')}
          type="text"
          name="fax"
          tabIndex={-1}
          autoComplete="off"
          value={values.fax}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
      </button>

      <div className="contact-form__feedback" role="status" aria-live="polite">
        {status === 'success' && <p className="alert alert-success">{feedback}</p>}
      </div>
      {status === 'error' && (
        <p className="alert alert-danger contact-form__feedback" role="alert">
          {feedback}
        </p>
      )}
    </form>
  );
}
