"use client";

import { useEffect, useState } from "react";

/** True after the client has mounted — safe for Date.now() / locale-only UI. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
