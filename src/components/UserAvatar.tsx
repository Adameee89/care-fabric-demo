import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

// Default avatar imports - mapped to specific user IDs
import patientMichaelAvatar from '@/assets/avatars/patient-michael.jpg';
import doctorEmilyAvatar from '@/assets/avatars/doctor-emily.jpg';
import doctorJamesAvatar from '@/assets/avatars/doctor-james.jpg';
import doctorJamesSAvatar from '@/assets/avatars/doctor-james-s.jpg';
import doctorSarahAvatar from '@/assets/avatars/doctor-sarah.jpg';
import doctorJohnAvatar from '@/assets/avatars/doctor-john.jpg';
import doctorMaryAvatar from '@/assets/avatars/doctor-mary.jpg';
import doctorPatriciaAvatar from '@/assets/avatars/doctor-patricia.jpg';
import doctorRobertAvatar from '@/assets/avatars/doctor-robert.jpg';
import adminDefaultAvatar from '@/assets/avatars/admin-default.jpg';
import testimonialEmilyAvatar from '@/assets/avatars/testimonial-emily-w.jpg';
import testimonialJamesAvatar from '@/assets/avatars/testimonial-james.jpg';
import testimonialLisaAvatar from '@/assets/avatars/testimonial-lisa.jpg';
import testimonialMichaelAvatar from '@/assets/avatars/testimonial-michael.jpg';
import testimonialRobertAvatar from '@/assets/avatars/testimonial-robert.jpg';
import testimonialSarahAvatar from '@/assets/avatars/testimonial-sarah.jpg';

// Map user IDs to their avatars
export const defaultAvatars: Record<string, string> = {
  // Patient - linked entity IDs
  'pat_042': patientMichaelAvatar,
  
  // Doctors - linked entity IDs (doc_001 to doc_020)
  'doc_001': doctorEmilyAvatar,
  'doc_002': doctorJamesAvatar,
  'doc_003': doctorSarahAvatar,
  'doc_004': testimonialMichaelAvatar,
  'doc_005': testimonialJamesAvatar,
  'doc_006': doctorMaryAvatar,
  'doc_007': testimonialLisaAvatar,
  'doc_008': doctorRobertAvatar,
  'doc_009': testimonialEmilyAvatar,
  'doc_010': doctorJohnAvatar,
  'doc_011': testimonialSarahAvatar,
  'doc_012': doctorJamesSAvatar,
  'doc_013': testimonialRobertAvatar,
  'doc_014': doctorPatriciaAvatar,
  
  // Admin user IDs
  'usr_admin_001': adminDefaultAvatar,
  'usr_admin_002': testimonialEmilyAvatar,
  'usr_admin_003': testimonialRobertAvatar,
  'admin_01': adminDefaultAvatar,
};

// Generate a deterministic realistic avatar URL for users without a specific avatar
const generateAvatarUrl = (userId: string, firstName: string, lastName: string): string => {
  // Use pravatar.cc for consistent, realistic human photos
  const seed = `${userId}-${firstName}-${lastName}`;
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
};

interface UserAvatarProps {
  userId: string;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  firstName,
  lastName,
  size = 'md',
  editable = false,
  className,
}) => {
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Load custom avatar from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`mediconnect_avatar_${userId}`);
    if (saved) {
      setCustomAvatar(saved);
    }
  }, [userId]);

  // Check for default avatar, otherwise generate one
  const defaultAvatar = defaultAvatars[userId];
  const generatedAvatar = !defaultAvatar ? generateAvatarUrl(userId, firstName, lastName) : null;
  const avatarSrc = customAvatar || defaultAvatar || generatedAvatar;
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`;

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setCustomAvatar(base64);
        localStorage.setItem(`mediconnect_avatar_${userId}`, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (editable) {
    return (
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className={cn(sizeClasses[size], 'transition-all', className)}>
          <AvatarImage src={avatarSrc} alt={`${firstName} ${lastName}`} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay for edit */}
        <label 
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full bg-black/50 cursor-pointer transition-opacity',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Camera className={cn('text-white', iconSizes[size])} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      </div>
    );
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={avatarSrc} alt={`${firstName} ${lastName}`} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
