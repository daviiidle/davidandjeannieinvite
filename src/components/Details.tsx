import { useRef, useCallback } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/useLanguage';

export function Details() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { strings } = useLanguage();
  const activateTitleAnimation = useCallback(() => {
    headingRef.current?.classList.add('page-title-handwriting--active');
  }, []);
  useScrollReveal(sectionRef, { duration: 0.8, onEnter: activateTitleAnimation });
  const { details } = strings;

  const cards = details.cards;
  const mainCards = cards.slice(0, 2);
  const scriptTextStyle = {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
    WebkitFontSmoothing: 'antialiased' as const,
    textRendering: 'geometricPrecision' as const,
  };

  return (
    <section
      id="details"
      ref={sectionRef}
      aria-labelledby="details-heading"
      className="details-section"
      style={{
        paddingTop: `var(--details-section-padding-top, ${theme.spacing['4xl']})`,
        paddingBottom: theme.spacing['4xl'],
        paddingLeft: theme.spacing.lg,
        paddingRight: theme.spacing.lg,
      }}
    >
      <div
        style={{
          maxWidth: theme.layout.maxWidth,
          margin: '0 auto',
        }}
      >
        {/* Section Title */}
        <h2
          id="details-heading"
          ref={headingRef}
          data-reveal
          className="font-serif text-center mb-12 page-title-handwriting"
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
            fontSize: 'clamp(3.1rem, 8.5vw, 5.75rem)',
            fontWeight: 400,
            color: theme.colors.primary.dustyBlue,
            letterSpacing: '0.015em',
            marginBottom: theme.spacing['2xl'],
            lineHeight: 0.92,
            paddingTop: '0.35rem',
            paddingBottom: '0.2rem',
            overflow: 'visible',
          }}
        >
          <span className="details-heading-monogram" style={scriptTextStyle}>
            <span className="details-heading-monogram__script details-heading-monogram__script--j">
              J
            </span>
            <span className="details-heading-monogram__script details-heading-monogram__script--d">
              D
            </span>
            <span className="details-heading-monogram__row details-heading-monogram__row--top">
              <span className="details-heading-monogram__name">JEANNIE</span>
            </span>
            <span className="details-heading-monogram__amp">&amp;</span>
            <span className="details-heading-monogram__row details-heading-monogram__row--bottom">
              <span className="details-heading-monogram__name">DAVID</span>
            </span>
          </span>
        </h2>

        {/* Ceremony & Reception */}
        <div
          className="details-event-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--details-event-gap, 2rem)',
            alignItems: 'stretch',
          }}
        >
          {mainCards.map((card, index) => {
            const isReception = index === 1;
            const mapLink = card.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}`
              : undefined;
            const embedLink = card.address
              ? `https://www.google.com/maps?q=${encodeURIComponent(card.address)}&z=16&output=embed`
              : undefined;
            const assetBase = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
            const imageSrc = card.image
              ? `${assetBase}/${card.image.replace(/^\/+/, '')}`
              : undefined;

            return (
              <article
                key={`${card.heading}-${index}`}
                data-reveal
                className={`details-event-card${isReception ? ' details-event-card--reception' : ''}`}
                style={{
                  padding: `var(--details-event-card-padding, ${theme.spacing['2xl']} ${theme.spacing.xl})`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: '100%',
                  gap: theme.spacing.sm,
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
                  {card.heading}
                </p>

                {card.time && (
                  <p
                    className="font-serif details-time-wash"
                    style={{
                      fontFamily: theme.typography.fontFamily.serif,
                      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.primary.dustyBlue,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {card.time}
                  </p>
                )}

                {card.location && (
                  <p
                    className="font-serif"
                    style={{
                      fontFamily: theme.typography.fontFamily.serif,
                      fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                      fontWeight: theme.typography.fontWeight.normal,
                      color: theme.colors.primary.dustyBlue,
                      letterSpacing: '0.02em',
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {card.location}
                  </p>
                )}

                {mapLink && (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '340px',
                      marginTop: theme.spacing.sm,
                      display: 'grid',
                      gap: theme.spacing.sm,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: theme.spacing.xs,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        style={{
                          width: '18px',
                          height: '18px',
                          flex: '0 0 auto',
                          fill: theme.colors.primary.dustyBlue,
                        }}
                      >
                        <path d="M12 2.75a6.75 6.75 0 0 0-6.75 6.75c0 4.76 5.14 10.27 6.2 11.36a.79.79 0 0 0 1.1 0c1.06-1.09 6.2-6.6 6.2-11.36A6.75 6.75 0 0 0 12 2.75Zm0 9.25a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                      </svg>
                      <span
                        style={{
                          fontFamily: theme.typography.fontFamily.sans,
                          fontSize: theme.typography.fontSize.sm,
                          lineHeight: theme.typography.lineHeight.relaxed,
                          letterSpacing: '0.03em',
                        }}
                      >
                        {card.address}
                      </span>
                    </div>

                    {embedLink && (
                      <div
                        style={{
                          width: '100%',
                          borderRadius: theme.borderRadius.xl,
                          overflow: 'hidden',
                          border: '1px solid rgba(139, 157, 195, 0.22)',
                          boxShadow: '0 14px 28px rgba(130, 149, 180, 0.14)',
                          background: '#f7fafc',
                        }}
                      >
                        <iframe
                          title={`${card.heading} map`}
                          src={embedLink}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          style={{
                            width: '100%',
                            height: '220px',
                            border: 0,
                            display: 'block',
                          }}
                        />
                      </div>
                    )}

                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        alignSelf: 'center',
                        fontFamily: theme.typography.fontFamily.sans,
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.semibold,
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                        color: theme.colors.primary.dustyBlue,
                        textDecoration: 'none',
                        border: '1px solid rgba(139, 157, 195, 0.35)',
                        borderRadius: theme.borderRadius.full,
                        padding: '0.8rem 1.1rem',
                        background: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      {details.mapCtaLabel}
                    </a>
                  </div>
                )}

                {card.description && (
                  <p
                    className="font-sans"
                    style={{
                      fontFamily: theme.typography.fontFamily.sans,
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.secondary.slate,
                      lineHeight: theme.typography.lineHeight.relaxed,
                      fontStyle: 'italic',
                      marginTop: theme.spacing.sm,
                    }}
                  >
                    {card.description}
                  </p>
                )}

                {imageSrc && (
                  <div
                    style={{
                      marginTop: theme.spacing.md,
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={`${card.heading} venue`}
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      height: '220px',
                      borderRadius: theme.borderRadius['2xl'],
                      boxShadow: theme.shadows.md,
                      objectFit: 'cover',
                    }}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
