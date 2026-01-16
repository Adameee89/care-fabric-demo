import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  Shield, 
  Stethoscope, 
  Brain,
  Clock,
  Bell,
  Lock,
  LineChart,
  Pill,
  Video
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered appointment booking that finds the perfect time for you and your healthcare provider.',
      color: 'primary',
    },
    {
      icon: FileText,
      title: 'Digital Health Records',
      description: 'Access your complete medical history, lab results, and documents anytime, anywhere.',
      color: 'info',
    },
    {
      icon: Brain,
      title: 'AI Health Assistant',
      description: 'Get preliminary symptom analysis and health insights powered by advanced AI.',
      color: 'secondary',
    },
    {
      icon: Video,
      title: 'Telemedicine',
      description: 'Connect with doctors via secure video consultations from the comfort of your home.',
      color: 'success',
    },
    {
      icon: Pill,
      title: 'Prescription Management',
      description: 'Track medications, get refill reminders, and manage all prescriptions in one place.',
      color: 'warning',
    },
    {
      icon: MessageSquare,
      title: 'Secure Messaging',
      description: 'Communicate directly with your healthcare team through encrypted messaging.',
      color: 'primary',
    },
    {
      icon: LineChart,
      title: 'Health Analytics',
      description: 'Track vital signs, view trends, and gain insights into your health journey.',
      color: 'info',
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and HIPAA-compliant infrastructure protect your data.',
      color: 'success',
    },
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
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Platform Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Everything You Need for{' '}
            <span className="gradient-text">Better Healthcare</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools designed to streamline healthcare delivery 
            and improve patient outcomes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            return (
              <div
                key={feature.title}
                className="glass-card-hover rounded-2xl p-6 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl ${colorClasses.bg} ${colorClasses.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${colorClasses.text}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            And many more features to discover...
          </p>
          <a 
            href="#pricing" 
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            View all features
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
