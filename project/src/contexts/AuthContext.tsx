import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async () => {
    // Simulate Google OAuth login
    setState({ ...state, isLoading: true });
    
    // Mock successful login after a short delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://i.pravatar.cc/150?u=john',
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};