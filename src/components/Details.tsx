import { useRef, useState, useEffect } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface DetailCard {
  icon?: string;
  heading: string;
  time?: string;
  location?: string;
  address?: string;
  description?: string;
}

interface DetailsProps {
  ceremonyCard?: DetailCard;
  receptionCard?: DetailCard;
  dressCodeCard?: DetailCard;
}

export function Details({
  ceremonyCard = {
    icon: "⛪",
    heading: "Ceremony",
    time: "1:00 PM",
    location: "Holy Family Parish",
    address: "46A Ballarat Rd, Maidstone VIC 3012",
    description: "Please arrive 15 minutes early for seating"
  },
  receptionCard = {
    icon: "🎉",
    heading: "Reception",
    time: "6:00 PM",
    location: "Ultima Function Centre",
    address: "Corner of Ely Court, Keilor Park Dr, Keilor East VIC 3042",
    description: "Dinner, drinks, and dancing to follow"
  },
  dressCodeCard = {
    icon: "👔",
    heading: "Dress Code",
    description: "Semi-formal attire requested. Ladies: Cocktail dresses or elegant separates. Gentlemen: Suits or dress pants with collared shirts."
  }
}: DetailsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.8 });

  const cards = [ceremonyCard, receptionCard, dressCodeCard];
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
            Save the Date
          </p>
          <p
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            October 3, 2026
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
            Countdown to the big day
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
                  {unit}
                </div>
              </div>
            ))}
          </div>
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
          Event Details
        </h2>

        {/* Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: theme.spacing.xl,
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="detail-card"
              style={{
                backgroundColor: 'transparent',
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing['2xl'],
                boxShadow: 'none',
                border: 'none',
              }}
            >
              {/* Icon (optional) */}
              {card.icon && (
                <div
                  style={{
                    fontSize: theme.typography.fontSize['4xl'],
                    textAlign: 'center',
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  {card.icon}
                </div>
              )}

              {/* Heading */}
              <h3
                className="font-serif text-center"
                style={{
                  fontFamily: theme.typography.fontFamily.serif,
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.primary.dustyBlue,
                  marginBottom: theme.spacing.lg,
                }}
              >
                {card.heading}
              </h3>

              {/* Time */}
              {card.time && (
                <p
                  className="font-sans text-center"
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {card.time}
                </p>
              )}

              {/* Location */}
              {card.location && (
                <p
                  className="font-sans text-center"
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.secondary.slate,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {card.location}
                </p>
              )}

              {/* Address */}
              {card.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-center link-hover"
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.normal,
                    color: theme.colors.primary.dustyBlue,
                    marginBottom: theme.spacing.md,
                    lineHeight: theme.typography.lineHeight.relaxed,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    display: 'block',
                  }}
                >
                  {card.address}
                </a>
              )}

              {/* Description */}
              {card.description && (
                <p
                  className="font-sans text-center"
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.normal,
                    color: theme.colors.text.secondary,
                    lineHeight: theme.typography.lineHeight.relaxed,
                    fontStyle: card.time ? 'italic' : 'normal',
                    marginTop: card.address ? theme.spacing.md : 0,
                    paddingTop: card.address ? theme.spacing.md : 0,
                    borderTop: card.address ? `1px solid ${theme.colors.primary.dustyBlue}20` : 'none',
                  }}
                >
                  {card.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
