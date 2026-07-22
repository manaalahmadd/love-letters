'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, User } from '@/lib/api';

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('ll_token');
    const storedUser = localStorage.getItem('ll_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function persist(authToken: string, authUser: User) {
    localStorage.setItem('ll_token', authToken);
    localStorage.setItem('ll_user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  }

  async function login(email: string, password: string) {
    const res = await api.login(email, password);
    persist(res.access_token, res.user);
  }

  async function signup(email: string, password: string, displayName?: string) {
    const res = await api.signup(email, password, displayName);
    persist(res.access_token, res.user);
  }

  function logout() {
    localStorage.removeItem('ll_token');
    localStorage.removeItem('ll_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
