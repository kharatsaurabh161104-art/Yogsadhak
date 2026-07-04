"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  role: "student" | "admin";
  mobileNumber?: string;
  email?: string;
} | null;

interface AuthContextType {
  user: User;
  role: "student" | "admin" | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("yogsadhak_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("yogsadhak_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("yogsadhak_user", JSON.stringify(userData));
    document.cookie = `yogsadhak_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("yogsadhak_user");
    document.cookie = "yogsadhak_token=; path=/; max-age=0";
    setUser(null);
  }, []);

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
