import type { CSSProperties, ReactNode } from 'react';
import { theme } from '../theme';
import '../styles/timeline.css';

const ICON_STROKE = theme.colors.primary.dustyBlue;

type TimelineIcon =
  | 'ceremony'
  | 'photos'
  | 'intermission'
  | 'cocktail'
  | 'dinner'
  | 'speeches'
  | 'cake'
  | 'firstDance'
  | 'games'
  | 'dancing'
  | 'farewell';

const iconProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 28 28',
  fill: 'none',
  stroke: ICON_STROKE,
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const iconMap: Record<TimelineIcon, ReactNode> = {
  ceremony: (
    <svg {...iconProps} aria-hidden="true">
      <circle cx="9" cy="11" r="4" />
      <circle cx="19" cy="11" r="4" />
      <path d="M7 17h14" />
      <path d="M5 21h18" />
    </svg>
  ),
  photos: (
    <svg {...iconProps} aria-hidden="true">
      <rect x="4" y="8" width="20" height="14" rx="2" />
      <path d="M10 8l2-3h4l2 3" />
      <circle cx="14" cy="15" r="3.25" />
    </svg>
  ),
  intermission: (
    <svg {...iconProps} aria-hidden="true">
      <circle cx="14" cy="14" r="8" />
      <path d="M14 10v5l3 2" />
    </svg>
  ),
  cocktail: (
    <svg {...iconProps} aria-hidden="true">
      <path d="M6 6h16" />
      <path d="M8 6l6 6 6-6" />
      <path d="M14 12v8" />
      <path d="M10 20h8" />
      <path d="M18 9h2" />
      <path d="M8.5 6l-2.5-3" />
    </svg>
  ),
  dinner: (
    <svg {...iconProps} aria-hidden="true">
      <path d="M8 6v12" />
      <path d="M6 7v4a2 2 0 0 0 2 2" />
      <path d="M10 7v4a2 2 0 0 1-2 2" />
      <path d="M18 6v12" />
      <path d="M14 6v12" />
      <path d="M22 6v12" />
    </svg>
  ),
  speeches: (
    <svg {...iconProps} aria-hidden="true">
      <path d="M11 20l-1 4" />
      <path d="M17 20l1 4" />
      <rect x="7" y="4" width="14" height="14" rx="3" />
      <path d="M11 10h6" />
      <path d="M11 14h6" />
    </svg>
  ),
  cake: (
    <svg {...iconProps} aria-hidden="true">
      <path d="M9 5c0 1.5 2 1.5 2 3" />
      <path d="M17 5c0 1.5-2 1.5-2 3" />
      <path d="M7 12h14" />
      <path d="M5 18h18" />
      <path d="M7 12l-2 6v3h18v-3l-2-6z" />
    </svg>
  ),
  firstDance: (
    <svg {...iconProps} aria-hidden="true">
      <circle cx="12" cy="7" r="2.5" />
      <path d="M10.5 9.5L7 14v5" />
      <path d="M13.5 9.5L17 14v5" />
      <path d="M7 16l3 2" />
      <path d="M17 16l-3 2" />
    </svg>
  ),
  games: (
    <svg {...iconProps} aria-hidden="true">
      <rect x="4" y="8" width="10" height="12" rx="2" />
      <circle cx="18.5" cy="14.5" r="5.5" />
      <path d="M7 11h4" />
      <path d="M6 15h2" />
      <path d="M18.5 11.5v6" />
      <path d="M15.5 14.5h6" />
    </svg>
  ),
  dancing: (
    <svg {...iconProps} aria-hidden="true">
      <path d="M9 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
      <path d="M11 8v6l3 5" />
      <path d="M11 11l-3 3" />
      <path d="M18 7l-4 3" />
      <path d="M16 11l2 9" />
    </svg>
  ),
  farewell: (
    <svg {...iconProps} aria-hidden="true">
      <path d="M5 17h18" />
      <path d="M7 17l1.5-5h11L21 17" />
      <path d="M12 17v3" />
      <path d="M18 17v3" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="19" cy="20" r="1.5" />
    </svg>
  ),
};

export interface TimelineItem {
  time: string;
  label: string;
  description?: string;
  icon: TimelineIcon;
  iconLabel?: string;
}

interface TimelineCardProps {
  title: string;
  subtitle: string;
  dateLine: string;
  items: TimelineItem[];
  titleRef?: React.Ref<HTMLHeadingElement>;
}

export function TimelineCard({
  title,
  subtitle,
  dateLine,
  items,
  titleRef,
}: TimelineCardProps) {
  const containerStyle: CSSProperties = {
    color: theme.colors.text.primary,
  };

  const textColor = theme.colors.text.primary;
  const mutedColor = theme.colors.secondary.slate;

  return (
    <section
      className="timeline-card"
      style={containerStyle}
      aria-label={`${title} schedule`}
    >
      <header className="timeline-card__header">
        <p
          className="timeline-card__kicker"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            color: mutedColor,
          }}
        >
          {subtitle}
        </p>
        <h2
          className="timeline-card__title page-title-handwriting"
          ref={titleRef}
          style={{
            fontFamily: '"Mea Culpa", "Playfair Display", serif',
            fontSize: theme.typography.heading.h2,
            color: theme.colors.primary.dustyBlue,
            fontWeight: 400,
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.md,
          }}
        >
          <span className="hero-handwriting">{title}</span>
        </h2>
        <p
          className="timeline-card__date"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            color: mutedColor,
          }}
        >
          {dateLine}
        </p>
      </header>

      <div className="timeline-card__list-wrapper">
        <ul className="timeline-card__list">
          {items.map((item) => (
            <li key={`${item.time}-${item.label}`} className="timeline-card__item">
              <div className="timeline-card__icon-col">
                <span
                  className="timeline-card__icon"
                  role="img"
                  aria-label={item.iconLabel ?? item.label}
                >
                  {iconMap[item.icon]}
                </span>
              </div>
              <div className="timeline-card__content">
                <p
                  className="timeline-card__time"
                  style={{ fontFamily: theme.typography.fontFamily.sans, color: textColor }}
                >
                  {item.time}
                </p>
                <p
                  className="timeline-card__label"
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    color: theme.colors.primary.dustyBlue,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  {item.label}
                </p>
                {item.description && (
                  <p
                    className="timeline-card__description"
                    style={{
                      fontFamily: theme.typography.fontFamily.sans,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
