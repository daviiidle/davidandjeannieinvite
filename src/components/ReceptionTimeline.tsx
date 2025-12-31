import { useRef } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TimelineCard, type TimelineItem } from './TimelineCard';
import { Section } from './Section';

const RECEPTION_ITEMS: TimelineItem[] = [
  {
    time: '6:00 PM',
    label: 'Doors Open & Welcome Drinks',
    description: 'Guests arrive, mingle, and enjoy a first toast in the Sketch Room.',
    icon: 'cocktail',
  },
  {
    time: '6:30 PM',
    label: 'Grand Entrance & Introductions',
    description: 'We make our entrance followed by immediate family and the wedding party.',
    icon: 'ceremony',
  },
  {
    time: '6:40 PM',
    label: 'Entrées Served',
    description: 'Shared starters are served to the table.',
    icon: 'dinner',
  },
  {
    time: '7:15 PM',
    label: 'Speeches · Round One',
    description: 'Heartfelt words from family to set the tone for the night.',
    icon: 'speeches',
  },
  {
    time: '7:35 PM',
    label: 'Main Courses Begin',
    description: 'Banquet-style mains are served progressively.',
    icon: 'dinner',
  },
  {
    time: '8:15 PM',
    label: 'Noodle & Rice Courses',
    description: 'Traditional celebratory courses round out the meal.',
    icon: 'dinner',
  },
  {
    time: '8:35 PM',
    label: 'Cake Cutting & Dessert',
    description: 'Cake service, tea, and coffee.',
    icon: 'cake',
  },
  {
    time: '8:50 PM',
    label: 'First Dance',
    description: 'We share our first dance together.',
    icon: 'firstDance',
  },
  {
    time: '8:55 PM',
    label: 'Family Dances',
    description: 'Bride & father, groom & mother—short songs to keep the evening flowing.',
    icon: 'dancing',
  },
  {
    time: '9:05 PM',
    label: 'Games & Family Toast',
    description: 'A playful couple game followed by a shared table toast.',
    icon: 'games',
  },
  {
    time: '9:25 PM – 11:00 PM',
    label: 'Dancing & Celebration',
    description: 'Dance floor stays lively through 11:00 PM.',
    icon: 'dancing',
  },
  {
    time: '11:00 PM',
    label: 'Last Songs & Slow Goodbyes',
    description: 'Dancing concludes with final songs so everyone can catch their breath.',
    icon: 'dancing',
  },
  {
    time: '11:15 PM',
    label: 'Farewells & Departures',
    description: 'Guests begin departing from 11:15 PM—hugs and thank-yous all around.',
    icon: 'farewell',
  },
  {
    time: '11:30 PM',
    label: 'Venue Clear',
    description: 'Venue fully cleared by 11:30 PM in line with venue timing.',
    icon: 'farewell',
  },
];

export function ReceptionTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.6 });

  return (
    <Section
      ref={sectionRef}
      aria-labelledby="reception-heading"
      maxWidth={theme.layout.maxWidth}
    >
      <TimelineCard
        title="Reception Timeline"
        subtitle="David + Jeannie"
        dateLine="October 3, 2026"
        items={RECEPTION_ITEMS}
      />
    </Section>
  );
}
