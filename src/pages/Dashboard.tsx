import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Calendar, FileText, Pill, MessageSquare, Bell, ChevronRight, Clock, Heart, Activity, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookAppointmentForm } from '@/components/appointments/BookAppointmentForm';
import { PatientAppointmentList } from '@/components/appointments/PatientAppointmentList';
import { DoctorAppointmentInbox } from '@/components/appointments/DoctorAppointmentInbox';
import { getPatientPrescriptions, getPatientLabResults, notifications, patients, doctors } from '@/data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getUpcomingForPatient, getPendingForDoctor, getStatusStats } = useAppointments();
  const [bookingOpen, setBookingOpen] = useState(false);

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
  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(199,89%,48%)] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">MediConnect</span>
          </div>
          <div className="flex items-center gap-3">
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
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              {user.role === 'patient' ? `Welcome back, ${patient.firstName}!` : 
               user.role === 'doctor' ? `Hello, Dr. ${doctor.lastName}` : 'Admin Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {user.role === 'patient' ? "Here's your health overview." : 
               user.role === 'doctor' ? `You have ${pendingRequests.length} pending requests` : 'System overview'}
            </p>
          </div>
          {user.role === 'patient' && (
            <Button variant="hero" onClick={() => setBookingOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Book Appointment
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
            <p className="text-2xl font-bold">{user.role === 'patient' ? upcomingAppointments.length : pendingRequests.length}</p>
            <p className="text-sm text-muted-foreground">{user.role === 'patient' ? 'Upcoming' : 'Pending Requests'}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Pill className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold">{user.role === 'admin' ? stats.Completed || 0 : activePrescriptions.length}</p>
            <p className="text-sm text-muted-foreground">{user.role === 'admin' ? 'Completed' : 'Active Prescriptions'}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" />
              </div>
            </div>
            <p className="text-2xl font-bold">{user.role === 'admin' ? stats.Accepted || 0 : labResults.length}</p>
            <p className="text-sm text-muted-foreground">{user.role === 'admin' ? 'Accepted' : 'Lab Results'}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{user.role === 'admin' ? stats.Declined || 0 : patient.conditions.length}</p>
            <p className="text-sm text-muted-foreground">{user.role === 'admin' ? 'Declined' : 'Active Conditions'}</p>
          </div>
        </div>

        {/* Role-specific Content */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            {user.role === 'patient' ? 'My Appointments' : 
             user.role === 'doctor' ? 'Appointment Inbox' : 'All Appointments Overview'}
          </h2>
          
          {user.role === 'patient' && <PatientAppointmentList patientId={patient.id} />}
          {user.role === 'doctor' && <DoctorAppointmentInbox doctorId={doctor.id} />}
          {user.role === 'admin' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats).map(([status, count]) => (
                <div key={status} className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-warning/10 border border-warning/20 text-center">
          <p className="text-sm text-warning">
            <strong>Demo Mode:</strong> This is a demonstration with simulated data.
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
