// ============================================
// EXTENDED APPOINTMENTS & BOOKINGS DATA MODEL
// ============================================

import { doctors, patients } from './mockData';

// Appointment Status - Full Lifecycle
export type AppointmentStatus =
  | 'Requested'           // Patient submitted booking form
  | 'PendingReview'       // Awaiting doctor action
  | 'Accepted'            // Doctor approved
  | 'Declined'            // Doctor rejected
  | 'RescheduleProposed'  // New date/time proposed
  | 'RescheduleAccepted'  // Patient accepted new slot
  | 'RescheduleDeclined'  // Patient rejected proposal
  | 'CancelledByPatient'
  | 'CancelledByDoctor'
  | 'Completed'
  | 'NoShow';

export type DeclineReason =
  | 'NotAvailable'
  | 'OutsideExpertise'
  | 'InsufficientInformation'
  | 'Other';

export const declineReasonLabels: Record<DeclineReason, string> = {
  NotAvailable: 'Not available at requested time',
  OutsideExpertise: 'Outside area of expertise',
  InsufficientInformation: 'Insufficient information provided',
  Other: 'Other reason',
};

export type AppointmentType =
  | 'Initial Consultation'
  | 'Follow-up'
  | 'Routine Checkup'
  | 'Emergency'
  | 'Lab Review'
  | 'Prescription Refill'
  | 'Telemedicine';

export interface TimeSlot {
  date: string;
  time: string;
}

export interface DoctorDecision {
  decisionAt: string | null;
  decisionBy: string | null;
  declineReason: DeclineReason | null;
  declineNotes: string | null;
}

export interface RescheduleProposal {
  date: string | null;
  time: string | null;
  proposedBy: 'doctor' | 'patient' | null;
  proposedAt: string | null;
  expiresAt: string | null;
}

export interface ExtendedAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentType: AppointmentType;
  reason: string;
  notes?: string;
  requestedSlots: TimeSlot[];
  confirmedSlot: TimeSlot | null;
  durationMinutes: number;
  status: AppointmentStatus;
  previousStatus?: AppointmentStatus;
  doctorDecision: DoctorDecision;
  rescheduleProposal: RescheduleProposal;
  isVirtual: boolean;
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// Status metadata for UI
export const statusConfig: Record<AppointmentStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  description: string;
}> = {
  Requested: { 
    label: 'Requested', 
    color: 'text-info', 
    bgColor: 'bg-info/10',
    description: 'Waiting for doctor to review your request'
  },
  PendingReview: { 
    label: 'Pending Review', 
    color: 'text-warning', 
    bgColor: 'bg-warning/10',
    description: 'Doctor is reviewing your appointment request'
  },
  Accepted: { 
    label: 'Confirmed', 
    color: 'text-success', 
    bgColor: 'bg-success/10',
    description: 'Appointment confirmed'
  },
  Declined: { 
    label: 'Declined', 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10',
    description: 'Doctor declined this appointment'
  },
  RescheduleProposed: { 
    label: 'Reschedule Proposed', 
    color: 'text-secondary', 
    bgColor: 'bg-secondary/10',
    description: 'A new time has been proposed'
  },
  RescheduleAccepted: { 
    label: 'Rescheduled', 
    color: 'text-success', 
    bgColor: 'bg-success/10',
    description: 'Appointment rescheduled successfully'
  },
  RescheduleDeclined: { 
    label: 'Reschedule Declined', 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10',
    description: 'Reschedule proposal was declined'
  },
  CancelledByPatient: { 
    label: 'Cancelled', 
    color: 'text-muted-foreground', 
    bgColor: 'bg-muted',
    description: 'Cancelled by patient'
  },
  CancelledByDoctor: { 
    label: 'Cancelled by Doctor', 
    color: 'text-muted-foreground', 
    bgColor: 'bg-muted',
    description: 'Doctor cancelled this appointment'
  },
  Completed: { 
    label: 'Completed', 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    description: 'Appointment completed'
  },
  NoShow: { 
    label: 'No Show', 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10',
    description: 'Patient did not attend'
  },
};

