import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { theme } from '../theme';

interface HeroProps {
  groomName?: string;
  brideName?: string;
}

export function Hero({
  groomName = "David",
  brideName = "Jeannie",
}: HeroProps) {
  // Refs for animation targets
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);

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

      </div>
    </section>
  );
}
