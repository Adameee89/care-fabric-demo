// ============================================
// PATIENT MEDICAL PROFILE - DATA LAYER
// ============================================

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface PatientMedicalProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: Gender | null;
  allergies: string[];
  chronicConditions: string[];
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  bloodType: string | null;
  medications: string[];
  notes: string | null;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

// Critical allergies that should be highlighted
export const criticalAllergies = [
  'Penicillin',
  'Sulfa drugs',
  'Aspirin',
  'NSAIDs',
  'Latex',
  'Bee stings',
  'Shellfish',
  'Peanuts',
  'Tree nuts',
  'Eggs',
  'Milk',
  'Soy',
  'Wheat',
  'Fish',
  'Contrast dye',
  'Anesthesia',
];

export const commonChronicConditions = [
  'Diabetes Type 1',
  'Diabetes Type 2',
  'Hypertension',
  'Asthma',
  'COPD',
  'Heart Disease',
  'Arthritis',
  'Chronic Kidney Disease',
  'Thyroid Disorder',
  'Depression',
  'Anxiety',
  'Epilepsy',
  'Cancer',
  'HIV/AIDS',
  'Hepatitis',
  'Multiple Sclerosis',
  'Parkinson\'s Disease',
  'Alzheimer\'s Disease',
];

export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ============================================
// LOCAL STORAGE PERSISTENCE
// ============================================

const STORAGE_KEY = 'mediconnect_medical_profiles';

export const loadMedicalProfiles = (): Record<string, PatientMedicalProfile> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load medical profiles:', e);
  }
  return {};
};

export const saveMedicalProfiles = (profiles: Record<string, PatientMedicalProfile>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save medical profiles:', e);
  }
};

// ============================================
// VALIDATION
// ============================================

export const validateProfileComplete = (profile: Partial<PatientMedicalProfile>): boolean => {
  return !!(
    profile.firstName?.trim() &&
    profile.lastName?.trim() &&
    profile.dateOfBirth &&
    profile.gender &&
    Array.isArray(profile.allergies) &&
    Array.isArray(profile.chronicConditions)
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const isCriticalAllergy = (allergy: string): boolean => {
  return criticalAllergies.some(
    critical => allergy.toLowerCase().includes(critical.toLowerCase())
  );
};

export const getProfileByUserId = (userId: string): PatientMedicalProfile | null => {
  const profiles = loadMedicalProfiles();
  return profiles[userId] || null;
};

export const createOrUpdateProfile = (
  userId: string,
  data: Partial<Omit<PatientMedicalProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isComplete'>>
): PatientMedicalProfile => {
  const profiles = loadMedicalProfiles();
  const existing = profiles[userId];
  const now = new Date().toISOString();
  
  const updatedProfile: PatientMedicalProfile = {
    id: existing?.id || `profile_${userId}`,
    userId,
    firstName: data.firstName ?? existing?.firstName ?? '',
    lastName: data.lastName ?? existing?.lastName ?? '',
    dateOfBirth: data.dateOfBirth ?? existing?.dateOfBirth ?? null,
    gender: data.gender ?? existing?.gender ?? null,
    allergies: data.allergies ?? existing?.allergies ?? [],
    chronicConditions: data.chronicConditions ?? existing?.chronicConditions ?? [],
    emergencyContactName: data.emergencyContactName ?? existing?.emergencyContactName ?? null,
    emergencyContactPhone: data.emergencyContactPhone ?? existing?.emergencyContactPhone ?? null,
    bloodType: data.bloodType ?? existing?.bloodType ?? null,
    medications: data.medications ?? existing?.medications ?? [],
    notes: data.notes ?? existing?.notes ?? null,
    isComplete: false,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  
  // Check if profile is complete
  updatedProfile.isComplete = validateProfileComplete(updatedProfile);
  
  profiles[userId] = updatedProfile;
  saveMedicalProfiles(profiles);
  
  return updatedProfile;
};

// ============================================
// SEED DATA FOR DEMO PATIENTS
// ============================================

export const seedDemoProfiles = (): void => {
  const profiles = loadMedicalProfiles();
  
  // Only seed if empty
  if (Object.keys(profiles).length > 0) return;
  
  // Seed first few patients with complete profiles for demo
  const demoProfiles: Record<string, PatientMedicalProfile> = {
    'usr_pat_001': {
      id: 'profile_usr_pat_001',
      userId: 'usr_pat_001',
      firstName: 'Michael',
      lastName: 'Thompson',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      allergies: ['Penicillin', 'Shellfish'],
      chronicConditions: ['Hypertension', 'Diabetes Type 2'],
      emergencyContactName: 'Sarah Thompson',
      emergencyContactPhone: '+1-555-0123',
      bloodType: 'O+',
      medications: ['Metformin 500mg', 'Lisinopril 10mg'],
      notes: 'Regular checkups every 3 months',
      isComplete: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-06-20T14:30:00Z',
    },
    'usr_pat_002': {
      id: 'profile_usr_pat_002',
      userId: 'usr_pat_002',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1978-07-22',
      gender: 'male',
      allergies: ['Latex'],
      chronicConditions: ['Asthma'],
      emergencyContactName: 'Mary Smith',
      emergencyContactPhone: '+1-555-0456',
      bloodType: 'A+',
      medications: ['Albuterol inhaler'],
      notes: null,
      isComplete: true,
      createdAt: '2024-02-10T09:00:00Z',
      updatedAt: '2024-05-15T11:00:00Z',
    },
    'usr_pat_003': {
      id: 'profile_usr_pat_003',
      userId: 'usr_pat_003',
      firstName: 'Patricia',
      lastName: 'Johnson',
      dateOfBirth: '1990-11-08',
      gender: 'female',
      allergies: [],
      chronicConditions: ['Thyroid Disorder'],
      emergencyContactName: 'Robert Johnson',
      emergencyContactPhone: '+1-555-0789',
      bloodType: 'B-',
      medications: ['Levothyroxine 50mcg'],
      notes: 'Prefers morning appointments',
      isComplete: true,
      createdAt: '2024-03-05T08:00:00Z',
      updatedAt: '2024-04-10T16:00:00Z',
    },
  };
  
  saveMedicalProfiles(demoProfiles);
};
