import { createContext } from 'react';
import { translations, type Language, type TranslationContent } from '../i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: TranslationContent;
  formatMessage: (template: string, vars?: Record<string, string | number>) => string;
}

const formatTemplate = (template: string, vars?: Record<string, string | number>) => {
  if (!vars) return template;
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value));
  }, template);
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getStringsForLanguage = (language: Language) => translations[language];

export { LanguageContext, formatTemplate, getStringsForLanguage };
export type { LanguageContextValue };
