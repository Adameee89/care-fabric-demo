import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { generateGenderedAvatarUrl } from '@/lib/avatarUtils';

// Import doctor avatars
import doctorEmilyAvatar from '@/assets/avatars/doctor-emily.jpg';
import doctorJamesAvatar from '@/assets/avatars/doctor-james.jpg';
import doctorSarahAvatar from '@/assets/avatars/doctor-sarah.jpg';
import doctorJamesSAvatar from '@/assets/avatars/doctor-james-s.jpg';
import doctorMaryAvatar from '@/assets/avatars/doctor-mary.jpg';
import doctorJohnAvatar from '@/assets/avatars/doctor-john.jpg';
import doctorPatriciaAvatar from '@/assets/avatars/doctor-patricia.jpg';
import doctorRobertAvatar from '@/assets/avatars/doctor-robert.jpg';

// Map doctor IDs to their avatar images
// Curated professional doctor photos for first 8 doctors
export const doctorAvatars: Record<string, string> = {
  'doc_001': doctorEmilyAvatar,    // Dr. Emily Carter - Internal Medicine (Female)
  'doc_002': doctorJamesAvatar,    // Dr. James Wilson - Cardiology (Male)
  'doc_003': doctorSarahAvatar,    // Dr. Sarah Chen - Dermatology (Female)
  'doc_004': doctorJamesSAvatar,   // Dr. Michael Rodriguez - (Male)
  'doc_005': doctorMaryAvatar,     // Dr. Jennifer Patel (Female)
  'doc_006': doctorJohnAvatar,     // Dr. David Kim (Male)
  'doc_007': doctorPatriciaAvatar, // Dr. Lisa Thompson (Female)
  'doc_008': doctorRobertAvatar,   // Dr. Robert Garcia (Male)
};

interface DoctorAvatarProps {
  doctorId: string;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({
  doctorId,
  firstName,
  lastName,
  size = 'md',
  className,
}) => {
  // First check curated doctor avatars
  const curatedAvatar = doctorAvatars[doctorId];
  
  // If no curated avatar, generate a gender-appropriate one
  const avatarSrc = curatedAvatar || generateGenderedAvatarUrl(doctorId, firstName, lastName);
  const initials = `${firstName[0]}${lastName[0]}`;

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={avatarSrc} alt={`Dr. ${firstName} ${lastName}`} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default DoctorAvatar;
