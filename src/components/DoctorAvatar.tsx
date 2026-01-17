import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
// doc_001: Dr. Emily Carter - Internal Medicine
// doc_002: Dr. James Wilson - Cardiology
// doc_003: Dr. Sarah Chen - Dermatology
// doc_004: Dr. James Smith - Internal Medicine (generated)
// doc_005: Dr. Mary Johnson - Pediatrics (generated)
// doc_006: Dr. John Williams - Orthopedics (generated)
// doc_007: Dr. Patricia Brown - Neurology (generated)
// doc_008: Dr. Robert Jones - Psychiatry (generated)
export const doctorAvatars: Record<string, string> = {
  'doc_001': doctorEmilyAvatar,
  'doc_002': doctorJamesAvatar,
  'doc_003': doctorSarahAvatar,
  'doc_004': doctorJamesSAvatar,
  'doc_005': doctorMaryAvatar,
  'doc_006': doctorJohnAvatar,
  'doc_007': doctorPatriciaAvatar,
  'doc_008': doctorRobertAvatar,
  // For remaining doctors, we'll use a rotation of existing avatars
  'doc_009': doctorEmilyAvatar,
  'doc_010': doctorJamesAvatar,
  'doc_011': doctorSarahAvatar,
  'doc_012': doctorJamesSAvatar,
  'doc_013': doctorMaryAvatar,
  'doc_014': doctorJohnAvatar,
  'doc_015': doctorPatriciaAvatar,
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
  const avatarSrc = doctorAvatars[doctorId];
  const initials = `${firstName[0]}${lastName[0]}`;

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarSrc ? (
        <AvatarImage src={avatarSrc} alt={`Dr. ${firstName} ${lastName}`} className="object-cover" />
      ) : null}
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default DoctorAvatar;
