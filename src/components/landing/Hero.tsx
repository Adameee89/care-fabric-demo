import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Shield, Clock, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '50K+', label: 'Active Patients' },
    { value: '1,200+', label: 'Healthcare Providers' },
    { value: '99.9%', label: 'Uptime Guaranteed' },
    { value: '4.9★', label: 'User Rating' },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-info/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                AI-Powered Healthcare Platform
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Modern Healthcare,{' '}
                <span className="gradient-text">Simplified</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Connect with top healthcare providers, manage your health records, 
                and get AI-assisted insights—all in one secure, intuitive platform.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/login')}
                className="group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 text-info" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm">Trusted by 50K+ Users</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Main Card */}
              <div className="glass-card rounded-2xl p-6 shadow-xl">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Welcome back,</p>
                    <h3 className="text-lg font-semibold">Dr. Emily Carter</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full gradient-bg-hero flex items-center justify-center text-white font-semibold">
                    EC
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">Today's Patients</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-success">8</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>

                {/* Appointment Preview */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Next Appointment</p>
                  <div className="flex items-center gap-4 p-3 bg-accent/30 rounded-xl border border-primary/10">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-medium text-sm">
                      MT
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Michael Thompson</p>
                      <p className="text-sm text-muted-foreground">Follow-up • 10:30 AM</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                      In 15 min
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 glass-card rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Data Protected</p>
                    <p className="text-xs text-muted-foreground">256-bit encryption</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 glass-card rounded-xl p-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI Assistant</p>
                    <p className="text-xs text-muted-foreground">24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-slide-in-up"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <p className="text-3xl md:text-4xl font-display font-bold gradient-text">
                {stat.value}
              </p>
              <p className="text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
