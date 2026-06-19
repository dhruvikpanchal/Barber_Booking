import { getStoredUser, patchStoredUser } from "@/client/lib/auth/session.js";
import {
  cacheBustUrl,
  stripCacheBust,
} from "@/client/lib/format/cacheBustUrl.js";
import { customerServices } from "@/client/modules/customer/services/customerServices.jsx";
import { barberServices } from "@/client/modules/barber/services/barberServices.jsx";
import { adminServices } from "@/client/modules/admin/services/adminServices.jsx";

export const PROFILE_QUERY_KEYS = {
  customer: ["getProfile"],
  barber: ["barberGetProfile"],
  admin: ["profile"],
};

const PROFILE_FETCHERS = {
  customer: () => customerServices.getProfile(),
  barber: () => barberServices.getProfile(),
  admin: () => adminServices.getProfile(),
};

export function getProfileQueryKey(portalRole) {
  return PROFILE_QUERY_KEYS[portalRole] ?? PROFILE_QUERY_KEYS.customer;
}

function buildFullName(apiProfile) {
  const explicit = apiProfile.fullName?.trim();
  if (explicit) return explicit;
  const combined = [apiProfile.firstName, apiProfile.lastName].filter(Boolean).join(" ").trim();
  return combined || undefined;
}

export function storedUserToProfilePlaceholder(stored, portalRole) {
  if (!stored?.id && !stored?.email) return undefined;

  const base = {
    id: stored.id,
    email: stored.email ?? "",
    fullName: stored.fullName ?? "",
    photoUrl: stripCacheBust(stored.photoUrl),
  };

  if (portalRole === "barber") {
    return {
      ...base,
      firstName: stored.firstName ?? "",
      lastName: stored.lastName ?? "",
    };
  }

  if (portalRole === "customer") {
    return {
      ...base,
      firstName: stored.firstName ?? "",
      lastName: stored.lastName ?? "",
      phone: stored.phone ?? "",
      address: stored.address ?? "",
    };
  }

  return base;
}

export function getProfilePlaceholderData(portalRole) {
  if (typeof window === "undefined") return undefined;
  const stored = getStoredUser();
  return storedUserToProfilePlaceholder(stored, portalRole);
}

export function authUserToStoredUser(authUser) {
  if (!authUser) return null;

  return {
    id: authUser.id,
    email: authUser.email,
    fullName: authUser.fullName,
    role: authUser.role,
    photoUrl: authUser.photoUrl ? cacheBustUrl(stripCacheBust(authUser.photoUrl)) : null,
  };
}

export function profileToStoredUser(apiProfile, portalRole) {
  if (!apiProfile) return {};

  const patch = {
    id: apiProfile.id,
    email: apiProfile.email,
    fullName: buildFullName(apiProfile),
    photoUrl: apiProfile.photoUrl
      ? cacheBustUrl(stripCacheBust(apiProfile.photoUrl))
      : apiProfile.photoUrl,
  };

  if (portalRole === "barber" || portalRole === "customer") {
    if (apiProfile.firstName) patch.firstName = apiProfile.firstName;
    if (apiProfile.lastName) patch.lastName = apiProfile.lastName;
  }

  if (portalRole === "customer") {
    patch.phone = apiProfile.phone ?? "";
    patch.address = apiProfile.address ?? "";
  }

  return Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value != null && value !== ""),
  );
}

function storedMatchesProfile(stored, patch) {
  if (!stored) return false;
  return Object.entries(patch).every(([key, value]) => {
    if (key === "photoUrl") {
      return stripCacheBust(stored.photoUrl) === stripCacheBust(value);
    }
    return stored[key] === value;
  });
}

export function syncUserProfileEverywhere(queryClient, portalRole, apiProfile) {
  if (!apiProfile || !queryClient) return;

  const queryKey = getProfileQueryKey(portalRole);
  const canonicalProfile = {
    ...apiProfile,
    ...(apiProfile.photoUrl != null
      ? { photoUrl: stripCacheBust(apiProfile.photoUrl) }
      : {}),
  };

  let mergedProfile = canonicalProfile;
  queryClient.setQueryData(queryKey, (current) => {
    mergedProfile = { ...(current ?? {}), ...canonicalProfile };
    return mergedProfile;
  });

  const patch = profileToStoredUser(mergedProfile, portalRole);
  const stored = getStoredUser();
  if (!storedMatchesProfile(stored, patch)) {
    patchStoredUser(patch);
  }

  patchDashboardProfileCache(queryClient, portalRole, mergedProfile);
}

export function patchDashboardProfileCache(queryClient, portalRole, profile) {
  if (!profile) return;

  if (portalRole === "customer") {
    queryClient.setQueryData(["dashboard"], (current) => {
      if (!current) return current;
      return {
        ...current,
        profile: {
          fullName: profile.fullName ?? current.profile?.fullName,
          firstName:
            profile.firstName ??
            profile.fullName?.split(" ")[0] ??
            current.profile?.firstName,
          photoUrl: profile.photoUrl ?? current.profile?.photoUrl ?? null,
        },
      };
    });
    return;
  }

  if (portalRole === "barber") {
    queryClient.setQueryData(["barberGetDashboard"], (current) => {
      if (!current?.barber) return current;
      return {
        ...current,
        barber: {
          ...current.barber,
          firstName:
            profile.firstName ??
            profile.fullName?.split(" ")[0] ??
            current.barber.firstName,
          photoUrl: profile.photoUrl ?? current.barber.photoUrl ?? null,
        },
      };
    });
  }
}

export function mergeProfileSnippet(queryClient, portalRole, snippet) {
  if (!snippet || !queryClient) return;

  const queryKey = getProfileQueryKey(portalRole);
  let mergedProfile = snippet;

  queryClient.setQueryData(queryKey, (current) => {
    mergedProfile = { ...(current ?? {}), ...snippet };
    return mergedProfile;
  });

  const patch = profileToStoredUser(mergedProfile, portalRole);
  const stored = getStoredUser();
  if (Object.keys(patch).length > 0 && !storedMatchesProfile(stored, patch)) {
    patchStoredUser(patch);
  }
}

export function seedProfileQueryFromStorage(queryClient, portalRole) {
  if (!queryClient) return;

  const queryKey = getProfileQueryKey(portalRole);
  if (queryClient.getQueryData(queryKey)) return;

  const placeholder = getProfilePlaceholderData(portalRole);
  if (placeholder) {
    queryClient.setQueryData(queryKey, placeholder);
  }
}

export async function fetchAndSyncProfile(queryClient, portalRole) {
  const fetcher = PROFILE_FETCHERS[portalRole];
  if (!fetcher || !queryClient) return null;

  const queryKey = getProfileQueryKey(portalRole);

  try {
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: fetcher,
      staleTime: 0,
    });
    syncUserProfileEverywhere(queryClient, portalRole, data);
    return data;
  } catch {
    return null;
  }
}

export function subscribeProfileQuerySync(queryClient, portalRole) {
  const queryKey = getProfileQueryKey(portalRole);

  return queryClient.getQueryCache().subscribe((event) => {
    const query = event?.query;
    if (!query || query.queryKey[0] !== queryKey[0]) return;
    if (event.type !== "updated") return;

    const { data, status } = query.state;
    if (status !== "success" || !data) return;

    const patch = profileToStoredUser(data, portalRole);
    const stored = getStoredUser();
    if (!storedMatchesProfile(stored, patch)) {
      patchStoredUser(patch);
    }
  });
}

export function getProfileFetcher(portalRole) {
  return PROFILE_FETCHERS[portalRole];
}
