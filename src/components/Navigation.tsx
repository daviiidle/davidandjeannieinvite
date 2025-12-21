import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';

export function Navigation() {
  const { strings, openLanguageSelector } = useLanguage();

  return (
    <>
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          backgroundColor: theme.colors.primary.dustyBlue,
          color: theme.colors.text.inverse,
          textDecoration: 'none',
          fontFamily: theme.typography.fontFamily.sans,
          fontWeight: theme.typography.fontWeight.semibold,
          fontSize: theme.typography.fontSize.base,
          borderRadius: theme.borderRadius.md,
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = theme.spacing.md;
          e.currentTarget.style.top = theme.spacing.md;
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px';
        }}
      >
        {strings.navigation.skipToContent}
      </a>

      {/* Navigation Menu */}
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
          <a
            href="#details"
            className="link-hover"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.primary.dustyBlue,
              textDecoration: 'none',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-block',
            }}
          >
            {strings.navigation.details}
          </a>
          <a
            href="#story"
            className="link-hover"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.primary.dustyBlue,
              textDecoration: 'none',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-block',
            }}
          >
            {strings.navigation.story}
          </a>
          <a
            href="#seating"
            className="link-hover"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.primary.dustyBlue,
              textDecoration: 'none',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-block',
            }}
          >
            {strings.navigation.seating}
          </a>
          <a
            href="#rsvp"
            className="link-hover"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.primary.dustyBlue,
              textDecoration: 'none',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-block',
            }}
          >
            {strings.navigation.rsvp}
          </a>
          <button
            type="button"
            onClick={openLanguageSelector}
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.primary.dustyBlue,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: `1px solid ${theme.colors.primary.dustyBlue}40`,
              borderRadius: theme.borderRadius.md,
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            {strings.navigation.changeLanguage}
          </button>
        </div>
      </nav>
    </>
  );
}
