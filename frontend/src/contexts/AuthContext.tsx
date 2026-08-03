import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import API from '../api/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await API.get('/api/auth/me');
      setUser({
        id: response.data.userId,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    const response = await API.post('/api/auth/login', { username, password });
    setUser({
      id: response.data.userId,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
    });
  };

  const loginWithGoogle = async (credential: string) => {
    const response = await API.post('/api/auth/google', { credential });
    setUser({
      id: response.data.userId,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
    });
  };

  const register = async (username: string, email: string, password: string) => {
    await API.post('/api/auth/register', { username, email, password, role: 'User' });
  };

  const logout = async () => {
    try {
      await API.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await API.post('/api/auth/refresh');
      setUser({
        id: response.data.userId,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
      });
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
