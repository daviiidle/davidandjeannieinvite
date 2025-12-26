import { useEffect, useMemo, useRef, useState } from 'react';
import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';
import { Countdown } from './Countdown';
import {
  createAppleCalendarLink,
  createGoogleCalendarLink,
} from '../utils/calendarLinks';
import { EVENT_START, EVENT_TIME_ZONE, formatWeekday, getEventEnd } from '../utils/time';
import { StayInLoopForm } from './StayInLoopForm';

interface HeroProps {
  groomName?: string;
  brideName?: string;
}

export function Hero({
  groomName,
  brideName,
}: HeroProps) {
  const { strings, language } = useLanguage();
  const resolvedGroom = (groomName ?? strings.hero.groomName).trim();
  const resolvedBride = (brideName ?? strings.hero.brideName).trim();
  const resolvedDate = strings.details.dateLabel;
  const locationText = strings.hero.locationLine;
  const invitationLine = strings.hero.invitationLine;
  const rsvpStatus = strings.hero.rsvpStatus;
  const { googleLabel, appleLabel } = strings.hero.calendar;
  const namesText = `${resolvedGroom} &\n${resolvedBride}`;
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1520854223477-08661d33a360?w=1600&auto=format&fit=crop&q=80';
  const calendarEventStart = EVENT_START;
  const calendarEventEnd = useMemo(() => getEventEnd(), []);
  const locale = language === 'vi' ? 'vi-VN' : 'en-AU';
  const weekdayLabel = useMemo(() => formatWeekday(locale), [locale]);
  const [lockedButton, setLockedButton] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  const googleCalendarLink = useMemo(
    () =>
      createGoogleCalendarLink({
        title: 'David & Jeannie Wedding',
        location: locationText,
        start: calendarEventStart,
        end: calendarEventEnd,
        timeZone: EVENT_TIME_ZONE,
      }),
    [calendarEventStart, calendarEventEnd, locationText]
  );

  const appleCalendarLink = useMemo(
    () =>
      createAppleCalendarLink({
        title: 'David & Jeannie Wedding',
        location: locationText,
        start: calendarEventStart,
        end: calendarEventEnd,
        timeZone: EVENT_TIME_ZONE,
      }),
    [calendarEventStart, calendarEventEnd, locationText]
  );

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCalendarClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    buttonId: string
  ) => {
    if (lockedButton === buttonId) {
      event.preventDefault();
      return;
    }
    setLockedButton(buttonId);
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => setLockedButton(null), 1500);
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden hero-opener-root"
      style={{
        backgroundColor: theme.colors.background.white,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.9)), url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div
        className="hero-opener__background"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255,255,255,0.3)',
        }}
      />

      <div className="w-full max-w-4xl text-center relative z-10 space-y-6">
        <p
          className="hero-opener__names font-serif"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2rem, 7vw, 5rem)',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.dustyBlue,
            letterSpacing: '0.02em',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.05,
            textAlign: 'center',
          }}
        >
          {namesText}
        </p>

        <div className="space-y-2 sm:space-y-3">
          <p
            className="hero-opener__fade-item font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: theme.colors.secondary.slate,
              marginBottom: 0,
              transitionDelay: '0.1s',
            }}
          >
            {weekdayLabel}
          </p>

          <p
            className="hero-opener__date font-sans tracking-[0.3em]"
            style={{
              fontFamily: theme.typography.fontFamily.serif,
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.primary.dustyBlue,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 0,
            }}
          >
            {resolvedDate}
          </p>

          <p
            className="hero-opener__fade-item font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.primary.dustyBlue,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: 0,
              transitionDelay: '0.15s',
            }}
          >
            {locationText}
          </p>

          <p
            className="hero-opener__fade-item font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.secondary.slate,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: 0,
              transitionDelay: '0.3s',
            }}
          >
            {invitationLine}
          </p>
        </div>

        <span
          className="hero-opener__divider"
          aria-hidden="true"
          style={{
            width: '80px',
            height: '2px',
            backgroundColor: theme.colors.primary.dustyBlue,
            display: 'inline-block',
          }}
        />

        <Countdown />

        <div className="space-y-3">
          <p
            className="hero-opener__fade-item font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: theme.colors.text.secondary,
              transitionDelay: '0.45s',
            }}
          >
            {rsvpStatus}
          </p>

          <div
            className="hero-opener__fade-item hero-calendar-actions"
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: theme.spacing.sm,
              transitionDelay: '0.6s',
            }}
          >
            <a
              href={googleCalendarLink}
              target="_blank"
              rel="noreferrer noopener"
              className="font-sans hero-calendar-button"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.xs,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.colors.primary.dustyBlue,
                border: `1px solid ${theme.colors.primary.dustyBlue}`,
                borderRadius: theme.borderRadius.full,
                padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
                minHeight: '44px',
                minWidth: '200px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                textDecoration: 'none',
                transition: `background-color ${theme.transitions.base}, color ${theme.transitions.base}`,
              }}
              aria-label={strings.hero.calendar.googleLabel}
              onClick={(event) => handleCalendarClick(event, 'google')}
              aria-disabled={lockedButton === 'google'}
              title={strings.hero.calendar.googleLabel}
            >
              {googleLabel}
            </a>
            <a
              href={appleCalendarLink}
              download="david-and-jeannie-wedding.ics"
              rel="noreferrer"
              className="font-sans hero-calendar-button"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.xs,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.colors.primary.dustyBlue,
                border: `1px solid ${theme.colors.primary.dustyBlue}80`,
                borderRadius: theme.borderRadius.full,
                padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
                minHeight: '44px',
                minWidth: '200px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                textDecoration: 'none',
                transition: `background-color ${theme.transitions.base}, color ${theme.transitions.base}`,
              }}
              onClick={(event) => handleCalendarClick(event, 'apple')}
              aria-label={strings.hero.calendar.appleLabel}
              aria-disabled={lockedButton === 'apple'}
              title={strings.hero.calendar.appleLabel}
            >
              {appleLabel}
            </a>
          </div>
        </div>

        <StayInLoopForm />
      </div>
    </section>
  );
}
