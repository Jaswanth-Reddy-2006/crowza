import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, type User } from '@crowza/shared';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  loginProvider: (token: string, user: User) => void;
  logoutProvider: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  loginProvider: () => {},
  logoutProvider: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persist
    const storedUser = localStorage.getItem('crowza_organizer_user');
    const token = localStorage.getItem('crowza_organizer_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const loginProvider = (token: string, user: User) => {
    localStorage.setItem('crowza_organizer_token', token);
    localStorage.setItem('crowza_organizer_user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const logoutProvider = () => {
    localStorage.removeItem('crowza_organizer_token');
    localStorage.removeItem('crowza_organizer_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, loginProvider, logoutProvider }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
