import React, { createContext, useContext, useState, useCallback } from "react";
import { UserAccount } from "@/lib/types";
import { getCurrentUser, login as authLogin, logout as authLogout, register as authRegister, AuthResult } from "@/lib/auth";

interface AuthContextValue {
  currentUser: UserAccount | null;
  login: (email: string, password: string) => AuthResult;
  register: (email: string, password: string, name: string, slug: string) => AuthResult;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser());

  const login = useCallback((email: string, password: string): AuthResult => {
    const result = authLogin(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    return result;
  }, []);

  const register = useCallback((email: string, password: string, name: string, slug: string): AuthResult => {
    const result = authRegister(email, password, name, slug);
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setCurrentUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
