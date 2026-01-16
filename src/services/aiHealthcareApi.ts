import axios, { AxiosError } from 'axios';

// API configuration for Medical Diagnosis API
const API_URL = 'https://ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com/analyzeSymptomsAndDiagnose';
const API_KEY = '4c6806186bmshdc5a602fb55b29dp18c21bjsnf96c5dc5ebe2';
const API_HOST = 'ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com';

// Supported specializations (kept for UI compatibility)
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

// Patient Info structure for the new API
export interface PatientInfo {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  medicalHistory?: string[];
  currentMedications?: string[];
  allergies?: string[];
  lifestyle?: {
    smoking?: boolean;
    alcohol?: 'none' | 'occasional' | 'moderate' | 'heavy';
    exercise?: 'none' | 'light' | 'moderate' | 'intense';
    diet?: 'balanced' | 'vegetarian' | 'vegan' | 'keto' | 'other';
  };
}

// Diagnosis from API
export interface Diagnosis {
  condition: string;
  probability: string;
  description: string;
  icdCode?: string;
}

// Rich response structure from new API
export interface AIResponseData {
  message: string;
  diagnoses: Diagnosis[];
  recommendations: string[];
  warnings: string[];
  references: string[];
  followUp: string[];
  lifestyle: string[];
  urgency: string;
  specialistReferral?: string;
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
  patientInfo?: PatientInfo;
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

// Parse symptoms from user message
const extractSymptomsFromMessage = (message: string): string[] => {
  // Simple extraction - split by common delimiters and clean up
  const symptoms = message
    .toLowerCase()
    .replace(/[.,!?]/g, ',')
    .split(/[,\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 2 && s.length < 100);
  
  // Return at least the full message if no clear symptoms extracted
  return symptoms.length > 0 ? symptoms : [message.trim()];
};

// Parse the new API response
const parseAPIResponse = (data: any, language: string): AIChatResponse => {
  const result = data?.result || data;
  
  // Extract diagnoses
  const diagnoses: Diagnosis[] = Array.isArray(result?.diagnoses) 
    ? result.diagnoses.map((d: any) => ({
        condition: d.condition || d.name || 'Unknown condition',
        probability: d.probability || d.likelihood || 'Unknown',
        description: d.description || d.explanation || '',
        icdCode: d.icdCode || d.icd_code,
      }))
    : [];
  
  // Build main message from analysis or summary
  let mainMessage = result?.summary || result?.analysis || result?.message || '';
  if (!mainMessage && diagnoses.length > 0) {
    mainMessage = `Based on the symptoms provided, here are the possible conditions identified:\n\n${diagnoses.map((d, i) => 
      `${i + 1}. **${d.condition}** (${d.probability} probability)\n${d.description}`
    ).join('\n\n')}`;
  }
  
  // Extract urgency level
  const urgencyLevel = result?.urgencyLevel || result?.urgency || 'routine';
  const emergencyLevel = urgencyLevel === 'high' || urgencyLevel === 'emergency' 
    ? 'emergency' 
    : urgencyLevel === 'medium' || urgencyLevel === 'urgent' 
      ? 'urgent' 
      : 'routine';
  
  // Determine confidence from diagnoses
  const hasHighProbability = diagnoses.some(d => 
    d.probability.toLowerCase().includes('high') || 
    parseFloat(d.probability) > 0.7
  );
  const confidence = hasHighProbability ? 'High' : diagnoses.length > 0 ? 'Moderate' : 'Low';
  
  return {
    response: {
      message: mainMessage || 'Analysis complete. Please see the details below.',
      diagnoses,
      recommendations: Array.isArray(result?.recommendations) ? result.recommendations : [],
      warnings: Array.isArray(result?.warnings) ? result.warnings : [],
      references: Array.isArray(result?.references) ? result.references : [],
      followUp: Array.isArray(result?.followUpQuestions) || Array.isArray(result?.followUp) 
        ? (result.followUpQuestions || result.followUp) 
        : [],
      lifestyle: Array.isArray(result?.lifestyleAdvice) || Array.isArray(result?.lifestyle)
        ? (result.lifestyleAdvice || result.lifestyle)
        : [],
      urgency: urgencyLevel,
      specialistReferral: result?.specialistReferral || result?.referral,
    },
    metadata: {
      specialization: result?.specialization || 'General Medicine',
      confidence,
      requiresPhysicianConsult: result?.requiresPhysicianConsult ?? emergencyLevel !== 'routine',
      emergencyLevel,
      topRelatedSpecialties: Array.isArray(result?.relatedSpecialties) 
        ? result.relatedSpecialties 
        : diagnoses.length > 0 
          ? ['General Practice', 'Internal Medicine']
          : [],
    },
    disclaimer: getMedicalDisclaimer(language),
  };
};

// Default patient info for demo
const defaultPatientInfo: PatientInfo = {
  age: 35,
  gender: 'other',
  lifestyle: {
    smoking: false,
    alcohol: 'occasional',
    exercise: 'moderate',
    diet: 'balanced',
  },
};

// API call with error handling
export const sendAIMessage = async (request: AIChatRequest): Promise<AIChatResponse> => {
  const apiLanguage = mapLanguageToAPI(request.language);
  const symptoms = extractSymptomsFromMessage(request.message);
  
  try {
    const response = await axios.post(
      API_URL,
      {
        symptoms,
        patientInfo: request.patientInfo || defaultPatientInfo,
        lang: apiLanguage,
      },
      {
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
          'Content-Type': 'application/json',
        },
        timeout: 45000,
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
