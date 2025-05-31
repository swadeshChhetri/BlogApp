// src/context/AuthProvider.tsx
import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';

// 1. Types
type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

// 2. Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(Cookies.get('token') || null);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const login = (newToken: string, userData: User) => {
    Cookies.set('token', newToken, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
