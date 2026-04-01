import { useRef, useCallback } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TimelineCard, type TimelineItem } from './TimelineCard';
import { Section } from './Section';
import { useLanguage } from '../context/useLanguage';

const RECEPTION_ITEMS: TimelineItem[] = [
  {
    time: '6:00 PM',
    label: 'Doors Open & Welcome Drinks',
    icon: 'cocktail',
  },
  {
    time: '6:30 PM',
    label: 'Grand Entrance & Introductions',
    icon: 'ceremony',
  },
  {
    time: '6:40 PM',
    label: 'Entrées Served',
    icon: 'dinner',
  },
  {
    time: '7:15 PM',
    label: 'Speeches · Round One',
    icon: 'speeches',
  },
  {
    time: '7:35 PM',
    label: 'Main Courses Begin',
    icon: 'dinner',
  },
  {
    time: '8:15 PM',
    label: 'Noodle & Rice Courses',
    icon: 'dinner',
  },
  {
    time: '8:35 PM',
    label: 'Cake Cutting & Dessert',
    icon: 'cake',
  },
  {
    time: '8:50 PM',
    label: 'First Dance',
    icon: 'firstDance',
  },
  {
    time: '8:55 PM',
    label: 'Family Dances',
    icon: 'dancing',
  },
  {
    time: '9:05 PM',
    label: 'Games & Family Toast',
    icon: 'games',
  },
  {
    time: '9:25 PM',
    label: 'Open Dancing',
    icon: 'dancing',
  },
  {
    time: '11:00 PM',
    label: 'Last Songs & Slow Goodbyes',
    icon: 'dancing',
  },
  {
    time: '11:15 PM',
    label: 'Farewells & Departures',
    icon: 'farewell',
  },
  {
    time: '11:30 PM',
    label: 'Venue Clear',
    icon: 'farewell',
  },
];

export function ReceptionTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { language } = useLanguage();
  const activateTitleAnimation = useCallback(() => {
    titleRef.current?.classList.add('page-title-handwriting--active');
  }, []);
  useScrollReveal(sectionRef, { duration: 0.6, onEnter: activateTitleAnimation });
  const items = RECEPTION_ITEMS.map((item) => {
    if (item.label === 'Entrées Served') {
      if (language === 'vi') {
        return {
          ...item,
          label: 'Phục vụ món khai vị',
        };
      }
      return {
        ...item,
        label: 'Entrées Served',
      };
    }
    if (item.label === 'Main Courses Begin') {
      if (language === 'vi') {
        return {
          ...item,
          label: 'Phục vụ món chính',
        };
      }
      return {
        ...item,
        label: 'Main Courses Begin',
      };
    }
    return item;
  });
  const decor = (
    <div className="timeline-decor" aria-hidden="true">
      <img className="timeline-decor__top" src="/images/Timeline Top.png" alt="" />
      <img className="timeline-decor__bottom" src="/images/Timeline Bottom.png" alt="" />
    </div>
  );

  return (
    <Section
      id="reception"
      ref={sectionRef}
      aria-labelledby="reception-heading"
      maxWidth={theme.layout.maxWidth}
      className="timeline-section timeline-section--reception"
      beforeInner={decor}
    >
      <TimelineCard
        title="Reception Timeline"
        dateLine="October 3, 2026"
        items={items}
        titleRef={titleRef}
      />
    </Section>
  );
}
