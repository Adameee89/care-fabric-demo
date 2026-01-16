import { useRef, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Trash2, Settings, Maximize2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAIChat } from '@/contexts/AIChatContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { specializationOptions } from '@/services/aiHealthcareApi';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface FloatingChatPanelProps {
  className?: string;
}

const FloatingChatPanel = memo(({ className }: FloatingChatPanelProps) => {
  const { t } = useTranslation();
  const { 
    messages, 
    isOpen, 
    setIsOpen, 
    sendMessage, 
    clearChat, 
    settings, 
    updateSettings,
    retryLastMessage,
    isLoading,
  } = useAIChat();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={cn(
        'fixed bottom-24 right-6 z-50',
        'w-[380px] max-w-[calc(100vw-3rem)]',
        'h-[600px] max-h-[calc(100vh-8rem)]',
        'bg-background border border-border rounded-2xl shadow-2xl',
        'flex flex-col overflow-hidden',
        'animate-scale-in',
        // Mobile full screen
        'md:bottom-24 md:right-6 md:w-[380px] md:h-[600px] md:max-h-[calc(100vh-8rem)]',
        'max-md:bottom-0 max-md:right-0 max-md:left-0 max-md:top-0 max-md:w-full max-md:h-full max-md:max-h-full max-md:rounded-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg-hero flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t('ai.assistantName', 'AI Health Assistant')}</h3>
            <p className="text-xs text-muted-foreground">{t('ai.online', 'Online')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Expand to full page */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            asChild
          >
            <Link to="/ai-assistant" onClick={() => setIsOpen(false)}>
              <Maximize2 className="w-4 h-4" />
              <span className="sr-only">{t('ai.expandFullPage', 'Open full page')}</span>
            </Link>
          </Button>
          
          {/* Clear chat */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={clearChat}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">{t('ai.clearChat', 'Clear chat')}</span>
          </Button>
          
          {/* Close */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">{t('ai.closeChat', 'Close chat')}</span>
          </Button>
        </div>
      </div>
      
      {/* Specialization selector */}
      <div className="px-4 py-2 border-b border-border bg-muted/20">
        <Select 
          value={settings.specialization} 
          onValueChange={(value) => updateSettings({ specialization: value as any })}
        >
          <SelectTrigger className="h-9 text-sm bg-background">
            <SelectValue placeholder={t('ai.selectSpecialization', 'Select specialization')} />
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
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onRetry={retryLastMessage}
            />
          ))}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <ChatInput 
        onSend={sendMessage}
        disabled={isLoading}
      />
    </div>
  );
});

FloatingChatPanel.displayName = 'FloatingChatPanel';

export default FloatingChatPanel;
