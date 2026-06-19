"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { shouldRetryQuery } from "@/client/lib/query/retryPolicy.js";
import {
  getProfileFetcher,
  getProfilePlaceholderData,
  getProfileQueryKey,
} from "@/client/lib/auth/profileCache.js";
import { useStoredUser } from "@/client/modules/shared/hooks/useStoredUser.js";

const ROLE_FALLBACK = {
  admin: { name: "Admin", email: "admin@ironandoak.app", photoUrl: null },
  barber: { name: "Barber", email: "", photoUrl: null },
  customer: { name: "Customer", email: "", photoUrl: null },
};

const PROFILE_STALE_TIME = 5 * 60_000;

function fromStoredUser(stored, fallback) {
  if (!stored) return fallback;

  const name = stored.fullName?.trim() || fallback.name;
  return {
    name,
    email: stored.email || fallback.email,
    photoUrl: stored.photoUrl ?? null,
  };
}

function fromApiProfile(data, fallback) {
  if (!data) return fallback;

  const name = data.fullName?.trim() || data.name?.trim() || fallback.name;
  const apiPhoto = data.photoUrl ?? null;
  const storedPhoto = fallback.photoUrl ?? null;
  const photoUrl =
    storedPhoto && apiPhoto && storedPhoto.startsWith(apiPhoto.split("?")[0])
      ? storedPhoto
      : (apiPhoto ?? storedPhoto);

  return {
    name,
    email: data.email || fallback.email,
    photoUrl,
  };
}

export function useHeaderProfile(role = "customer") {
  const fallback = ROLE_FALLBACK[role] ?? ROLE_FALLBACK.customer;
  const storedUser = useStoredUser();
  const queryKey = getProfileQueryKey(role);
  const fetcher = getProfileFetcher(role);

  const { data: apiProfile } = useQuery({
    queryKey,
    queryFn: fetcher,
    enabled: Boolean(storedUser && fetcher),
    staleTime: PROFILE_STALE_TIME,
    placeholderData: () => getProfilePlaceholderData(role),
    retry: shouldRetryQuery,
  });

  return useMemo(() => {
    const base = fromStoredUser(storedUser, fallback);
    if (apiProfile) return fromApiProfile(apiProfile, base);
    return base;
  }, [storedUser, apiProfile, fallback]);
}
