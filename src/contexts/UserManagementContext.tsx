import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  SystemUser,
  UserRole,
  UserStatus,
  AuditLogEntry,
  systemUsers as initialUsers,
  initialAuditLog,
  formatUserFullName,
} from '@/data/usersData';

interface UserManagementContextType {
  // User Data
  users: SystemUser[];
  auditLog: AuditLogEntry[];
  
  // CRUD Operations
  createUser: (user: Omit<SystemUser, 'id' | 'createdAt' | 'lastLoginAt'>) => SystemUser;
  updateUserRole: (userId: string, newRole: UserRole) => boolean;
  updateUserStatus: (userId: string, newStatus: UserStatus) => boolean;
  resetUserSession: (userId: string) => void;
  
  // Queries
  getUserById: (id: string) => SystemUser | undefined;
  getUserByEmail: (email: string) => SystemUser | undefined;
  searchUsers: (query: string) => SystemUser[];
  filterUsers: (role?: UserRole | null, status?: UserStatus | null) => SystemUser[];
  
  // Validation
  canChangeRole: (userId: string, newRole: UserRole) => { allowed: boolean; reason?: string };
  canDeactivateUser: (userId: string) => { allowed: boolean; reason?: string };
  
  // Audit
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  
  // Stats
  getUserStats: () => {
    total: number;
    active: number;
    inactive: number;
    byRole: Record<UserRole, number>;
  };
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

const STORAGE_KEY = 'mediconnect_users';
const AUDIT_STORAGE_KEY = 'mediconnect_audit_log';

export const UserManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<SystemUser[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialUsers;
      }
    }
    return initialUsers;
  });

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialAuditLog;
      }
    }
    return initialAuditLog;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLog));
  }, [auditLog]);

  const addAuditEntry = useCallback((entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLog(prev => [newEntry, ...prev]);
  }, []);

  const getUserById = useCallback((id: string) => {
    return users.find(u => u.id === id);
  }, [users]);

  const getUserByEmail = useCallback((email: string) => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }, [users]);

  const searchUsers = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return users.filter(u => 
      u.email.toLowerCase().includes(lowerQuery) ||
      u.firstName.toLowerCase().includes(lowerQuery) ||
      u.lastName.toLowerCase().includes(lowerQuery) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(lowerQuery)
    );
  }, [users]);

  const filterUsers = useCallback((role?: UserRole | null, status?: UserStatus | null) => {
    return users.filter(u => {
      if (role && u.role !== role) return false;
      if (status && u.status !== status) return false;
      return true;
    });
  }, [users]);

  const canChangeRole = useCallback((userId: string, newRole: UserRole): { allowed: boolean; reason?: string } => {
    const user = getUserById(userId);
    if (!user) return { allowed: false, reason: 'User not found' };
    if (user.role === newRole) return { allowed: false, reason: 'User already has this role' };
    
    // Check if removing last admin
    if (user.role === 'ADMIN' && newRole !== 'ADMIN') {
      const adminCount = users.filter(u => u.role === 'ADMIN' && u.status === 'ACTIVE').length;
      if (adminCount <= 1) {
        return { allowed: false, reason: 'Cannot remove the last active admin' };
      }
    }
    
    return { allowed: true };
  }, [users, getUserById]);

  const canDeactivateUser = useCallback((userId: string): { allowed: boolean; reason?: string } => {
    const user = getUserById(userId);
    if (!user) return { allowed: false, reason: 'User not found' };
    if (user.status === 'INACTIVE') return { allowed: false, reason: 'User is already inactive' };
    
    // Check if deactivating last admin
    if (user.role === 'ADMIN') {
      const activeAdminCount = users.filter(u => u.role === 'ADMIN' && u.status === 'ACTIVE').length;
      if (activeAdminCount <= 1) {
        return { allowed: false, reason: 'Cannot deactivate the last active admin' };
      }
    }
    
    return { allowed: true };
  }, [users, getUserById]);

  const createUser = useCallback((userData: Omit<SystemUser, 'id' | 'createdAt' | 'lastLoginAt'>): SystemUser => {
    const newUser: SystemUser = {
      ...userData,
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    
    // Generate linkedEntityId based on role
    if (newUser.role === 'DOCTOR' && !newUser.linkedEntityId) {
      newUser.linkedEntityId = `doc_${Date.now()}`;
    } else if (newUser.role === 'PATIENT' && !newUser.linkedEntityId) {
      newUser.linkedEntityId = `pat_${Date.now()}`;
    }
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const updateUserRole = useCallback((userId: string, newRole: UserRole): boolean => {
    const validation = canChangeRole(userId, newRole);
    if (!validation.allowed) return false;

    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      
      // Update linkedEntityId when role changes
      let linkedEntityId = u.linkedEntityId;
      if (newRole === 'DOCTOR' && u.role !== 'DOCTOR') {
        linkedEntityId = `doc_${Date.now()}`;
      } else if (newRole === 'PATIENT' && u.role !== 'PATIENT') {
        linkedEntityId = `pat_${Date.now()}`;
      } else if (newRole === 'ADMIN') {
        linkedEntityId = null;
      }
      
      return { ...u, role: newRole, linkedEntityId };
    }));
    
    return true;
  }, [canChangeRole]);

  const updateUserStatus = useCallback((userId: string, newStatus: UserStatus): boolean => {
    if (newStatus === 'INACTIVE') {
      const validation = canDeactivateUser(userId);
      if (!validation.allowed) return false;
    }

    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
    
    return true;
  }, [canDeactivateUser]);

  const resetUserSession = useCallback((userId: string) => {
    // In demo mode, just log the action
    const user = getUserById(userId);
    if (user) {
      addAuditEntry({
        actorId: 'current_admin', // Will be set by caller
        actorName: 'Admin',
        action: 'SESSION_RESET',
        targetId: userId,
        targetName: formatUserFullName(user),
        details: 'User session was reset',
        category: 'USER_MANAGEMENT',
      });
    }
  }, [getUserById, addAuditEntry]);

  const getUserStats = useCallback(() => {
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'ACTIVE').length,
      inactive: users.filter(u => u.status === 'INACTIVE').length,
      byRole: {
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
        DOCTOR: users.filter(u => u.role === 'DOCTOR').length,
        PATIENT: users.filter(u => u.role === 'PATIENT').length,
      },
    };
    return stats;
  }, [users]);

  return (
    <UserManagementContext.Provider
      value={{
        users,
        auditLog,
        createUser,
        updateUserRole,
        updateUserStatus,
        resetUserSession,
        getUserById,
        getUserByEmail,
        searchUsers,
        filterUsers,
        canChangeRole,
        canDeactivateUser,
        addAuditEntry,
        getUserStats,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = (): UserManagementContextType => {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};
