import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  ExtendedAppointment,
  AppointmentStatus,
  AppointmentType,
  DeclineReason,
  TimeSlot,
  extendedAppointments as initialAppointments,
  appointmentTypeConfig,
} from '@/data/appointmentData';
import { doctors, patients } from '@/data/mockData';
import { toast } from 'sonner';

// LocalStorage key for appointments
const APPOINTMENTS_STORAGE_KEY = 'mediconnect_appointments';

// Helper to load appointments from localStorage
const loadAppointmentsFromStorage = (): ExtendedAppointment[] => {
  try {
    const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load appointments from localStorage:', error);
  }
  return initialAppointments;
};

// Helper to save appointments to localStorage
const saveAppointmentsToStorage = (appointments: ExtendedAppointment[]) => {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (error) {
    console.error('Failed to save appointments to localStorage:', error);
  }
};

// Fake API simulation
interface FakeAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const simulateAPI = async <T,>(
  operation: () => T,
  failureRate: number = 0.05
): Promise<FakeAPIResponse<T>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  // Simulate random failures
  if (Math.random() < failureRate) {
    return { success: false, error: 'Network error. Please try again.' };
  }
  
  return { success: true, data: operation() };
};

// Context Types
interface AppointmentContextType {
  appointments: ExtendedAppointment[];
  isLoading: boolean;
  error: string | null;
  
  // Patient Actions
  requestAppointment: (data: AppointmentRequestData) => Promise<boolean>;
  cancelAppointment: (appointmentId: string, reason?: string) => Promise<boolean>;
  acceptReschedule: (appointmentId: string) => Promise<boolean>;
  declineReschedule: (appointmentId: string) => Promise<boolean>;
  
  // Doctor Actions
  acceptAppointment: (appointmentId: string, confirmedSlot: TimeSlot) => Promise<boolean>;
  declineAppointment: (appointmentId: string, reason: DeclineReason, notes?: string) => Promise<boolean>;
  proposeReschedule: (appointmentId: string, newSlot: TimeSlot) => Promise<boolean>;
  markAsCompleted: (appointmentId: string, notes?: string) => Promise<boolean>;
  markAsNoShow: (appointmentId: string) => Promise<boolean>;
  cancelByDoctor: (appointmentId: string, reason?: string) => Promise<boolean>;
  
  // Admin Actions
  overrideStatus: (appointmentId: string, newStatus: AppointmentStatus) => Promise<boolean>;
  
  // Queries
  getPatientAppointments: (patientId: string) => ExtendedAppointment[];
  getDoctorAppointments: (doctorId: string) => ExtendedAppointment[];
  getPendingForDoctor: (doctorId: string) => ExtendedAppointment[];
  getTodaysSchedule: (doctorId: string) => ExtendedAppointment[];
  getUpcomingForPatient: (patientId: string) => ExtendedAppointment[];
  getAppointmentById: (id: string) => ExtendedAppointment | undefined;
  getStatusStats: () => Record<AppointmentStatus, number>;
  
  // Undo functionality
  undoLastAction: () => Promise<boolean>;
  canUndo: boolean;
  lastAction: string | null;
}

interface AppointmentRequestData {
  patientId: string;
  doctorId: string;
  appointmentType: AppointmentType;
  reason: string;
  requestedSlots: TimeSlot[];
  notes?: string;
  isVirtual: boolean;
}

