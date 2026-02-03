import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  AppNotification,
  NotificationType,
  loadNotifications,
  saveNotifications,
  createNotification,
  getNotificationContent,
} from '@/data/notificationData';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  
  // Add notification
  addNotification: (
    recipientUserId: string,
    type: NotificationType,
    actorName: string,
    appointmentId?: string,
    appointmentDate?: string,
    appointmentTime?: string
  ) => void;
  
  // Mark as read
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  
  // Delete
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  
  // Get for current user
  getMyNotifications: () => AppNotification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications());

  // Persist to localStorage
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Get notifications for current user
  const getMyNotifications = useCallback((): AppNotification[] => {
    if (!user) return [];
    return notifications
      .filter(n => n.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, user]);

  // Unread count for current user
  const unreadCount = user 
    ? notifications.filter(n => n.userId === user.id && !n.isRead).length 
    : 0;

  // Add notification
  const addNotification = useCallback((
    recipientUserId: string,
    type: NotificationType,
    actorName: string,
    appointmentId?: string,
    appointmentDate?: string,
    appointmentTime?: string
  ) => {
    const content = getNotificationContent(type, actorName, appointmentDate, appointmentTime);
    const notification = createNotification({
      userId: recipientUserId,
      type,
      title: content.title,
      message: content.message,
      relatedAppointmentId: appointmentId,
      relatedUserName: actorName,
    });
    
    setNotifications(prev => [notification, ...prev]);
  }, []);

  // Mark as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    if (!user) return;
    setNotifications(prev =>
      prev.map(n => n.userId === user.id ? { ...n, isRead: true } : n)
    );
  }, [user]);

  // Delete notification
  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Clear all for current user
  const clearAll = useCallback(() => {
    if (!user) return;
    setNotifications(prev => prev.filter(n => n.userId !== user.id));
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        getMyNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
