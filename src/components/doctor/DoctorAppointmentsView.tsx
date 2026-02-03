import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import { useAppointmentNotifications } from '@/hooks/useAppointmentNotifications';
import { AppointmentStatusBadge } from '@/components/appointments/AppointmentStatusBadge';
import { PatientProfileViewer } from '@/components/doctor/PatientProfileViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Clock, Search, Filter, CheckCircle, XCircle, Video, User, Heart } from 'lucide-react';
import { ExtendedAppointment } from '@/data/appointmentData';
import { systemUsers } from '@/data/usersData';
import { doctors } from '@/data/mockData';

interface Props {
  doctorId: string;
}

export const DoctorAppointmentsView = ({ doctorId }: Props) => {
  const { t } = useTranslation();
  const { appointments, markAsCompleted, markAsNoShow } = useAppointments();
  const { getProfileByUserId } = useMedicalProfile();
  const { sendNotification } = useAppointmentNotifications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [profileViewerOpen, setProfileViewerOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<{ id: string; name: string } | null>(null);
  
  // Get doctor info for notifications
  const doctor = doctors.find(d => d.id === doctorId);

  // Helper to find patient user ID from linked entity
  const findPatientUserId = (patientId: string): string | null => {
    const user = systemUsers.find(u => u.linkedEntityId === patientId);
    return user?.id || patientId;
  };

  const handleViewProfile = (patientId: string, patientName: string) => {
    const userId = findPatientUserId(patientId);
    setViewingPatient({ id: userId || patientId, name: patientName });
    setProfileViewerOpen(true);
  };
  
  const handleMarkCompleted = async (apt: ExtendedAppointment) => {
    const success = await markAsCompleted(apt.id);
    if (success && doctor) {
      sendNotification('complete', {
        appointmentId: apt.id,
        patientId: apt.patientId,
        patientName: apt.patientName,
        doctorId: apt.doctorId,
        doctorName: doctor.name,
      });
    }
  };
  
  const handleMarkNoShow = async (apt: ExtendedAppointment) => {
    const success = await markAsNoShow(apt.id);
    if (success && doctor) {
      sendNotification('noshow', {
        appointmentId: apt.id,
        patientId: apt.patientId,
        patientName: apt.patientName,
        doctorId: apt.doctorId,
        doctorName: doctor.name,
      });
    }
  };

  const doctorAppointments = useMemo(() => 
    appointments.filter(a => a.doctorId === doctorId), [appointments, doctorId]);

  const today = new Date().toISOString().split('T')[0];

  const todayAppts = useMemo(() => 
    doctorAppointments.filter(a => 
      a.confirmedSlot?.date === today && ['Accepted', 'RescheduleAccepted'].includes(a.status)
    ).sort((a, b) => (a.confirmedSlot?.time || '').localeCompare(b.confirmedSlot?.time || '')),
  [doctorAppointments, today]);

  const upcomingAppts = useMemo(() => 
    doctorAppointments.filter(a => 
      a.confirmedSlot?.date && a.confirmedSlot.date > today && 
      ['Accepted', 'RescheduleAccepted'].includes(a.status)
    ).sort((a, b) => (a.confirmedSlot?.date || '').localeCompare(b.confirmedSlot?.date || '')),
  [doctorAppointments, today]);

  const pastAppts = useMemo(() => 
    doctorAppointments.filter(a => 
      (a.confirmedSlot?.date && a.confirmedSlot.date < today) || 
      ['Completed', 'NoShow', 'Declined', 'CancelledByPatient', 'CancelledByDoctor'].includes(a.status)
    ).sort((a, b) => {
      const dateA = a.confirmedSlot?.date || a.requestedSlots[0]?.date || '';
      const dateB = b.confirmedSlot?.date || b.requestedSlots[0]?.date || '';
      return dateB.localeCompare(dateA);
    }),
  [doctorAppointments, today]);

  const filterAppointments = (appts: ExtendedAppointment[]) => {
    return appts.filter(a => {
      const matchesSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.appointmentType.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const renderTable = (appts: ExtendedAppointment[], showActions = false) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.patient')}</TableHead>
            <TableHead>{t('common.type')}</TableHead>
            <TableHead>{t('common.date')}</TableHead>
            <TableHead>{t('common.time')}</TableHead>
            <TableHead>{t('common.duration')}</TableHead>
            <TableHead>{t('common.status')}</TableHead>
            {showActions && <TableHead>{t('common.actions')}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {appts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 6} className="text-center py-8 text-muted-foreground">
                {t('appointments.noAppointments')}
              </TableCell>
            </TableRow>
          ) : appts.map(apt => {
            const patientUserId = findPatientUserId(apt.patientId);
            const hasProfile = patientUserId ? !!getProfileByUserId(patientUserId) : false;
            
            return (
              <TableRow key={apt.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {apt.isVirtual ? <Video className="h-4 w-4 text-info" /> : <User className="h-4 w-4" />}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="font-medium hover:text-primary hover:underline transition-colors flex items-center gap-1"
                          onClick={() => handleViewProfile(apt.patientId, apt.patientName)}
                        >
                          {apt.patientName}
                          {hasProfile && (
                            <Heart className="h-3 w-3 text-success fill-success" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to view patient profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>{t(`appointments.types.${apt.appointmentType}` as any, apt.appointmentType)}</TableCell>
                <TableCell>{apt.confirmedSlot?.date || apt.requestedSlots[0]?.date}</TableCell>
                <TableCell>{apt.confirmedSlot?.time || apt.requestedSlots[0]?.time}</TableCell>
                <TableCell>{apt.durationMinutes} {t('time.minutes')}</TableCell>
                <TableCell><AppointmentStatusBadge status={apt.status} /></TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex gap-1">
                        {apt.status === 'Accepted' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleMarkCompleted(apt)}>
                              <CheckCircle className="h-3 w-3 mr-1" />{t('appointments.actions.markCompleted')}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleMarkNoShow(apt)}>
                              <XCircle className="h-3 w-3 mr-1" />{t('appointments.actions.markNoShow')}
                            </Button>
                          </>
                        )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Patient Profile Viewer */}
      <PatientProfileViewer
        open={profileViewerOpen}
        onOpenChange={setProfileViewerOpen}
        profile={viewingPatient ? getProfileByUserId(viewingPatient.id) : null}
        patientId={viewingPatient?.id || ''}
        patientName={viewingPatient?.name || ''}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            {['Accepted', 'Completed', 'NoShow', 'Declined'].map(s => (
              <SelectItem key={s} value={s}>{t(`appointments.status.${s}` as any)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="w-full h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="today" className="flex-1 min-w-fit text-xs sm:text-sm px-2 py-1.5">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">{t('appointments.todayAppointments')}</span>
            <span className="sm:hidden">Today</span>
            <span className="ml-1">({todayAppts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1 min-w-fit text-xs sm:text-sm px-2 py-1.5">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">{t('appointments.upcomingAppointments')}</span>
            <span className="sm:hidden">Upcoming</span>
            <span className="ml-1">({upcomingAppts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1 min-w-fit text-xs sm:text-sm px-2 py-1.5">
            <span className="hidden sm:inline">{t('appointments.pastAppointments')}</span>
            <span className="sm:hidden">Past</span>
            <span className="ml-1">({pastAppts.length})</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4">{renderTable(filterAppointments(todayAppts), true)}</TabsContent>
        <TabsContent value="upcoming" className="mt-4">{renderTable(filterAppointments(upcomingAppts))}</TabsContent>
        <TabsContent value="past" className="mt-4">{renderTable(filterAppointments(pastAppts).slice(0, 50))}</TabsContent>
      </Tabs>
    </div>
  );
};
