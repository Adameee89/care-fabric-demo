import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Trash2, 
  Settings, 
  ArrowLeft, 
  History, 
  ChevronDown,
  Brain,
  Heart,
  Shield,
  Stethoscope,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAIChat } from '@/contexts/AIChatContext';
import { specializationOptions } from '@/services/aiHealthcareApi';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import ChatMessage from '@/components/ai-assistant/ChatMessage';
import ChatInput from '@/components/ai-assistant/ChatInput';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const AIAssistant = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    clearChat, 
    settings, 
    updateSettings,
    retryLastMessage,
    isLoading,
    setIsOpen,
  } = useAIChat();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Close floating chat when on this page
  useEffect(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Ensure welcome message exists
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage(''); // This will trigger the welcome message in context
    }
  }, []);
  
  const suggestionTopics = [
    { icon: '🤒', label: t('ai.suggestions.symptoms', 'Symptom questions'), query: 'What could cause headaches and fatigue?' },
    { icon: '💊', label: t('ai.suggestions.medications', 'Medication info'), query: 'What should I know about common pain relievers?' },
    { icon: '🍎', label: t('ai.suggestions.nutrition', 'Nutrition advice'), query: 'What are healthy eating habits for better health?' },
    { icon: '🏃', label: t('ai.suggestions.exercise', 'Exercise tips'), query: 'What are good exercises for beginners?' },
    { icon: '😴', label: t('ai.suggestions.sleep', 'Sleep health'), query: 'How can I improve my sleep quality?' },
    { icon: '🧘', label: t('ai.suggestions.mental', 'Mental wellness'), query: 'What are some stress management techniques?' },
  ];
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 border-r border-border flex-col bg-muted/30">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            className="mb-4 gap-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('ai.backToDashboard', 'Back to Dashboard')}
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-bg-hero flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">{t('ai.assistantTitle', 'AI Health Assistant')}</h1>
              <p className="text-sm text-muted-foreground">{t('ai.poweredBy', 'Powered by MediConnect AI')}</p>
            </div>
          </div>
        </div>
        
        {/* Settings */}
        <div className="p-4 border-b border-border space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t('ai.settings', 'Settings')}
          </h3>
          
          {/* Specialization */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              {t('ai.specialization', 'Specialization')}
            </label>
            <Select 
              value={settings.specialization} 
              onValueChange={(value) => updateSettings({ specialization: value as any })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-[100]">
                {specializationOptions.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    <span className="flex items-center gap-2">
                      <span>{spec.icon}</span>
                      <span>{t(spec.labelKey, spec.value)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Quick actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={clearChat}>
              <Trash2 className="w-4 h-4" />
              {t('ai.clearChat', 'Clear Chat')}
            </Button>
          </div>
        </div>
        
        {/* Topic suggestions */}
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-sm mb-3">
            {t('ai.suggestedTopics', 'Suggested Topics')}
          </h3>
          <div className="space-y-2">
            {suggestionTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => sendMessage(topic.query)}
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
              {t('ai.disclaimer', 'This AI assistant provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment.')}
            </p>
          </div>
        </div>
      </aside>
      
      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg-hero flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">{t('ai.assistantName', 'AI Health Assistant')}</span>
            </div>
            <div className="hidden lg:block">
              <span className="text-muted-foreground">
                {t('ai.chatWith', 'Chatting with')} <span className="font-medium text-foreground">{t(`ai.specializations.${settings.specialization}`, settings.specialization)}</span> {t('ai.specialist', 'specialist')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>
        
        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4 lg:p-6" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl gradient-bg-hero flex items-center justify-center mb-6">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  {t('ai.welcomeTitle', 'Hello! I\'m your AI Health Assistant')}
                </h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  {t('ai.welcomeSubtitle', 'Ask me anything about health, symptoms, medications, or general wellness. Remember, I\'m here to provide information, not medical advice.')}
                </p>
                
                {/* Mobile suggestions */}
                <div className="lg:hidden grid grid-cols-2 gap-2 w-full max-w-sm">
                  {suggestionTopics.slice(0, 4).map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(topic.query)}
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
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  onRetry={retryLastMessage}
                />
              ))
            )}
          </div>
        </ScrollArea>
        
        {/* Input */}
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput 
            onSend={sendMessage}
            disabled={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
