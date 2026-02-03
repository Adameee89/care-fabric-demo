import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  PatientMedicalProfile, 
  loadMedicalProfiles, 
  createOrUpdateProfile,
  seedDemoProfiles,
  validateProfileComplete 
} from '@/data/medicalProfileData';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface MedicalProfileContextType {
  // Current user's profile (for patients)
  myProfile: PatientMedicalProfile | null;
  isProfileComplete: boolean;
  
  // Profile operations
  updateMyProfile: (data: Partial<PatientMedicalProfile>) => Promise<boolean>;
  getProfileByUserId: (userId: string) => PatientMedicalProfile | null;
  
  // Loading state
  isLoading: boolean;
}

const MedicalProfileContext = createContext<MedicalProfileContextType | undefined>(undefined);

export const MedicalProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Record<string, PatientMedicalProfile>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Load profiles on mount and seed demo data
  useEffect(() => {
    // Always try to seed - the function checks if enough profiles exist
    seedDemoProfiles();
    setProfiles(loadMedicalProfiles());
  }, []);
  
  // Get current user's profile
  const myProfile = user?.role === 'patient' ? profiles[user.id] || null : null;
  const isProfileComplete = myProfile?.isComplete ?? false;
  
  // Update current user's profile
  const updateMyProfile = useCallback(async (data: Partial<PatientMedicalProfile>): Promise<boolean> => {
    if (!user || user.role !== 'patient') {
      toast.error('Only patients can update medical profiles');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updated = createOrUpdateProfile(user.id, data);
      setProfiles(prev => ({ ...prev, [user.id]: updated }));
      
      if (updated.isComplete) {
        toast.success('Medical profile saved successfully');
      } else {
        toast.info('Profile saved. Please complete all required fields.');
      }
      
      return true;
    } catch (error) {
      toast.error('Failed to save profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Get any patient's profile (for doctors)
  const getProfileByUserId = useCallback((userId: string): PatientMedicalProfile | null => {
    return profiles[userId] || null;
  }, [profiles]);
  
  return (
    <MedicalProfileContext.Provider
      value={{
        myProfile,
        isProfileComplete,
        updateMyProfile,
        getProfileByUserId,
        isLoading,
      }}
    >
      {children}
    </MedicalProfileContext.Provider>
  );
};

export const useMedicalProfile = (): MedicalProfileContextType => {
  const context = useContext(MedicalProfileContext);
  if (!context) {
    throw new Error('useMedicalProfile must be used within a MedicalProfileProvider');
  }
  return context;
};
