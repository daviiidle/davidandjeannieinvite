import { useRef } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { navigateWithinApp } from '../utils/routing';

export function Details() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.8 });
  const { strings } = useLanguage();
  const { details } = strings;
  const parents = details.parents;
  const weddingParty = details.weddingParty;

  const cards = details.cards;
  const mainCards = cards.slice(0, 2);
  const etiquettePreview = strings.etiquette?.preview;
  const setAddressLinkState = (element: HTMLAnchorElement | null, isActive: boolean) => {
    if (!element) return;
    element.style.color = isActive ? theme.colors.primary.dustyBlue : theme.colors.text.secondary;
    element.style.borderBottomColor = isActive
      ? theme.colors.primary.dustyBlue
      : `${theme.colors.primary.dustyBlue}40`;
  };

  return (
    <section
      id="details"
      ref={sectionRef}
      aria-labelledby="details-heading"
      style={{
        padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
      }}
    >
      <div
        style={{
          maxWidth: theme.layout.maxWidth,
          margin: '0 auto',
        }}
      >
        {/* Parents */}
        <div className="wedding-party-grid mb-12">
          <div
            style={{
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
              {parents.groomTitle}
            </p>
            <p
              className="font-serif"
              style={{
                fontFamily: theme.typography.fontFamily.serif,
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                color: theme.colors.primary.dustyBlue,
              }}
            >
              {parents.groomNames}
            </p>
          </div>
          <div
            style={{
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
              {parents.brideTitle}
            </p>
            <p
              className="font-serif"
              style={{
                fontFamily: theme.typography.fontFamily.serif,
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                color: theme.colors.primary.dustyBlue,
              }}
            >
              {parents.brideNames}
            </p>
          </div>
        </div>

        {/* Principal Sponsors */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: theme.spacing['3xl'],
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
            Principal Sponsors
          </p>
          <p
            className="font-serif"
            style={{
              fontFamily: theme.typography.fontFamily.serif,
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              color: theme.colors.primary.dustyBlue,
            }}
          >
            Diana & Eddie
          </p>
        </div>

        {/* Wedding Party */}
        <div className="wedding-party-grid mb-12">
          {weddingParty.columns.map((column, index) => (
            <div
              key={`${column.title}-${index}`}
              className="wedding-party-card"
              style={{
                borderRadius: theme.borderRadius.xl,
              }}
            >
              <p
                className="font-sans text-center"
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  fontSize: theme.typography.fontSize.sm,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: theme.colors.secondary.slate,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {column.title}
              </p>
              <div style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
                <p
                  style={{
                    fontFamily: theme.typography.fontFamily.serif,
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                    fontWeight: theme.typography.fontWeight.normal,
                    color: theme.colors.primary.dustyBlue,
                    display: 'inline-block',
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {column.name}
                </p>
                <span
                  style={{
                    display: 'block',
                    width: '60px',
                    height: '1px',
                    backgroundColor: theme.colors.primary.dustyBlue,
                    margin: '0 auto',
                    opacity: 0.4,
                  }}
                />
              </div>
              <p
                className="font-sans text-center"
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.secondary.slate,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginBottom: theme.spacing.sm,
                }}
              >
                {column.groupTitle}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gap: theme.spacing.xs,
                }}
              >
                {column.members.map((member) => (
                  <li
                    key={member}
                    className="font-sans text-center"
                    style={{
                      fontFamily: theme.typography.fontFamily.sans,
                      fontSize: theme.typography.fontSize.base,
                      color: theme.colors.text.secondary,
                      letterSpacing: '0.03em',
                    }}
                  >
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section Title */}
        <h2
          id="details-heading"
          className="font-serif text-center mb-12"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing['3xl'],
          }}
        >
          {details.sectionTitle}
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
            const mapLink = card.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}`
              : undefined;
            const assetBase = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
            const imageSrc = card.image
              ? `${assetBase}/${card.image.replace(/^\/+/, '')}`
              : undefined;
            const qrSize = 120;

            return (
              <article
                key={index}
                className="details-event-card"
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
                    className="font-serif"
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
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: theme.typography.fontFamily.sans,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                      lineHeight: theme.typography.lineHeight.relaxed,
                      letterSpacing: '0.03em',
                      textDecoration: 'none',
                      borderBottom: `1px solid ${theme.colors.primary.dustyBlue}40`,
                      paddingBottom: 2,
                      transition: theme.transitions.base,
                      display: 'inline-block',
                      marginBottom: theme.spacing.xs,
                    }}
                    onMouseEnter={(event) => setAddressLinkState(event.currentTarget, true)}
                    onFocus={(event) => setAddressLinkState(event.currentTarget, true)}
                    onMouseLeave={(event) => setAddressLinkState(event.currentTarget, false)}
                    onBlur={(event) => setAddressLinkState(event.currentTarget, false)}
                  >
                    {card.address}
                  </a>
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

                {mapLink && (
                  <div
                    style={{
                      marginTop: theme.spacing.lg,
                      opacity: 0.8,
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(mapLink)}`}
                      alt={`QR code for ${card.heading} location`}
                      style={{
                        width: `${qrSize}px`,
                        height: `${qrSize}px`,
                        borderRadius: theme.borderRadius.md,
                      }}
                    />
                  </div>
                )}

                {imageSrc && (
                  <div
                    style={{
                      marginTop: 'auto',
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

        {etiquettePreview && (
          <div className="mt-16 md:mt-20">
            <article
              className="flex flex-col gap-6 rounded-[1.5rem] p-6 md:p-10 lg:flex-row lg:items-center lg:gap-10"
              style={{
                backgroundColor: theme.colors.background.lightGray,
                borderRadius: theme.borderRadius['3xl'],
                boxShadow: theme.shadows.md,
              }}
            >
              <div className="flex-1 text-center lg:text-left space-y-4">
                <p
                  className="font-serif text-2xl md:text-3xl text-[#8B9DC3]"
                  style={{
                    fontFamily: theme.typography.fontFamily.serif,
                    color: theme.colors.primary.dustyBlue,
                  }}
                >
                  {etiquettePreview.title}
                </p>
                <p
                  className="font-sans text-base text-slate-600 leading-relaxed"
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    color: theme.colors.text.secondary,
                  }}
                >
                  {etiquettePreview.summary}
                </p>
                <ul className="space-y-2">
                  {etiquettePreview.highlights.map((item) => (
                    <li
                      key={item}
                      className="font-sans text-sm text-slate-600 flex items-start justify-center lg:justify-start gap-2"
                      style={{
                        fontFamily: theme.typography.fontFamily.sans,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          color: theme.colors.primary.dustyBlue,
                        }}
                      >
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <button
                  type="button"
                  className="button-link"
                  onClick={() => navigateWithinApp('/etiquette')}
                >
                  {etiquettePreview.ctaLabel}
                </button>
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  );
}