// Generate time slots
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 8; hour < 17; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  return slots;
};

export const availableTimeSlots = generateTimeSlots();

// Appointment types with duration
export const appointmentTypeConfig: Record<AppointmentType, { duration: number; urgencyDefault: 'low' | 'medium' | 'high' }> = {
  'Initial Consultation': { duration: 45, urgencyDefault: 'medium' },
  'Follow-up': { duration: 30, urgencyDefault: 'low' },
  'Routine Checkup': { duration: 30, urgencyDefault: 'low' },
  'Emergency': { duration: 60, urgencyDefault: 'high' },
  'Lab Review': { duration: 20, urgencyDefault: 'medium' },
  'Prescription Refill': { duration: 15, urgencyDefault: 'low' },
  'Telemedicine': { duration: 30, urgencyDefault: 'medium' },
};

// Appointment reasons
const appointmentReasons = [
  'Annual physical examination',
  'Blood pressure follow-up',
  'Medication review',
  'Chest pain evaluation',
  'Diabetes management',
  'Headache/migraine',
  'Joint pain assessment',
  'Skin rash examination',
  'Anxiety/stress consultation',
  'Cold/flu symptoms',
  'Digestive issues',
  'Fatigue evaluation',
  'Weight management',
  'Sleep problems',
  'Allergy symptoms',
  'Back pain consultation',
  'Heart palpitations',
  'Breathing difficulties',
  'Vaccination consultation',
  'Pre-surgery assessment',
];

