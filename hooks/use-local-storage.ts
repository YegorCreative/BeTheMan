"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(key);

      if (storedValue) {
        setValue(JSON.parse(storedValue) as T);
      }
    } catch {
      setValue(initialValue);
    } finally {
      setHydrated(true);
    }
  }, [initialValue, key]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write failures so the UI remains usable.
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated] as const;
}