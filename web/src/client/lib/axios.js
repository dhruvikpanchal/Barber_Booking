import axios from "axios";

const ACCESS_TOKEN_KEY = "io.auth.accessToken";
const REFRESH_TOKEN_KEY = "io.auth.refreshToken";

/** Shared API client — base URL `/api/v1` */
const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && body.success === true) {
      if (body.meta != null && Array.isArray(body.data)) {
        response.data = { items: body.data, meta: body.meta };
      } else {
        response.data = body.data;
      }
    }
    return response;
  },
  (error) => {
    const apiError = error.response?.data?.error;
    const err = new Error(apiError?.message ?? error.message ?? "Something went wrong");
    err.status = error.response?.status;
    err.code = apiError?.code;
    err.fields = apiError?.fields;
    return Promise.reject(err);
  },
);

export function setAuthTokens({ accessToken, refreshToken }) {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export default api;
