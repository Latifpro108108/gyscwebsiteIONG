import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, AuthUser, setToken } from "@/app/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { name: string; email: string; password: string; country?: string }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("gysc_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (u: AuthUser | null, token?: string | null) => {
    setUser(u);
    if (u) localStorage.setItem("gysc_user", JSON.stringify(u));
    else localStorage.removeItem("gysc_user");
    if (token !== undefined) setToken(token);
  };

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user: u } = await api.login(email, password);
      persist(u, token);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; country?: string }) => {
    setLoading(true);
    try {
      const { token, user: u } = await api.register(data);
      persist(u, token);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => persist(null, null), []);

  const value = useMemo(
    () => ({ user, loading, isAdmin: user?.role === "admin", login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
