import { theme } from '../theme';

export function Navigation() {
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
        Skip to main content
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
            Details
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
            Our Story
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
            Seating
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
            RSVP
          </a>
        </div>
      </nav>
    </>
  );
}
