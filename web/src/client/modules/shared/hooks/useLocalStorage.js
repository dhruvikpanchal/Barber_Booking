"use client";

import { useCallback, useEffect, useState } from "react";

function readValue(key, initialValue) {
  if (typeof window === "undefined") return initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    setStored(readValue(key, initialValue));
  }, [key, initialValue]);

  const setValue = useCallback(
    (next) => {
      setStored((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
        return value;
      });
    },
    [key],
  );

  return [stored, setValue];
}
