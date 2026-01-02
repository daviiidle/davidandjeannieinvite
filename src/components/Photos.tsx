import { useEffect, useMemo, useState, useRef } from 'react';
import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';
import { Section } from './Section';

declare global {
  interface Window {
    uploadcare?: unknown;
  }
}

export function Photos() {
  const { strings } = useLanguage();
  const { photos } = strings;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const envPortalUrl = import.meta.env.VITE_UPLOADCARE_PORTAL_URL;
  const [uploadLink, setUploadLink] = useState(() => {
    if (!envPortalUrl) return '';
    return envPortalUrl.includes('#')
      ? envPortalUrl
      : `${envPortalUrl}#uploadcare-uploader`;
  });
  const uploadcarePublicKey = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY ?? '';
  const [widgetReady, setWidgetReady] = useState(false);
  const [widgetLoadError, setWidgetLoadError] = useState(false);

  useEffect(() => {
    if (uploadLink || typeof window === 'undefined') return;
    const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
    const normalizedBase = base === '' || base === '/' ? '' : base;
    const relativePath = `${normalizedBase}/photos#uploadcare-uploader`;
    const url = new URL(
      relativePath.startsWith('/') ? relativePath : `/${relativePath}`,
      window.location.origin,
    );
    setUploadLink(url.toString());
  }, [uploadLink]);

  useEffect(() => {
    setWidgetReady(false);
    setWidgetLoadError(false);
    if (!uploadcarePublicKey || typeof window === 'undefined') return;
    if (window.uploadcare) {
      setWidgetReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-uploadcare-widget]',
    );

    const handleLoad = () => setWidgetReady(true);
    const handleError = () => setWidgetLoadError(true);

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', handleError);
      return () => {
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', handleError);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js';
    script.async = true;
    script.dataset.uploadcareWidget = 'true';
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, [uploadcarePublicKey]);

  useEffect(() => {
    headingRef.current?.classList.add('page-title-handwriting--active');
  }, []);

  const widgetUnavailable = !uploadcarePublicKey || widgetLoadError;

  const qrImageSrc = useMemo(() => {
    if (!uploadLink) return '';
    const params = new URLSearchParams({
      text: uploadLink,
      size: '600',
      margin: '12',
      light: 'FAF9F6',
      dark: '7A8DB5',
    });
    return `https://quickchart.io/qr?${params.toString()}`;
  }, [uploadLink]);

  const cardStyle = {
    borderRadius: theme.borderRadius['3xl'],
    padding: theme.spacing['2xl'],
    backgroundColor: theme.colors.background.white,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.primary.dustyBlue}15`,
  };

  return (
    <Section
      id="photos"
      aria-labelledby="photos-heading"
      style={{
        backgroundColor: theme.colors.background.offWhite,
      }}
      maxWidth={theme.layout.maxWidth}
    >
      <div
        style={{
          textAlign: 'center',
          margin: '0 auto',
          maxWidth: '720px',
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
          ref={headingRef}
          className="font-serif page-title-handwriting"
          style={{
            fontFamily: '"Mea Culpa", "Playfair Display", serif',
            fontSize: theme.typography.heading.h1,
            fontWeight: 400,
            letterSpacing: '0.05em',
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing.md,
          }}
        >
          <span className="hero-handwriting">
            <span className="hero-handwriting__text">{photos.heading}</span>
          </span>
        </h1>
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.text.secondary,
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          {photos.intro}
        </p>
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            color: `${theme.colors.secondary.slate}`,
            opacity: 0.9,
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing['3xl'],
          }}
        >
          {photos.encouragement}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: theme.spacing['2xl'],
          alignItems: 'stretch',
          maxWidth: '960px',
          margin: `${theme.spacing['3xl']} auto`,
        }}
      >
        <div
          style={{
            ...cardStyle,
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
        </div>

        <div
          style={{
            ...cardStyle,
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
                maxWidth: '280px',
                backgroundColor: theme.colors.background.offWhite,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius['2xl'],
            }}
          >
            <img
              src={qrImageSrc || undefined}
              alt="QR code that opens the Uploadcare portal"
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

      <div
        className="uploadcare-card"
        style={{
          margin: `${theme.spacing['3xl']} auto 0`,
          maxWidth: '720px',
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius['3xl'],
          padding: theme.spacing['2xl'],
          boxShadow: theme.shadows.lg,
          border: `1px solid ${theme.colors.primary.dustyBlue}15`,
          textAlign: 'center',
          marginBottom: theme.spacing['4xl'],
        }}
      >
        <p
          className="font-serif"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing.sm,
          }}
        >
          {photos.widgetTitle}
        </p>
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.lg,
            lineHeight: theme.typography.lineHeight.relaxed,
          }}
        >
          {photos.widgetDescription}
        </p>

        <div
          id="uploadcare-uploader"
          style={{
            width: '100%',
            margin: `${theme.spacing.lg} auto`,
            maxWidth: '480px',
          }}
        >
          {widgetUnavailable && (
            <p
              className="font-sans"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}
            >
              {photos.widgetUnavailable}
            </p>
          )}

          {!widgetUnavailable && !widgetReady && (
            <p
              className="font-sans"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}
            >
              Loading uploader...
            </p>
          )}

          {!widgetUnavailable && widgetReady && (
            <input
              type="hidden"
              role="uploadcare-uploader"
              data-public-key={uploadcarePublicKey}
              data-tabs="file camera url dropbox gdrive instagram"
              data-multiple="true"
              data-multiple-max="50"
              data-preview-step="true"
              data-clearable="true"
              data-image-shrink="1600x1600"
              data-metadata="source:wedding-invite"
              data-integration="WeddingInvite/1.0"
              style={{ width: '100%' }}
            />
          )}
        </div>
      </div>
    </Section>
  );
}
