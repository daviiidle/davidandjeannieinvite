import { useMemo } from 'react';
import { theme } from '../theme';

const albumUrl =
  'https://drive.google.com/drive/folders/150PrNYewxA1k3xeKzoOLS278EvkF62v6?usp=sharing';

const infoSteps = [
  {
    title: 'Scan the code',
    description:
      'Point your camera at the QR code to open our shared Google Drive album in your browser.',
  },
  {
    title: 'Add your memories',
    description:
      'Upload any photos or videos you capture so everyone can relive the celebration together.',
  },
  {
    title: 'Download & share',
    description:
      'Browse the gallery, save your favorites, and share the highlight moments with family and friends.',
  },
];

export function Photos() {
  const qrImageSrc = useMemo(() => {
    const params = new URLSearchParams({
      text: albumUrl,
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
          Shared Memories
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
          Photo & Video Album
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
          We created a shared Google Drive folder for all of the candid moments.
          Please use the QR code below to open the album, upload anything you
          captured, and explore the memories from every point of view.
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
            How it works
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
            }}
          >
            {infoSteps.map((step) => (
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
            Open Album in Browser
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
            Scan to view & upload
          </p>
        </div>
      </div>
    </section>
  );
}
