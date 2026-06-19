"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { hasValidSession } from "@/client/lib/auth/session.js";
import {
  fetchAndSyncProfile,
  seedProfileQueryFromStorage,
  subscribeProfileQuerySync,
} from "@/client/lib/auth/profileCache.js";

/**
 * Keeps the role profile query cache and localStorage user cache in sync.
 * Runs on dashboard mount and after auth/session changes.
 */
export default function ProfileHydrator({ role }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hasValidSession(role)) return undefined;

    seedProfileQueryFromStorage(queryClient, role);
    fetchAndSyncProfile(queryClient, role);

    const unsubscribe = subscribeProfileQuerySync(queryClient, role);
    return unsubscribe;
  }, [queryClient, role]);

  useEffect(() => {
    function handleAuthUpdated() {
      if (!hasValidSession(role)) return;
      seedProfileQueryFromStorage(queryClient, role);
      fetchAndSyncProfile(queryClient, role);
    }

    window.addEventListener("io:auth-updated", handleAuthUpdated);
    return () => window.removeEventListener("io:auth-updated", handleAuthUpdated);
  }, [queryClient, role]);

  return null;
}
