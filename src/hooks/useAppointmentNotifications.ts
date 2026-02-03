import { useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { systemUsers } from '@/data/usersData';
import { doctors, patients } from '@/data/mockData';

type NotificationAction = 
  | 'request'
  | 'accept'
  | 'decline'
  | 'reschedule_propose'
  | 'reschedule_accept'
  | 'reschedule_decline'
  | 'cancel_by_patient'
  | 'cancel_by_doctor'
  | 'complete'
  | 'noshow';

interface AppointmentNotificationData {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date?: string;
  time?: string;
}

/**
 * Hook to send notifications for appointment actions.
 * Call this after successful appointment state changes.
 */
export const useAppointmentNotifications = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Find user ID from patient/doctor ID
  const findUserIdFromPatientId = useCallback((patientId: string): string | null => {
    const sysUser = systemUsers.find(u => u.linkedEntityId === patientId);
    return sysUser?.id || patientId;
  }, []);

  const findUserIdFromDoctorId = useCallback((doctorId: string): string | null => {
    const sysUser = systemUsers.find(u => u.linkedEntityId === doctorId);
    return sysUser?.id || doctorId;
  }, []);

  const sendNotification = useCallback((
    action: NotificationAction,
    data: AppointmentNotificationData
  ) => {
    const patientUserId = findUserIdFromPatientId(data.patientId);
    const doctorUserId = findUserIdFromDoctorId(data.doctorId);

    switch (action) {
      case 'request':
        // Notify doctor about new request
        if (doctorUserId) {
          addNotification(
            doctorUserId,
            'appointment_requested',
            data.patientName,
            data.appointmentId,
            data.date,
            data.time
          );
        }
        break;

      case 'accept':
        // Notify patient about acceptance
        if (patientUserId) {
          addNotification(
            patientUserId,
            'appointment_accepted',
            data.doctorName,
            data.appointmentId,
            data.date,
            data.time
          );
        }
        break;

      case 'decline':
        // Notify patient about decline
        if (patientUserId) {
          addNotification(
            patientUserId,
            'appointment_declined',
            data.doctorName,
            data.appointmentId
          );
        }
        break;

      case 'reschedule_propose':
        // Notify patient about reschedule proposal
        if (patientUserId) {
          addNotification(
            patientUserId,
            'reschedule_proposed',
            data.doctorName,
            data.appointmentId,
            data.date,
            data.time
          );
        }
        break;

      case 'reschedule_accept':
        // Notify doctor that patient accepted
        if (doctorUserId) {
          addNotification(
            doctorUserId,
            'reschedule_accepted',
            data.patientName,
            data.appointmentId,
            data.date,
            data.time
          );
        }
        break;

      case 'reschedule_decline':
        // Notify doctor that patient declined
        if (doctorUserId) {
          addNotification(
            doctorUserId,
            'reschedule_declined',
            data.patientName,
            data.appointmentId
          );
        }
        break;

      case 'cancel_by_patient':
        // Notify doctor
        if (doctorUserId) {
          addNotification(
            doctorUserId,
            'appointment_cancelled',
            data.patientName,
            data.appointmentId,
            data.date,
            data.time
          );
        }
        break;

      case 'cancel_by_doctor':
        // Notify patient
        if (patientUserId) {
          addNotification(
            patientUserId,
            'appointment_cancelled',
            data.doctorName,
            data.appointmentId,
            data.date,
            data.time
          );
        }
        break;

      case 'complete':
        // Notify patient
        if (patientUserId) {
          addNotification(
            patientUserId,
            'appointment_completed',
            data.doctorName,
            data.appointmentId
          );
        }
        break;

      case 'noshow':
        // Notify patient
        if (patientUserId) {
          addNotification(
            patientUserId,
            'appointment_noshow',
            data.doctorName,
            data.appointmentId
          );
        }
        break;
    }
  }, [addNotification, findUserIdFromPatientId, findUserIdFromDoctorId]);

  return { sendNotification };
};
