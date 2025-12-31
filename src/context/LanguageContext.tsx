import { createContext, useContext, useMemo, useCallback } from 'react';
import { translations, type Language, type TranslationContent } from '../i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: TranslationContent;
  formatMessage: (template: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const formatTemplate = (template: string, vars?: Record<string, string | number>) => {
  if (!vars) return template;
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value));
  }, template);
};

interface LanguageProviderProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  children: React.ReactNode;
}

export function LanguageProvider({ language, onChangeLanguage, children }: LanguageProviderProps) {
  const selectLanguage = useCallback((lang: Language) => {
    onChangeLanguage(lang);
  }, [onChangeLanguage]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: selectLanguage,
    strings: translations[language],
    formatMessage: formatTemplate,
  }), [language, selectLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
