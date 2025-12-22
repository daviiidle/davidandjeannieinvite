import { useMemo } from 'react';
import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';

const albumUrl =
  'https://www.dropbox.com/scl/fo/pf030gqg9tcw34jsln73e/AFYO7H95lXmsXk0l9KA5oAM?rlkey=dk1z5cyeq3nmtbye2cyjgictw&st=x9eegmm7&dl=0';

export function Photos() {
  const { strings } = useLanguage();
  const { photos } = strings;
  const qrImageSrc = useMemo(() => {
    const params = new URLSearchParams({
      text: 'https://www.dropbox.com/scl/fo/pf030gqg9tcw34jsln73e/AFYO7H95lXmsXk0l9KA5oAM?rlkey=dk1z5cyeq3nmtbye2cyjgictw&st=x9eegmm7&dl=0',
      size: '600',
      margin: '12',
      light: 'FAF9F6',
      dark: '7A8DB5',
    });
    return `https://quickchart.io/qr?${params.toString()}`;
  }, []);

  return (
    <section
      id="photos"
      aria-labelledby="photos-heading"
      style={{
        padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
        backgroundColor: theme.colors.background.offWhite,
      }}
    >
      <div
        style={{
          maxWidth: theme.layout.maxWidth,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: theme.colors.secondary.slate,
            marginBottom: theme.spacing.xs,
          }}
        >
          {photos.sectionLabel}
        </p>
        <h1
          id="photos-heading"
          className="font-serif"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing.md,
          }}
        >
          {photos.heading}
        </h1>
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.text.secondary,
            maxWidth: '720px',
            margin: `0 auto ${theme.spacing['2xl']}`,
          }}
        >
          {photos.intro}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: theme.spacing['2xl'],
          alignItems: 'stretch',
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            borderRadius: theme.borderRadius['3xl'],
            padding: theme.spacing['2xl'],
            backgroundColor: theme.colors.background.white,
            boxShadow: theme.shadows.md,
            textAlign: 'left',
          }}
        >
          <p
            className="font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.colors.secondary.slate,
              marginBottom: theme.spacing.lg,
              textAlign: 'center',
            }}
          >
            {photos.stepsTitle}
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
            }}
          >
            {photos.steps.map((step) => (
              <div key={step.title}>
                <p
                  className="font-serif"
                  style={{
                    fontFamily: theme.typography.fontFamily.serif,
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                    color: theme.colors.primary.dustyBlue,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {step.title}
                </p>
                <p
                  className="font-sans"
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.secondary,
                    lineHeight: theme.typography.lineHeight.relaxed,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <a
            href={albumUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: theme.spacing['2xl'],
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.full,
              border: `1px solid ${theme.colors.primary.dustyBlue}`,
              color: theme.colors.primary.dustyBlue,
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              textDecoration: 'none',
              transition: `background-color ${theme.transitions.base}, color ${theme.transitions.base}`,
            }}
          >
            {photos.ctaLabel}
          </a>
        </div>

        <div
          style={{
            borderRadius: theme.borderRadius['3xl'],
            padding: theme.spacing['2xl'],
            backgroundColor: theme.colors.background.white,
            boxShadow: theme.shadows.md,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.lg,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '320px',
              backgroundColor: theme.colors.background.offWhite,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius['2xl'],
            }}
          >
            <img
              src={qrImageSrc}
              alt="QR code that opens the shared photo album"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: theme.borderRadius.lg,
              }}
            />
          </div>
          <p
            className="font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: theme.colors.secondary.slate,
              textAlign: 'center',
            }}
          >
            {photos.qrCaption}
          </p>
        </div>
      </div>
    </section>
  );
}
