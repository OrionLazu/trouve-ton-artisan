import { useEffect, useState } from 'react';

/**
 * Exécute une fonction asynchrone (appel AJAX) et expose son état.
 * La fonction `loader` doit être stable (définie hors du composant ou via useCallback) :
 * un nouveau `loader` relance le chargement.
 *
 * @template T
 * @param {() => Promise<T>} loader
 * @returns {{ status: 'loading' | 'success' | 'error', data: T | null, error: Error | null }}
 */
export default function useAsyncData(loader) {
  const [result, setResult] = useState({ loader: null, data: null, error: null });

  useEffect(() => {
    // Ignore la réponse si le composant a changé de données entre-temps
    let isActive = true;

    loader().then(
      (data) => {
        if (isActive) setResult({ loader, data, error: null });
      },
      (error) => {
        if (isActive) setResult({ loader, data: null, error });
      },
    );

    return () => {
      isActive = false;
    };
  }, [loader]);

  // Tant que le résultat ne correspond pas au loader courant, les données sont en cours de chargement
  if (result.loader !== loader) {
    return { status: 'loading', data: null, error: null };
  }

  return {
    status: result.error ? 'error' : 'success',
    data: result.data,
    error: result.error,
  };
}
