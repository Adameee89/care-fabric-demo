// ============================================
// MEDICONNECT - COMPREHENSIVE MOCK DATA LAYER
// ============================================

// User Types
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
}

// Patient Model
export interface Patient {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType: string;
  conditions: string[];
  allergies: string[];
  heightCm: number;
  weightKg: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  avatar?: string;
  createdAt: string;
  lastVisit: string;
}

// Doctor Model
export interface Doctor {
  id: string;
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  availability: string[];
  patientsCount: number;
  bio: string;
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications: string[];
  languages: string[];
  consultationFee: number;
  avatar?: string;
  status: 'available' | 'busy' | 'offline';
  createdAt: string;
}

// Appointment Model
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  endTime: string;
  type: 'Initial Consultation' | 'Follow-up' | 'Routine Checkup' | 'Emergency' | 'Lab Review' | 'Prescription Refill' | 'Telemedicine';
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  reason: string;
  notes?: string;
  vitalSigns?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
  };
  isVirtual: boolean;
  createdAt: string;
}

// Prescription Model
export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  prescribingDoctor: string;
  medication: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: 'Oral' | 'Topical' | 'Injection' | 'Inhalation' | 'Sublingual';
  quantity: number;
  refillsRemaining: number;
  startDate: string;
  endDate: string | null;
  instructions: string;
  warnings: string[];
  status: 'Active' | 'Completed' | 'Discontinued' | 'Pending Refill';
  pharmacy?: {
    name: string;
    phone: string;
    address: string;
  };
  createdAt: string;
}

// Lab Result Model
export interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  orderedBy: string;
  testName: string;
  category: 'Blood Work' | 'Urine Analysis' | 'Imaging' | 'Cardiac' | 'Metabolic' | 'Thyroid' | 'Other';
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Slightly Elevated' | 'Slightly Low' | 'Pending';
  date: string;
  notes?: string;
  attachmentUrl?: string;
  createdAt: string;
}

// Medical Document Model
export interface MedicalDocument {
  id: string;
  patientId: string;
  title: string;
  type: 'Lab Report' | 'Prescription' | 'Imaging' | 'Referral' | 'Insurance' | 'Consent Form' | 'Discharge Summary' | 'Medical History';
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  fileType: string;
  description?: string;
}

// Vital Signs Record
export interface VitalSign {
  id: string;
  patientId: string;
  date: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  notes?: string;
}

// Message Model
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
}

// AI Chat Message
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: string[];
  disclaimer?: string;
}

// Activity Log Model
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  category: 'Authentication' | 'Patient Care' | 'Prescription' | 'Appointment' | 'System' | 'AI Usage' | 'Document';
}

// Notification Model
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'appointment' | 'prescription' | 'lab' | 'message' | 'system';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ============================================
// DEMO USERS
// ============================================

export const demoUsers: Record<UserRole, User> = {
  patient: {
    id: 'pat_042',
    role: 'patient',
    email: 'michael.thompson@email.com',
    firstName: 'Michael',
    lastName: 'Thompson',
    createdAt: '2023-04-12T10:22:00Z',
  },
  doctor: {
    id: 'doc_001',
    role: 'doctor',
    email: 'dr.carter@mediconnect.com',
    firstName: 'Emily',
    lastName: 'Carter',
    createdAt: '2021-06-15T08:00:00Z',
  },
  admin: {
    id: 'admin_01',
    role: 'admin',
    email: 'admin@mediconnect.com',
    firstName: 'System',
    lastName: 'Administrator',
    createdAt: '2020-01-01T00:00:00Z',
  },
};

// ============================================
// PATIENTS DATA (100+ entries)
// ============================================

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
const conditions = ['Hypertension', 'Type 2 Diabetes', 'Asthma', 'Arthritis', 'High Cholesterol', 'Anxiety', 'Depression', 'GERD', 'Hypothyroidism', 'Allergic Rhinitis', 'Migraine', 'Chronic Back Pain', 'Obesity', 'Sleep Apnea', 'Atrial Fibrillation'];
const allergies = ['Penicillin', 'Sulfa Drugs', 'Aspirin', 'Ibuprofen', 'Latex', 'Peanuts', 'Shellfish', 'Eggs', 'Codeine', 'Morphine', 'Contrast Dye'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];

