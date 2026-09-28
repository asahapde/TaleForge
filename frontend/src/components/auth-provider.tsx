"use client";

import { api, onUnauthorized, tokenStore } from "@/lib/api";
import type { AuthResponse, Me } from "@/lib/types";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface AuthState {
  user: Me | null;
  /** True until the stored token has been checked on first load. */
  loading: boolean;
  login: (login: string, password: string) => Promise<Me>;
  register: (data: { username: string; email: string; password: string; displayName?: string }) => Promise<Me>;
  logout: () => void;
  setUser: (user: Me) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    const unsubscribe = onUnauthorized(logout);
    if (!tokenStore.get()) {
      setLoading(false);
      return () => {
        unsubscribe();
      };
    }
    api<Me>("/me")
      .then(setUser)
      .catch(() => {
        // An expired token was already cleared by the 401 listener; network errors keep it for next time.
      })
      .finally(() => setLoading(false));
    return () => {
      unsubscribe();
    };
  }, [logout]);

  const accept = useCallback((res: AuthResponse) => {
    tokenStore.set(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      logout,
      setUser,
      login: (login, password) =>
        api<AuthResponse>("/auth/login", { method: "POST", body: { login, password } }).then(accept),
      register: (data) => api<AuthResponse>("/auth/register", { method: "POST", body: data }).then(accept),
    }),
    [user, loading, logout, accept],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
