import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { theme } from '../theme';
import { useLanguage } from '../context/useLanguage';
import type { Language } from '../i18n';

const baseAssetPath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
const withBasePath = (path: string) =>
  `${baseAssetPath}${path.startsWith('/') ? path : `/${path}`}`;
const RSVP_CTA_SRC = withBasePath(encodeURI('/images/the golden button.png'));

interface NavigationProps {
  onNavigate: (targetId?: string) => void;
}

const HEADER_VAR = '--app-header-height';
const languageOptions: Language[] = ['en', 'vi'];

export function Navigation({ onNavigate }: NavigationProps) {
  const { strings, language, setLanguage } = useLanguage();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateHeaderHeight = () => {
      const height = navRef.current?.offsetHeight ?? 0;
      if (height > 0) {
        document.documentElement.style.setProperty(HEADER_VAR, `${height}px`);
      }
    };

    updateHeaderHeight();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && navRef.current) {
      resizeObserver = new ResizeObserver(updateHeaderHeight);
      resizeObserver.observe(navRef.current);
    }

    window.addEventListener('resize', updateHeaderHeight, { passive: true });
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  const languageGroupStyle: CSSProperties = {
    display: 'inline-flex',
    gap: '0.25rem',
    border: `1px solid ${theme.colors.primary.dustyBlue}40`,
    borderRadius: theme.borderRadius.full,
    padding: '0.25rem',
    backgroundColor: 'rgba(255,255,255,0.65)',
  };

  const languageOptionStyle = (active: boolean): CSSProperties => ({
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    border: active ? `1px solid ${theme.colors.primary.dustyBlue}` : `1px dashed ${theme.colors.primary.dustyBlue}40`,
    borderRadius: theme.borderRadius.full,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: active ? theme.colors.primary.dustyBlue : 'transparent',
    color: active ? theme.colors.background.white : theme.colors.primary.dustyBlue,
    cursor: active ? 'default' : 'pointer',
    opacity: active ? 1 : 0.8,
  });

  const renderLanguageButton = () => (
    <div
      role="group"
      aria-label={strings.navigation.changeLanguage}
      style={languageGroupStyle}
    >
      {languageOptions.map((option) => (
        <button
          key={`language-${option}`}
          type="button"
          onClick={() => {
            if (language === option) return;
            setLanguage(option);
          }}
          style={languageOptionStyle(language === option)}
          aria-pressed={language === option}
          disabled={language === option}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: theme.colors.background.white,
        boxShadow: theme.shadows.sm,
        borderBottom: `1px solid ${theme.colors.primary.dustyBlue}20`,
      }}
    >
      <div className="navigation-inner">
        <button
          type="button"
          className="navigation-rsvp-cta"
          onClick={() => onNavigate('rsvp')}
          aria-label={strings.navigation.rsvpCta}
        >
          <span
            className="navigation-rsvp-cta__icon"
            aria-hidden="true"
            style={{ backgroundImage: `url(${RSVP_CTA_SRC})` }}
          />
          <span className="navigation-rsvp-cta__label">{strings.navigation.rsvpCta}</span>
        </button>
        <div className="navigation-links">
          {renderLanguageButton()}
        </div>
      </div>
    </nav>
  );
}
