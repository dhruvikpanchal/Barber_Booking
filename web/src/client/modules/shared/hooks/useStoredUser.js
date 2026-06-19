"use client";

import { useEffect, useState } from "react";
import { getStoredUser } from "@/client/lib/auth/session.js";

/**
 * Reactive view of the cached auth user in localStorage.
 * Updates when `io:auth-updated` or `io:user-updated` fires.
 */
export function useStoredUser() {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const bump = () => setRevision((value) => value + 1);
    window.addEventListener("io:auth-updated", bump);
    window.addEventListener("io:user-updated", bump);
    return () => {
      window.removeEventListener("io:auth-updated", bump);
      window.removeEventListener("io:user-updated", bump);
    };
  }, []);

  return getStoredUser();
}
