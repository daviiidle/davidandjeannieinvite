import { useRef, useState, useEffect } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export function Details() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.8 });
  const { strings } = useLanguage();
  const { details } = strings;
  const parents = details.parents;
  const weddingParty = details.weddingParty;

  const cards = details.cards;
  const mainCards = cards.slice(0, 2);
  const orderedInfoSections = details.infoSections ?? [];
  const targetDate = new Date('2026-10-03T00:00:00');

  const calculateTimeRemaining = () => {
    const total = targetDate.getTime() - Date.now();
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

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
        {/* Save the Date */}
        <div
          className="text-center mb-10"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            color: theme.colors.primary.dustyBlue,
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: theme.typography.fontWeight.semibold,
              marginBottom: theme.spacing.xs,
            }}
          >
            {details.saveTheDate}
          </p>
          <p
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {details.dateLabel}
          </p>
        </div>

        {/* Countdown */}
        <div
          className="font-sans text-center mb-10"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            color: theme.colors.primary.dustyBlue,
          }}
        >
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: theme.typography.fontSize.sm,
              marginBottom: theme.spacing.sm,
            }}
          >
            {details.countdownTitle}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: theme.spacing.xl,
              fontFamily: theme.typography.fontFamily.serif,
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            }}
          >
            {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
              <div key={unit}>
                <div>{String(timeRemaining[unit]).padStart(2, '0')}</div>
                <div
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.sm,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginTop: theme.spacing.xs,
                  }}
                >
                  {details.countdownUnits[unit]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parents */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: theme.spacing.xl,
          }}
        >
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
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: theme.spacing.xl,
          }}
        >
          {weddingParty.columns.map((column, index) => (
            <div
              key={`${column.title}-${index}`}
              style={{
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing['2xl'],
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
              <p
                style={{
                  fontFamily: theme.typography.fontFamily.serif,
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                  fontWeight: theme.typography.fontWeight.normal,
                  color: theme.colors.primary.dustyBlue,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {column.name}
                <span
                  style={{
                    display: 'block',
                    width: '60px',
                    height: '1px',
                    backgroundColor: theme.colors.primary.dustyBlue,
                    margin: `${theme.spacing.sm} auto 0`,
                    opacity: 0.4,
                  }}
                />
              </p>
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: theme.spacing.xl,
            marginBottom: theme.spacing['3xl'],
          }}
        >
          {mainCards.map((card, index) => {
            const mapLink = card.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}`
              : undefined;

            return (
              <div
                key={index}
                style={{
                  padding: theme.spacing['2xl'],
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
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {card.time}
                  </p>
                )}

                {card.location && (
                  <p
                    className="font-sans"
                    style={{
                      fontFamily: theme.typography.fontFamily.sans,
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {card.location}
                  </p>
                )}

                {mapLink && (
                  <p
                    className="font-sans"
                    style={{
                      fontFamily: theme.typography.fontFamily.sans,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.primary.dustyBlue,
                      lineHeight: theme.typography.lineHeight.relaxed,
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    {card.address}
                  </p>
                )}

                {mapLink && (
                  <div
                    style={{
                      marginTop: theme.spacing.md,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(mapLink)}`}
                      alt={`QR code for ${card.heading} location`}
                      style={{
                        width: '160px',
                        height: '160px',
                        borderRadius: theme.borderRadius.md,
                      }}
                    />
                  </div>
                )}

                {card.description && (
                  <p
                    className="font-sans"
                    style={{
                      fontFamily: theme.typography.fontFamily.sans,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                      lineHeight: theme.typography.lineHeight.relaxed,
                      fontStyle: 'italic',
                      marginTop: theme.spacing.md,
                    }}
                  >
                    {card.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Wedding Etiquette & Information */}
        {orderedInfoSections.length > 0 && (
          <div
            style={{
              marginTop: theme.spacing['4xl'],
              marginBottom: theme.spacing['4xl'],
            }}
          >
            <h3
              className="font-serif text-center"
              style={{
                fontFamily: theme.typography.fontFamily.serif,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.primary.dustyBlue,
                marginBottom: theme.spacing['2xl'],
              }}
            >
              {details.infoTitle}
            </h3>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: theme.spacing.xl,
                alignItems: 'stretch',
              }}
            >
              {orderedInfoSections.map((column, columnIndex) => (
                <div
                  key={`${column.title}-${columnIndex}`}
                  style={{
                    padding: theme.spacing['2xl'],
                    textAlign: 'center',
                    maxWidth: '360px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
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
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {column.title}
                  </p>
                  {column.subsections.map((section, idx) => (
                    <div
                      key={`${section.heading}-${idx}`}
                      style={{
                        marginBottom: theme.spacing.lg,
                        textAlign: 'center',
                      }}
                    >
                      <p
                        className="font-serif"
                        style={{
                          fontFamily: theme.typography.fontFamily.serif,
                          fontSize: theme.typography.fontSize.lg,
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.primary.dustyBlue,
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        {section.heading}
                      </p>
                      {section.body && (
                        <p
                          className="font-sans"
                          style={{
                            fontFamily: theme.typography.fontFamily.sans,
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.text.secondary,
                            lineHeight: theme.typography.lineHeight.relaxed,
                            marginBottom: section.bullets ? theme.spacing.xs : 0,
                          }}
                        >
                          {section.body}
                        </p>
                      )}
                      {section.bullets && (
                        <ul
                          style={{
                            listStyle: 'none',
                            paddingLeft: 0,
                            marginTop: theme.spacing.xs,
                            color: theme.colors.text.secondary,
                          }}
                        >
                          {section.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              style={{
                                fontFamily: theme.typography.fontFamily.sans,
                                fontSize: theme.typography.fontSize.sm,
                                marginBottom: '4px',
                              }}
                            >
                              {`• ${bullet}`}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
