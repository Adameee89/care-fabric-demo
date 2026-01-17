import { useState } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { ExtendedAppointment, statusConfig, declineReasonLabels } from '@/data/appointmentData';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { Button } from '@/components/ui/button';
import { DoctorAvatar, doctorAvatars } from '@/components/DoctorAvatar';
import { doctors } from '@/data/mockData';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ChevronRight,
  X,
  Check,
  RefreshCw,
  AlertCircle,
  User
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PatientAppointmentListProps {
  patientId: string;
}

export const PatientAppointmentList = ({ patientId }: PatientAppointmentListProps) => {
  const { 
    getPatientAppointments, 
    cancelAppointment, 
    acceptReschedule, 
    declineReschedule,
    isLoading 
  } = useAppointments();
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<ExtendedAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  
  const allAppointments = getPatientAppointments(patientId);
  
  const upcomingAppointments = allAppointments.filter(a => {
    const date = a.confirmedSlot?.date || a.requestedSlots[0]?.date || '';
    return new Date(date) >= new Date() && 
      !['Declined', 'CancelledByPatient', 'CancelledByDoctor', 'Completed', 'NoShow'].includes(a.status);
  });
  
  const pendingRequests = allAppointments.filter(a => 
    ['Requested', 'PendingReview', 'RescheduleProposed'].includes(a.status)
  );
  
  const pastAppointments = allAppointments.filter(a => 
    ['Completed', 'NoShow', 'Declined', 'CancelledByPatient', 'CancelledByDoctor'].includes(a.status)
  );
  
  const handleCancelClick = (appointment: ExtendedAppointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };
  
  const handleRescheduleClick = (appointment: ExtendedAppointment) => {
    setSelectedAppointment(appointment);
    setRescheduleDialogOpen(true);
  };
  
  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    await cancelAppointment(selectedAppointment.id, cancelReason || undefined);
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
    setCancelReason('');
  };
  
  const handleAcceptReschedule = async () => {
    if (!selectedAppointment) return;
    await acceptReschedule(selectedAppointment.id);
    setRescheduleDialogOpen(false);
    setSelectedAppointment(null);
  };
  
  const handleDeclineReschedule = async () => {
    if (!selectedAppointment) return;
    await declineReschedule(selectedAppointment.id);
    setRescheduleDialogOpen(false);
    setSelectedAppointment(null);
  };
  
  const renderAppointmentCard = (appointment: ExtendedAppointment, showActions: boolean = true) => {
    const dateStr = appointment.confirmedSlot?.date || appointment.requestedSlots[0]?.date || '';
    const timeStr = appointment.confirmedSlot?.time || appointment.requestedSlots[0]?.time || '';
    
    return (
      <div 
        key={appointment.id}
        className="glass-card rounded-xl p-4 hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {(() => {
              const doctor = doctors.find(d => d.id === appointment.doctorId);
              return doctor ? (
                <DoctorAvatar 
                  doctorId={doctor.id}
                  firstName={doctor.firstName}
                  lastName={doctor.lastName}
                  size="lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              );
            })()}
            <div>
              <h4 className="font-semibold">{appointment.doctorName}</h4>
              <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
            </div>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{dateStr ? format(new Date(dateStr), 'EEEE, MMMM d, yyyy') : 'Date pending'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{timeStr || 'Time pending'} ({appointment.durationMinutes} min)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {appointment.isVirtual ? (
              <>
                <Video className="w-4 h-4 text-info" />
                <span className="text-info">Virtual Visit</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>In-Person</span>
              </>
            )}
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-muted/50 mb-4">
          <p className="text-sm font-medium">{appointment.appointmentType}</p>
          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
        </div>
        
        {/* Decline reason display */}
        {appointment.status === 'Declined' && appointment.doctorDecision.declineReason && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  {declineReasonLabels[appointment.doctorDecision.declineReason]}
                </p>
                {appointment.doctorDecision.declineNotes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {appointment.doctorDecision.declineNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Reschedule proposal */}
        {appointment.status === 'RescheduleProposed' && appointment.rescheduleProposal.date && (
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 mb-4">
            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-secondary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {appointment.rescheduleProposal.proposedBy === 'doctor' ? 'Doctor proposed a new time:' : 'You proposed a new time:'}
                </p>
                <p className="text-sm font-medium text-secondary">
                  {format(new Date(appointment.rescheduleProposal.date), 'EEEE, MMMM d')} at {appointment.rescheduleProposal.time}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2 border-t border-border">
            {appointment.status === 'RescheduleProposed' && appointment.rescheduleProposal.proposedBy === 'doctor' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleRescheduleClick(appointment)}
                >
                  View Proposal
                </Button>
              </>
            )}
            {['Requested', 'PendingReview', 'Accepted', 'RescheduleAccepted'].includes(appointment.status) && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleCancelClick(appointment)}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
            {appointment.status === 'Accepted' && appointment.isVirtual && (
              <Button variant="hero" size="sm" className="flex-1">
                <Video className="w-4 h-4 mr-1" />
                Join Call
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="gap-2">
            Upcoming
            {upcomingAppointments.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                {upcomingAppointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming appointments</p>
              <p className="text-sm mt-1">Book a new appointment to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingAppointments.map(a => renderAppointmentCard(a))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No pending requests</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingRequests.map(a => renderAppointmentCard(a))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          {pastAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No past appointments</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pastAppointments.slice(0, 10).map(a => renderAppointmentCard(a, false))}
            </div>
          )}
          {pastAppointments.length > 10 && (
            <div className="text-center mt-4">
              <Button variant="outline">
                View All ({pastAppointments.length}) <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? You can undo this action for 30 seconds.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="font-medium">{selectedAppointment.doctorName}</p>
              <p className="text-sm text-muted-foreground">
                {selectedAppointment.confirmedSlot?.date || selectedAppointment.requestedSlots[0]?.date} at{' '}
                {selectedAppointment.confirmedSlot?.time || selectedAppointment.requestedSlots[0]?.time}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for cancellation (optional)</label>
            <Textarea
              placeholder="Let us know why you're cancelling..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmCancel}
              disabled={isLoading}
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Proposal</DialogTitle>
            <DialogDescription>
              The doctor has proposed a new time for your appointment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && selectedAppointment.rescheduleProposal.date && (
            <>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Original Request</p>
                  <p className="font-medium">
                    {selectedAppointment.requestedSlots.map((s, i) => (
                      <span key={i}>
                        {format(new Date(s.date), 'MMM d')} at {s.time}
                        {i < selectedAppointment.requestedSlots.length - 1 && ', '}
                      </span>
                    ))}
                  </p>
                </div>
                
                <div className="flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-primary mb-1">Proposed New Time</p>
                  <p className="font-medium text-lg">
                    {format(new Date(selectedAppointment.rescheduleProposal.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {selectedAppointment.rescheduleProposal.time}
                  </p>
                </div>
              </div>
              
              <DialogFooter className="flex gap-2 sm:gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleDeclineReschedule}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-1" />
                  Decline
                </Button>
                <Button 
                  variant="hero" 
                  className="flex-1"
                  onClick={handleAcceptReschedule}
                  disabled={isLoading}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
