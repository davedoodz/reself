import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A `useState` that mirrors itself into AsyncStorage.
 *
 * `hydrated` is false until the first read resolves, so screens can avoid
 * flashing default content and — importantly — writes are suppressed until
 * hydration completes, otherwise the initial default would clobber stored data.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (cancelled) return;
        if (raw != null) {
          try {
            setValue(JSON.parse(raw) as T);
          } catch {
            // Corrupt payload: fall back to the default rather than crash.
          }
        }
      })
      .finally(() => {
        if (cancelled) return;
        hydratedRef.current = true;
        setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [key, value]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return { value, setValue, hydrated, reset } as const;
}

/** Monotonic-enough id without pulling in a uuid dependency. */
export function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
