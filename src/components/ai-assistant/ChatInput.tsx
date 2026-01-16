import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Paperclip, X, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAIChat, UploadedFile } from '@/contexts/AIChatContext';

interface ChatInputProps {
  onSend: (message: string, files?: UploadedFile[]) => void;
  disabled?: boolean;
  className?: string;
}

const ChatInput = ({ onSend, disabled, className }: ChatInputProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const { uploadedFiles, uploadFile, removeFile, isLoading } = useAIChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = useCallback(() => {
    if (message.trim() || uploadedFiles.length > 0) {
      onSend(message.trim(), uploadedFiles.length > 0 ? uploadedFiles : undefined);
      setMessage('');
    }
  }, [message, uploadedFiles, onSend]);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const isImage = (type: string) => type.startsWith('image/');
  
  return (
    <div className={cn('border-t border-border bg-background p-4', className)}>
      {/* Uploaded files preview */}
      {uploadedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {uploadedFiles.map((file) => (
            <div 
              key={file.id}
              className="relative group bg-muted rounded-lg p-2 pr-8 flex items-center gap-2"
            >
              {isImage(file.type) && file.preview ? (
                <img 
                  src={file.preview} 
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-muted-foreground/10 rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[150px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* File upload button */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading}
        >
          <Paperclip className="w-5 h-5" />
          <span className="sr-only">{t('ai.attachFile', 'Attach file')}</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        
        {/* Textarea */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('ai.inputPlaceholder', 'Ask a health-related question...')}
            disabled={disabled || isLoading}
            className="min-h-[44px] max-h-[200px] resize-none pr-12 py-3"
            rows={1}
          />
        </div>
        
        {/* Send button */}
        <Button
          size="icon"
          className="shrink-0"
          onClick={handleSubmit}
          disabled={disabled || isLoading || (!message.trim() && uploadedFiles.length === 0)}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">{t('ai.send', 'Send')}</span>
        </Button>
      </div>
      
      {/* Hint */}
      <p className="text-xs text-muted-foreground mt-2 text-center">
        {t('ai.inputHint', 'Press Enter to send, Shift+Enter for new line')}
      </p>
    </div>
  );
};

export default ChatInput;
