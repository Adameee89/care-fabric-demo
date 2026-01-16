import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  Building,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const plans = [
    {
      name: t('pricing.plans.starter.name', 'Starter'),
      description: t('pricing.plans.starter.description', 'Perfect for individuals'),
      price: t('pricing.plans.starter.price', 'Free'),
      period: '',
      icon: Sparkles,
      color: 'primary',
      features: [
        { name: t('pricing.features.appointments', 'Appointments per month'), value: '5' },
        { name: t('pricing.features.aiChats', 'AI Assistant chats'), value: '10' },
        { name: t('pricing.features.records', 'Digital records'), included: true },
        { name: t('pricing.features.telemedicine', 'Telemedicine'), included: false },
        { name: t('pricing.features.analytics', 'Health analytics'), included: false },
        { name: t('pricing.features.support', 'Priority support'), included: false },
      ],
      cta: t('pricing.plans.starter.cta', 'Get Started'),
      popular: false,
    },
    {
      name: t('pricing.plans.pro.name', 'Professional'),
      description: t('pricing.plans.pro.description', 'For active health managers'),
      price: '$19',
      period: t('pricing.perMonth', '/month'),
      icon: Zap,
      color: 'secondary',
      features: [
        { name: t('pricing.features.appointments', 'Appointments per month'), value: t('pricing.unlimited', 'Unlimited') },
        { name: t('pricing.features.aiChats', 'AI Assistant chats'), value: t('pricing.unlimited', 'Unlimited') },
        { name: t('pricing.features.records', 'Digital records'), included: true },
        { name: t('pricing.features.telemedicine', 'Telemedicine'), included: true },
        { name: t('pricing.features.analytics', 'Health analytics'), included: true },
        { name: t('pricing.features.support', 'Priority support'), included: false },
      ],
      cta: t('pricing.plans.pro.cta', 'Start Free Trial'),
      popular: true,
    },
    {
      name: t('pricing.plans.enterprise.name', 'Enterprise'),
      description: t('pricing.plans.enterprise.description', 'For healthcare organizations'),
      price: t('pricing.plans.enterprise.price', 'Custom'),
      period: '',
      icon: Building,
      color: 'info',
      features: [
        { name: t('pricing.features.appointments', 'Appointments per month'), value: t('pricing.unlimited', 'Unlimited') },
        { name: t('pricing.features.aiChats', 'AI Assistant chats'), value: t('pricing.unlimited', 'Unlimited') },
        { name: t('pricing.features.records', 'Digital records'), included: true },
        { name: t('pricing.features.telemedicine', 'Telemedicine'), included: true },
        { name: t('pricing.features.analytics', 'Health analytics'), included: true },
        { name: t('pricing.features.support', 'Priority support'), included: true },
      ],
      cta: t('pricing.plans.enterprise.cta', 'Contact Sales'),
      popular: false,
    },
  ];
  
  const comparisonFeatures = [
    { name: t('pricing.comparison.appointments', 'Monthly appointments'), starter: '5', pro: t('pricing.unlimited', 'Unlimited'), enterprise: t('pricing.unlimited', 'Unlimited') },
    { name: t('pricing.comparison.aiChats', 'AI chat sessions'), starter: '10', pro: t('pricing.unlimited', 'Unlimited'), enterprise: t('pricing.unlimited', 'Unlimited') },
    { name: t('pricing.comparison.fileUpload', 'File uploads'), starter: '100MB', pro: '5GB', enterprise: t('pricing.unlimited', 'Unlimited') },
    { name: t('pricing.comparison.telemedicine', 'Telemedicine calls'), starter: false, pro: true, enterprise: true },
    { name: t('pricing.comparison.analytics', 'Health analytics'), starter: false, pro: true, enterprise: true },
    { name: t('pricing.comparison.api', 'API access'), starter: false, pro: false, enterprise: true },
    { name: t('pricing.comparison.sso', 'SSO integration'), starter: false, pro: false, enterprise: true },
    { name: t('pricing.comparison.support', 'Support'), starter: t('pricing.support.email', 'Email'), pro: t('pricing.support.priority', 'Priority'), enterprise: t('pricing.support.dedicated', 'Dedicated') },
  ];
  
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
      secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20' },
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
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t('pricing.badge', 'Simple Pricing')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {t('pricing.heroTitle1', 'Choose Your')} <span className="gradient-text">{t('pricing.heroTitle2', 'Health Plan')}</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            {t('pricing.heroSubtitle', 'Start free and upgrade as you grow. No hidden fees, cancel anytime.')}
          </p>
          
          {/* Demo mode disclaimer */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-lg mb-10">
            <Info className="w-4 h-4 text-warning" />
            <span className="text-sm text-warning">{t('pricing.demoDisclaimer', 'Demo Mode: All plans are simulated for demonstration purposes')}</span>
          </div>
        </div>
      </section>
      
      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const colorClasses = getColorClasses(plan.color);
              
              return (
                <div 
                  key={plan.name}
                  className={`relative glass-card rounded-2xl p-6 ${plan.popular ? 'ring-2 ring-secondary shadow-xl' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-secondary text-secondary-foreground">
                        {t('pricing.mostPopular', 'Most Popular')}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className={`w-14 h-14 rounded-xl ${colorClasses.bg} ${colorClasses.border} border flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className={`w-7 h-7 ${colorClasses.text}`} />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <span className="text-4xl font-display font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        {feature.included === false ? (
                          <X className="w-5 h-5 text-muted-foreground/50" />
                        ) : (
                          <Check className={`w-5 h-5 ${colorClasses.text}`} />
                        )}
                        <span className={feature.included === false ? 'text-muted-foreground/50' : ''}>
                          {feature.name}
                          {feature.value && <span className="font-medium"> ({feature.value})</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.popular ? 'hero' : 'outline'} 
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    {plan.cta}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Comparison Table */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('pricing.comparisonTitle', 'Compare Plans')}
            </h2>
            <p className="text-muted-foreground">
              {t('pricing.comparisonSubtitle', 'See what\'s included in each plan')}
            </p>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">{t('pricing.feature', 'Feature')}</TableHead>
                  <TableHead className="text-center">{t('pricing.plans.starter.name', 'Starter')}</TableHead>
                  <TableHead className="text-center bg-secondary/5">{t('pricing.plans.pro.name', 'Professional')}</TableHead>
                  <TableHead className="text-center">{t('pricing.plans.enterprise.name', 'Enterprise')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFeatures.map((feature, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{feature.name}</TableCell>
                    <TableCell className="text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                      ) : feature.starter}
                    </TableCell>
                    <TableCell className="text-center bg-secondary/5">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                      ) : feature.pro}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                      ) : feature.enterprise}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('pricing.faqTitle', 'Frequently Asked Questions')}
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: t('pricing.faq.q1', 'Can I change plans later?'), a: t('pricing.faq.a1', 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.') },
              { q: t('pricing.faq.q2', 'Is there a free trial?'), a: t('pricing.faq.a2', 'Yes! The Professional plan includes a 14-day free trial with full access to all features.') },
              { q: t('pricing.faq.q3', 'What payment methods do you accept?'), a: t('pricing.faq.a3', 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.') },
              { q: t('pricing.faq.q4', 'Is my data secure?'), a: t('pricing.faq.a4', 'Absolutely. We use enterprise-grade encryption and are fully HIPAA compliant.') },
            ].map((faq, index) => (
              <div key={index} className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 gradient-bg-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('pricing.ctaTitle', 'Ready to Get Started?')}
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            {t('pricing.ctaSubtitle', 'Start with our free plan and upgrade when you\'re ready.')}
          </p>
          <Button 
            variant="outline" 
            size="xl" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate('/login')}
          >
            {t('pricing.ctaButton', 'Start Free Today')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Pricing;
