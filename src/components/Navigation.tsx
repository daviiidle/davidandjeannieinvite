import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
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
type NavVariant = 'inline' | 'drawer';

export function Navigation({ currentPath, links, onNavigate }: NavigationProps) {
  const { strings, openLanguageSelector } = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMenuOpen]);

  const handleNavigate = (path: string, targetId?: string) => {
    setIsMenuOpen(false);
    onNavigate(path, targetId);
  };

  const linkButtonStyle = (active: boolean, variant: NavVariant): CSSProperties => ({
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: variant === 'inline' ? theme.typography.fontSize.sm : '0.8rem',
    fontWeight: theme.typography.fontWeight.medium,
    color: active ? theme.colors.primary.dustyBlue : theme.colors.secondary.slate,
    textTransform: 'uppercase',
    letterSpacing: variant === 'inline' ? '0.05em' : '0.08em',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding:
      variant === 'inline'
        ? `${theme.spacing.xs} ${theme.spacing.sm}`
        : '0.35rem 0',
    width: variant === 'drawer' ? '100%' : undefined,
    textAlign: variant === 'drawer' ? 'left' : 'center',
    borderBottom:
      variant === 'drawer' ? `1px solid ${theme.colors.primary.dustyBlue}20` : 'none',
  });

  const languageButtonStyle = (variant: NavVariant): CSSProperties => ({
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: variant === 'inline' ? theme.typography.fontSize.sm : '0.8rem',
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.dustyBlue,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: variant === 'inline' ? `1px solid ${theme.colors.primary.dustyBlue}40` : 'none',
    borderRadius: variant === 'inline' ? theme.borderRadius.md : 0,
    padding:
      variant === 'inline'
        ? `${theme.spacing.xs} ${theme.spacing.sm}`
        : '0.5rem 0 0',
    background: 'transparent',
    cursor: 'pointer',
    width: variant === 'drawer' ? '100%' : undefined,
    textAlign: variant === 'drawer' ? 'left' : 'center',
  });

  const renderLinkButtons = (items: NavigationLink[], variant: NavVariant) => (
    <>
      {items.map((link) => {
        const active = currentPath === link.path;
        return (
          <button
            key={`${variant}-${link.path}`}
            type="button"
            onClick={() => handleNavigate(link.path, link.targetId)}
            style={linkButtonStyle(active, variant)}
          >
            {link.label}
          </button>
        );
      })}
    </>
  );

  const renderLanguageButton = (variant: NavVariant) => (
    <button
      type="button"
      onClick={() => {
        setIsMenuOpen(false);
        openLanguageSelector();
      }}
      style={languageButtonStyle(variant)}
    >
      {strings.navigation.changeLanguage}
    </button>
  );

  const drawerId = 'navigation-drawer';
  const secondaryLinks = links.filter((link) => link.path === '/etiquette');
  const primaryLinks = links.filter((link) => link.path !== '/etiquette');

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
        <div className="navigation-links">
          {renderLinkButtons(links, 'inline')}
          {renderLanguageButton('inline')}
        </div>
        <button
          type="button"
          className="navigation-menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls={drawerId}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? strings.navigation.closeMenu : strings.navigation.menuLabel}
        </button>
      </div>

      <div
        id={drawerId}
        className={`navigation-drawer ${isMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className="navigation-drawer__backdrop"
          aria-label={strings.navigation.closeMenu}
          onClick={() => setIsMenuOpen(false)}
        />
        <div className="navigation-drawer__panel" role="menu">
          <div className="navigation-drawer__group">
            {renderLinkButtons(primaryLinks, 'drawer')}
          </div>
          {secondaryLinks.length > 0 && (
            <div className="navigation-drawer__group navigation-drawer__group--secondary">
              <p>{strings.navigation.moreLabel ?? 'More'}</p>
              {renderLinkButtons(secondaryLinks, 'drawer')}
            </div>
          )}
          <div className="navigation-drawer__group navigation-drawer__group--actions">
            {renderLanguageButton('drawer')}
          </div>
        </div>
      </div>
    </nav>
  );
}
