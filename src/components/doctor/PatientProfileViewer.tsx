import { useState } from 'react';
import { PatientMedicalProfile, isCriticalAllergy } from '@/data/medicalProfileData';
import { UserAvatar } from '@/components/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Pill, 
  User, 
  Phone,
  Calendar,
  Droplets,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { cn } from '@/lib/utils';

interface PatientProfileViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: PatientMedicalProfile | null;
  patientId: string;
  patientName: string;
}

export const PatientProfileViewer = ({ 
  open, 
  onOpenChange, 
  profile, 
  patientId,
  patientName 
}: PatientProfileViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const calculateAge = (dob: string): number => {
    return differenceInYears(new Date(), new Date(dob));
  };
  
  const hasAnyContent = profile && (
    profile.allergies.length > 0 || 
    profile.chronicConditions.length > 0 ||
    profile.medications.length > 0
  );
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <UserAvatar 
              userId={patientId}
              firstName={profile?.firstName || patientName.split(' ')[0] || ''}
              lastName={profile?.lastName || patientName.split(' ')[1] || ''}
              size="lg"
            />
            <div>
              <SheetTitle className="text-left">{patientName}</SheetTitle>
              <SheetDescription className="text-left">
                {profile?.dateOfBirth && (
                  <span>{calculateAge(profile.dateOfBirth)} years old • </span>
                )}
                {profile?.gender && (
                  <span className="capitalize">{profile.gender.replace('_', ' ')}</span>
                )}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        {!profile ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-1">No Medical Profile</h4>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              This patient hasn't completed their medical profile yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Medical Summary - Always Visible */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Medical Summary
              </h3>
              
              {/* Allergies */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-sm">Allergies</span>
                </div>
                {profile.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pl-6">
                    {profile.allergies.map((allergy, i) => (
                      <Badge 
                        key={i}
                        variant={isCriticalAllergy(allergy) ? 'destructive' : 'secondary'}
                        className={cn(
                          "text-xs",
                          isCriticalAllergy(allergy) && "animate-pulse"
                        )}
                      >
                        {isCriticalAllergy(allergy) && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground pl-6">No known allergies</p>
                )}
              </div>
              
              {/* Chronic Conditions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-warning" />
                  <span className="font-medium text-sm">Chronic Conditions</span>
                </div>
                {profile.chronicConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pl-6">
                    {profile.chronicConditions.map((condition, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground pl-6">No chronic conditions</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Expandable Full Details */}
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span>Full Profile Details</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-6 pt-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {profile.dateOfBirth && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Date of Birth</p>
                        <p className="font-medium">{format(new Date(profile.dateOfBirth), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.bloodType && (
                    <div className="flex items-start gap-2">
                      <Droplets className="h-4 w-4 text-destructive mt-0.5" />
                      <div>
                        <p className="text-muted-foreground text-xs">Blood Type</p>
                        <p className="font-medium">{profile.bloodType}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Medications */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Current Medications</span>
                  </div>
                  {profile.medications.length > 0 ? (
                    <ul className="space-y-1 pl-6">
                      {profile.medications.map((med, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {med}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground pl-6">No medications listed</p>
                  )}
                </div>
                
                {/* Emergency Contact */}
                {(profile.emergencyContactName || profile.emergencyContactPhone) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-success" />
                      <span className="font-medium text-sm">Emergency Contact</span>
                    </div>
                    <div className="pl-6 text-sm">
                      {profile.emergencyContactName && <p>{profile.emergencyContactName}</p>}
                      {profile.emergencyContactPhone && (
                        <p className="text-muted-foreground">{profile.emergencyContactPhone}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Notes */}
                {profile.notes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Additional Notes</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6 italic">
                      "{profile.notes}"
                    </p>
                  </div>
                )}
                
                {/* Last Updated */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Profile last updated: {format(new Date(profile.updatedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
