import { useRef } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TimelineCard, type TimelineItem } from './TimelineCard';
import { Section } from './Section';

const DAY_TIMELINE: TimelineItem[] = [
  {
    time: '1:00 PM',
    label: 'Ceremony',
    description: 'Holy Family Parish · please arrive 15 minutes early for seating.',
    icon: 'ceremony',
  },
  {
    time: '2:00 PM',
    label: 'Photos & Congratulations',
    description: 'Confetti, hugs, and portraits outside the church.',
    icon: 'photos',
  },
  {
    time: '2:45 PM – 5:15 PM',
    label: 'Intermission',
    description: 'Rest, explore nearby cafés, or head home to refresh before the evening.',
    icon: 'intermission',
  },
  {
    time: '6:00 PM',
    label: 'Reception Doors Open',
    description: 'Ultima Function Centre · Sketch Room welcomes you with drinks.',
    icon: 'cocktail',
  },
];

export function TheDay() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.6 });

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="the-day-heading"
      maxWidth={theme.layout.maxWidth}
    >
      <TimelineCard
        title="Wedding Day Timeline"
        subtitle="David + Jeannie"
        dateLine="October 3, 2026"
        items={DAY_TIMELINE}
      />
    </Section>
  );
}
