import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import type { Language } from '../i18n';
import { LanguageContext, formatTemplate, getStringsForLanguage } from './languageContext';

interface LanguageProviderProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  children: ReactNode;
}

export function LanguageProvider({ language, onChangeLanguage, children }: LanguageProviderProps) {
  const selectLanguage = useCallback((lang: Language) => {
    onChangeLanguage(lang);
  }, [onChangeLanguage]);

  const value = useMemo(() => ({
    language,
    setLanguage: selectLanguage,
    strings: getStringsForLanguage(language),
    formatMessage: formatTemplate,
  }), [language, selectLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
