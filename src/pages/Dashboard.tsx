import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Calendar, FileText, Pill, Bell, Activity, Plus, Menu, LogOut, Settings, Globe, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BookAppointmentForm } from '@/components/appointments/BookAppointmentForm';
import { PatientAppointmentList } from '@/components/appointments/PatientAppointmentList';
import { DoctorAppointmentInbox } from '@/components/appointments/DoctorAppointmentInbox';
import { DoctorAppointmentsView } from '@/components/doctor/DoctorAppointmentsView';
import { AdminAnalyticsDashboard } from '@/components/admin/AdminAnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPatientPrescriptions, getPatientLabResults, notifications, patients, doctors } from '@/data/mockData';
import { Heart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useTheme } from 'next-themes';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getUpcomingForPatient, getPendingForDoctor, getStatusStats, getTodaysSchedule, getDoctorAppointments } = useAppointments();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const patient = patients.find(p => p.id === 'pat_042')!;
  const doctor = doctors.find(d => d.id === 'doc_001')!;
  const prescriptions = getPatientPrescriptions(patient.id);
  const labResults = getPatientLabResults(patient.id);
  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
  const unreadNotifications = notifications.filter(n => !n.isRead);
  
  const upcomingAppointments = user.role === 'patient' ? getUpcomingForPatient(patient.id) : [];
  const pendingRequests = user.role === 'doctor' ? getPendingForDoctor(doctor.id) : [];
  const todaysSchedule = user.role === 'doctor' ? getTodaysSchedule(doctor.id) : [];
  const doctorAppts = user.role === 'doctor' ? getDoctorAppointments(doctor.id) : [];
  const stats = getStatusStats();

  // Doctor stats
  const thisWeekAppts = doctorAppts.filter(a => {
    const d = new Date(a.confirmedSlot?.date || '');
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return d >= weekStart && ['Accepted', 'RescheduleAccepted'].includes(a.status);
  }).length;
  const noShowRate = doctorAppts.length > 0 
    ? ((doctorAppts.filter(a => a.status === 'NoShow').length / doctorAppts.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          {/* Logo - always visible */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(199,89%,48%)] flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-display font-bold">{t('common.appName')}</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{t(`common.${user.role}`)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>{t('common.logout')}</Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader className="text-left pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <SheetTitle className="text-base">{user.firstName} {user.lastName}</SheetTitle>
                      <p className="text-sm text-muted-foreground capitalize">{t(`common.${user.role}`)}</p>
                    </div>
                  </div>
                </SheetHeader>
                
                <div className="py-4 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide px-2 mb-2">Settings</p>
                  
                  {/* Theme Toggle */}
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted text-left"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span className="text-sm">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </button>
                  
                  {/* Language */}
                  <div className="px-2 py-2.5">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-5 h-5" />
                      <span className="text-sm">Language</span>
                    </div>
                    <div className="ml-8">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                  >
                    <LogOut className="w-5 h-5" />
                    {t('common.logout')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              {user.role === 'patient' ? t('auth.welcomeBack', { name: patient.firstName }) : 
               user.role === 'doctor' ? t('auth.helloDoctor', { name: doctor.lastName }) : t('auth.adminDashboard')}
            </h1>
            <p className="text-muted-foreground">
              {user.role === 'patient' ? t('doctor.dashboard.healthOverview') : 
               user.role === 'doctor' ? t('doctor.dashboard.pendingCount', { count: pendingRequests.length }) : t('admin.dashboard.overview')}
            </p>
          </div>
          {user.role === 'patient' && (
            <Button variant="hero" onClick={() => setBookingOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> {t('appointments.bookAppointment')}
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {user.role === 'patient' ? upcomingAppointments.length : 
               user.role === 'doctor' ? todaysSchedule.length : stats.Requested || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.role === 'patient' ? t('stats.upcoming') : 
               user.role === 'doctor' ? t('doctor.dashboard.appointmentsToday') : t('appointments.pendingRequests')}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Pill className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {user.role === 'patient' ? activePrescriptions.length : 
               user.role === 'doctor' ? thisWeekAppts : stats.Completed || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.role === 'patient' ? t('stats.activePrescriptions') : 
               user.role === 'doctor' ? t('doctor.dashboard.upcomingThisWeek') : t('stats.completed')}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {user.role === 'patient' ? labResults.length : 
               user.role === 'doctor' ? pendingRequests.length : stats.Accepted || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.role === 'patient' ? t('stats.labResults') : 
               user.role === 'doctor' ? t('appointments.pendingRequests') : t('stats.accepted')}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {user.role === 'patient' ? patient.conditions.length : 
               user.role === 'doctor' ? `${noShowRate}%` : stats.Declined || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.role === 'patient' ? t('stats.activeConditions') : 
               user.role === 'doctor' ? t('doctor.dashboard.noShowRate') : t('stats.declined')}
            </p>
          </div>
        </div>

        {/* Role-specific Content */}
        {user.role === 'patient' && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t('appointments.myAppointments')}</h2>
            <PatientAppointmentList patientId={patient.id} />
          </div>
        )}

        {user.role === 'doctor' && (
          <Tabs defaultValue="inbox" className="space-y-4">
            <TabsList>
              <TabsTrigger value="inbox">{t('appointments.appointmentInbox')} ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="schedule">{t('appointments.title')}</TabsTrigger>
            </TabsList>
            <TabsContent value="inbox">
              <div className="glass-card rounded-2xl p-6">
                <DoctorAppointmentInbox doctorId={doctor.id} />
              </div>
            </TabsContent>
            <TabsContent value="schedule">
              <div className="glass-card rounded-2xl p-6">
                <DoctorAppointmentsView doctorId={doctor.id} />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {user.role === 'admin' && <AdminAnalyticsDashboard />}

        <div className="mt-8 p-4 rounded-xl bg-warning/10 border border-warning/20 text-center">
          <p className="text-sm text-warning">
            <strong>{t('common.demoMode')}:</strong> {t('common.demoModeDesc')}
          </p>
        </div>
      </main>

      {user.role === 'patient' && (
        <BookAppointmentForm patientId={patient.id} open={bookingOpen} onOpenChange={setBookingOpen} />
      )}
    </div>
  );
};

export default Dashboard;
