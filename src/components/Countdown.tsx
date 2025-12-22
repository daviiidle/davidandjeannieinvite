import { useEffect, useState } from 'react';
import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const targetDate = new Date('2026-10-03T00:00:00').getTime();

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
      style={{
        fontFamily: theme.typography.fontFamily.sans,
        color: theme.colors.primary.dustyBlue,
        marginTop: '2rem',
      }}
    >
      <p
        style={{
          fontFamily: theme.typography.fontFamily.serif,
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: theme.typography.fontWeight.semibold,
          marginBottom: theme.spacing.xs,
        }}
      >
        {strings.details.saveTheDate}
      </p>
      <p
        style={{
          fontFamily: theme.typography.fontFamily.sans,
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: theme.spacing.lg,
        }}
      >
        {strings.details.dateLabel}
      </p>
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
          gap: theme.spacing.xl,
          fontFamily: theme.typography.fontFamily.serif,
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        }}
      >
        {(Object.keys(timeRemaining) as Array<keyof Remaining>).map((unit) => (
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
