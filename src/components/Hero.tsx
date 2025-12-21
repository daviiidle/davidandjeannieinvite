import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { theme } from '../theme';

interface HeroProps {
  groomName?: string;
  brideName?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  ceremonyAddress?: string;
  receptionTime?: string;
  receptionLocation?: string;
  receptionAddress?: string;
}

export function Hero({
  groomName = "David Le",
  brideName = "Jeannie Chiu",
  ceremonyTime = "1pm",
  ceremonyLocation = "Holy Family Parish",
  ceremonyAddress = "46A Ballarat Rd, Maidstone VIC 3012",
  receptionTime = "6pm",
  receptionLocation = "Ultima Function Centre",
  receptionAddress = "Corner of Ely Court, Keilor Park Dr, Keilor East VIC 3042"
}: HeroProps) {
  // Refs for animation targets
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const eventDetailsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Split names into letters for animation
  const splitNames = useMemo(() => {
    const splitText = (text: string) => text.split('').map((char, i) => ({
      char: char === ' ' ? '\u00A0' : char, // Non-breaking space
      key: `${text}-${i}`
    }));

    return {
      groom: splitText(groomName),
      ampersand: '&',
      bride: splitText(brideName)
    };
  }, [groomName, brideName]);

  // Animation on mount
  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip animation, show final state immediately
      if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 1 });
      if (namesRef.current) gsap.set(namesRef.current.children, { opacity: 1 });
      if (eventDetailsRef.current) gsap.set(eventDetailsRef.current, { opacity: 1, y: 0 });
      if (buttonsRef.current) gsap.set(buttonsRef.current, { opacity: 1, y: 0 });
      if (sectionRef.current) gsap.set(sectionRef.current, { scale: 1 });
      return;
    }

    // Create GSAP timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Fade in background overlay (0.8s)
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      0
    );

    // Subtle background zoom (3s, runs in parallel)
    tl.fromTo(
      sectionRef.current,
      { scale: 1.1 },
      { scale: 1, duration: 3, ease: 'power2.out' },
      0
    );

    // 2. Reveal couple names letter-by-letter (1.2s)
    if (namesRef.current) {
      const letters = namesRef.current.querySelectorAll('.letter');
      tl.fromTo(
        letters,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.05,
          stagger: 0.03, // ~1.2s total for ~40 letters
          ease: 'back.out(1.7)'
        },
        0.4 // Start after 0.4s
      );
    }

    // 3. Slide in event details from bottom (0.6s)
    tl.fromTo(
      eventDetailsRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6 },
      1.8 // Start after names animation
    );

    // 4. Slide in buttons (0.5s)
    tl.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 },
      2.2 // Start shortly after event details
    );

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []); // Empty dependency array - runs ONCE on mount

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        backgroundColor: theme.colors.background.white,
        position: 'relative',
        transformOrigin: 'center center',
      }}
    >
      {/* Background Overlay for fade-in effect */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Content Container */}
      <div className="w-full max-w-5xl text-center relative z-10">

        {/* Couple Names with letter-by-letter animation */}
        <div
          ref={namesRef}
          className="font-serif mb-8 sm:mb-10 lg:mb-12"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.dustyBlue,
            lineHeight: theme.typography.lineHeight.tight,
            letterSpacing: '0.02em',
          }}
        >
          {/* Groom Name */}
          {splitNames.groom.map(({ char, key }) => (
            <span key={key} className="letter" style={{ display: 'inline-block', opacity: 0 }}>
              {char}
            </span>
          ))}

          {/* Ampersand */}
          <span
            className="letter"
            style={{
              display: 'inline-block',
              opacity: 0,
              fontWeight: theme.typography.fontWeight.normal,
              margin: '0 0.2em'
            }}
          >
            {splitNames.ampersand}
          </span>

          {/* Bride Name */}
          {splitNames.bride.map(({ char, key }) => (
            <span key={key} className="letter" style={{ display: 'inline-block', opacity: 0 }}>
              {char}
            </span>
          ))}
        </div>

        {/* Event Details Container */}
        <div
          ref={eventDetailsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto"
          style={{ opacity: 0 }}
        >

          {/* Ceremony */}
          <div
            style={{
              backgroundColor: theme.colors.background.offWhite,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.xl,
              border: `2px solid ${theme.colors.primary.dustyBlue}30`,
              boxShadow: theme.shadows.md,
            }}
          >
            <p
              className="font-sans mb-3"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.secondary.slate,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Church Ceremony
            </p>
            <p
              className="font-serif mb-2"
              style={{
                fontFamily: theme.typography.fontFamily.serif,
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.primary.dustyBlue,
              }}
            >
              {ceremonyTime}
            </p>
            <p
              className="font-sans mb-2"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
              }}
            >
              {ceremonyLocation}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ceremonyAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans link-hover"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: 'clamp(0.875rem, 1.5vw, 0.9375rem)',
                fontWeight: theme.typography.fontWeight.normal,
                color: theme.colors.primary.dustyBlue,
                lineHeight: theme.typography.lineHeight.relaxed,
                textDecoration: 'underline',
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
              {ceremonyAddress}
            </a>
          </div>

          {/* Reception */}
          <div
            style={{
              backgroundColor: theme.colors.background.offWhite,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.xl,
              border: `2px solid ${theme.colors.primary.dustyBlue}30`,
              boxShadow: theme.shadows.md,
            }}
          >
            <p
              className="font-sans mb-3"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.secondary.slate,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Wedding Reception
            </p>
            <p
              className="font-serif mb-2"
              style={{
                fontFamily: theme.typography.fontFamily.serif,
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.primary.dustyBlue,
              }}
            >
              {receptionTime}
            </p>
            <p
              className="font-sans mb-2"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
              }}
            >
              {receptionLocation}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(receptionAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans link-hover"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: 'clamp(0.875rem, 1.5vw, 0.9375rem)',
                fontWeight: theme.typography.fontWeight.normal,
                color: theme.colors.primary.dustyBlue,
                lineHeight: theme.typography.lineHeight.relaxed,
                textDecoration: 'underline',
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
              {receptionAddress}
            </a>
          </div>

        </div>

        {/* CTA Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          style={{ opacity: 0 }}
        >

          {/* RSVP Button - Primary */}
          <button
            className="w-full sm:w-auto font-sans btn-hover"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
              minHeight: '48px',
              minWidth: '200px',
              backgroundColor: theme.colors.primary.dustyBlue,
              color: theme.colors.text.inverse,
              border: 'none',
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: theme.shadows.lg,
              transition: theme.transitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.dustyBlueDark;
              e.currentTarget.style.boxShadow = theme.shadows.xl;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.dustyBlue;
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `3px solid ${theme.colors.primary.dustyBlue}40`;
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            RSVP
          </button>

          {/* Find My Seat Button - Secondary */}
          <button
            className="w-full sm:w-auto font-sans btn-hover"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
              minHeight: '48px',
              minWidth: '200px',
              backgroundColor: 'transparent',
              color: theme.colors.primary.dustyBlue,
              border: `2px solid ${theme.colors.primary.dustyBlue}`,
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: 'none',
              transition: theme.transitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary.dustyBlue;
              e.currentTarget.style.color = theme.colors.text.inverse;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.primary.dustyBlue;
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `3px solid ${theme.colors.primary.dustyBlue}40`;
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            Find My Seat
          </button>

        </div>
      </div>
    </section>
  );
}
