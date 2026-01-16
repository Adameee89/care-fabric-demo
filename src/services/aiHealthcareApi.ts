import axios, { AxiosError } from 'axios';

// API configuration
const API_URL = 'https://ai-doctor-api-ai-medical-chatbot-healthcare-ai-assistant.p.rapidapi.com/chat';
const API_KEY = '4c6806186bmshdc5a602fb55b29dp18c21bjsnf96c5dc5ebe2';
const API_HOST = 'ai-doctor-api-ai-medical-chatbot-healthcare-ai-assistant.p.rapidapi.com';

// Supported specializations
export type AISpecialization = 
  | 'general'
  | 'cardiology'
  | 'dermatology'
  | 'neurology'
  | 'orthopedics'
  | 'pediatrics'
  | 'psychiatry'
  | 'gynecology'
  | 'oncology'
  | 'endocrinology';

export interface AISpecializationOption {
  value: AISpecialization;
  labelKey: string;
  icon: string;
}

export const specializationOptions: AISpecializationOption[] = [
  { value: 'general', labelKey: 'ai.specializations.general', icon: '🏥' },
  { value: 'cardiology', labelKey: 'ai.specializations.cardiology', icon: '❤️' },
  { value: 'dermatology', labelKey: 'ai.specializations.dermatology', icon: '🧴' },
  { value: 'neurology', labelKey: 'ai.specializations.neurology', icon: '🧠' },
  { value: 'orthopedics', labelKey: 'ai.specializations.orthopedics', icon: '🦴' },
  { value: 'pediatrics', labelKey: 'ai.specializations.pediatrics', icon: '👶' },
  { value: 'psychiatry', labelKey: 'ai.specializations.psychiatry', icon: '💭' },
  { value: 'gynecology', labelKey: 'ai.specializations.gynecology', icon: '👩' },
  { value: 'oncology', labelKey: 'ai.specializations.oncology', icon: '🎗️' },
  { value: 'endocrinology', labelKey: 'ai.specializations.endocrinology', icon: '⚗️' },
];

// Supported languages
export type AILanguage = 'en' | 'de' | 'fr' | 'es' | 'ar' | 'it' | 'pt' | 'nl' | 'pl' | 'ru' | 'zh' | 'ja' | 'ko' | 'hi';

// Rich response structure from API
export interface AIResponseData {
  message: string;
  recommendations: string[];
  warnings: string[];
  references: string[];
  followUp: string[];
}

export interface AIResponseMetadata {
  specialization: string;
  confidence: 'High' | 'Moderate' | 'Low';
  requiresPhysicianConsult: boolean;
  emergencyLevel: 'routine' | 'urgent' | 'emergency';
  topRelatedSpecialties: string[];
}

export interface AIChatRequest {
  message: string;
  specialization: AISpecialization;
  language: string;
}

export interface AIChatResponse {
  response: AIResponseData;
  metadata: AIResponseMetadata;
  disclaimer: string;
}

export interface AIError {
  code: 'API_ERROR' | 'NETWORK_ERROR' | 'RATE_LIMIT' | 'INVALID_INPUT' | 'TIMEOUT' | 'UNKNOWN';
  message: string;
  retryable: boolean;
}

// Map i18n language codes to API-supported languages
export const mapLanguageToAPI = (lang: string): AILanguage => {
  const languageMap: Record<string, AILanguage> = {
    en: 'en',
    de: 'de',
    fr: 'fr',
    es: 'es',
    ar: 'ar',
    it: 'en',
    pt: 'en',
    nl: 'en',
    pl: 'en',
    ru: 'ru',
    zh: 'zh',
    ja: 'ja',
    ko: 'ko',
    hi: 'hi',
  };
  return languageMap[lang] || 'en';
};

// Medical disclaimer
export const getMedicalDisclaimer = (lang: string): string => {
  const disclaimers: Record<string, string> = {
    en: 'This is not a medical diagnosis. Please consult a licensed healthcare professional for proper medical advice.',
    de: 'Dies ist keine medizinische Diagnose. Bitte konsultieren Sie einen zugelassenen Arzt für eine ordnungsgemäße medizinische Beratung.',
    fr: 'Ceci n\'est pas un diagnostic médical. Veuillez consulter un professionnel de santé agréé pour un avis médical approprié.',
    es: 'Esto no es un diagnóstico médico. Por favor, consulte a un profesional de la salud autorizado para obtener un consejo médico adecuado.',
    ar: 'هذا ليس تشخيصًا طبيًا. يرجى استشارة أخصائي رعاية صحية مرخص للحصول على المشورة الطبية المناسبة.',
  };
  return disclaimers[lang] || disclaimers.en;
};

// Parse the rich API response
const parseAPIResponse = (data: any, language: string): AIChatResponse => {
  // Handle the nested structure
  const result = data?.result || data;
  const responseData = result?.response || {};
  const metadata = result?.metadata || {};
  
  return {
    response: {
      message: responseData.message || (typeof data === 'string' ? data : 'No response available'),
      recommendations: Array.isArray(responseData.recommendations) ? responseData.recommendations : [],
      warnings: Array.isArray(responseData.warnings) ? responseData.warnings : [],
      references: Array.isArray(responseData.references) ? responseData.references : [],
      followUp: Array.isArray(responseData.followUp) ? responseData.followUp : [],
    },
    metadata: {
      specialization: metadata.specialization || 'General',
      confidence: metadata.confidence || 'Moderate',
      requiresPhysicianConsult: metadata.requiresPhysicianConsult ?? true,
      emergencyLevel: metadata.emergencyLevel || 'routine',
      topRelatedSpecialties: Array.isArray(metadata.topRelatedSpecialties) ? metadata.topRelatedSpecialties : [],
    },
    disclaimer: getMedicalDisclaimer(language),
  };
};

// API call with error handling
export const sendAIMessage = async (request: AIChatRequest): Promise<AIChatResponse> => {
  const apiLanguage = mapLanguageToAPI(request.language);
  
  try {
    const response = await axios.post(
      API_URL,
      {
        message: request.message,
        specialization: request.specialization,
        language: apiLanguage,
      },
      {
        params: { noqueue: '1' },
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return parseAPIResponse(response.data, request.language);
  } catch (error) {
    throw parseAIError(error);
  }
};

// Error parsing
const parseAIError = (error: unknown): AIError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
      return {
        code: 'TIMEOUT',
        message: 'Request timed out. Please try again.',
        retryable: true,
      };
    }
    
    if (!axiosError.response) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        retryable: true,
      };
    }
    
    const status = axiosError.response.status;
    
    if (status === 429) {
      return {
        code: 'RATE_LIMIT',
        message: 'Too many requests. Please wait a moment and try again.',
        retryable: true,
      };
    }
    
    if (status >= 400 && status < 500) {
      return {
        code: 'INVALID_INPUT',
        message: 'Invalid request. Please try rephrasing your question.',
        retryable: false,
      };
    }
    
    return {
      code: 'API_ERROR',
      message: 'Service temporarily unavailable. Please try again later.',
      retryable: true,
    };
  }
  
  return {
    code: 'UNKNOWN',
    message: 'An unexpected error occurred.',
    retryable: true,
  };
};
