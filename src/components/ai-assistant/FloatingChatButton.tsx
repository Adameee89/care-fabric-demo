import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIChat } from '@/contexts/AIChatContext';

interface FloatingChatButtonProps {
  className?: string;
}

const FloatingChatButton = memo(({ className }: FloatingChatButtonProps) => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen, messages } = useAIChat();
  
  // Count unread messages (messages since last close)
  const unreadCount = 0; // Could implement actual unread tracking
  
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-14 h-14 rounded-full',
        'flex items-center justify-center',
        'shadow-lg transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isOpen 
          ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
          : 'gradient-bg-hero text-white hover:scale-110 btn-glow',
        className
      )}
      aria-label={isOpen ? t('ai.closeChat', 'Close chat') : t('ai.openChat', 'Open AI Assistant')}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <>
          <Sparkles className="w-6 h-6" />
          {/* Pulse animation when closed */}
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/30 pointer-events-none" />
        </>
      )}
      
      {/* Unread badge */}
      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
});

FloatingChatButton.displayName = 'FloatingChatButton';

export default FloatingChatButton;
