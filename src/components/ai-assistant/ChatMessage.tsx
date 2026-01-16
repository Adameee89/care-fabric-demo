import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, User, AlertTriangle, FileText, Image, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/contexts/AIChatContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatMessageProps {
  message: ChatMessageType;
  onRetry?: () => void;
}

const ChatMessage = memo(({ message, onRetry }: ChatMessageProps) => {
  const { t } = useTranslation();
  
  const isUser = message.type === 'user';
  const isAI = message.type === 'ai';
  const isSystem = message.type === 'system';
  const isError = message.type === 'error';
  const isFile = message.type === 'file';
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('default', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Typing indicator
  if (message.isTyping) {
    return (
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
    );
  }
  
  // File message
  if (isFile && message.file) {
    const isImage = message.file.type.startsWith('image/');
    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    
    return (
      <div className="flex gap-3 items-start justify-end">
        <div className="max-w-[80%]">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3">
            <div className="flex items-center gap-3">
              {isImage && message.file.preview ? (
                <img 
                  src={message.file.preview} 
                  alt={message.file.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{message.file.name}</p>
                <p className="text-sm opacity-80">{formatFileSize(message.file.size)}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-right mt-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-secondary" />
        </div>
      </div>
    );
  }
  
  // Error message
  if (isError) {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4 text-destructive" />
        </div>
        <div className="flex-1">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl rounded-tl-sm px-4 py-3">
            <p className="text-sm">{message.content}</p>
            {message.error?.retryable && onRetry && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRetry}
                className="mt-2 h-8 text-destructive hover:text-destructive"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                {t('ai.retry', 'Retry')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // System message
  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 max-w-[90%] text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium">{t('ai.systemNotice', 'Notice')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{message.content}</p>
        </div>
      </div>
    );
  }
  
  // User message
  if (isUser) {
    return (
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
    );
  }
  
  // AI message
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          
          {/* Confidence indicator */}
          {message.confidence !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${message.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(message.confidence * 100)}%
              </span>
            </div>
          )}
        </div>
        
        {/* Disclaimer */}
        {message.disclaimer && (
          <div className="mt-2 flex items-start gap-2 px-2">
            <AlertTriangle className="w-3 h-3 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              {message.disclaimer}
            </p>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-1 px-2">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
