import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  Brain, 
  Shield, 
  Globe, 
  MessageSquare,
  ArrowRight,
  Check,
  Send,
  AlertTriangle,
  Heart,
  Stethoscope,
  FileText,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { sendAIMessage, specializationOptions, AISpecialization, getMedicalDisclaimer } from '@/services/aiHealthcareApi';

interface DemoMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  disclaimer?: string;
}

const AIAssistantLanding = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [specialization, setSpecialization] = useState<AISpecialization>('general');
  const [demoUsed, setDemoUsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const MAX_DEMO_MESSAGES = 3;
  
  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Add welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        type: 'system',
        content: t('aiLanding.demo.welcome', 'Welcome! Try our AI Health Assistant. Ask any health-related question. You have 3 free demo messages.'),
        timestamp: new Date(),
      }]);
    }
  }, []);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading || demoUsed >= MAX_DEMO_MESSAGES) return;
    
    const userMessage: DemoMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    const typingId = `ai_${Date.now()}`;
    const typingMessage: DemoMessage = {
      id: typingId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    
    setMessages(prev => [...prev, userMessage, typingMessage]);
    setInput('');
    setIsLoading(true);
    setDemoUsed(prev => prev + 1);
    
    try {
      const response = await sendAIMessage({
        message: input.trim(),
        specialization,
        language: i18n.language,
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...msg, content: response.response, disclaimer: response.disclaimer, isTyping: false }
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...msg, content: t('aiLanding.demo.error', 'Sorry, I encountered an error. Please try again.'), isTyping: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };
  
  const features = [
    {
      icon: Brain,
      title: t('aiLanding.features.smart.title', 'Smart Health Insights'),
      description: t('aiLanding.features.smart.description', 'Get AI-powered responses to your health questions with relevant medical information.'),
    },
    {
      icon: Shield,
      title: t('aiLanding.features.safe.title', 'Safe & Responsible'),
      description: t('aiLanding.features.safe.description', 'Every response includes medical disclaimers. We never provide diagnoses.'),
    },
    {
      icon: Globe,
      title: t('aiLanding.features.multilingual.title', '50+ Languages'),
      description: t('aiLanding.features.multilingual.description', 'Communicate in your preferred language for better understanding.'),
    },
    {
      icon: Clock,
      title: t('aiLanding.features.available.title', '24/7 Available'),
      description: t('aiLanding.features.available.description', 'Get health information anytime, day or night, whenever you need it.'),
    },
    {
      icon: FileText,
      title: t('aiLanding.features.upload.title', 'File Upload Support'),
      description: t('aiLanding.features.upload.description', 'Upload lab results and images for context-aware discussions.'),
    },
    {
      icon: Stethoscope,
      title: t('aiLanding.features.specializations.title', 'Medical Specializations'),
      description: t('aiLanding.features.specializations.description', 'Choose from cardiology, dermatology, neurology, and more.'),
    },
  ];
  
  const suggestedQuestions = [
    t('aiLanding.suggestions.q1', 'What are common symptoms of seasonal allergies?'),
    t('aiLanding.suggestions.q2', 'How can I improve my sleep quality?'),
    t('aiLanding.suggestions.q3', 'What should I know about staying hydrated?'),
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Info */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{t('aiLanding.badge', 'AI-Powered Healthcare')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                {t('aiLanding.heroTitle1', 'Your Personal')} <br />
                <span className="gradient-text">{t('aiLanding.heroTitle2', 'Health Assistant')}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                {t('aiLanding.heroSubtitle', 'Get instant answers to your health questions. Our AI assistant provides reliable health information 24/7, in 50+ languages.')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
                  {t('aiLanding.getFullAccess', 'Get Full Access')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-5 h-5 text-success" />
                  <span className="text-sm">{t('aiLanding.trust.safe', 'Safe & Secure')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-5 h-5 text-info" />
                  <span className="text-sm">{t('aiLanding.trust.languages', '50+ Languages')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-5 h-5 text-destructive" />
                  <span className="text-sm">{t('aiLanding.trust.users', 'Trusted by 50K+')}</span>
                </div>
              </div>
            </div>
            
            {/* Right - Live Demo Chat */}
            <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-bg-hero flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{t('aiLanding.demo.title', 'Try AI Assistant')}</h3>
                    <p className="text-xs text-muted-foreground">
                      {demoUsed}/{MAX_DEMO_MESSAGES} {t('aiLanding.demo.messagesUsed', 'demo messages used')}
                    </p>
                  </div>
                </div>
                
                <Select value={specialization} onValueChange={(v) => setSpecialization(v as AISpecialization)}>
                  <SelectTrigger className="w-40 h-9 text-sm bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-[100]">
                    {specializationOptions.map((spec) => (
                      <SelectItem key={spec.value} value={spec.value}>
                        <span className="flex items-center gap-2">
                          <span>{spec.icon}</span>
                          <span>{spec.value}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Messages */}
              <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.type === 'system' ? (
                        <div className="flex justify-center">
                          <div className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 max-w-[90%] text-center">
                            <p className="text-sm text-muted-foreground">{message.content}</p>
                          </div>
                        </div>
                      ) : message.type === 'user' ? (
                        <div className="flex justify-end">
                          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ) : message.isTyping ? (
                        <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2 py-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-1 pt-1">
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 max-w-[85%]">
                            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            </div>
                            {message.disclaimer && (
                              <div className="mt-2 flex items-start gap-2 px-2">
                                <AlertTriangle className="w-3 h-3 text-warning shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground">{message.disclaimer}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Suggested questions */}
                  {messages.length <= 1 && (
                    <div className="space-y-2 pt-4">
                      <p className="text-xs text-muted-foreground text-center">{t('aiLanding.demo.trySaying', 'Try asking:')}</p>
                      {suggestedQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(q)}
                          className="w-full text-left p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors text-sm"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="p-4 border-t border-border">
                {demoUsed >= MAX_DEMO_MESSAGES ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {t('aiLanding.demo.limitReached', 'Demo limit reached. Sign up for unlimited access!')}
                    </p>
                    <Button variant="hero" className="w-full" onClick={() => navigate('/login')}>
                      {t('aiLanding.demo.signUp', 'Sign Up for Free')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={t('aiLanding.demo.placeholder', 'Ask a health question...')}
                      className="min-h-[44px] max-h-[100px] resize-none"
                      disabled={isLoading}
                    />
                    <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('aiLanding.featuresTitle', 'Why Choose Our AI Assistant?')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('aiLanding.featuresSubtitle', 'Designed with your health and safety in mind.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card-hover rounded-2xl p-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Disclaimer Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 border-warning/20 bg-warning/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('aiLanding.disclaimer.title', 'Important Medical Disclaimer')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('aiLanding.disclaimer.content', 'Our AI Health Assistant provides general health information for educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.')}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    {t('aiLanding.disclaimer.point1', 'Never disregard professional medical advice')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    {t('aiLanding.disclaimer.point2', 'Do not delay seeking medical advice because of AI responses')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    {t('aiLanding.disclaimer.point3', 'In case of emergency, call emergency services immediately')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 gradient-bg-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('aiLanding.ctaTitle', 'Ready for Unlimited Access?')}
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            {t('aiLanding.ctaSubtitle', 'Sign up for free and get unlimited AI health consultations, file uploads, and more.')}
          </p>
          <Button 
            variant="outline" 
            size="xl" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate('/login')}
          >
            {t('aiLanding.ctaButton', 'Start Free Today')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AIAssistantLanding;