// Generate 250 extended appointments with all statuses
const generateExtendedAppointments = (): ExtendedAppointment[] => {
  const appointments: ExtendedAppointment[] = [];
  const allStatuses: AppointmentStatus[] = [
    'Requested', 'PendingReview', 'Accepted', 'Declined',
    'RescheduleProposed', 'RescheduleAccepted', 'RescheduleDeclined',
    'CancelledByPatient', 'CancelledByDoctor', 'Completed', 'NoShow'
  ];
  const appointmentTypes: AppointmentType[] = [
    'Initial Consultation', 'Follow-up', 'Routine Checkup', 'Emergency',
    'Lab Review', 'Prescription Refill', 'Telemedicine'
  ];

  for (let i = 0; i < 250; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const typeConfig = appointmentTypeConfig[appointmentType];

    // Distribute dates: 30% future, 70% past
    const isFuture = Math.random() < 0.3;
    const daysOffset = isFuture 
      ? Math.floor(Math.random() * 60) + 1 
      : -Math.floor(Math.random() * 180);
    const baseDate = new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000);
    const dateStr = baseDate.toISOString().split('T')[0];
    const timeSlot = availableTimeSlots[Math.floor(Math.random() * availableTimeSlots.length)];

    // Determine status based on date
    let status: AppointmentStatus;
    if (isFuture) {
      // Future appointments: mix of pending states
      const futureStatuses: AppointmentStatus[] = [
        'Requested', 'PendingReview', 'Accepted', 'RescheduleProposed',
        'RescheduleAccepted', 'CancelledByPatient', 'CancelledByDoctor'
      ];
      status = futureStatuses[Math.floor(Math.random() * futureStatuses.length)];
    } else {
      // Past appointments: completed or terminal states
      const pastStatuses: AppointmentStatus[] = [
        'Completed', 'Completed', 'Completed', 'NoShow', 'Declined',
        'CancelledByPatient', 'CancelledByDoctor'
      ];
      status = pastStatuses[Math.floor(Math.random() * pastStatuses.length)];
    }

    // Generate requested slots (1-3 options)
    const numSlots = Math.floor(Math.random() * 3) + 1;
    const requestedSlots: TimeSlot[] = [];
    for (let j = 0; j < numSlots; j++) {
      const slotDate = new Date(baseDate.getTime() + j * 24 * 60 * 60 * 1000);
      requestedSlots.push({
        date: slotDate.toISOString().split('T')[0],
        time: availableTimeSlots[Math.floor(Math.random() * availableTimeSlots.length)]
      });
    }

    // Confirmed slot based on status
    const confirmedSlot = ['Accepted', 'RescheduleAccepted', 'Completed', 'NoShow'].includes(status)
      ? { date: dateStr, time: timeSlot }
      : null;

    // Doctor decision for declined appointments
    const doctorDecision: DoctorDecision = status === 'Declined' ? {
      decisionAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      decisionBy: doctor.id,
      declineReason: (['NotAvailable', 'OutsideExpertise', 'InsufficientInformation', 'Other'] as DeclineReason[])[Math.floor(Math.random() * 4)],
      declineNotes: Math.random() > 0.5 ? 'Please consider booking with a specialist.' : null
    } : {
      decisionAt: ['Accepted', 'Completed', 'NoShow'].includes(status) 
        ? new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() 
        : null,
      decisionBy: ['Accepted', 'Completed', 'NoShow'].includes(status) ? doctor.id : null,
      declineReason: null,
      declineNotes: null
    };

    // Reschedule proposal
    const rescheduleProposal: RescheduleProposal = status === 'RescheduleProposed' ? {
      date: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: availableTimeSlots[Math.floor(Math.random() * availableTimeSlots.length)],
      proposedBy: Math.random() > 0.5 ? 'doctor' : 'patient',
      proposedAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
    } : {
      date: null,
      time: null,
      proposedBy: null,
      proposedAt: null,
      expiresAt: null
    };

    appointments.push({
      id: `apt_${String(i + 20000).padStart(5, '0')}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      appointmentType,
      reason: appointmentReasons[Math.floor(Math.random() * appointmentReasons.length)],
      notes: Math.random() > 0.6 ? 'Patient notes: Please review previous lab results before appointment.' : undefined,
      requestedSlots,
      confirmedSlot,
      durationMinutes: typeConfig.duration,
      status,
      doctorDecision,
      rescheduleProposal,
      isVirtual: Math.random() > 0.6,
      urgency: typeConfig.urgencyDefault,
      createdAt: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(baseDate.getTime() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // Sort by date
  return appointments.sort((a, b) => {
    const dateA = a.confirmedSlot?.date || a.requestedSlots[0]?.date || '';
    const dateB = b.confirmedSlot?.date || b.requestedSlots[0]?.date || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
};

export const extendedAppointments: ExtendedAppointment[] = generateExtendedAppointments();

// Helper functions
export const getPatientExtendedAppointments = (patientId: string): ExtendedAppointment[] =>
  extendedAppointments.filter(a => a.patientId === patientId);

export const getDoctorExtendedAppointments = (doctorId: string): ExtendedAppointment[] =>
  extendedAppointments.filter(a => a.doctorId === doctorId);

export const getAppointmentById = (id: string): ExtendedAppointment | undefined =>
  extendedAppointments.find(a => a.id === id);

export const getPendingAppointments = (doctorId: string): ExtendedAppointment[] =>
  extendedAppointments.filter(a => 
    a.doctorId === doctorId && 
    ['Requested', 'PendingReview'].includes(a.status)
  );

export const getTodaysDoctorSchedule = (doctorId: string): ExtendedAppointment[] => {
  const today = new Date().toISOString().split('T')[0];
  return extendedAppointments
    .filter(a => 
      a.doctorId === doctorId && 
      a.confirmedSlot?.date === today &&
      ['Accepted', 'RescheduleAccepted'].includes(a.status)
    )
    .sort((a, b) => (a.confirmedSlot?.time || '').localeCompare(b.confirmedSlot?.time || ''));
};

export const getUpcomingPatientAppointments = (patientId: string): ExtendedAppointment[] => {
  const today = new Date().toISOString().split('T')[0];
  return extendedAppointments
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
};

export const getAppointmentStats = () => {
  const stats: Record<AppointmentStatus, number> = {} as Record<AppointmentStatus, number>;
  extendedAppointments.forEach(a => {
    stats[a.status] = (stats[a.status] || 0) + 1;
  });
  return stats;
};
