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

export function Navigation({ currentPath, links, onNavigate }: NavigationProps) {
  const { strings, openLanguageSelector } = useLanguage();

  return (
    <nav
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
