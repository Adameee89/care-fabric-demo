import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, demoUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for existing session
    const savedRole = localStorage.getItem('mediconnect_role') as UserRole | null;
    if (savedRole && demoUsers[savedRole]) {
      return demoUsers[savedRole];
    }
    return null;
  });

  const login = useCallback((role: UserRole) => {
    const demoUser = demoUsers[role];
    setUser(demoUser);
    localStorage.setItem('mediconnect_role', role);
    localStorage.setItem('mediconnect_token', `demo_token_${role}_${Date.now()}`);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('mediconnect_role');
    localStorage.removeItem('mediconnect_token');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    login(role);
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