const generatePatients = (count: number): Patient[] => {
  const patients: Patient[] = [];
  
  // Add the main demo patient first
  patients.push({
    id: 'pat_042',
    userId: 'pat_042',
    firstName: 'Michael',
    lastName: 'Thompson',
    email: 'michael.thompson@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1986-03-15',
    age: 38,
    gender: 'male',
    bloodType: 'O+',
    conditions: ['Hypertension'],
    allergies: ['Penicillin'],
    heightCm: 178,
    weightKg: 86,
    emergencyContact: {
      name: 'Sarah Thompson',
      phone: '(555) 345-6789',
      relationship: 'Spouse',
    },
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BCB-78945612',
      groupNumber: 'GRP-45678',
    },
    address: {
      street: '456 Oak Avenue',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
    },
    createdAt: '2023-04-12T10:22:00Z',
    lastVisit: '2024-10-18T10:30:00Z',
  });

  for (let i = 1; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const cityIndex = Math.floor(Math.random() * cities.length);
    const age = Math.floor(Math.random() * 60) + 18;
    const numConditions = Math.floor(Math.random() * 3);
    const numAllergies = Math.floor(Math.random() * 2);
    
    patients.push({
      id: `pat_${String(i + 100).padStart(3, '0')}`,
      userId: `pat_${String(i + 100).padStart(3, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      dateOfBirth: `${1960 + Math.floor(Math.random() * 50)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      age,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      conditions: conditions.slice(0, numConditions),
      allergies: allergies.slice(0, numAllergies),
      heightCm: Math.floor(Math.random() * 40) + 150,
      weightKg: Math.floor(Math.random() * 60) + 50,
      emergencyContact: {
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastName}`,
        phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        relationship: ['Spouse', 'Parent', 'Sibling', 'Child'][Math.floor(Math.random() * 4)],
      },
      insurance: {
        provider: ['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Cigna', 'Humana'][Math.floor(Math.random() * 5)],
        policyNumber: `POL-${Math.floor(Math.random() * 90000000) + 10000000}`,
        groupNumber: `GRP-${Math.floor(Math.random() * 90000) + 10000}`,
      },
      address: {
        street: `${Math.floor(Math.random() * 9000) + 1000} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm'][Math.floor(Math.random() * 6)]} ${['St', 'Ave', 'Blvd', 'Dr', 'Ln'][Math.floor(Math.random() * 5)]}`,
        city: cities[cityIndex],
        state: states[cityIndex],
        zip: `${Math.floor(Math.random() * 90000) + 10000}`,
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000 * 3)).toISOString(),
      lastVisit: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
    });
  }
  
  return patients;
};

export const patients: Patient[] = generatePatients(120);

// ============================================
// DOCTORS DATA
// ============================================

const specialties = ['Internal Medicine', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'Pediatrics', 'Psychiatry', 'Oncology', 'Endocrinology', 'Gastroenterology'];

