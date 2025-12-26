import { useEffect, useRef } from 'react';
import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';

interface NavigationLink {
  path: string;
  label: string;
  targetId?: string;
}

interface NavigationProps {
  currentPath: string;
  links: NavigationLink[];
  onNavigate: (path: string, targetId?: string) => void;
}

const HEADER_VAR = '--app-header-height';

export function Navigation({ currentPath, links, onNavigate }: NavigationProps) {
  const { strings, openLanguageSelector } = useLanguage();
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
      <div
        style={{
          maxWidth: theme.layout.maxWidth,
          margin: '0 auto',
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          display: 'flex',
          justifyContent: 'center',
          gap: theme.spacing.xl,
          flexWrap: 'wrap',
        }}
      >
        {links.map((link) => {
          const active = currentPath === link.path;
          return (
            <button
              key={link.path}
              type="button"
              onClick={() => onNavigate(link.path, link.targetId)}
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: active
                  ? theme.colors.primary.dustyBlue
                  : theme.colors.secondary.slate,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              }}
            >
              {link.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={openLanguageSelector}
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.primary.dustyBlue,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: `1px solid ${theme.colors.primary.dustyBlue}40`,
            borderRadius: theme.borderRadius.md,
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          {strings.navigation.changeLanguage}
        </button>
      </div>
    </nav>
  );
}
