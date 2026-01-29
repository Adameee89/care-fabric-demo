import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateGenderedAvatarUrl, isDoctorId, getLinkedEntityId } from '@/lib/avatarUtils';
import { doctorAvatars } from '@/components/DoctorAvatar';

// Default avatar imports - mapped to specific user IDs
import patientMichaelAvatar from '@/assets/avatars/patient-michael.jpg';
import adminDefaultAvatar from '@/assets/avatars/admin-default.jpg';
import testimonialEmilyAvatar from '@/assets/avatars/testimonial-emily-w.jpg';
import testimonialRobertAvatar from '@/assets/avatars/testimonial-robert.jpg';

// Map user IDs to their avatars (only non-doctor specific ones)
export const defaultAvatars: Record<string, string> = {
  // Patient - linked entity IDs
  'pat_042': patientMichaelAvatar,
  
  // Admin user IDs
  'usr_admin_001': adminDefaultAvatar,
  'usr_admin_002': testimonialEmilyAvatar,
  'usr_admin_003': testimonialRobertAvatar,
  'admin_01': adminDefaultAvatar,
};

interface UserAvatarProps {
  userId: string;
  firstName: string;
  lastName: string;
  linkedEntityId?: string | null;
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

/**
 * Get the appropriate avatar source for a user
 * Priority: Custom avatar > Doctor avatar > Explicit default > Gender-aware generated
 */
const getAvatarSource = (
  userId: string,
  firstName: string,
  lastName: string,
  linkedEntityId?: string | null,
  customAvatar?: string | null
): string => {
  // 1. Custom uploaded avatar takes priority
  if (customAvatar) return customAvatar;
  
  // 2. Check if this is a doctor - use professional doctor avatars
  const entityId = getLinkedEntityId(userId, linkedEntityId || null);
  
  if (isDoctorId(userId) || isDoctorId(entityId)) {
    // Check for doctor avatar by entity ID
    const docAvatar = doctorAvatars[entityId];
    if (docAvatar) return docAvatar;
    
    // Also check by user ID pattern
    if (userId.startsWith('usr_doc_')) {
      const num = userId.replace('usr_doc_', '');
      const docId = `doc_${num}`;
      if (doctorAvatars[docId]) return doctorAvatars[docId];
    }
  }
  
  // 3. Check explicit default avatars
  if (defaultAvatars[userId]) return defaultAvatars[userId];
  if (linkedEntityId && defaultAvatars[linkedEntityId]) return defaultAvatars[linkedEntityId];
  
  // 4. Generate gender-appropriate avatar
  return generateGenderedAvatarUrl(userId, firstName, lastName);
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  firstName,
  lastName,
  linkedEntityId,
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

  const avatarSrc = getAvatarSource(userId, firstName, lastName, linkedEntityId, customAvatar);
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