export const doctors: Doctor[] = [
  {
    id: 'doc_001',
    userId: 'doc_001',
    name: 'Dr. Emily Carter',
    firstName: 'Emily',
    lastName: 'Carter',
    email: 'dr.carter@mediconnect.com',
    phone: '(555) 111-2222',
    specialty: 'Internal Medicine',
    licenseNumber: 'MD-784512',
    yearsExperience: 12,
    rating: 4.8,
    reviewCount: 247,
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    patientsCount: 120,
    bio: 'Dr. Emily Carter is a board-certified internist with over 12 years of experience in primary care. She specializes in preventive medicine, chronic disease management, and patient-centered care.',
    education: [
      { degree: 'MD', institution: 'Johns Hopkins University School of Medicine', year: 2009 },
      { degree: 'Residency', institution: 'Massachusetts General Hospital', year: 2012 },
    ],
    certifications: ['American Board of Internal Medicine', 'Advanced Cardiovascular Life Support'],
    languages: ['English', 'Spanish'],
    consultationFee: 150,
    status: 'available',
    createdAt: '2021-06-15T08:00:00Z',
  },
  {
    id: 'doc_002',
    userId: 'doc_002',
    name: 'Dr. James Wilson',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'dr.wilson@mediconnect.com',
    phone: '(555) 222-3333',
    specialty: 'Cardiology',
    licenseNumber: 'MD-856214',
    yearsExperience: 18,
    rating: 4.9,
    reviewCount: 312,
    availability: ['Monday', 'Wednesday', 'Friday'],
    patientsCount: 85,
    bio: 'Dr. James Wilson is a renowned cardiologist specializing in interventional cardiology and heart failure management. He has pioneered several minimally invasive procedures.',
    education: [
      { degree: 'MD', institution: 'Stanford University School of Medicine', year: 2003 },
      { degree: 'Fellowship', institution: 'Cleveland Clinic', year: 2007 },
    ],
    certifications: ['American Board of Cardiology', 'Interventional Cardiology'],
    languages: ['English', 'French'],
    consultationFee: 250,
    status: 'busy',
    createdAt: '2019-03-20T08:00:00Z',
  },
  {
    id: 'doc_003',
    userId: 'doc_003',
    name: 'Dr. Sarah Chen',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'dr.chen@mediconnect.com',
    phone: '(555) 333-4444',
    specialty: 'Dermatology',
    licenseNumber: 'MD-912456',
    yearsExperience: 8,
    rating: 4.7,
    reviewCount: 189,
    availability: ['Tuesday', 'Wednesday', 'Thursday'],
    patientsCount: 150,
    bio: 'Dr. Sarah Chen specializes in medical and cosmetic dermatology, with expertise in skin cancer detection, acne treatment, and anti-aging procedures.',
    education: [
      { degree: 'MD', institution: 'UCLA School of Medicine', year: 2013 },
      { degree: 'Residency', institution: 'NYU Langone Health', year: 2017 },
    ],
    certifications: ['American Board of Dermatology', 'Mohs Surgery'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    consultationFee: 175,
    status: 'available',
    createdAt: '2020-09-01T08:00:00Z',
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `doc_${String(i + 4).padStart(3, '0')}`,
    userId: `doc_${String(i + 4).padStart(3, '0')}`,
    name: `Dr. ${firstNames[i]} ${lastNames[i]}`,
    firstName: firstNames[i],
    lastName: lastNames[i],
    email: `dr.${lastNames[i].toLowerCase()}@mediconnect.com`,
    phone: `(555) ${400 + i}${Math.floor(Math.random() * 9000) + 1000}`,
    specialty: specialties[i % specialties.length],
    licenseNumber: `MD-${Math.floor(Math.random() * 900000) + 100000}`,
    yearsExperience: Math.floor(Math.random() * 25) + 3,
    rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 300) + 50,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].filter(() => Math.random() > 0.4),
    patientsCount: Math.floor(Math.random() * 150) + 30,
    bio: `Experienced ${specialties[i % specialties.length]} specialist dedicated to providing exceptional patient care.`,
    education: [
      { degree: 'MD', institution: ['Harvard', 'Yale', 'Stanford', 'Columbia', 'Penn'][i % 5] + ' School of Medicine', year: 2000 + Math.floor(Math.random() * 15) },
    ],
    certifications: [`American Board of ${specialties[i % specialties.length]}`],
    languages: ['English', ['Spanish', 'French', 'German', 'Mandarin', 'Hindi'][i % 5]],
    consultationFee: Math.floor(Math.random() * 150) + 100,
    status: ['available', 'busy', 'offline'][i % 3] as 'available' | 'busy' | 'offline',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000 * 4)).toISOString(),
  })),
];

// ============================================
// APPOINTMENTS DATA (150+ entries)
// ============================================

