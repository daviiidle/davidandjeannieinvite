import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface FooterProps {
  coupleName?: string;
  email?: string;
  showSocials?: boolean;
  socialLinks?: SocialLink[];
}

export function Footer({
  coupleName = "David & Jeannie",
  email = "daviiidle@gmail.com",
  showSocials = false,
  socialLinks = []
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { strings } = useLanguage();

  return (
    <footer
      style={{
        backgroundColor: theme.colors.primary.dustyBlue,
        padding: `${theme.spacing['3xl']} ${theme.spacing.lg}`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: theme.layout.maxWidth,
          margin: '0 auto',
        }}
      >
        {/* Social Links (Optional) */}
        {showSocials && socialLinks.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: theme.spacing.lg,
              marginBottom: theme.spacing.xl,
            }}
          >
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover"
                style={{
                  color: theme.colors.text.inverse,
                  fontSize: theme.typography.fontSize.lg,
                  fontFamily: theme.typography.fontFamily.sans,
                  fontWeight: theme.typography.fontWeight.medium,
                  textDecoration: 'none',
                }}
                aria-label={link.platform}
              >
                {link.icon || link.platform}
              </a>
            ))}
          </div>
        )}

        {/* Contact Email */}
        {email && (
          <p
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.normal,
              color: theme.colors.text.inverse,
              marginBottom: theme.spacing.md,
              opacity: 0.9,
            }}
          >
            <a
              href={`mailto:${email}`}
              className="link-hover"
              style={{
                color: theme.colors.text.inverse,
                display: 'inline-block',
              }}
            >
              {email}
            </a>
          </p>
        )}

        {/* Divider */}
        <div
          style={{
            width: '60px',
            height: '1px',
            backgroundColor: theme.colors.text.inverse,
            margin: `${theme.spacing.lg} auto`,
            opacity: 0.3,
          }}
        />

        <p
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.text.inverse,
            marginBottom: theme.spacing.sm,
            opacity: 0.9,
          }}
        >
          We can’t wait to celebrate with you.
        </p>
        {strings.footer.formalLine ? (
          <p
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.inverse,
              marginBottom: theme.spacing.md,
              opacity: 0.85,
            }}
          >
            {strings.footer.formalLine}
          </p>
        ) : null}

        {/* Copyright */}
        <p
          className="font-serif"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.normal,
            color: theme.colors.text.inverse,
            marginBottom: theme.spacing.xs,
          }}
        >
          {coupleName}
        </p>

        <p
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.xs,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: theme.colors.text.inverse,
            opacity: 0.7,
            marginBottom: theme.spacing.md,
          }}
        >
          David &amp; Jeannie • 2026
        </p>

        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.normal,
            color: theme.colors.text.inverse,
            opacity: 0.8,
          }}
        >
          © {currentYear} · {strings.footer.rights}
        </p>

        {/* Made with Love */}
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.normal,
            color: theme.colors.text.inverse,
            opacity: 0.6,
            marginTop: theme.spacing.lg,
            fontStyle: 'italic',
          }}
        >
          {strings.footer.madeWith}
        </p>
      </div>
    </footer>
  );
}
