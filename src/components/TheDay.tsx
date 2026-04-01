import { useRef, useCallback } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TimelineCard, type TimelineItem } from './TimelineCard';
import { Section } from './Section';

const DAY_TIMELINE: TimelineItem[] = [
  {
    time: '1:00 PM',
    label: 'Ceremony',
    icon: 'ceremony',
  },
  {
    time: '2:00 PM',
    label: 'Photos & Congratulations',
    icon: 'photos',
  },
  {
    time: '6:00 PM',
    label: 'Reception Doors Open',
    icon: 'cocktail',
  },
];

export function TheDay() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const activateTitleAnimation = useCallback(() => {
    titleRef.current?.classList.add('page-title-handwriting--active');
  }, []);
  useScrollReveal(sectionRef, { duration: 0.6, onEnter: activateTitleAnimation });
  const decor = (
    <div className="timeline-decor" aria-hidden="true">
      <img className="timeline-decor__top" src="/images/Timeline Top.png" alt="" />
      <img className="timeline-decor__bottom" src="/images/Timeline Bottom.png" alt="" />
    </div>
  );

  return (
    <Section
      id="the-day"
      ref={sectionRef}
      aria-labelledby="the-day-heading"
      maxWidth={theme.layout.maxWidth}
      className="timeline-section"
      beforeInner={decor}
    >
      <TimelineCard
        title="Wedding Day Timeline"
        dateLine="October 3, 2026"
        items={DAY_TIMELINE}
        titleRef={titleRef}
      />
    </Section>
  );
}