const appointmentTypes: Appointment['type'][] = ['Initial Consultation', 'Follow-up', 'Routine Checkup', 'Emergency', 'Lab Review', 'Prescription Refill', 'Telemedicine'];
const appointmentStatuses: Appointment['status'][] = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'];
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
];

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 8; hour < 17; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export const appointments: Appointment[] = Array.from({ length: 150 }, (_, i) => {
  const patient = patients[Math.floor(Math.random() * patients.length)];
  const doctor = doctors[Math.floor(Math.random() * doctors.length)];
  const daysOffset = i < 20 ? Math.floor(Math.random() * 30) : -Math.floor(Math.random() * 180);
  const date = new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000);
  const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const endHour = hours + (minutes === 30 ? 1 : 0);
  const endMinutes = minutes === 30 ? 0 : 30;
  
  const isFuture = daysOffset >= 0;
  const statusOptions = isFuture 
    ? ['Scheduled', 'Confirmed'] 
    : ['Completed', 'Cancelled', 'No Show'];
  
  return {
    id: `apt_${String(i + 10000).padStart(5, '0')}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctorId: doctor.id,
    doctorName: doctor.name,
    date: date.toISOString().split('T')[0],
    time: timeSlot,
    endTime: `${String(endHour).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`,
    type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)] as Appointment['status'],
    reason: appointmentReasons[Math.floor(Math.random() * appointmentReasons.length)],
    notes: Math.random() > 0.5 ? 'Patient reported improvement since last visit. Continue current treatment plan.' : undefined,
    vitalSigns: Math.random() > 0.3 ? {
      bloodPressure: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
      heartRate: 60 + Math.floor(Math.random() * 40),
      temperature: parseFloat((97 + Math.random() * 2).toFixed(1)),
      weight: 120 + Math.floor(Math.random() * 80),
    } : undefined,
    isVirtual: Math.random() > 0.7,
    createdAt: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

// Get appointments for a specific date (for doctor's daily schedule)
export const getTodaysAppointments = (doctorId: string): Appointment[] => {
  const today = new Date().toISOString().split('T')[0];
  return appointments
    .filter(apt => apt.doctorId === doctorId && apt.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
};

// ============================================
// PRESCRIPTIONS DATA
// ============================================

const medications = [
  { name: 'Lisinopril', generic: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', route: 'Oral' as const },
  { name: 'Metformin', generic: 'Metformin HCL', dosage: '500mg', frequency: 'Twice daily', route: 'Oral' as const },
  { name: 'Atorvastatin', generic: 'Atorvastatin Calcium', dosage: '20mg', frequency: 'Once daily at bedtime', route: 'Oral' as const },
  { name: 'Omeprazole', generic: 'Omeprazole', dosage: '20mg', frequency: 'Once daily before breakfast', route: 'Oral' as const },
  { name: 'Amlodipine', generic: 'Amlodipine Besylate', dosage: '5mg', frequency: 'Once daily', route: 'Oral' as const },
  { name: 'Levothyroxine', generic: 'Levothyroxine Sodium', dosage: '50mcg', frequency: 'Once daily on empty stomach', route: 'Oral' as const },
  { name: 'Albuterol', generic: 'Albuterol Sulfate', dosage: '90mcg', frequency: 'As needed', route: 'Inhalation' as const },
  { name: 'Sertraline', generic: 'Sertraline HCL', dosage: '50mg', frequency: 'Once daily', route: 'Oral' as const },
  { name: 'Gabapentin', generic: 'Gabapentin', dosage: '300mg', frequency: 'Three times daily', route: 'Oral' as const },
  { name: 'Prednisone', generic: 'Prednisone', dosage: '10mg', frequency: 'As directed', route: 'Oral' as const },
];

export const prescriptions: Prescription[] = Array.from({ length: 80 }, (_, i) => {
  const patient = patients[Math.floor(Math.random() * patients.length)];
  const doctor = doctors[Math.floor(Math.random() * doctors.length)];
  const med = medications[Math.floor(Math.random() * medications.length)];
  const startDate = new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000);
  const isActive = Math.random() > 0.3;
  
  return {
    id: `rx_${String(i + 10000).padStart(5, '0')}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctorId: doctor.id,
    prescribingDoctor: doctor.name,
    medication: med.name,
    genericName: med.generic,
    dosage: med.dosage,
    frequency: med.frequency,
    route: med.route,
    quantity: [30, 60, 90][Math.floor(Math.random() * 3)],
    refillsRemaining: Math.floor(Math.random() * 6),
    startDate: startDate.toISOString().split('T')[0],
    endDate: isActive ? null : new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    instructions: `Take ${med.dosage} ${med.frequency.toLowerCase()}. ${Math.random() > 0.5 ? 'Take with food.' : 'May take with or without food.'}`,
    warnings: ['May cause drowsiness', 'Do not drink alcohol', 'Avoid grapefruit'].slice(0, Math.floor(Math.random() * 2) + 1),
    status: isActive ? 'Active' : (['Completed', 'Discontinued'][Math.floor(Math.random() * 2)] as 'Completed' | 'Discontinued'),
    pharmacy: {
      name: ['CVS Pharmacy', 'Walgreens', 'Rite Aid', 'Costco Pharmacy'][Math.floor(Math.random() * 4)],
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: `${Math.floor(Math.random() * 9000) + 1000} Main St`,
    },
    createdAt: startDate.toISOString(),
  };
});

