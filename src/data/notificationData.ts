// ============================================
// NOTIFICATION SYSTEM - DATA LAYER
// ============================================

export type NotificationType = 
  | 'appointment_requested'
  | 'appointment_accepted'
  | 'appointment_declined'
  | 'appointment_rescheduled'
  | 'appointment_cancelled'
  | 'appointment_completed'
  | 'appointment_noshow'
  | 'reschedule_proposed'
  | 'reschedule_accepted'
  | 'reschedule_declined'
  | 'system';

export interface AppNotification {
  id: string;
  userId: string; // Who receives the notification
  type: NotificationType;
  title: string;
  message: string;
  relatedAppointmentId?: string;
  relatedUserId?: string;
  relatedUserName?: string;
  isRead: boolean;
  createdAt: string;
}

// LocalStorage key
const NOTIFICATIONS_STORAGE_KEY = 'mediconnect_notifications';

// Load notifications from storage
export const loadNotifications = (): AppNotification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load notifications:', e);
  }
  return [];
};

// Save notifications to storage
export const saveNotifications = (notifications: AppNotification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
};

// Create a new notification
export const createNotification = (
  data: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>
): AppNotification => {
  return {
    ...data,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
};

// Notification templates
export const getNotificationContent = (
  type: NotificationType,
  actorName: string,
  appointmentDate?: string,
  appointmentTime?: string
): { title: string; message: string } => {
  const dateTimeStr = appointmentDate && appointmentTime 
    ? ` for ${appointmentDate} at ${appointmentTime}` 
    : '';

  switch (type) {
    case 'appointment_requested':
      return {
        title: 'New Appointment Request',
        message: `${actorName} has requested an appointment${dateTimeStr}`,
      };
    case 'appointment_accepted':
      return {
        title: 'Appointment Confirmed',
        message: `Your appointment with ${actorName} has been confirmed${dateTimeStr}`,
      };
    case 'appointment_declined':
      return {
        title: 'Appointment Declined',
        message: `Your appointment request with ${actorName} was declined`,
      };
    case 'reschedule_proposed':
      return {
        title: 'Reschedule Proposed',
        message: `${actorName} has proposed a new time${dateTimeStr}`,
      };
    case 'reschedule_accepted':
      return {
        title: 'Reschedule Accepted',
        message: `${actorName} accepted the rescheduled appointment${dateTimeStr}`,
      };
    case 'reschedule_declined':
      return {
        title: 'Reschedule Declined',
        message: `${actorName} declined the proposed reschedule`,
      };
    case 'appointment_cancelled':
      return {
        title: 'Appointment Cancelled',
        message: `Your appointment with ${actorName}${dateTimeStr} has been cancelled`,
      };
    case 'appointment_completed':
      return {
        title: 'Appointment Completed',
        message: `Your appointment with ${actorName} has been marked as completed`,
      };
    case 'appointment_noshow':
      return {
        title: 'Marked as No-Show',
        message: `You were marked as no-show for your appointment with ${actorName}`,
      };
    default:
      return {
        title: 'Notification',
        message: 'You have a new notification',
      };
  }
};
