import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroHealthcare from '@/assets/hero-healthcare.jpg';

const CTA = () => {
  const navigate = useNavigate();

  const benefits = [
    'No credit card required',
    '14-day free trial',
    'Full platform access',
    'Cancel anytime',
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroHealthcare} 
          alt="Healthcare technology" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 to-foreground/80" />
      </div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-info/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Ready to Transform Your{' '}
            <span className="text-primary">Healthcare Experience?</span>
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare providers and patients who are already 
            experiencing the future of healthcare management.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate('/login')}
              className="group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="glass" 
              size="xl"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Schedule a Demo
            </Button>
          </div>

          {/* Social Proof */}
          <p className="text-white/50 text-sm mt-10">
            Trusted by 1,200+ healthcare organizations worldwide
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
