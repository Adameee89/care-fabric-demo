import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

// Default avatar imports
import patientMichaelAvatar from '@/assets/avatars/patient-michael.jpg';
import doctorEmilyAvatar from '@/assets/avatars/doctor-emily.jpg';
import adminDefaultAvatar from '@/assets/avatars/admin-default.jpg';

export const defaultAvatars = {
  'pat_042': patientMichaelAvatar,
  'doc_001': doctorEmilyAvatar,
  'admin_01': adminDefaultAvatar,
} as const;

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

  const defaultAvatar = defaultAvatars[userId as keyof typeof defaultAvatars];
  const avatarSrc = customAvatar || defaultAvatar;
  const initials = `${firstName[0]}${lastName[0]}`;

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