// ============================================
// LAB RESULTS DATA
// ============================================

const labTests = [
  { name: 'Blood Pressure', category: 'Cardiac' as const, unit: 'mmHg', range: '120/80', valueGen: () => `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}` },
  { name: 'Fasting Glucose', category: 'Metabolic' as const, unit: 'mg/dL', range: '70-100', valueGen: () => String(70 + Math.floor(Math.random() * 60)) },
  { name: 'HbA1c', category: 'Metabolic' as const, unit: '%', range: '<5.7', valueGen: () => (4.5 + Math.random() * 3).toFixed(1) },
  { name: 'Total Cholesterol', category: 'Blood Work' as const, unit: 'mg/dL', range: '<200', valueGen: () => String(150 + Math.floor(Math.random() * 100)) },
  { name: 'LDL Cholesterol', category: 'Blood Work' as const, unit: 'mg/dL', range: '<100', valueGen: () => String(70 + Math.floor(Math.random() * 80)) },
  { name: 'HDL Cholesterol', category: 'Blood Work' as const, unit: 'mg/dL', range: '>40', valueGen: () => String(35 + Math.floor(Math.random() * 40)) },
  { name: 'Triglycerides', category: 'Blood Work' as const, unit: 'mg/dL', range: '<150', valueGen: () => String(80 + Math.floor(Math.random() * 120)) },
  { name: 'TSH', category: 'Thyroid' as const, unit: 'mIU/L', range: '0.4-4.0', valueGen: () => (0.3 + Math.random() * 5).toFixed(2) },
  { name: 'Complete Blood Count', category: 'Blood Work' as const, unit: 'cells/mcL', range: 'See ranges', valueGen: () => 'Within normal limits' },
  { name: 'Urinalysis', category: 'Urine Analysis' as const, unit: '-', range: 'Normal', valueGen: () => 'Normal' },
  { name: 'Creatinine', category: 'Metabolic' as const, unit: 'mg/dL', range: '0.7-1.3', valueGen: () => (0.6 + Math.random() * 1).toFixed(2) },
  { name: 'eGFR', category: 'Metabolic' as const, unit: 'mL/min', range: '>60', valueGen: () => String(60 + Math.floor(Math.random() * 50)) },
];

const labStatuses: LabResult['status'][] = ['Normal', 'Abnormal', 'Slightly Elevated', 'Slightly Low', 'Critical', 'Pending'];

export const labResults: LabResult[] = Array.from({ length: 100 }, (_, i) => {
  const patient = patients[Math.floor(Math.random() * patients.length)];
  const doctor = doctors[Math.floor(Math.random() * doctors.length)];
  const test = labTests[Math.floor(Math.random() * labTests.length)];
  const date = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
  
  return {
    id: `lab_${String(i + 70000).padStart(5, '0')}`,
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    orderedBy: doctor.name,
    testName: test.name,
    category: test.category,
    value: test.valueGen(),
    unit: test.unit,
    referenceRange: test.range,
    status: labStatuses[Math.floor(Math.random() * labStatuses.length)],
    date: date.toISOString().split('T')[0],
    notes: Math.random() > 0.7 ? 'Please schedule follow-up in 3 months.' : undefined,
    createdAt: date.toISOString(),
  };
});

// ============================================
// MEDICAL DOCUMENTS DATA
// ============================================

const documentTypes: MedicalDocument['type'][] = ['Lab Report', 'Prescription', 'Imaging', 'Referral', 'Insurance', 'Consent Form', 'Discharge Summary', 'Medical History'];

