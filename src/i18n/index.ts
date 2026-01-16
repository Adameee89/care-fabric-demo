import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ar from './locales/ar.json';

// Supported languages with metadata
export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr', flag: '🇵🇱' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', dir: 'ltr', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', dir: 'ltr', flag: '🇸🇰' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', dir: 'ltr', flag: '🇭🇺' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', dir: 'ltr', flag: '🇷🇸' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', dir: 'ltr', flag: '🇭🇷' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', dir: 'ltr', flag: '🇸🇮' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', dir: 'ltr', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', dir: 'ltr', flag: '🇧🇬' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr', flag: '🇬🇷' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', dir: 'rtl', flag: '🇮🇱' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', flag: '🇷🇺' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr', flag: '🇺🇦' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', dir: 'ltr', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr', flag: '🇲🇾' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', dir: 'ltr', flag: '🇫🇮' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', dir: 'ltr', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', dir: 'ltr', flag: '🇩🇰' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', dir: 'ltr', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', dir: 'ltr', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', dir: 'ltr', flag: '🇱🇹' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', dir: 'ltr', flag: '🇲🇹' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', dir: 'ltr', flag: '🇮🇪' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', dir: 'ltr', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', dir: 'ltr', flag: '🇪🇸' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', dir: 'ltr', flag: '🇪🇸' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', dir: 'ltr', flag: '🇪🇸' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', dir: 'ltr', flag: '🇮🇸' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', dir: 'ltr', flag: '🇦🇱' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', dir: 'ltr', flag: '🇲🇰' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', dir: 'ltr', flag: '🇧🇦' },
  { code: 'me', name: 'Montenegrin', nativeName: 'Crnogorski', dir: 'ltr', flag: '🇲🇪' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', dir: 'ltr', flag: '🇧🇾' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', dir: 'ltr', flag: '🇬🇪' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերdelays', dir: 'ltr', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', dir: 'ltr', flag: '🇦🇿' },
];

// Resources - using English as fallback for non-translated languages
const resources = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  ar: { translation: ar },
  // Other languages fall back to English
};

// Get stored language or browser language
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem('mediconnect_language');
  if (stored && supportedLanguages.some(l => l.code === stored)) {
    return stored;
  }
  
  // Try to match browser language
  const browserLang = navigator.language.split('-')[0];
  if (supportedLanguages.some(l => l.code === browserLang)) {
    return browserLang;
  }
  
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Helper to get language config
export const getLanguageConfig = (code: string): LanguageConfig | undefined => {
  return supportedLanguages.find(l => l.code === code);
};

// Helper to get current language direction
export const getCurrentDirection = (): 'ltr' | 'rtl' => {
  const currentLang = getLanguageConfig(i18n.language);
  return currentLang?.dir || 'ltr';
};

// Change language and persist
export const changeLanguage = async (code: string): Promise<void> => {
  await i18n.changeLanguage(code);
  localStorage.setItem('mediconnect_language', code);
  
  // Update document direction for RTL support
  const config = getLanguageConfig(code);
  document.documentElement.dir = config?.dir || 'ltr';
  document.documentElement.lang = code;
};

export default i18n;
