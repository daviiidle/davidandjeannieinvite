import { useEffect, useState } from 'react';
import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';
import { EVENT_START } from '../utils/time';

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const targetDate = EVENT_START.getTime();

export function Countdown() {
  const { strings } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState<Remaining>(calculate());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeRemaining(calculate());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className="font-sans text-center"
      role="timer"
      aria-live="polite"
      style={{
        fontFamily: theme.typography.fontFamily.sans,
        color: theme.colors.primary.dustyBlue,
        maxWidth: '560px',
        margin: `${theme.spacing.lg} auto`,
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
        {strings.details.countdownTitle}
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          flexWrap: 'wrap',
          columnGap: theme.spacing.lg,
          rowGap: theme.spacing.md,
          fontFamily: theme.typography.fontFamily.serif,
          fontSize: 'clamp(1.35rem, 3.5vw, 2.2rem)',
        }}
      >
        {(Object.keys(timeRemaining) as Array<keyof Remaining>).map((unit) => (
          <div
            key={unit}
            style={{
              minWidth: '80px',
            }}
          >
            <div style={{ whiteSpace: 'nowrap' }}>
              {String(timeRemaining[unit]).padStart(2, '0')}
            </div>
            <div
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: theme.spacing.xs,
              }}
            >
              {strings.details.countdownUnits[unit]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function calculate(): Remaining {
  const total = Math.max(targetDate - Date.now(), 0);
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}
