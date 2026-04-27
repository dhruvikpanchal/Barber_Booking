import { createContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'barbar_booking_auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Load auth data on app start
  useEffect(() => {
    try {
      const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);

      if (rawAuth) {
        const parsedAuth = JSON.parse(rawAuth);
        setUser(parsedAuth?.user ?? null);
        setToken(parsedAuth?.token ?? null);
      }
    } catch (error) {
      console.log('Auth load error:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 Save to localStorage
  const persistAuth = (nextUser, nextToken) => {
    if (nextUser && nextToken) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // 🔹 LOGIN
  const login = async (credentials) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const nextUser = data.data.user;
      const nextToken = data.data.token;

      setUser(nextUser);
      setToken(nextToken);
      persistAuth(nextUser, nextToken);

      return nextUser;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log('Logout API failed (ignored)');
      console.log(`Error ${error}`);
    } finally {
      setUser(null);
      setToken(null);
      persistAuth(null, null);
    }
  };

  // 🔹 AUTH HEADER HELPER
  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      getAuthHeaders,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
