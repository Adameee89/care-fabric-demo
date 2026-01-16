import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Brain, 
  Video, 
  Pill, 
  MessageSquare, 
  LineChart, 
  Lock,
  Shield,
  Clock,
  Globe,
  Zap,
  Check,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const FeaturesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const mainFeatures = [
    {
      icon: Calendar,
      title: t('features.scheduling.title', 'Smart Scheduling'),
      description: t('features.scheduling.description', 'AI-powered appointment booking that finds the perfect time for both patients and healthcare providers. No more back-and-forth calls.'),
      benefits: [
        t('features.scheduling.benefit1', 'Real-time availability'),
        t('features.scheduling.benefit2', 'Automated reminders'),
        t('features.scheduling.benefit3', 'Reschedule flexibility'),
        t('features.scheduling.benefit4', 'Multi-provider support'),
      ],
      color: 'primary',
    },
    {
      icon: Brain,
      title: t('features.ai.title', 'AI Health Assistant'),
      description: t('features.ai.description', 'Get preliminary health insights powered by advanced AI. Our assistant helps you understand symptoms and prepare for doctor visits.'),
      benefits: [
        t('features.ai.benefit1', '24/7 availability'),
        t('features.ai.benefit2', 'Symptom analysis'),
        t('features.ai.benefit3', 'Multi-language support'),
        t('features.ai.benefit4', 'Medical disclaimers included'),
      ],
      color: 'secondary',
    },
    {
      icon: FileText,
      title: t('features.records.title', 'Digital Health Records'),
      description: t('features.records.description', 'Access your complete medical history, lab results, prescriptions, and documents from anywhere, anytime.'),
      benefits: [
        t('features.records.benefit1', 'Secure cloud storage'),
        t('features.records.benefit2', 'Easy sharing with providers'),
        t('features.records.benefit3', 'Document uploads'),
        t('features.records.benefit4', 'Complete medical history'),
      ],
      color: 'info',
    },
    {
      icon: Video,
      title: t('features.telemedicine.title', 'Telemedicine'),
      description: t('features.telemedicine.description', 'Connect with doctors via secure video consultations from the comfort of your home. Quality care without the commute.'),
      benefits: [
        t('features.telemedicine.benefit1', 'HD video quality'),
        t('features.telemedicine.benefit2', 'Screen sharing'),
        t('features.telemedicine.benefit3', 'Recording options'),
        t('features.telemedicine.benefit4', 'Virtual waiting room'),
      ],
      color: 'success',
    },
  ];
  
  const additionalFeatures = [
    { icon: Pill, title: t('features.additional.prescriptions', 'Prescription Management'), color: 'warning' },
    { icon: MessageSquare, title: t('features.additional.messaging', 'Secure Messaging'), color: 'primary' },
    { icon: LineChart, title: t('features.additional.analytics', 'Health Analytics'), color: 'info' },
    { icon: Lock, title: t('features.additional.security', 'Enterprise Security'), color: 'success' },
    { icon: Globe, title: t('features.additional.multilingual', '50+ Languages'), color: 'secondary' },
    { icon: Zap, title: t('features.additional.realtime', 'Real-time Updates'), color: 'warning' },
  ];
  
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
      secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20' },
      success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
      warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
      info: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/20' },
    };
    return colors[color] || colors.primary;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-info/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t('features.badge', 'Platform Features')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('features.heroTitle1', 'Everything You Need for')} <br />
            <span className="gradient-text">{t('features.heroTitle2', 'Modern Healthcare')}</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {t('features.heroSubtitle', 'A comprehensive suite of tools designed to streamline healthcare delivery, improve patient outcomes, and make healthcare accessible to everyone.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
              {t('features.getStarted', 'Get Started Free')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate('/pricing')}>
              {t('features.viewPricing', 'View Pricing')}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Main Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => {
              const colorClasses = getColorClasses(feature.color);
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={feature.title}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div className={`w-16 h-16 rounded-2xl ${colorClasses.bg} ${colorClasses.border} border flex items-center justify-center`}>
                      <feature.icon className={`w-8 h-8 ${colorClasses.text}`} />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-display font-bold">
                      {feature.title}
                    </h2>
                    
                    <p className="text-lg text-muted-foreground">
                      {feature.description}
                    </p>
                    
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full ${colorClasses.bg} flex items-center justify-center`}>
                            <Check className={`w-4 h-4 ${colorClasses.text}`} />
                          </div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Visual */}
                  <div className="flex-1">
                    <div className="glass-card rounded-2xl p-8 shadow-xl">
                      <div className={`w-full h-64 ${colorClasses.bg} rounded-xl flex items-center justify-center`}>
                        <feature.icon className={`w-24 h-24 ${colorClasses.text} opacity-50`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Additional Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('features.moreTitle', 'And Much More')}
            </h2>
            <p className="text-muted-foreground">
              {t('features.moreSubtitle', 'Explore all the features that make MediConnect the leading healthcare platform.')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {additionalFeatures.map((feature) => {
              const colorClasses = getColorClasses(feature.color);
              return (
                <div 
                  key={feature.title}
                  className="glass-card-hover rounded-xl p-6 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} ${colorClasses.border} border flex items-center justify-center mx-auto mb-3`}>
                    <feature.icon className={`w-6 h-6 ${colorClasses.text}`} />
                  </div>
                  <p className="text-sm font-medium">{feature.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 gradient-bg-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('features.ctaTitle', 'Ready to Transform Your Healthcare Experience?')}
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            {t('features.ctaSubtitle', 'Join thousands of patients and healthcare providers already using MediConnect.')}
          </p>
          <Button 
            variant="outline" 
            size="xl" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate('/login')}
          >
            {t('features.ctaButton', 'Start Your Free Trial')}
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FeaturesPage;
