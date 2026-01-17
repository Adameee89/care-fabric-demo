import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  LineChart, 
  Brain, 
  Shield,
  ArrowRight,
  Check,
  Stethoscope,
  ClipboardList,
  Bell,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import doctorsTeamImage from '@/assets/doctors-team.jpg';
import doctorEmilyAvatar from '@/assets/avatars/doctor-emily.jpg';

const ForDoctors = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const benefits = [
    {
      icon: Calendar,
      title: t('forDoctors.benefits.scheduling.title', 'Streamlined Scheduling'),
      description: t('forDoctors.benefits.scheduling.description', 'Manage your entire appointment calendar in one place. Accept, decline, or reschedule with a single click.'),
    },
    {
      icon: ClipboardList,
      title: t('forDoctors.benefits.inbox.title', 'Smart Appointment Inbox'),
      description: t('forDoctors.benefits.inbox.description', 'Review appointment requests with full patient context. Never miss a request with intelligent notifications.'),
    },
    {
      icon: Brain,
      title: t('forDoctors.benefits.ai.title', 'AI-Assisted Insights'),
      description: t('forDoctors.benefits.ai.description', 'Get AI-powered summaries of patient concerns before appointments. Be prepared for every consultation.'),
    },
    {
      icon: LineChart,
      title: t('forDoctors.benefits.analytics.title', 'Practice Analytics'),
      description: t('forDoctors.benefits.analytics.description', 'Track your practice metrics, patient satisfaction, and appointment trends with detailed dashboards.'),
    },
    {
      icon: Users,
      title: t('forDoctors.benefits.patients.title', 'Patient Management'),
      description: t('forDoctors.benefits.patients.description', 'Access complete patient histories, previous appointments, and communication logs instantly.'),
    },
    {
      icon: Bell,
      title: t('forDoctors.benefits.notifications.title', 'Smart Notifications'),
      description: t('forDoctors.benefits.notifications.description', 'Receive timely alerts for new requests, upcoming appointments, and urgent matters.'),
    },
  ];
  
  const workflowSteps = [
    { step: '01', title: t('forDoctors.workflow.step1.title', 'Receive Request'), description: t('forDoctors.workflow.step1.description', 'Patient submits appointment request with symptoms and preferences') },
    { step: '02', title: t('forDoctors.workflow.step2.title', 'Review Details'), description: t('forDoctors.workflow.step2.description', 'AI summarizes patient info, you review and make decisions') },
    { step: '03', title: t('forDoctors.workflow.step3.title', 'Respond'), description: t('forDoctors.workflow.step3.description', 'Accept, decline with reason, or propose alternative time') },
    { step: '04', title: t('forDoctors.workflow.step4.title', 'Consult'), description: t('forDoctors.workflow.step4.description', 'Conduct appointment in-person or via telemedicine') },
  ];
  
  const stats = [
    { value: '40%', label: t('forDoctors.stats.timeSaved', 'Time Saved on Admin') },
    { value: '95%', label: t('forDoctors.stats.satisfaction', 'Doctor Satisfaction') },
    { value: '60%', label: t('forDoctors.stats.noShow', 'Reduction in No-Shows') },
    { value: '24/7', label: t('forDoctors.stats.availability', 'System Availability') },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{t('forDoctors.badge', 'For Healthcare Providers')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                {t('forDoctors.heroTitle1', 'Focus on Patients,')} <br />
                <span className="gradient-text">{t('forDoctors.heroTitle2', 'Not Paperwork')}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                {t('forDoctors.heroSubtitle', 'MediConnect streamlines your practice workflow so you can spend more time with patients and less time on administrative tasks.')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" onClick={() => navigate('/login?role=doctor')}>
                  {t('forDoctors.tryDemo', 'Try Doctor Demo')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="xl">
                  {t('forDoctors.learnMore', 'Learn More')}
                </Button>
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative">
              <div className="glass-card rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('forDoctors.preview.welcome', 'Welcome back,')}</p>
                    <h3 className="text-lg font-semibold">Dr. Emily Carter</h3>
                  </div>
                  <img 
                    src={doctorEmilyAvatar} 
                    alt="Dr. Emily Carter" 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary">8</p>
                    <p className="text-xs text-muted-foreground">{t('forDoctors.preview.today', 'Today')}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-warning">3</p>
                    <p className="text-xs text-muted-foreground">{t('forDoctors.preview.pending', 'Pending')}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-success">24</p>
                    <p className="text-xs text-muted-foreground">{t('forDoctors.preview.week', 'This Week')}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <span className="text-sm font-medium">P{i}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Patient {i}</p>
                        <p className="text-xs text-muted-foreground">10:{i}0 AM - Follow-up</p>
                      </div>
                      <div className="px-2 py-1 bg-success/10 text-success text-xs rounded">
                        {t('forDoctors.preview.confirmed', 'Confirmed')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-display font-bold gradient-text">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('forDoctors.benefitsTitle', 'Built for Modern Medical Practice')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('forDoctors.benefitsSubtitle', 'Every feature designed with healthcare providers in mind.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card-hover rounded-2xl p-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Workflow */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('forDoctors.workflowTitle', 'Simple Appointment Workflow')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="glass-card rounded-2xl p-6 h-full">
                  <span className="text-4xl font-display font-bold text-primary/20">{item.step}</span>
                  <h3 className="text-lg font-semibold mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-muted-foreground">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={doctorsTeamImage} 
            alt="Healthcare team" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-info/80" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('forDoctors.ctaTitle', 'Ready to Modernize Your Practice?')}
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            {t('forDoctors.ctaSubtitle', 'Join thousands of healthcare providers who have transformed their practice with MediConnect.')}
          </p>
          <Button 
            variant="outline" 
            size="xl" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate('/login?role=doctor')}
          >
            {t('forDoctors.ctaButton', 'Start Free Trial')}
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ForDoctors;
