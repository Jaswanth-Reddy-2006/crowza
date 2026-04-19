import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User } from '@crowza/shared';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('crowza_organizer_user');
    const token = localStorage.getItem('crowza_organizer_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // Simulated successful login for now
    if (!email || !pass) throw new Error('Invalid credentials');
    
    const mockUser: User = { 
      id: 'mock-1', 
      email, 
      role: 'organizer' as any, 
      name: email.split('@')[0] 
    };
    
    localStorage.setItem('crowza_organizer_token', 'mock_token');
    localStorage.setItem('crowza_organizer_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const register = async (email: string, pass: string, data: any) => {
    // Simulated successful registration
    if (!email || !pass) throw new Error('Details missing');
    
    const mockUser: User = { 
      id: 'mock-2', 
      email, 
      role: 'organizer' as any, 
      name: data.fullName || email.split('@')[0] 
    };
    
    localStorage.setItem('crowza_organizer_token', 'mock_token');
    localStorage.setItem('crowza_organizer_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('crowza_organizer_token');
    localStorage.removeItem('crowza_organizer_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
