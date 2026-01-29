import { useState, useMemo } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import { doctors } from '@/data/mockData';
import { AppointmentType, TimeSlot, availableTimeSlots, appointmentTypeConfig } from '@/data/appointmentData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DoctorAvatar } from '@/components/DoctorAvatar';
import { PatientMedicalProfileForm } from '@/components/patient/PatientMedicalProfileForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock, Video, MapPin, Search, X, Loader2, AlertTriangle, Heart } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookAppointmentFormProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const appointmentTypes: AppointmentType[] = [
  'Initial Consultation',
  'Follow-up',
  'Routine Checkup',
  'Emergency',
  'Lab Review',
  'Prescription Refill',
  'Telemedicine',
];

export const BookAppointmentForm = ({ patientId, open, onOpenChange }: BookAppointmentFormProps) => {
  const { requestAppointment, isLoading } = useAppointments();
  const { isProfileComplete } = useMedicalProfile();
  
  const [step, setStep] = useState(0); // Start at 0 for profile check
  const [profileFormOpen, setProfileFormOpen] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<AppointmentType | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  
  const filteredDoctors = useMemo(() => {
    const query = doctorSearch.toLowerCase();
    return doctors.filter(d => 
      d.name.toLowerCase().includes(query) ||
      d.specialty.toLowerCase().includes(query)
    );
  }, [doctorSearch]);
  
  const selectedDoctorData = useMemo(() => 
    doctors.find(d => d.id === selectedDoctor),
    [selectedDoctor]
  );
  
  const resetForm = () => {
    setStep(isProfileComplete ? 1 : 0);
    setDoctorSearch('');
    setSelectedDoctor(null);
    setAppointmentType(null);
    setReason('');
    setNotes('');
    setIsVirtual(false);
    setSelectedDates([]);
    setSelectedSlots([]);
  };
  
  // Reset step when profile completion changes
  const handleProfileComplete = () => {
    setStep(1);
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (selectedDates.some(d => d.toDateString() === date.toDateString())) {
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
      setSelectedSlots(selectedSlots.filter(s => s.date !== format(date, 'yyyy-MM-dd')));
    } else if (selectedDates.length < 3) {
      setSelectedDates([...selectedDates, date]);
    }
  };
  
  const handleTimeSelect = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existing = selectedSlots.find(s => s.date === dateStr && s.time === time);
    
    if (existing) {
      setSelectedSlots(selectedSlots.filter(s => !(s.date === dateStr && s.time === time)));
    } else {
      setSelectedSlots([...selectedSlots, { date: dateStr, time }]);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedDoctor || !appointmentType || !reason || selectedSlots.length === 0) {
      return;
    }
    
    const success = await requestAppointment({
      patientId,
      doctorId: selectedDoctor,
      appointmentType,
      reason,
      requestedSlots: selectedSlots,
      notes: notes || undefined,
      isVirtual,
    });
    
    if (success) {
      handleClose();
    }
  };
  
  const canProceed = () => {
    switch (step) {
      case 0: return isProfileComplete;
      case 1: return !!selectedDoctor;
      case 2: return !!appointmentType && reason.length >= 10;
      case 3: return selectedSlots.length > 0;
      default: return false;
    }
  };
  
  const getStepTitle = () => {
    switch (step) {
      case 0: return 'Complete Medical Profile';
      case 1: return 'Select Doctor';
      case 2: return 'Appointment Details';
      case 3: return 'Choose Time Slots';
      default: return '';
    }
  };
  
  const totalSteps = 4; // Including profile step
  
  return (
    <>
      <PatientMedicalProfileForm 
        open={profileFormOpen} 
        onOpenChange={setProfileFormOpen}
        onComplete={handleProfileComplete}
      />
      
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Book an Appointment</DialogTitle>
            <DialogDescription>
              Step {step + 1} of {totalSteps}: {getStepTitle()}
            </DialogDescription>
          </DialogHeader>
        
          {/* Progress Bar */}
          <div className="flex gap-2 mb-6">
            {[0, 1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          
          {/* Step 0: Profile Check */}
          {step === 0 && (
            <div className="space-y-6 py-8">
              <div className="flex flex-col items-center text-center">
                {isProfileComplete ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Profile Complete!</h3>
                    <p className="text-muted-foreground max-w-[300px]">
                      Your medical profile is complete. You can proceed to book an appointment.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
                      <AlertTriangle className="h-8 w-8 text-warning" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Complete Your Medical Profile</h3>
                    <p className="text-muted-foreground max-w-[300px] mb-6">
                      Before booking an appointment, please complete your medical profile. This helps doctors provide better care.
                    </p>
                    <Button onClick={() => setProfileFormOpen(true)}>
                      <Heart className="h-4 w-4 mr-2" />
                      Complete Profile
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        
        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by doctor name or specialty..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor.id)}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                    selectedDoctor === doctor.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <DoctorAvatar 
                    doctorId={doctor.id}
                    firstName={doctor.firstName}
                    lastName={doctor.lastName}
                    size="lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{doctor.name}</h4>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        ⭐ {doctor.rating}
                      </span>
                      <span>{doctor.yearsExperience}+ years</span>
                      <span>${doctor.consultationFee}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    doctor.status === 'available' ? "bg-success/10 text-success" :
                    doctor.status === 'busy' ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {doctor.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Step 2: Appointment Details */}
        {step === 2 && (
          <div className="space-y-6">
            {selectedDoctorData && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <DoctorAvatar 
                  doctorId={selectedDoctorData.id}
                  firstName={selectedDoctorData.firstName}
                  lastName={selectedDoctorData.lastName}
                  size="md"
                />
                <div>
                  <p className="font-medium">{selectedDoctorData.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedDoctorData.specialty}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Appointment Type *</Label>
              <Select
                value={appointmentType || ''}
                onValueChange={(v) => setAppointmentType(v as AppointmentType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center justify-between w-full">
                        <span>{type}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {appointmentTypeConfig[type].duration} min
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Reason for Visit * (min 10 characters)</Label>
              <Textarea
                placeholder="Describe the reason for your visit..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {reason.length}/10 characters minimum
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Additional Notes (Optional)</Label>
              <Textarea
                placeholder="Any additional information the doctor should know..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                {isVirtual ? (
                  <Video className="w-5 h-5 text-primary" />
                ) : (
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{isVirtual ? 'Virtual Visit' : 'In-Person Visit'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isVirtual ? 'Video consultation' : 'At the clinic'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isVirtual}
                onCheckedChange={setIsVirtual}
              />
            </div>
          </div>
        )}
        
        {/* Step 3: Select Time Slots */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select up to 3 preferred dates, then choose time slots for each date.
            </p>
            
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0">
                <Calendar
                  mode="single"
                  selected={selectedDates[selectedDates.length - 1]}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
                  modifiers={{
                    selected: selectedDates
                  }}
                  modifiersClassNames={{
                    selected: 'bg-primary text-primary-foreground'
                  }}
                  className="rounded-lg border"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                {selectedDates.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Select dates from the calendar
                  </div>
                ) : (
                  selectedDates.map((date) => (
                    <div key={date.toISOString()} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{format(date, 'EEEE, MMMM d')}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDateSelect(date)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableTimeSlots.map((time) => {
                          const dateStr = format(date, 'yyyy-MM-dd');
                          const isSelected = selectedSlots.some(
                            s => s.date === dateStr && s.time === time
                          );
                          return (
                            <Button
                              key={time}
                              variant={isSelected ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleTimeSelect(date, time)}
                              className="w-[72px]"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {time}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {selectedSlots.length > 0 && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium mb-2">Selected Time Slots:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSlots.map((slot, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {format(new Date(slot.date), 'MMM d')} at {slot.time}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
          <DialogFooter className="flex justify-between sm:justify-between">
            <div>
              {step > 0 && (step > 1 || !isProfileComplete) && (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canProceed() || isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Submit Request
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
