import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Brain, 
  Shield,
  ArrowRight,
  Check,
  Heart,
  Globe,
  Smartphone,
  MessageSquare,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const ForPatients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const benefits = [
    {
      icon: Calendar,
      title: t('forPatients.benefits.booking.title', 'Easy Appointment Booking'),
      description: t('forPatients.benefits.booking.description', 'Book appointments with any doctor in just a few clicks. Choose your preferred date and time slots.'),
    },
    {
      icon: Brain,
      title: t('forPatients.benefits.ai.title', 'AI Health Discussions'),
      description: t('forPatients.benefits.ai.description', 'Discuss your symptoms with our AI assistant. Get helpful information to prepare for your doctor visit.'),
    },
    {
      icon: FileText,
      title: t('forPatients.benefits.records.title', 'Digital Health Records'),
      description: t('forPatients.benefits.records.description', 'Access your complete medical history, lab results, and prescriptions anytime, anywhere.'),
    },
    {
      icon: Video,
      title: t('forPatients.benefits.telemedicine.title', 'Telemedicine'),
      description: t('forPatients.benefits.telemedicine.description', 'Connect with doctors via secure video calls. Get quality care from the comfort of your home.'),
    },
    {
      icon: Globe,
      title: t('forPatients.benefits.languages.title', '50+ Languages'),
      description: t('forPatients.benefits.languages.description', 'Use the platform in your preferred language. Healthcare accessibility for everyone.'),
    },
    {
      icon: Shield,
      title: t('forPatients.benefits.privacy.title', 'Privacy First'),
      description: t('forPatients.benefits.privacy.description', 'Your health data is encrypted and protected with enterprise-grade security.'),
    },
  ];
  
  const bookingSteps = [
    { 
      step: '1', 
      title: t('forPatients.steps.step1.title', 'Select Doctor'), 
      description: t('forPatients.steps.step1.description', 'Browse doctors by specialty and availability'),
      icon: '👨‍⚕️'
    },
    { 
      step: '2', 
      title: t('forPatients.steps.step2.title', 'Choose Time'), 
      description: t('forPatients.steps.step2.description', 'Pick your preferred date and time slots'),
      icon: '📅'
    },
    { 
      step: '3', 
      title: t('forPatients.steps.step3.title', 'Describe Symptoms'), 
      description: t('forPatients.steps.step3.description', 'Share your reason for visit'),
      icon: '📝'
    },
    { 
      step: '4', 
      title: t('forPatients.steps.step4.title', 'Get Confirmation'), 
      description: t('forPatients.steps.step4.description', 'Receive instant confirmation'),
      icon: '✅'
    },
  ];
  
  const testimonials = [
    {
      quote: t('forPatients.testimonials.quote1', 'Booking appointments has never been easier. I love the AI assistant that helps me prepare for my visits.'),
      name: 'Sarah M.',
      role: t('forPatients.testimonials.role1', 'Patient'),
    },
    {
      quote: t('forPatients.testimonials.quote2', 'The multilingual support is amazing. I can finally use a healthcare app in my native language.'),
      name: 'Ahmed K.',
      role: t('forPatients.testimonials.role2', 'Patient'),
    },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                <Heart className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">{t('forPatients.badge', 'For Patients')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                {t('forPatients.heroTitle1', 'Your Health,')} <br />
                <span className="gradient-text">{t('forPatients.heroTitle2', 'In Your Hands')}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                {t('forPatients.heroSubtitle', 'Take control of your healthcare journey. Book appointments, access records, and get AI-powered health insights—all in one place.')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" onClick={() => navigate('/login?role=patient')}>
                  {t('forPatients.tryDemo', 'Try Patient Demo')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="xl">
                  {t('forPatients.learnMore', 'Learn More')}
                </Button>
              </div>
            </div>
            
            {/* Visual - Phone mockup */}
            <div className="relative flex justify-center">
              <div className="w-72 h-[580px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                  {/* Phone content */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                        <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                      </div>
                    </div>
                    
                    <div className="text-center pt-4">
                      <h4 className="font-semibold">{t('forPatients.preview.title', 'Book Appointment')}</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-muted rounded-xl p-3">
                        <p className="text-xs text-muted-foreground">{t('forPatients.preview.doctor', 'Doctor')}</p>
                        <p className="text-sm font-medium">Dr. Emily Carter</p>
                      </div>
                      <div className="bg-muted rounded-xl p-3">
                        <p className="text-xs text-muted-foreground">{t('forPatients.preview.date', 'Date')}</p>
                        <p className="text-sm font-medium">October 18, 2024</p>
                      </div>
                      <div className="bg-muted rounded-xl p-3">
                        <p className="text-xs text-muted-foreground">{t('forPatients.preview.time', 'Time')}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full">10:30 AM</span>
                          <span className="px-3 py-1 bg-muted-foreground/20 text-xs rounded-full">11:00 AM</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="w-full py-3 gradient-bg-hero text-white text-center rounded-xl text-sm font-medium">
                        {t('forPatients.preview.confirm', 'Confirm Booking')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Booking Steps */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('forPatients.stepsTitle', 'Book in 4 Simple Steps')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookingSteps.map((item) => (
              <div key={item.step} className="glass-card rounded-2xl p-6 text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                  {t('forPatients.step', 'Step')} {item.step}
                </span>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
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
              {t('forPatients.benefitsTitle', 'Healthcare Made Simple')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('forPatients.benefitsSubtitle', 'Everything you need to manage your health journey.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card-hover rounded-2xl p-6">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Assistant Highlight */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{t('forPatients.ai.badge', 'AI Powered')}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                {t('forPatients.ai.title', 'Discuss Symptoms with AI')}
              </h2>
              
              <p className="text-muted-foreground">
                {t('forPatients.ai.description', 'Our AI Health Assistant helps you understand your symptoms and prepare meaningful questions for your doctor. It\'s available 24/7 in 50+ languages.')}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span>{t('forPatients.ai.feature1', 'Non-diagnostic health discussions')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span>{t('forPatients.ai.feature2', 'Upload lab results and images')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span>{t('forPatients.ai.feature3', 'Always includes medical disclaimers')}</span>
                </div>
              </div>
              
              <Button variant="hero" onClick={() => navigate('/login?role=patient')}>
                {t('forPatients.ai.cta', 'Try AI Assistant')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Chat preview */}
            <div className="glass-card rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl gradient-bg-hero flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{t('forPatients.ai.chatTitle', 'AI Health Assistant')}</p>
                  <p className="text-xs text-muted-foreground">{t('forPatients.ai.chatOnline', 'Online')}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                    <p className="text-sm">{t('forPatients.ai.userMessage', 'I\'ve been having headaches lately')}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm">{t('forPatients.ai.botMessage', 'I understand you\'re experiencing headaches. Can you tell me more about when they occur and how long they last? This will help me provide relevant information.')}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      ⚠️ {t('forPatients.ai.disclaimer', 'For informational purposes only')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 gradient-bg-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('forPatients.ctaTitle', 'Take Control of Your Health Today')}
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            {t('forPatients.ctaSubtitle', 'Join thousands of patients who have simplified their healthcare experience with MediConnect.')}
          </p>
          <Button 
            variant="outline" 
            size="xl" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate('/login?role=patient')}
          >
            {t('forPatients.ctaButton', 'Get Started Free')}
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ForPatients;
