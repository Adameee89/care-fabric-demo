import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  FileText, 
  Pill, 
  MessageSquare, 
  Bell,
  ChevronRight,
  Clock,
  Heart,
  Activity,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getPatientAppointments, 
  getPatientPrescriptions, 
  getPatientLabResults,
  notifications,
  patients
} from '@/data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const patient = patients.find(p => p.id === 'pat_042')!;
  const appointments = getPatientAppointments(patient.id);
  const prescriptions = getPatientPrescriptions(patient.id);
  const labResults = getPatientLabResults(patient.id);
  const upcomingAppointment = appointments.find(a => a.status === 'Scheduled' || a.status === 'Confirmed');
  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(199,89%,48%)] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">MediConnect</span>
          </div>
          <div className="flex items-center gap-4">
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
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{patient.firstName} {patient.lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Welcome back, {patient.firstName}!
          </h1>
          <p className="text-muted-foreground">Here's your health overview for today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{appointments.filter(a => a.status !== 'Cancelled').length}</p>
            <p className="text-sm text-muted-foreground">Total Appointments</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Pill className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold">{activePrescriptions.length}</p>
            <p className="text-sm text-muted-foreground">Active Prescriptions</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" />
              </div>
            </div>
            <p className="text-2xl font-bold">{labResults.length}</p>
            <p className="text-sm text-muted-foreground">Lab Results</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-bold">{patient.conditions.length}</p>
            <p className="text-sm text-muted-foreground">Active Conditions</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Appointment */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Upcoming Appointment</h2>
              <Button variant="ghost" size="sm">View All <ChevronRight className="w-4 h-4" /></Button>
            </div>
            {upcomingAppointment ? (
              <div className="flex items-start gap-4 p-4 bg-accent/30 rounded-xl border border-primary/10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{upcomingAppointment.doctorName}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                      {upcomingAppointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{upcomingAppointment.type} • {upcomingAppointment.reason}</p>
                  <p className="text-sm font-medium">{upcomingAppointment.date} at {upcomingAppointment.time}</p>
                </div>
                <Button variant="hero" size="sm">Join Call</Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
                <Button variant="outline" size="sm" className="mt-3">Schedule Now</Button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Calendar className="w-5 h-5 text-primary" /> Book Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <MessageSquare className="w-5 h-5 text-info" /> Message Doctor
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Pill className="w-5 h-5 text-success" /> Refill Prescription
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <TrendingUp className="w-5 h-5 text-secondary" /> View Health Trends
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-4 rounded-xl bg-warning/10 border border-warning/20 text-center">
          <p className="text-sm text-warning">
            <strong>Demo Mode:</strong> This is a demonstration with simulated data. No real medical information is shown.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
