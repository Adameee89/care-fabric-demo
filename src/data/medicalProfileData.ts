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

// Import patients to seed profiles for them
import { patients } from './mockData';
import { systemUsers } from './usersData';

const firstNames = {
  male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen'],
};

const randomAllergies = ['Penicillin', 'Shellfish', 'Latex', 'Aspirin', 'Bee stings', 'Peanuts', 'Eggs', 'Milk'];
const randomConditions = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Thyroid Disorder', 'Arthritis', 'COPD', 'Heart Disease', 'Chronic Kidney Disease'];
const randomMedications = ['Metformin 500mg', 'Lisinopril 10mg', 'Albuterol inhaler', 'Levothyroxine 50mcg', 'Atorvastatin 20mg', 'Omeprazole 20mg', 'Amlodipine 5mg'];

export const seedDemoProfiles = (): void => {
  const profiles = loadMedicalProfiles();
  
  // Only seed if we have very few profiles
  if (Object.keys(profiles).length >= 10) return;
  
  // Find all unique patient IDs from systemUsers that are patients
  const patientUsers = systemUsers.filter(u => u.role === 'PATIENT' && u.linkedEntityId);
  
  // Also get patient entities from mockData  
  const patientEntities = patients.slice(0, 30); // Take first 30 patients
  
  const demoProfiles: Record<string, PatientMedicalProfile> = {};
  
  // Create profiles for system users (patients)
  patientUsers.forEach((user, index) => {
    const patientEntity = patients.find(p => p.id === user.linkedEntityId);
    const isFemale = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Emily', 'Helen', 'Margaret', 'Lisa', 'Betty', 'Dorothy', 'Sandra', 'Ashley', 'Kimberly', 'Donna', 'Nancy', 'Laura', 'Michelle', 'Carol', 'Amanda'].includes(user.firstName);
    const gender: Gender = isFemale ? 'female' : 'male';
    
    // Generate random data with some variety
    const hasAllergies = Math.random() > 0.3;
    const hasConditions = Math.random() > 0.4;
    const allergies = hasAllergies 
      ? randomAllergies.slice(0, Math.floor(Math.random() * 3) + 1)
      : [];
    const conditions = hasConditions 
      ? randomConditions.slice(0, Math.floor(Math.random() * 2) + 1)
      : [];
    const medications = conditions.length > 0 
      ? randomMedications.slice(0, Math.floor(Math.random() * 2) + 1)
      : [];
    
    demoProfiles[user.id] = {
      id: `profile_${user.id}`,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: patientEntity?.dateOfBirth || `19${70 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender,
      allergies,
      chronicConditions: conditions,
      emergencyContactName: patientEntity?.emergencyContact?.name || `Emergency Contact ${index + 1}`,
      emergencyContactPhone: patientEntity?.emergencyContact?.phone || `+1-555-${String(1000 + index).padStart(4, '0')}`,
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      medications,
      notes: Math.random() > 0.7 ? 'Regular checkups recommended' : null,
      isComplete: true,
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
  
  // Also create profiles for patient entities that might be used in appointments
  patientEntities.forEach((patient, index) => {
    // Skip if we already have a profile for a user linked to this patient
    const linkedUser = systemUsers.find(u => u.linkedEntityId === patient.id);
    if (linkedUser && demoProfiles[linkedUser.id]) return;
    
    // Use patient.id as the profile key for direct lookups
    const isFemale = patient.gender === 'female';
    const gender: Gender = patient.gender === 'other' ? 'other' : patient.gender;
    
    demoProfiles[patient.id] = {
      id: `profile_${patient.id}`,
      userId: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender,
      allergies: patient.allergies || [],
      chronicConditions: patient.conditions || [],
      emergencyContactName: patient.emergencyContact?.name || null,
      emergencyContactPhone: patient.emergencyContact?.phone || null,
      bloodType: patient.bloodType,
      medications: [],
      notes: null,
      isComplete: true,
      createdAt: patient.createdAt,
      updatedAt: patient.lastVisit,
    };
  });
  
  saveMedicalProfiles({ ...profiles, ...demoProfiles });
};
