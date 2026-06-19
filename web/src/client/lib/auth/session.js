import { routes } from "@/client/config/routes/routes.js";
import {
  API_ROLE_TO_PORTAL,
  USER_KEY,
} from "@/client/modules/auth/constants/authConstants.js";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/axios";
import { authUserToStoredUser } from "@/client/lib/auth/profileCache.js";

const ROLE_KEY = "io.auth.role";

const PORTAL_TO_API_ROLE = {
  customer: "CUSTOMER",
  barber: "BARBER",
  admin: "ADMIN",
};

export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

export function getStoredPortalRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function getPortalRoleFromToken(token = getAccessToken()) {
  const payload = decodeJwtPayload(token);
  if (!payload?.role) return null;
  return API_ROLE_TO_PORTAL[payload.role] ?? null;
}

export function hasValidSession(requiredPortalRole) {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) return false;

  const portalRole = getPortalRoleFromToken(token);
  if (!portalRole) return false;
  if (requiredPortalRole && portalRole !== requiredPortalRole) return false;

  return true;
}

export function getDashboardPath(portalRole) {
  if (portalRole === "admin") return routes.admin.dashboard;
  if (portalRole === "barber") return routes.barber.dashboard;
  return routes.customer.dashboard;
}

export function clearAuthSession() {
  clearAuthTokens();
  if (typeof window === "undefined") return;
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent("io:auth-updated"));
}

export function persistAuthSession({ tokens, user, portalRole }) {
  if (tokens) setAuthTokens(tokens);
  if (typeof window === "undefined") return;
  if (portalRole) localStorage.setItem(ROLE_KEY, portalRole);
  if (user) {
    const normalized = authUserToStoredUser(user) ?? user;
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  }
  window.dispatchEvent(new CustomEvent("io:auth-updated"));
}

export function patchStoredUser(updates) {
  if (typeof window === "undefined" || !updates) return;
  const user = getStoredUser();
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, ...updates }));
  window.dispatchEvent(new CustomEvent("io:user-updated"));
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken || isTokenExpired(refreshToken)) return false;

  try {
    const response = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      // Stale/invalid refresh token; clear session so guards stop retrying.
      if (response.status === 401 || response.status === 403) {
        clearAuthSession();
      }
      return false;
    }

    const body = await response.json();
    const tokens = body?.data?.tokens ?? body?.tokens;
    if (!tokens?.accessToken) {
      clearAuthSession();
      return false;
    }

    setAuthTokens(tokens);
    return true;
  } catch {
    return false;
  }
}

export async function ensureAuthenticated(requiredPortalRole) {
  if (hasValidSession(requiredPortalRole)) {
    return { ok: true, portalRole: getPortalRoleFromToken() };
  }

  const token = getAccessToken();
  if (token && isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (refreshed && hasValidSession(requiredPortalRole)) {
      return { ok: true, portalRole: getPortalRoleFromToken() };
    }
  }

  return { ok: false, portalRole: null };
}

export { PORTAL_TO_API_ROLE };
