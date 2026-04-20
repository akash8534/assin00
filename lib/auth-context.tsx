"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'PLAYER' | 'CAPTAIN' | 'ORGANISER' | 'FAN';
export type User = { id: string; name: string; role: Role; teamId?: string };

const AuthContext = createContext<{ user: User | null; login: (u: User) => void; logout: () => void; }>({ 
  user: null, login: () => {}, logout: () => {} 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Safely check local storage only after the component mounts on the client
    const storedUser = localStorage.getItem('gully_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('gully_user', JSON.stringify(userData));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gully_user');
    router.push('/');
  };

  // Removed the 'mounted' block that was breaking your app!
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);