export const medicalDocuments: MedicalDocument[] = Array.from({ length: 50 }, (_, i) => {
  const patient = patients[Math.floor(Math.random() * patients.length)];
  const type = documentTypes[Math.floor(Math.random() * documentTypes.length)];
  const date = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
  
  return {
    id: `doc_${String(i + 50000).padStart(5, '0')}`,
    patientId: patient.id,
    title: `${type} - ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
    type,
    category: type,
    uploadedBy: doctors[Math.floor(Math.random() * doctors.length)].name,
    uploadedAt: date.toISOString(),
    fileSize: `${Math.floor(Math.random() * 5000) + 100} KB`,
    fileType: ['PDF', 'PDF', 'PDF', 'JPEG', 'PNG'][Math.floor(Math.random() * 5)],
    description: `${type} document for patient ${patient.firstName} ${patient.lastName}`,
  };
});

// ============================================
// VITAL SIGNS HISTORY
// ============================================

export const vitalSignsHistory: VitalSign[] = Array.from({ length: 50 }, (_, i) => {
  const patient = patients[Math.floor(Math.random() * Math.min(20, patients.length))];
  const date = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
  
  return {
    id: `vital_${String(i + 1000).padStart(4, '0')}`,
    patientId: patient.id,
    date: date.toISOString(),
    bloodPressureSystolic: 110 + Math.floor(Math.random() * 30),
    bloodPressureDiastolic: 70 + Math.floor(Math.random() * 20),
    heartRate: 60 + Math.floor(Math.random() * 40),
    temperature: parseFloat((97 + Math.random() * 2).toFixed(1)),
    respiratoryRate: 12 + Math.floor(Math.random() * 8),
    oxygenSaturation: 95 + Math.floor(Math.random() * 5),
    weight: 150 + Math.floor(Math.random() * 50),
  };
});

// ============================================
// MESSAGES DATA
// ============================================

const messageContents = [
  'Thank you for the prescription refill. I have a question about the dosage.',
  'My symptoms have improved since our last appointment.',
  'Can I schedule a follow-up for next week?',
  'I received my lab results. Could you explain them?',
  'The medication is working well, no side effects so far.',
  'I need to reschedule my appointment.',
  'When should I start the new medication?',
  'I have been experiencing some mild headaches.',
];

export const messages: Message[] = Array.from({ length: 30 }, (_, i) => {
  const patient = patients[Math.floor(Math.random() * Math.min(10, patients.length))];
  const doctor = doctors[0];
  const isPatientSender = Math.random() > 0.4;
  const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
  
  return {
    id: `msg_${String(i + 1000).padStart(4, '0')}`,
    conversationId: `conv_${patient.id}_${doctor.id}`,
    senderId: isPatientSender ? patient.id : doctor.id,
    senderName: isPatientSender ? `${patient.firstName} ${patient.lastName}` : doctor.name,
    senderRole: isPatientSender ? 'patient' : 'doctor',
    recipientId: isPatientSender ? doctor.id : patient.id,
    content: messageContents[Math.floor(Math.random() * messageContents.length)],
    timestamp: date.toISOString(),
    isRead: Math.random() > 0.3,
  };
});

// ============================================
// AI CHAT DEMO RESPONSES
// ============================================

export const aiDemoResponses: AIChatMessage[] = [
  {
    id: 'ai_1',
    role: 'assistant',
    content: "Based on your description of persistent headaches and fatigue, these symptoms could be related to various factors including stress, dehydration, sleep issues, or tension. However, I'm an AI assistant and cannot provide medical diagnoses. I recommend discussing these symptoms with your healthcare provider who can properly evaluate your condition.",
    timestamp: new Date().toISOString(),
    confidence: 0.72,
    sources: ['Mayo Clinic', 'CDC Guidelines'],
    disclaimer: 'This is not a medical diagnosis. Please consult your doctor for proper evaluation.',
  },
  {
    id: 'ai_2',
    role: 'assistant',
    content: "Your blood pressure reading of 128/82 mmHg is slightly elevated compared to the normal range (120/80 mmHg). While this isn't immediately concerning, it's worth monitoring. Consider lifestyle modifications like reducing sodium intake, regular exercise, and stress management. Your doctor can provide personalized recommendations.",
    timestamp: new Date().toISOString(),
    confidence: 0.85,
    sources: ['American Heart Association'],
    disclaimer: 'This is informational only. Consult your healthcare provider for medical advice.',
  },
];

// ============================================
// ACTIVITY LOGS (500+ entries)
// ============================================

const actionTemplates = [
  { action: 'User Login', category: 'Authentication' as const },
  { action: 'User Logout', category: 'Authentication' as const },
  { action: 'Viewed Patient Record', category: 'Patient Care' as const },
  { action: 'Updated Patient Information', category: 'Patient Care' as const },
  { action: 'Created Prescription', category: 'Prescription' as const },
  { action: 'Refilled Prescription', category: 'Prescription' as const },
  { action: 'Scheduled Appointment', category: 'Appointment' as const },
  { action: 'Cancelled Appointment', category: 'Appointment' as const },
  { action: 'Completed Appointment', category: 'Appointment' as const },
  { action: 'Uploaded Document', category: 'Document' as const },
  { action: 'AI Symptom Check', category: 'AI Usage' as const },
  { action: 'AI Chat Session', category: 'AI Usage' as const },
  { action: 'System Configuration Changed', category: 'System' as const },
  { action: 'Password Reset', category: 'Authentication' as const },
  { action: 'Two-Factor Authentication Enabled', category: 'Authentication' as const },
];

export const activityLogs: ActivityLog[] = Array.from({ length: 500 }, (_, i) => {
  const users = [...patients.slice(0, 30), ...doctors];
  const user = users[Math.floor(Math.random() * users.length)];
  const template = actionTemplates[Math.floor(Math.random() * actionTemplates.length)];
  const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 24 * 60 * 60 * 1000));
  const isPatient = 'age' in user;
  
  return {
    id: `log_${String(i + 1).padStart(6, '0')}`,
    userId: user.id,
    userName: isPatient ? `${(user as Patient).firstName} ${(user as Patient).lastName}` : (user as Doctor).name,
    userRole: (isPatient ? 'patient' : 'doctor') as UserRole,
    action: template.action,
    details: `${template.action} - ${isPatient ? 'Patient' : 'Doctor'} ${isPatient ? (user as Patient).firstName : (user as Doctor).firstName}`,
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    timestamp: date.toISOString(),
    category: template.category,
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// ============================================
// NOTIFICATIONS DATA
// ============================================

export const notifications: Notification[] = [
  {
    id: 'notif_001',
    userId: 'pat_042',
    title: 'Upcoming Appointment',
    message: 'You have an appointment with Dr. Emily Carter tomorrow at 10:30 AM.',
    type: 'info',
    category: 'appointment',
    isRead: false,
    actionUrl: '/dashboard/appointments',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif_002',
    userId: 'pat_042',
    title: 'Prescription Ready',
    message: 'Your prescription for Lisinopril is ready for pickup at CVS Pharmacy.',
    type: 'success',
    category: 'prescription',
    isRead: false,
    actionUrl: '/dashboard/prescriptions',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_003',
    userId: 'pat_042',
    title: 'Lab Results Available',
    message: 'Your recent blood work results are now available for review.',
    type: 'info',
    category: 'lab',
    isRead: true,
    actionUrl: '/dashboard/lab-results',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_004',
    userId: 'pat_042',
    title: 'New Message',
    message: 'Dr. Emily Carter sent you a new message.',
    type: 'info',
    category: 'message',
    isRead: true,
    actionUrl: '/dashboard/messages',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================
// ADMIN STATISTICS
// ============================================

export const adminStats = {
  totalPatients: patients.length,
  totalDoctors: doctors.length,
  totalAppointments: appointments.length,
  totalPrescriptions: prescriptions.length,
  activeUsers: Math.floor(patients.length * 0.7),
  appointmentsToday: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
  newPatientsThisMonth: Math.floor(Math.random() * 20) + 10,
  aiUsageThisMonth: Math.floor(Math.random() * 500) + 200,
  systemUptime: '99.98%',
  averageResponseTime: '124ms',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getPatientById = (id: string): Patient | undefined => 
  patients.find(p => p.id === id);

export const getDoctorById = (id: string): Doctor | undefined => 
  doctors.find(d => d.id === id);

export const getPatientAppointments = (patientId: string): Appointment[] => 
  appointments.filter(a => a.patientId === patientId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

export const getPatientPrescriptions = (patientId: string): Prescription[] => 
  prescriptions.filter(p => p.patientId === patientId);

export const getPatientLabResults = (patientId: string): LabResult[] => 
  labResults.filter(l => l.patientId === patientId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

export const getPatientDocuments = (patientId: string): MedicalDocument[] => 
  medicalDocuments.filter(d => d.patientId === patientId);

export const getDoctorPatients = (doctorId: string): Patient[] => {
  const patientIds = [...new Set(appointments.filter(a => a.doctorId === doctorId).map(a => a.patientId))];
  return patients.filter(p => patientIds.includes(p.id));
};

export const getDoctorAppointments = (doctorId: string, date?: string): Appointment[] => {
  let filtered = appointments.filter(a => a.doctorId === doctorId);
  if (date) {
    filtered = filtered.filter(a => a.date === date);
  }
  return filtered.sort((a, b) => a.time.localeCompare(b.time));
};
