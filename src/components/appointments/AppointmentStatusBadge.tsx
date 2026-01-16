import { AppointmentStatus, statusConfig } from '@/data/appointmentData';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AppointmentStatusBadge = ({ 
  status, 
  showTooltip = true,
  size = 'md' 
}: AppointmentStatusBadgeProps) => {
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  const badge = (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        config.bgColor,
        config.color,
        sizeClasses[size]
      )}
    >
      {config.label}
    </span>
  );
  
  if (!showTooltip) return badge;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
};
