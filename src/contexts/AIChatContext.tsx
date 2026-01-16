import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  sendAIMessage, 
  AISpecialization, 
  getMedicalDisclaimer,
  AIError 
} from '@/services/aiHealthcareApi';

// Message types
export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system' | 'error' | 'file';
  content: string;
  timestamp: Date;
  confidence?: number;
  disclaimer?: string;
  file?: UploadedFile;
  isTyping?: boolean;
  error?: AIError;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  uploadedAt: Date;
}

export interface AIChatSettings {
  specialization: AISpecialization;
  language: string;
}

interface AIChatContextType {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  settings: AIChatSettings;
  uploadedFiles: UploadedFile[];
  
  // Actions
  sendMessage: (content: string, files?: UploadedFile[]) => Promise<void>;
  clearChat: () => void;
  setIsOpen: (open: boolean) => void;
  updateSettings: (settings: Partial<AIChatSettings>) => void;
  uploadFile: (file: File) => Promise<UploadedFile | null>;
  removeFile: (fileId: string) => void;
  retryLastMessage: () => Promise<void>;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

// Generate unique ID
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// File validation
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t } = useTranslation();
  
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [settings, setSettings] = useState<AIChatSettings>({
    specialization: 'general',
    language: i18n.language,
  });
  
  // Refs
  const lastUserMessageRef = useRef<string>('');
  
  // Add welcome message on first open
  const ensureWelcomeMessage = useCallback(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: generateId(),
        type: 'system',
        content: t('ai.welcomeMessage', 'Hello! I\'m your AI Healthcare Assistant. I can help answer your health-related questions. Please note that my responses are for informational purposes only and should not replace professional medical advice.'),
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, t]);
  
  // Handle opening chat
  const handleSetIsOpen = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      ensureWelcomeMessage();
    }
  }, [ensureWelcomeMessage]);
  
  // Send message
  const sendMessage = useCallback(async (content: string, files?: UploadedFile[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;
    
    lastUserMessageRef.current = content;
    
    // Add file messages if any
    if (files && files.length > 0) {
      files.forEach(file => {
        const fileMessage: ChatMessage = {
          id: generateId(),
          type: 'file',
          content: `Uploaded: ${file.name}`,
          timestamp: new Date(),
          file,
        };
        setMessages(prev => [...prev, fileMessage]);
      });
      setUploadedFiles([]);
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Add typing indicator
    const typingId = generateId();
    const typingMessage: ChatMessage = {
      id: typingId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);
    setIsLoading(true);
    
    try {
      // Include file context in message if files were uploaded
      let messageWithContext = content;
      if (files && files.length > 0) {
        const fileNames = files.map(f => f.name).join(', ');
        messageWithContext = `[User uploaded files: ${fileNames}]\n\n${content}`;
      }
      
      const response = await sendAIMessage({
        message: messageWithContext,
        specialization: settings.specialization,
        language: settings.language,
      });
      
      // Replace typing indicator with response
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? {
              ...msg,
              content: response.response,
              confidence: response.confidence,
              disclaimer: response.disclaimer,
              isTyping: false,
            }
          : msg
      ));
    } catch (error) {
      const aiError = error as AIError;
      
      // Replace typing indicator with error
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? {
              ...msg,
              type: 'error' as const,
              content: aiError.message,
              error: aiError,
              isTyping: false,
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [settings]);
  
  // Retry last message
  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current) {
      // Remove last error message
      setMessages(prev => {
        const lastError = prev.findIndex(m => m.type === 'error');
        if (lastError !== -1) {
          return prev.filter((_, i) => i !== lastError);
        }
        return prev;
      });
      
      await sendMessage(lastUserMessageRef.current);
    }
  }, [sendMessage]);
  
  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([]);
    setUploadedFiles([]);
    lastUserMessageRef.current = '';
  }, []);
  
  // Update settings
  const updateSettings = useCallback((newSettings: Partial<AIChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  // Upload file
  const uploadFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return null;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return null;
    }
    
    // Create preview for images
    let preview: string | undefined;
    if (file.type.startsWith('image/')) {
      preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
    
    const uploadedFile: UploadedFile = {
      id: generateId(),
      name: file.name,
      type: file.type,
      size: file.size,
      preview,
      uploadedAt: new Date(),
    };
    
    setUploadedFiles(prev => [...prev, uploadedFile]);
    return uploadedFile;
  }, []);
  
  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);
  
  // Sync language with i18n
  React.useEffect(() => {
    setSettings(prev => ({ ...prev, language: i18n.language }));
  }, [i18n.language]);
  
  return (
    <AIChatContext.Provider
      value={{
        messages,
        isLoading,
        isOpen,
        settings,
        uploadedFiles,
        sendMessage,
        clearChat,
        setIsOpen: handleSetIsOpen,
        updateSettings,
        uploadFile,
        removeFile,
        retryLastMessage,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = (): AIChatContextType => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};
