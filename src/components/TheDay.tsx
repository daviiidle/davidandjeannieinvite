import { useRef } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface TimelineEntry {
  time: string;
  details: string[];
}

const TIMELINE: TimelineEntry[] = [
  {
    time: '1:00 PM — Ceremony',
    details: ['💍 Join us as we exchange vows and officially become husband & wife.'],
  },
  {
    time: '2:00 PM — Photos & Congratulations',
    details: ['📸 Confetti, family photos, and a few hugs.'],
  },
  {
    time: '2:45 PM – 5:15 PM — Intermission',
    details: [
      '✨ Take some time to relax, freshen up, or explore nearby cafés.',
      'We’ll see you again in the evening.',
    ],
  },
  {
    time: '6:00 PM — Reception Doors Open',
    details: ['🥂 Guests are welcome to arrive at the reception venue.'],
  },
];

export function TheDay() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.6 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="the-day-heading"
      style={{
        backgroundColor: theme.colors.background.offWhite,
        padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
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
          id="the-day-heading"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing['3xl'],
          }}
        >
          Wedding Day Overview
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: theme.spacing['2xl'],
          }}
        >
          {TIMELINE.map((entry) => (
            <article
              key={entry.time}
              style={{
                backgroundColor: theme.colors.background.white,
                borderRadius: theme.borderRadius['3xl'],
                padding: theme.spacing['2xl'],
                boxShadow: theme.shadows.md,
                border: `1px solid ${theme.colors.primary.dustyBlue}20`,
                textAlign: 'left',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md,
              }}
            >
              <p
                style={{
                  fontFamily: theme.typography.fontFamily.serif,
                  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                  color: theme.colors.primary.dustyBlue,
                  margin: 0,
                }}
              >
                {entry.time}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.xs,
                }}
              >
                {entry.details.map((line, index) => (
                  <p
                    key={`${entry.time}-${index}`}
                    style={{
                      fontFamily: theme.typography.fontFamily.sans,
                      fontSize: theme.typography.fontSize.base,
                      color: theme.colors.text.secondary,
                      lineHeight: theme.typography.lineHeight.relaxed,
                      margin: 0,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
