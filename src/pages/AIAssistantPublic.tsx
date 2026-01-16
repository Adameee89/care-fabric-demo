import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Trash2, 
  Sparkles,
  AlertTriangle,
  Heart,
  Info,
  ArrowLeft,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { sendAIMessage, specializationOptions, AISpecialization, AIChatResponse } from '@/services/aiHealthcareApi';
import AIResponseCard from '@/components/ai-assistant/AIResponseCard';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  aiResponse?: AIChatResponse;
}

const AIAssistantPublic = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [specialization, setSpecialization] = useState<AISpecialization>('general');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        type: 'system',
        content: t('ai.publicWelcome', 'Welcome to MediConnect AI Health Assistant! Ask me anything about health, symptoms, medications, or wellness. Remember, I provide information only—not medical advice.'),
        timestamp: new Date(),
      }]);
    }
  }, [t]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    const typingId = `ai_${Date.now()}`;
    const typingMessage: Message = {
      id: typingId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    
    setMessages(prev => [...prev, userMessage, typingMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await sendAIMessage({
        message: input.trim(),
        specialization,
        language: i18n.language,
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...msg, content: response.response.message, aiResponse: response, isTyping: false }
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...msg, content: t('ai.errorMessage', 'Sorry, I encountered an error. Please try again.'), isTyping: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      type: 'system',
      content: t('ai.publicWelcome', 'Welcome to MediConnect AI Health Assistant! Ask me anything about health, symptoms, medications, or wellness. Remember, I provide information only—not medical advice.'),
      timestamp: new Date(),
    }]);
  };
  
  const suggestedTopics = [
    { icon: '🤒', label: t('ai.suggestions.symptoms', 'Symptoms'), query: 'What could cause headaches and fatigue?' },
    { icon: '💊', label: t('ai.suggestions.medications', 'Medications'), query: 'What should I know about common pain relievers?' },
    { icon: '🍎', label: t('ai.suggestions.nutrition', 'Nutrition'), query: 'What are healthy eating habits?' },
    { icon: '🏃', label: t('ai.suggestions.exercise', 'Exercise'), query: 'What are good exercises for beginners?' },
    { icon: '😴', label: t('ai.suggestions.sleep', 'Sleep'), query: 'How can I improve my sleep quality?' },
    { icon: '🧘', label: t('ai.suggestions.mental', 'Mental Health'), query: 'What are stress management techniques?' },
  ];
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('default', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 border-r border-border flex-col bg-muted/30">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl gradient-bg-hero flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">
              Medi<span className="gradient-text">Connect</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 rounded-xl gradient-bg-hero flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">{t('ai.assistantTitle', 'AI Health Assistant')}</h1>
              <p className="text-sm text-muted-foreground">{t('ai.available', '24/7 Available')}</p>
            </div>
          </div>
        </div>
        
        {/* Specialization */}
        <div className="p-4 border-b border-border space-y-3">
          <label className="text-sm font-medium">{t('ai.specialization', 'Specialization')}</label>
          <Select value={specialization} onValueChange={(v) => setSpecialization(v as AISpecialization)}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-[100]">
              {specializationOptions.map((spec) => (
                <SelectItem key={spec.value} value={spec.value}>
                  <span className="flex items-center gap-2">
                    <span>{spec.icon}</span>
                    <span className="capitalize">{spec.value}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="w-full gap-2" onClick={clearChat}>
            <Trash2 className="w-4 h-4" />
            {t('ai.newChat', 'New Chat')}
          </Button>
        </div>
        
        {/* Topic suggestions */}
        <div className="p-4 flex-1 overflow-auto">
          <h3 className="font-semibold text-sm mb-3">{t('ai.suggestedTopics', 'Quick Topics')}</h3>
          <div className="space-y-2">
            {suggestedTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => setInput(topic.query)}
                disabled={isLoading}
                className="w-full text-left p-3 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{topic.icon}</span>
                  <span className="text-sm">{topic.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {t('ai.disclaimer', 'This AI provides general health information only. Not a substitute for professional medical advice.')}
            </p>
          </div>
        </div>
      </aside>
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg-hero flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">{t('ai.assistantName', 'AI Health Assistant')}</span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground text-sm">
                {t('ai.chatWith', 'Chatting with')} <span className="font-medium text-foreground capitalize">{specialization}</span> {t('ai.specialist', 'specialist')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile specialization */}
            <div className="lg:hidden">
              <Select value={specialization} onValueChange={(v) => setSpecialization(v as AISpecialization)}>
                <SelectTrigger className="h-9 w-32 text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-[100]">
                  {specializationOptions.slice(0, 5).map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>
                      <span className="flex items-center gap-1">
                        <span>{spec.icon}</span>
                        <span className="capitalize text-xs">{spec.value}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link to="/login">{t('ai.signIn', 'Sign In')}</Link>
            </Button>
          </div>
        </header>
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-4 lg:p-6" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length <= 1 ? (
              // Empty state with suggestions
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-2xl gradient-bg-hero flex items-center justify-center mb-6 animate-float">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  {t('ai.welcomeTitle', 'Hello! I\'m your AI Health Assistant')}
                </h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  {t('ai.welcomeSubtitle', 'Ask me anything about health, symptoms, medications, or general wellness.')}
                </p>
                
                {/* Mobile suggestions */}
                <div className="lg:hidden grid grid-cols-2 gap-2 w-full max-w-sm">
                  {suggestedTopics.slice(0, 4).map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(topic.query)}
                      disabled={isLoading}
                      className="text-left p-3 rounded-lg bg-muted border border-border hover:border-primary/50 transition-colors disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{topic.icon}</span>
                        <span className="text-xs">{topic.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id}>
                  {message.type === 'system' ? (
                    <div className="flex justify-center">
                      <div className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 max-w-[90%] text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="text-sm font-medium">{t('ai.notice', 'Notice')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.content}</p>
                      </div>
                    </div>
                  ) : message.type === 'user' ? (
                    <div className="flex gap-3 items-start justify-end">
                      <div className="max-w-[80%]">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground text-right mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-secondary" />
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
                        <Skeleton className="h-20 w-full" />
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
                      <div className="flex-1">
                        {message.aiResponse ? (
                          <AIResponseCard 
                            response={message.aiResponse.response}
                            metadata={message.aiResponse.metadata}
                            disclaimer={message.aiResponse.disclaimer}
                          />
                        ) : (
                          <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {/* Input */}
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={t('ai.inputPlaceholder', 'Ask a health-related question...')}
                  disabled={isLoading}
                  className="min-h-[48px] max-h-[200px] resize-none py-3 pr-12"
                  rows={1}
                />
              </div>
              <Button
                size="icon"
                className="shrink-0 h-12 w-12"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-5 h-5" />
                <span className="sr-only">{t('ai.send', 'Send')}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {t('ai.inputHint', 'Press Enter to send, Shift+Enter for new line')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPublic;
