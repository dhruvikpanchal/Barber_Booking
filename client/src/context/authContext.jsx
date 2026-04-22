import { createContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'barbar_booking_auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (rawAuth) {
        const parsedAuth = JSON.parse(rawAuth);
        setUser(parsedAuth?.user ?? null);
      }
    } catch (error) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistAuth = (nextUser) => {
    if (nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: nextUser }));
      return;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const login = async (credentials) => {
    // TODO(backend): enable API login when backend auth endpoints are ready.
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // });
    // const data = await response.json();
    // const nextUser = data.user;

    const nextUser = {
      name: credentials?.name || credentials?.email || 'Demo User',
      email: credentials?.email || '',
    };
    setUser(nextUser);
    persistAuth(nextUser);
    return nextUser;
  };

  const logout = async () => {
    // TODO(backend): enable API logout when backend auth endpoints are ready.
    // await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    persistAuth(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
