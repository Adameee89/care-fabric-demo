import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppointments } from '@/contexts/AppointmentContext';
import { AppointmentStatusBadge } from '@/components/appointments/AppointmentStatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Search, Filter, CheckCircle, XCircle, Video, User } from 'lucide-react';
import { ExtendedAppointment, AppointmentStatus } from '@/data/appointmentData';

interface Props {
  doctorId: string;
}

export const DoctorAppointmentsView = ({ doctorId }: Props) => {
  const { t } = useTranslation();
  const { appointments, markAsCompleted, markAsNoShow } = useAppointments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
          ) : appts.map(apt => (
            <TableRow key={apt.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {apt.isVirtual ? <Video className="h-4 w-4 text-info" /> : <User className="h-4 w-4" />}
                  <span className="font-medium">{apt.patientName}</span>
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
                        <Button size="sm" variant="outline" onClick={() => markAsCompleted(apt.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />{t('appointments.actions.markCompleted')}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => markAsNoShow(apt.id)}>
                          <XCircle className="h-3 w-3 mr-1" />{t('appointments.actions.markNoShow')}
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
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
