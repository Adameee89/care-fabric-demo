import { useState } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import { useAppointmentNotifications } from '@/hooks/useAppointmentNotifications';
import { ExtendedAppointment, DeclineReason, declineReasonLabels, availableTimeSlots } from '@/data/appointmentData';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';
import { PatientProfileViewer } from '@/components/doctor/PatientProfileViewer';
import { patients } from '@/data/mockData';
import { systemUsers } from '@/data/usersData';
import { Calendar, Clock, User, Check, X, RefreshCw, AlertTriangle, Loader2, Info, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface DoctorAppointmentInboxProps {
  doctorId: string;
}

export const DoctorAppointmentInbox = ({ doctorId }: DoctorAppointmentInboxProps) => {
  const { getPendingForDoctor, acceptAppointment, declineAppointment, proposeReschedule, isLoading } = useAppointments();
  const { getProfileByUserId } = useMedicalProfile();
  const { sendNotification } = useAppointmentNotifications();
  
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<ExtendedAppointment | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [declineReason, setDeclineReason] = useState<DeclineReason>('NotAvailable');
  const [declineNotes, setDeclineNotes] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [profileViewerOpen, setProfileViewerOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<{ id: string; name: string } | null>(null);
  
  const pendingAppointments = getPendingForDoctor(doctorId);
  
  // Helper to find patient user ID from linked entity
  const findPatientUserId = (patientId: string): string | null => {
    // Try to find in systemUsers by linkedEntityId
    const user = systemUsers.find(u => u.linkedEntityId === patientId);
    return user?.id || patientId;
  };
  
  const handleAccept = async () => {
    if (!selectedAppointment) return;
    const slot = selectedAppointment.requestedSlots[selectedSlotIndex];
    const success = await acceptAppointment(selectedAppointment.id, slot);
    
    if (success) {
      // Send notification to patient
      sendNotification('accept', {
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patientId,
        patientName: selectedAppointment.patientName,
        doctorId: selectedAppointment.doctorId,
        doctorName: selectedAppointment.doctorName,
        date: slot.date,
        time: slot.time,
      });
    }
    
    setAcceptDialogOpen(false);
    setSelectedAppointment(null);
  };
  
  const handleDecline = async () => {
    if (!selectedAppointment) return;
    const success = await declineAppointment(selectedAppointment.id, declineReason, declineNotes || undefined);
    
    if (success) {
      // Send notification to patient
      sendNotification('decline', {
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patientId,
        patientName: selectedAppointment.patientName,
        doctorId: selectedAppointment.doctorId,
        doctorName: selectedAppointment.doctorName,
      });
    }
    
    setDeclineDialogOpen(false);
    setSelectedAppointment(null);
    setDeclineNotes('');
  };
  
  const handleReschedule = async () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return;
    const dateStr = format(rescheduleDate, 'yyyy-MM-dd');
    const success = await proposeReschedule(selectedAppointment.id, { date: dateStr, time: rescheduleTime });
    
    if (success) {
      // Send notification to patient
      sendNotification('reschedule_propose', {
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patientId,
        patientName: selectedAppointment.patientName,
        doctorId: selectedAppointment.doctorId,
        doctorName: selectedAppointment.doctorName,
        date: dateStr,
        time: rescheduleTime,
      });
    }
    
    setRescheduleDialogOpen(false);
    setSelectedAppointment(null);
  };
  
  const handleViewProfile = (patientId: string, patientName: string) => {
    const userId = findPatientUserId(patientId);
    setViewingPatient({ id: userId || patientId, name: patientName });
    setProfileViewerOpen(true);
  };
  
  if (pendingAppointments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Check className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">All caught up!</p>
        <p className="text-sm">No pending appointment requests</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Pending Requests ({pendingAppointments.length})</h3>
      </div>
      
      {/* Patient Profile Viewer */}
      <PatientProfileViewer
        open={profileViewerOpen}
        onOpenChange={setProfileViewerOpen}
        profile={viewingPatient ? getProfileByUserId(viewingPatient.id) : null}
        patientId={viewingPatient?.id || ''}
        patientName={viewingPatient?.name || ''}
      />
      
      {pendingAppointments.map((apt) => {
        const patient = patients.find(p => p.id === apt.patientId);
        const patientUserId = findPatientUserId(apt.patientId);
        const hasProfile = patientUserId ? !!getProfileByUserId(patientUserId) : false;
        
        return (
          <div key={apt.id} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {patient ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleViewProfile(apt.patientId, apt.patientName)}
                        className="relative group"
                      >
                        <UserAvatar 
                          userId={patient.id}
                          firstName={patient.firstName}
                          lastName={patient.lastName}
                          size="md"
                        />
                        <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Info className="h-4 w-4 text-primary" />
                        </div>
                        {hasProfile && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                            <Heart className="h-2.5 w-2.5 text-success-foreground" />
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View patient profile</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div>
                  <button 
                    className="font-medium hover:text-primary hover:underline transition-colors text-left"
                    onClick={() => handleViewProfile(apt.patientId, apt.patientName)}
                  >
                    {apt.patientName}
                  </button>
                  <p className="text-sm text-muted-foreground">{apt.appointmentType}</p>
                </div>
              </div>
              <AppointmentStatusBadge status={apt.status} size="sm" />
            </div>
          
          <p className="text-sm mb-3 p-2 rounded bg-muted/50">{apt.reason}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {apt.requestedSlots.map((slot, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-info/10 text-info text-sm">
                {format(new Date(slot.date), 'MMM d')} @ {slot.time}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 pt-3 border-t">
            <Button size="sm" className="flex-shrink-0" onClick={() => { setSelectedAppointment(apt); setAcceptDialogOpen(true); }}>
              <Check className="w-4 h-4 mr-1" /> Accept
            </Button>
            <Button size="sm" variant="outline" className="flex-shrink-0" onClick={() => { setSelectedAppointment(apt); setRescheduleDialogOpen(true); }}>
              <RefreshCw className="w-4 h-4 mr-1" /> Reschedule
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => { setSelectedAppointment(apt); setDeclineDialogOpen(true); }}>
              <X className="w-4 h-4 mr-1" /> Decline
            </Button>
          </div>
          </div>
        );
      })}
      
      {/* Accept Dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Appointment</DialogTitle>
            <DialogDescription>Select a time slot to confirm</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              {selectedAppointment.requestedSlots.map((slot, i) => (
                <button key={i} onClick={() => setSelectedSlotIndex(i)} className={cn("w-full p-4 rounded-lg border text-left", selectedSlotIndex === i ? "border-primary bg-primary/5" : "border-border")}>
                  <p className="font-medium">{format(new Date(slot.date), 'EEEE, MMMM d')}</p>
                  <p className="text-primary">{slot.time}</p>
                </button>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAccept} disabled={isLoading}>{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Decline Dialog */}
      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Appointment</DialogTitle>
            <DialogDescription>Please provide a reason</DialogDescription>
          </DialogHeader>
          <Select value={declineReason} onValueChange={(v) => setDeclineReason(v as DeclineReason)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(declineReasonLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea placeholder="Additional notes..." value={declineNotes} onChange={(e) => setDeclineNotes(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeclineDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDecline} disabled={isLoading}>Decline</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose New Time</DialogTitle>
          </DialogHeader>
          <CalendarPicker mode="single" selected={rescheduleDate} onSelect={setRescheduleDate} disabled={(d) => d < new Date()} className="rounded-md border" />
          {rescheduleDate && (
            <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
              <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>{availableTimeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReschedule} disabled={!rescheduleDate || !rescheduleTime || isLoading}>Propose</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
