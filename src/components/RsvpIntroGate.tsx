import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const baseAssetPath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
const withBasePath = (path: string) =>
  `${baseAssetPath}${path.startsWith('/') ? path : `/${path}`}`;
const RSVP_INTRO_SRC = withBasePath(encodeURI('/images/rsvp-intro.webp'));
const RSVP_INTRO_DURATION_MS = 8000;
const RSVP_INTRO_FADE_MS = 650;

type IntroPhase = 'visible' | 'fading' | 'hidden';

interface RsvpIntroGateProps {
  children: ReactNode;
}

export function RsvpIntroGate({ children }: RsvpIntroGateProps) {
  const [phase, setPhase] = useState<IntroPhase>('visible');
  const hideTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setPhase('fading');
      fadeTimeoutRef.current = window.setTimeout(() => {
        setPhase('hidden');
      }, RSVP_INTRO_FADE_MS);
    }, RSVP_INTRO_DURATION_MS);

    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const isOverlayVisible = phase !== 'hidden';

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (isOverlayVisible) {
      root.setAttribute('data-rsvp-intro', 'active');
      return () => {
        root.removeAttribute('data-rsvp-intro');
      };
    }
    root.removeAttribute('data-rsvp-intro');
  }, [isOverlayVisible]);

  return (
    <div className="rsvp-intro" data-intro-active={isOverlayVisible}>
      {isOverlayVisible && (
        <div
          className="rsvp-intro__overlay"
          data-phase={phase}
          style={{ transitionDuration: `${RSVP_INTRO_FADE_MS}ms` }}
        >
          <img
            className="rsvp-intro__image"
            src={RSVP_INTRO_SRC}
            alt=""
            aria-hidden="true"
          />
        </div>
      )}

      <div className="rsvp-intro__content">{children}</div>
    </div>
  );
}
