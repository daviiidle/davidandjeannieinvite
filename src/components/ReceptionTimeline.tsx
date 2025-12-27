import { useRef } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ReceptionEntry {
  time: string;
  description: string;
}

const RECEPTION_TIMELINE: ReceptionEntry[] = [
  {
    time: '6:00 PM — Doors Open',
    description: 'Guests arrive, mingle, and enjoy welcome drinks.',
  },
  {
    time: '6:30 PM — Grand Entrance & Family Introductions',
    description:
      '🎉 Please welcome the newlyweds, followed by immediate family and the wedding party.',
  },
  {
    time: '6:40 PM — Entrées Served',
    description: '🍽️ Shared starters are served to the table.',
  },
  {
    time: '7:15 PM — Speeches (Round One)',
    description: '🎤 Short, heartfelt words from family.',
  },
  {
    time: '7:35 PM — Main Courses Begin',
    description: '🥂 A selection of banquet-style main dishes are served progressively.',
  },
  {
    time: '8:15 PM — Noodle & Rice Courses',
    description: '🍜 Traditional celebratory courses to round out the meal.',
  },
  {
    time: '8:35 PM — Cake Cutting & Dessert',
    description: '🍰 Dessert is served, followed by tea and coffee.',
  },
  {
    time: '8:50 PM — First Dance',
    description: '💃🕺 The newlyweds share their first dance together.',
  },
  {
    time: '8:55 PM — Family Dances',
    description:
      '❤️ Meaningful moments with family:\n• Bride & Father\n• Groom & Mother\n(Short or trimmed songs to keep the evening flowing.)',
  },
  {
    time: '9:05 PM — Games & Family Toast',
    description:
      '🎲 A fun couple game, followed by a shared table toast.\nEach table opens their Martell Blue Swift\n(small pours — quality over quantity)',
  },
  {
    time: '9:25 PM – 11:15 PM — Dancing & Celebration',
    description: '🪩 Dance, laugh, and celebrate with us as the night winds down.',
  },
];

export function ReceptionTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.6 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="reception-heading"
      style={{
        backgroundColor: theme.colors.background.offWhite,
        padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
      }}
    >
      <div
        style={{
          maxWidth: theme.layout.maxWidth,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: theme.spacing['3xl'],
          }}
        >
          <p
            id="reception-heading"
            style={{
              fontFamily: theme.typography.fontFamily.serif,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.primary.dustyBlue,
              marginBottom: theme.spacing.xs,
            }}
          >
            Reception Evening Timeline
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing['2xl'],
          }}
        >
          {RECEPTION_TIMELINE.map((entry) => (
            <article
              key={entry.time}
              style={{
                backgroundColor: theme.colors.background.white,
                borderRadius: theme.borderRadius['3xl'],
                padding: theme.spacing['2xl'],
                boxShadow: theme.shadows.lg,
                border: `1px solid ${theme.colors.primary.dustyBlue}20`,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
              }}
            >
              <p
                style={{
                  fontFamily: theme.typography.fontFamily.serif,
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  color: theme.colors.primary.dustyBlue,
                  margin: 0,
                }}
              >
                {entry.time}
              </p>
              <p
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  margin: 0,
                }}
              >
                {entry.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