interface UndoState {
  appointmentId: string;
  previousState: ExtendedAppointment;
  action: string;
  timestamp: number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<ExtendedAppointment[]>(() => loadAppointmentsFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<UndoState[]>([]);
  
  // Persist appointments to localStorage whenever they change
  useEffect(() => {
    saveAppointmentsToStorage(appointments);
  }, [appointments]);

  // Helper to update appointment
  const updateAppointment = useCallback((
    id: string, 
    updates: Partial<ExtendedAppointment>,
    action: string
  ) => {
    setAppointments(prev => {
      const appointment = prev.find(a => a.id === id);
      if (!appointment) return prev;
      
      // Save to undo stack
      setUndoStack(stack => [{
        appointmentId: id,
        previousState: { ...appointment },
        action,
        timestamp: Date.now()
      }, ...stack.slice(0, 9)]); // Keep last 10 actions
      
      return prev.map(a => 
        a.id === id 
          ? { ...a, ...updates, updatedAt: new Date().toISOString() }
          : a
      );
    });
  }, []);

  // Patient: Request new appointment
  const requestAppointment = useCallback(async (data: AppointmentRequestData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    const patient = patients.find(p => p.id === data.patientId);
    const doctor = doctors.find(d => d.id === data.doctorId);
    
    if (!patient || !doctor) {
      setError('Invalid patient or doctor');
      setIsLoading(false);
      return false;
    }
    
    const response = await simulateAPI(() => {
      const typeConfig = appointmentTypeConfig[data.appointmentType];
      const newAppointment: ExtendedAppointment = {
        id: `apt_${Date.now()}`,
        patientId: data.patientId,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorId: data.doctorId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        appointmentType: data.appointmentType,
        reason: data.reason,
        notes: data.notes,
        requestedSlots: data.requestedSlots,
        confirmedSlot: null,
        durationMinutes: typeConfig.duration,
        status: 'Requested',
        doctorDecision: {
          decisionAt: null,
          decisionBy: null,
          declineReason: null,
          declineNotes: null
        },
        rescheduleProposal: {
          date: null,
          time: null,
          proposedBy: null,
          proposedAt: null,
          expiresAt: null
        },
        isVirtual: data.isVirtual,
        urgency: typeConfig.urgencyDefault,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newAppointment;
    });
    
    setIsLoading(false);
    
    if (response.success && response.data) {
      setAppointments(prev => [response.data!, ...prev]);
      toast.success('Appointment request submitted', {
        description: `Your request has been sent to ${doctor.name}`
      });
      return true;
    } else {
      setError(response.error || 'Failed to request appointment');
      toast.error('Failed to submit request', { description: response.error });
      return false;
    }
  }, []);

  // Patient: Cancel appointment
  const cancelAppointment = useCallback(async (appointmentId: string, reason?: string): Promise<boolean> => {
    setIsLoading(true);
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      updateAppointment(appointmentId, {
        status: 'CancelledByPatient',
        notes: reason ? `Cancellation reason: ${reason}` : undefined
      }, 'Cancel Appointment');
      toast.success('Appointment cancelled', {
        description: 'You can undo this action for the next 30 seconds',
        action: {
          label: 'Undo',
          onClick: () => undoLastAction()
        }
      });
      return true;
    }
    
    toast.error('Failed to cancel appointment');
    return false;
  }, [updateAppointment]);

  // Patient: Accept reschedule
  const acceptReschedule = useCallback(async (appointmentId: string): Promise<boolean> => {
    setIsLoading(true);
    
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment?.rescheduleProposal.date) {
      setIsLoading(false);
      return false;
    }
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      updateAppointment(appointmentId, {
        status: 'RescheduleAccepted',
        confirmedSlot: {
          date: appointment.rescheduleProposal.date!,
          time: appointment.rescheduleProposal.time!
        },
        rescheduleProposal: {
          date: null,
          time: null,
          proposedBy: null,
          proposedAt: null,
          expiresAt: null
        }
      }, 'Accept Reschedule');
      toast.success('Reschedule accepted', {
        description: `Appointment confirmed for ${appointment.rescheduleProposal.date} at ${appointment.rescheduleProposal.time}`
      });
      return true;
    }
    
    return false;
  }, [appointments, updateAppointment]);

  // Patient: Decline reschedule
  const declineReschedule = useCallback(async (appointmentId: string): Promise<boolean> => {
    setIsLoading(true);
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      updateAppointment(appointmentId, {
        status: 'RescheduleDeclined',
        rescheduleProposal: {
          date: null,
          time: null,
          proposedBy: null,
          proposedAt: null,
          expiresAt: null
        }
      }, 'Decline Reschedule');
      toast.info('Reschedule declined');
      return true;
    }
    
    return false;
  }, [updateAppointment]);

  // Doctor: Accept appointment
  const acceptAppointment = useCallback(async (appointmentId: string, confirmedSlot: TimeSlot): Promise<boolean> => {
    setIsLoading(true);
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      updateAppointment(appointmentId, {
        status: 'Accepted',
        confirmedSlot,
        doctorDecision: {
          decisionAt: new Date().toISOString(),
          decisionBy: 'current_doctor',
          declineReason: null,
          declineNotes: null
        }
      }, 'Accept Appointment');
      toast.success('Appointment accepted');
      return true;
    }
    
    return false;
  }, [updateAppointment]);

  // Doctor: Decline appointment
  const declineAppointment = useCallback(async (
    appointmentId: string, 
    reason: DeclineReason, 
    notes?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Check if appointment is already cancelled
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment?.status.includes('Cancelled')) {
      setIsLoading(false);
      toast.error('Cannot decline a cancelled appointment');
      return false;
    }
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      updateAppointment(appointmentId, {
        status: 'Declined',
        doctorDecision: {
          decisionAt: new Date().toISOString(),
          decisionBy: 'current_doctor',
          declineReason: reason,
          declineNotes: notes || null
        }
      }, 'Decline Appointment');
      toast.success('Appointment declined');
      return true;
    }
    
    return false;
  }, [appointments, updateAppointment]);

  // Doctor: Propose reschedule
  const proposeReschedule = useCallback(async (appointmentId: string, newSlot: TimeSlot): Promise<boolean> => {
    setIsLoading(true);
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);
      
      updateAppointment(appointmentId, {
        status: 'RescheduleProposed',
        rescheduleProposal: {
          date: newSlot.date,
          time: newSlot.time,
          proposedBy: 'doctor',
          proposedAt: new Date().toISOString(),
          expiresAt: expiresAt.toISOString()
        }
      }, 'Propose Reschedule');
      toast.success('Reschedule proposed', {
        description: `Waiting for patient response`
      });
      return true;
    }
    
    return false;
  }, [updateAppointment]);

  // Doctor: Mark as completed
  const markAsCompleted = useCallback(async (appointmentId: string, notes?: string): Promise<boolean> => {
    setIsLoading(true);
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      const appointment = appointments.find(a => a.id === appointmentId);
      updateAppointment(appointmentId, {
        status: 'Completed',
        notes: notes || appointment?.notes
      }, 'Mark Completed');
      toast.success('Appointment marked as completed');
      return true;
    }
    
    return false;
  }, [appointments, updateAppointment]);

  // Doctor: Mark as no-show
  const markAsNoShow = useCallback(async (appointmentId: string): Promise<boolean> => {
    setIsLoading(true);
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      updateAppointment(appointmentId, { status: 'NoShow' }, 'Mark No Show');
      toast.warning('Appointment marked as no-show');
      return true;
    }
    
    return false;
  }, [updateAppointment]);

  // Doctor: Cancel appointment
  const cancelByDoctor = useCallback(async (appointmentId: string, reason?: string): Promise<boolean> => {
    setIsLoading(true);
    
    const response = await simulateAPI(() => true);
    setIsLoading(false);
    
    if (response.success) {
      updateAppointment(appointmentId, {
        status: 'CancelledByDoctor',
        notes: reason ? `Doctor cancellation: ${reason}` : undefined
      }, 'Cancel by Doctor');
      toast.success('Appointment cancelled');
      return true;
    }
    
    return false;
  }, [updateAppointment]);

  // Admin: Override status
  const overrideStatus = useCallback(async (appointmentId: string, newStatus: AppointmentStatus): Promise<boolean> => {
    setIsLoading(true);
    
    const response = await simulateAPI(() => true, 0.02); // Lower failure rate for admin
    setIsLoading(false);
    
    if (response.success) {
      updateAppointment(appointmentId, { status: newStatus }, `Admin Override to ${newStatus}`);
      toast.success(`Status updated to ${newStatus}`);
      return true;
    }
    
    return false;
  }, [updateAppointment]);

  // Undo last action
  const undoLastAction = useCallback(async (): Promise<boolean> => {
    if (undoStack.length === 0) return false;
    
    const lastUndo = undoStack[0];
    const timeSinceAction = Date.now() - lastUndo.timestamp;
    
    // Only allow undo within 30 seconds
    if (timeSinceAction > 30000) {
      toast.error('Undo time expired');
      return false;
    }
    
    setAppointments(prev => 
      prev.map(a => a.id === lastUndo.appointmentId ? lastUndo.previousState : a)
    );
    setUndoStack(prev => prev.slice(1));
    toast.success('Action undone');
    return true;
  }, [undoStack]);

  // Query functions
  const getPatientAppointments = useCallback((patientId: string) => 
    appointments.filter(a => a.patientId === patientId), [appointments]);

  const getDoctorAppointments = useCallback((doctorId: string) => 
    appointments.filter(a => a.doctorId === doctorId), [appointments]);

  const getPendingForDoctor = useCallback((doctorId: string) => 
    appointments.filter(a => 
      a.doctorId === doctorId && 
      ['Requested', 'PendingReview'].includes(a.status)
    ), [appointments]);

  const getTodaysSchedule = useCallback((doctorId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(a => 
        a.doctorId === doctorId && 
        a.confirmedSlot?.date === today &&
        ['Accepted', 'RescheduleAccepted'].includes(a.status)
      )
      .sort((a, b) => (a.confirmedSlot?.time || '').localeCompare(b.confirmedSlot?.time || ''));
  }, [appointments]);

  const getUpcomingForPatient = useCallback((patientId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(a => 
        a.patientId === patientId &&
        (a.confirmedSlot?.date || a.requestedSlots[0]?.date || '') >= today &&
        !['Declined', 'CancelledByPatient', 'CancelledByDoctor', 'Completed', 'NoShow'].includes(a.status)
      )
      .sort((a, b) => {
        const dateA = a.confirmedSlot?.date || a.requestedSlots[0]?.date || '';
        const dateB = b.confirmedSlot?.date || b.requestedSlots[0]?.date || '';
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
  }, [appointments]);

  const getAppointmentById = useCallback((id: string) => 
    appointments.find(a => a.id === id), [appointments]);

  const getStatusStats = useCallback(() => {
    const stats: Record<AppointmentStatus, number> = {} as Record<AppointmentStatus, number>;
    appointments.forEach(a => {
      stats[a.status] = (stats[a.status] || 0) + 1;
    });
    return stats;
  }, [appointments]);

  const value = useMemo(() => ({
    appointments,
    isLoading,
    error,
    requestAppointment,
    cancelAppointment,
    acceptReschedule,
    declineReschedule,
    acceptAppointment,
    declineAppointment,
    proposeReschedule,
    markAsCompleted,
    markAsNoShow,
    cancelByDoctor,
    overrideStatus,
    getPatientAppointments,
    getDoctorAppointments,
    getPendingForDoctor,
    getTodaysSchedule,
    getUpcomingForPatient,
    getAppointmentById,
    getStatusStats,
    undoLastAction,
    canUndo: undoStack.length > 0 && (Date.now() - undoStack[0]?.timestamp) < 30000,
    lastAction: undoStack[0]?.action || null
  }), [
    appointments, isLoading, error, undoStack,
    requestAppointment, cancelAppointment, acceptReschedule, declineReschedule,
    acceptAppointment, declineAppointment, proposeReschedule, markAsCompleted,
    markAsNoShow, cancelByDoctor, overrideStatus, getPatientAppointments,
    getDoctorAppointments, getPendingForDoctor, getTodaysSchedule,
    getUpcomingForPatient, getAppointmentById, getStatusStats, undoLastAction
  ]);

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
