import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import cs from './locales/cs.json';
import sk from './locales/sk.json';
import hu from './locales/hu.json';
import sr from './locales/sr.json';
import hr from './locales/hr.json';
import sl from './locales/sl.json';
import ro from './locales/ro.json';
import bg from './locales/bg.json';
import el from './locales/el.json';
import tr from './locales/tr.json';
import he from './locales/he.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import hi from './locales/hi.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';

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
];

// Resources
const resources: Record<string, { translation: Record<string, unknown> }> = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  ar: { translation: ar },
  it: { translation: it },
  pt: { translation: pt },
  nl: { translation: nl },
  pl: { translation: pl },
  cs: { translation: cs },
  sk: { translation: sk },
  hu: { translation: hu },
  sr: { translation: sr },
  hr: { translation: hr },
  sl: { translation: sl },
  ro: { translation: ro },
  bg: { translation: bg },
  el: { translation: el },
  tr: { translation: tr },
  he: { translation: he },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  hi: { translation: hi },
  ru: { translation: ru },
  uk: { translation: uk },
};

// Get stored language or browser language
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem('mediconnect_language');
  if (stored && supportedLanguages.some(l => l.code === stored)) {
    return stored;
  }
  
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

export const getLanguageConfig = (code: string): LanguageConfig | undefined => {
  return supportedLanguages.find(l => l.code === code);
};

export const getCurrentDirection = (): 'ltr' | 'rtl' => {
  const currentLang = getLanguageConfig(i18n.language);
  return currentLang?.dir || 'ltr';
};

export const changeLanguage = async (code: string): Promise<void> => {
  await i18n.changeLanguage(code);
  localStorage.setItem('mediconnect_language', code);
  
  const config = getLanguageConfig(code);
  document.documentElement.dir = config?.dir || 'ltr';
  document.documentElement.lang = code;
};

export default i18n;
