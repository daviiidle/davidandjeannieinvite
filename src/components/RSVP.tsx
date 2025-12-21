import { useRef } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';

interface RSVPProps {
  heading?: string;
  deadline?: string;
  formUrl?: string;
  emails?: string[];
}

export function RSVP({
  heading,
  deadline,
  formUrl = "https://forms.google.com/your-form-url",
  emails = ["davidandjeannie@wedding.com"]
}: RSVPProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.7 });
  const { strings } = useLanguage();
  const headingText = heading ?? strings.rsvp.heading;
  const deadlineText = deadline ?? strings.rsvp.deadline;

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      aria-labelledby="rsvp-heading"
      style={{
        backgroundColor: theme.colors.background.offWhite,
        padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Heading */}
        <h2
          id="rsvp-heading"
          className="font-serif"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing.lg,
          }}
        >
          {headingText}
        </h2>

        {/* Deadline Text */}
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing['2xl'],
          }}
        >
          {deadlineText}
        </p>

        {/* Main RSVP Button */}
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hover"
          style={{
            display: 'inline-block',
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            padding: `${theme.spacing.lg} ${theme.spacing['3xl']}`,
            minHeight: '60px',
            minWidth: '280px',
            backgroundColor: theme.colors.primary.dustyBlue,
            color: theme.colors.text.inverse,
            border: 'none',
            borderRadius: theme.borderRadius.xl,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: theme.shadows.lg,
            marginBottom: theme.spacing['2xl'],
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary.dustyBlueDark;
            e.currentTarget.style.boxShadow = theme.shadows.xl;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary.dustyBlue;
            e.currentTarget.style.boxShadow = theme.shadows.lg;
          }}
        >
          {strings.rsvp.button}
        </a>

        {/* Contact Line */}
        <div
          style={{
            marginTop: theme.spacing['2xl'],
            paddingTop: theme.spacing.xl,
            borderTop: `1px solid ${theme.colors.primary.dustyBlue}30`,
          }}
        >
          <p
            className="font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.normal,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.sm,
            }}
          >
            {strings.rsvp.havingTrouble}
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xs,
              alignItems: 'center',
            }}
          >
            <p
              className="font-sans"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.normal,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.sm,
              }}
            >
              {strings.rsvp.contactHint}
            </p>
            {emails.map((email, index) => (
              <a
                key={index}
                href={`mailto:${email}`}
                className="link-hover"
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.primary.dustyBlue,
                  display: 'inline-block',
                }}
              >
                {email}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
