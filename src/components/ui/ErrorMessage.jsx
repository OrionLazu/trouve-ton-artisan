/**
 * Message d'erreur mis en évidence et annoncé immédiatement.
 * @param {{ children: import('react').ReactNode }} props
 */
export default function ErrorMessage({ children }) {
  return (
    <p className="alert alert-danger" role="alert">
      {children}
    </p>
  );
}
