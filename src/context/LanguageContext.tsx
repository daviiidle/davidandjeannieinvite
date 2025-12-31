import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { translations, type Language, type TranslationContent } from '../i18n';
import { theme } from '../theme';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: TranslationContent;
  formatMessage: (template: string, vars?: Record<string, string | number>) => string;
  openLanguageSelector: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getStoredLanguage = (): Language | null => {
  if (typeof window === 'undefined') return null;
  const stored = window.sessionStorage.getItem('preferredLanguage');
  return stored === 'en' || stored === 'vi' ? stored : null;
};

const formatTemplate = (template: string, vars?: Record<string, string | number>) => {
  if (!vars) return template;
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value));
  }, template);
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const stored = typeof window !== 'undefined' ? getStoredLanguage() : null;
  const [language, setLanguageState] = useState<Language>(stored ?? 'en');
  const [hasConfirmedLanguage, setHasConfirmedLanguage] = useState<boolean>(!!stored);
  const [selectorVisible, setSelectorVisible] = useState<boolean>(!stored);

  const selectLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('preferredLanguage', lang);
    }
    setHasConfirmedLanguage(true);
    setSelectorVisible(false);
  };

  const openLanguageSelector = useCallback(() => {
    if (hasConfirmedLanguage) {
      setSelectorVisible(true);
    }
  }, [hasConfirmedLanguage]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: selectLanguage,
    strings: translations[language],
    formatMessage: formatTemplate,
    openLanguageSelector,
  }), [language, openLanguageSelector]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {selectorVisible && (
        <LanguageSelector
          onSelect={selectLanguage}
          onClose={hasConfirmedLanguage ? () => setSelectorVisible(false) : undefined}
        />
      )}
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

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
  onClose?: () => void;
}

function LanguageSelector({ onSelect, onClose }: LanguageSelectorProps) {
  return (
    <div
      className="language-selector"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: theme.spacing.lg,
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius['2xl'],
          padding: theme.spacing['3xl'],
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: theme.shadows['2xl'],
        }}
      >
        <p
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing.md,
          }}
        >
          {translations.en.languageSelector.title} / {translations.vi.languageSelector.title}
        </p>
        <p
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing['2xl'],
          }}
        >
          {translations.en.languageSelector.subtitle}
          <br />
          {translations.vi.languageSelector.subtitle}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
          }}
        >
          <button
            type="button"
            onClick={() => onSelect('en')}
            className="btn-hover"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
              borderRadius: theme.borderRadius.lg,
              border: 'none',
              backgroundColor: theme.colors.primary.dustyBlue,
              color: theme.colors.text.inverse,
              cursor: 'pointer',
            }}
          >
            {translations.en.languageSelector.english}
          </button>
          <button
            type="button"
            onClick={() => onSelect('vi')}
            className="btn-hover"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
              borderRadius: theme.borderRadius.lg,
              border: `2px solid ${theme.colors.primary.dustyBlue}`,
              backgroundColor: 'transparent',
              color: theme.colors.primary.dustyBlue,
              cursor: 'pointer',
            }}
          >
            {translations.vi.languageSelector.vietnamese}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.secondary.slate,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                marginTop: theme.spacing.sm,
                textDecoration: 'underline',
              }}
            >
              {translations.en.languageSelector.close} / {translations.vi.languageSelector.close}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
