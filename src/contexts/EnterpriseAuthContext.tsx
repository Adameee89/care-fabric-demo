import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SystemUser, UserRole, formatUserFullName } from '@/data/usersData';

interface EnterpriseAuthContextType {
  // Current session
  currentUser: SystemUser | null;
  isAuthenticated: boolean;
  
  // Auth operations
  login: (user: SystemUser) => void;
  logout: () => void;
  
  // Impersonation
  isImpersonating: boolean;
  originalUser: SystemUser | null;
  impersonate: (user: SystemUser) => void;
  stopImpersonation: () => void;
  
  // Role checking
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  
  // Session info
  getDisplayName: () => string;
  getSessionInfo: () => { userId: string; role: UserRole; impersonating: boolean } | null;
}

const EnterpriseAuthContext = createContext<EnterpriseAuthContextType | undefined>(undefined);

const SESSION_KEY = 'mediconnect_session';
const ORIGINAL_USER_KEY = 'mediconnect_original_user';

interface StoredSession {
  user: SystemUser;
  originalUser?: SystemUser;
  isImpersonating: boolean;
}

export const EnterpriseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [originalUser, setOriginalUser] = useState<SystemUser | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const session: StoredSession = JSON.parse(stored);
        setCurrentUser(session.user);
        if (session.isImpersonating && session.originalUser) {
          setOriginalUser(session.originalUser);
          setIsImpersonating(true);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  // Persist session changes
  useEffect(() => {
    if (currentUser) {
      const session: StoredSession = {
        user: currentUser,
        originalUser: originalUser || undefined,
        isImpersonating,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser, originalUser, isImpersonating]);

  const login = useCallback((user: SystemUser) => {
    // Update last login
    const updatedUser = {
      ...user,
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    setOriginalUser(null);
    setIsImpersonating(false);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setOriginalUser(null);
    setIsImpersonating(false);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ORIGINAL_USER_KEY);
  }, []);

  const impersonate = useCallback((user: SystemUser) => {
    if (!currentUser) return;
    
    // Only admins can impersonate
    if (currentUser.role !== 'ADMIN') return;
    
    // Store original user if not already impersonating
    if (!isImpersonating) {
      setOriginalUser(currentUser);
    }
    
    setCurrentUser(user);
    setIsImpersonating(true);
  }, [currentUser, isImpersonating]);

  const stopImpersonation = useCallback(() => {
    if (!isImpersonating || !originalUser) return;
    
    setCurrentUser(originalUser);
    setOriginalUser(null);
    setIsImpersonating(false);
  }, [isImpersonating, originalUser]);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    
    return currentUser.role === role;
  }, [currentUser]);

  const hasAccess = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    
    // Admins always have access
    if (currentUser.role === 'ADMIN') return true;
    
    return requiredRoles.includes(currentUser.role);
  }, [currentUser]);

  const getDisplayName = useCallback((): string => {
    if (!currentUser) return '';
    return formatUserFullName(currentUser);
  }, [currentUser]);

  const getSessionInfo = useCallback(() => {
    if (!currentUser) return null;
    
    return {
      userId: currentUser.id,
      role: currentUser.role,
      impersonating: isImpersonating,
    };
  }, [currentUser, isImpersonating]);

  return (
    <EnterpriseAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        isImpersonating,
        originalUser,
        impersonate,
        stopImpersonation,
        hasRole,
        hasAccess,
        getDisplayName,
        getSessionInfo,
      }}
    >
      {children}
    </EnterpriseAuthContext.Provider>
  );
};

export const useEnterpriseAuth = (): EnterpriseAuthContextType => {
  const context = useContext(EnterpriseAuthContext);
  if (context === undefined) {
    throw new Error('useEnterpriseAuth must be used within an EnterpriseAuthProvider');
  }
  return context;
};

// Safe hook that returns defaults when outside provider (for gradual migration)
export const useEnterpriseAuthSafe = (): EnterpriseAuthContextType => {
  const context = useContext(EnterpriseAuthContext);
  if (!context) {
    return {
      currentUser: null,
      isAuthenticated: false,
      login: () => {},
      logout: () => {},
      isImpersonating: false,
      originalUser: null,
      impersonate: () => {},
      stopImpersonation: () => {},
      hasRole: () => false,
      hasAccess: () => false,
      getDisplayName: () => '',
      getSessionInfo: () => null,
    };
  }
  return context;
};
