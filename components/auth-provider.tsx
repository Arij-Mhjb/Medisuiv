'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, getUser, saveUser, clearUser } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate from localStorage on mount
    const stored = getUser();
    if (stored) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: AuthUser) => {
    saveUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
