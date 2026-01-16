import { useRef, useEffect, useState, useCallback } from 'react';
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
  User,
  Paperclip,
  X,
  FileText,
  RefreshCw
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
  files?: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
}

// All available questions for each topic
const allTopicQuestions: Record<string, string[]> = {
  symptoms: [
    'What could cause headaches and fatigue?',
    'Why do I feel dizzy when standing up?',
    'What causes chest pain and when should I worry?',
    'What are common causes of persistent cough?',
    'Why do I have muscle aches without exercising?',
    'What causes sudden weight loss or gain?',
  ],
  medications: [
    'What should I know about common pain relievers?',
    'What are the side effects of antibiotics?',
    'Can I take vitamins with prescription medications?',
    'How do blood pressure medications work?',
    'What is the difference between generic and brand drugs?',
    'How long should I take prescribed antibiotics?',
  ],
  nutrition: [
    'What are healthy eating habits?',
    'What foods boost the immune system?',
    'How much protein do I need daily?',
    'What are the best foods for heart health?',
    'How can I reduce sugar in my diet?',
    'What vitamins should I take daily?',
  ],
  exercise: [
    'What are good exercises for beginners?',
    'How often should I work out per week?',
    'What exercises help with back pain?',
    'Is stretching before exercise necessary?',
    'What are low-impact cardio options?',
    'How do I build muscle effectively?',
  ],
  sleep: [
    'How can I improve my sleep quality?',
    'What causes insomnia and how to treat it?',
    'How many hours of sleep do adults need?',
    'What foods help or hurt sleep?',
    'Is napping during the day healthy?',
    'Why do I wake up tired after sleeping?',
  ],
  mental: [
    'What are stress management techniques?',
    'How can I manage anxiety naturally?',
    'What are signs of depression to watch for?',
    'How does exercise affect mental health?',
    'What are mindfulness techniques for beginners?',
    'How can I improve my focus and concentration?',
  ],
};

const topicKeys = ['symptoms', 'medications', 'nutrition', 'exercise', 'sleep', 'mental'] as const;

const AIAssistantPublic = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [specialization, setSpecialization] = useState<AISpecialization>('general');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [topicIndices, setTopicIndices] = useState<Record<string, number>>(() => 
    Object.fromEntries(topicKeys.map(key => [key, 0]))
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  // Rotate topic question
  const rotateTopicQuestion = useCallback((topicKey: string) => {
    setTopicIndices(prev => ({
      ...prev,
      [topicKey]: (prev[topicKey] + 1) % allTopicQuestions[topicKey].length
    }));
  }, []);
  
  // Get current question for a topic
  const getTopicQuestion = useCallback((topicKey: string) => {
    return allTopicQuestions[topicKey][topicIndices[topicKey]];
  }, [topicIndices]);
  
  // File handling
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) continue; // Skip files > 10MB
      
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      
      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        preview,
      };
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const handleSend = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;
    
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
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
    setUploadedFiles([]);
    setIsLoading(true);
    
    try {
      // Build message with file context
      let messageWithContext = input.trim();
      if (userMessage.files && userMessage.files.length > 0) {
        const fileNames = userMessage.files.map(f => f.name).join(', ');
        const fileContext = userMessage.files.some(f => f.type === 'application/pdf') 
          ? '[User uploaded medical documents for OCR analysis: ' + fileNames + ']'
          : '[User uploaded images for analysis: ' + fileNames + ']';
        messageWithContext = `${fileContext}\n\n${messageWithContext || 'Please analyze the uploaded files.'}`;
      }
      
      const response = await sendAIMessage({
        message: messageWithContext,
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
    setUploadedFiles([]);
  };
  
  const suggestedTopics = [
    { icon: '🤒', label: t('ai.suggestions.symptoms', 'Symptoms'), key: 'symptoms' },
    { icon: '💊', label: t('ai.suggestions.medications', 'Medications'), key: 'medications' },
    { icon: '🍎', label: t('ai.suggestions.nutrition', 'Nutrition'), key: 'nutrition' },
    { icon: '🏃', label: t('ai.suggestions.exercise', 'Exercise'), key: 'exercise' },
    { icon: '😴', label: t('ai.suggestions.sleep', 'Sleep'), key: 'sleep' },
    { icon: '🧘', label: t('ai.suggestions.mental', 'Mental Health'), key: 'mental' },
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
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            {t('ai.suggestedTopics', 'Quick Topics')}
            <span className="text-xs text-muted-foreground">(click to rotate)</span>
          </h3>
          <div className="space-y-2">
            {suggestedTopics.map((topic) => (
              <div key={topic.key} className="group relative">
                <button
                  onClick={() => setInput(getTopicQuestion(topic.key))}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <span className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{topic.icon}</span>
                    <span className="text-sm font-medium">{topic.label}</span>
                  </span>
                  <p className="text-xs text-muted-foreground pl-7 truncate">
                    {getTopicQuestion(topic.key)}
                  </p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    rotateTopicQuestion(topic.key);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                  title="Show different question"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
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
                  {suggestedTopics.slice(0, 4).map((topic) => (
                    <button
                      key={topic.key}
                      onClick={() => {
                        setInput(getTopicQuestion(topic.key));
                        rotateTopicQuestion(topic.key);
                      }}
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
                        {/* Show attached files */}
                        {message.files && message.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2 justify-end">
                            {message.files.map((file) => (
                              <div 
                                key={file.id}
                                className="bg-primary/80 text-primary-foreground rounded-lg p-2 flex items-center gap-2"
                              >
                                {file.type.startsWith('image/') && file.preview ? (
                                  <img src={file.preview} alt={file.name} className="w-10 h-10 object-cover rounded" />
                                ) : (
                                  <div className="w-10 h-10 bg-primary-foreground/10 rounded flex items-center justify-center">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                )}
                                <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3">
                          <p className="text-sm whitespace-pre-wrap">{message.content || '(Attached files for analysis)'}</p>
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
            {/* Uploaded files preview */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                  <div 
                    key={file.id}
                    className="relative group bg-muted rounded-lg p-2 pr-8 flex items-center gap-2"
                  >
                    {file.type.startsWith('image/') && file.preview ? (
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
            
            <div className="flex items-end gap-2">
              {/* File upload button */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-12 w-12 text-muted-foreground hover:text-foreground"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
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
                disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
              >
                <Send className="w-5 h-5" />
                <span className="sr-only">{t('ai.send', 'Send')}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {t('ai.fileHint', 'Upload PDFs or images for OCR analysis • Enter to send')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPublic;
