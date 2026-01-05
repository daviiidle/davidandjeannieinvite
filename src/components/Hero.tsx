import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { theme } from '../theme';
import { useLanguage } from '../context/useLanguage';
import { Countdown } from './Countdown';
import {
  createAppleCalendarLink,
  createGoogleCalendarLink,
} from '../utils/calendarLinks';
import { formatWeekday } from '../utils/time';
import { StayInLoopForm } from './StayInLoopForm';
import { Section } from './Section';

export function Hero() {
  const { strings, language } = useLanguage();
  const heroTitle = (strings.hero.title || 'Save the Date').trim();
  const heroSubtitle = (strings.hero.subtitle || '').trim();
  const heroCtaLabel = (strings.hero.ctaLabel || 'Receive Updates').trim();
  const updatesHeading = (strings.hero.updatesHeading || 'Updates & RSVP').trim();
  const scrollHint = (strings.hero.scrollHint || 'Scroll for details').trim();
  const resolvedDate = strings.details.dateLabel;
  const locationText = strings.hero.locationLine;
  const invitationLine = strings.hero.invitationLine;
  const rsvpStatus = strings.hero.rsvpStatus;
  const { googleLabel, appleLabel } = strings.hero.calendar;
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1520854223477-08661d33a360?w=1600&auto=format&fit=crop&q=80';
  const calendarDate = '2026-10-03';
  const locale = language === 'vi' ? 'vi-VN' : 'en-AU';
  const weekdayLabel = useMemo(() => formatWeekday(locale), [locale]);
  const [lockedButton, setLockedButton] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const scrollTargetId = 'updates-and-rsvp';

  const googleCalendarLink = useMemo(
    () =>
      createGoogleCalendarLink({
        title: 'David & Jeannie Wedding',
        location: locationText,
        startDate: calendarDate,
      }),
    [locationText]
  );

  const appleCalendarLink = useMemo(
    () =>
      createAppleCalendarLink({
        title: 'David & Jeannie Wedding',
        location: locationText,
        startDate: calendarDate,
      }),
    [locationText]
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

  const handleScrollToUpdates = useCallback(() => {
    const target = document.getElementById(scrollTargetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <Section
      className="overflow-hidden hero-opener-root hero-section"
      style={{
        backgroundColor: theme.colors.background.white,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.9)), url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        paddingTop:
          'calc(var(--section-padding-y) + env(safe-area-inset-top) + var(--hero-safe-offset, 0px))',
      }}
      beforeInner={
        <>
          <div
            className="hero-opener__background"
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.3)',
              zIndex: 0,
            }}
          />
          <div className="heroDecor" aria-hidden="true">
            <img
              className="heroWash"
              src="/images/wash-8.webp"
              alt=""
              decoding="async"
              fetchPriority="high"
            />
            <img
              className="heroFloralTL"
              src="/images/floral-14.webp"
              alt=""
              decoding="async"
              loading="eager"
            />
          </div>
        </>
      }
      maxWidth="56rem"
      innerClassName="w-full text-center relative z-10 space-y-4 sm:space-y-6"
    >
        <p
          className="hero-opener__names"
          data-handwriting="true"
          style={{
            fontFamily: '"Mea Culpa", "Playfair Display", serif',
            fontSize: 'clamp(3rem, 12vw, 6rem)',
            fontWeight: 400,
            color: theme.colors.primary.dustyBlue,
            letterSpacing: '0.05em',
            whiteSpace: 'normal',
            lineHeight: 1.1,
            textAlign: 'center',
          }}
        >
          <span className="hero-handwriting">
            <span className="hero-handwriting__text">{heroTitle}</span>
          </span>
        </p>
        {heroSubtitle ? (
          <p
            className="hero-opener__fade-item font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.secondary.slate,
              letterSpacing: '0.04em',
              marginBottom: 0,
              lineHeight: 1.4,
              transitionDelay: '0.05s',
            }}
          >
            {heroSubtitle}
          </p>
        ) : null}

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
              className="font-sans hero-calendar-button hero-calendar-button--secondary"
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
              className="font-sans hero-calendar-button hero-calendar-button--secondary"
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

          <button
            type="button"
            onClick={handleScrollToUpdates}
            className="font-sans hero-calendar-button hero-calendar-button--primary"
            data-hero-cta
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderRadius: theme.borderRadius.full,
              border: 'none',
              backgroundColor: theme.colors.primary.dustyBlue,
              color: theme.colors.background.white,
              padding: `${theme.spacing.sm} ${theme.spacing['2xl']}`,
              minHeight: '48px',
              cursor: 'pointer',
              marginTop: theme.spacing.sm,
            }}
            aria-label={heroCtaLabel}
          >
            {heroCtaLabel}
          </button>
        </div>

        <div
          id={scrollTargetId}
          className="updates-section-bridge"
          style={{
            marginTop: `var(--updates-section-margin, ${theme.spacing['3xl']})`,
            paddingTop: `var(--updates-section-padding, ${theme.spacing.lg})`,
            paddingBottom: 'var(--updates-section-padding-bottom, 0px)',
            borderTop: `1px solid var(--updates-divider-color, ${theme.colors.primary.dustyBlue}33)`,
            backgroundColor: 'var(--updates-section-bg, transparent)',
          }}
        >
          <h2
            style={{
              fontFamily: theme.typography.fontFamily.serif,
              fontSize: theme.typography.fontSize['2xl'],
              color: theme.colors.primary.dustyBlue,
              marginBottom: theme.spacing.lg,
            }}
          >
            {updatesHeading}
          </h2>
          <p
            className="font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.relaxed,
              maxWidth: '640px',
              margin: `0 auto ${theme.spacing.lg}`,
            }}
          >
            {strings.stayInLoop.instruction}
          </p>
          <StayInLoopForm />
        </div>
    </Section>
  );
}
