import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const baseAssetPath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
const withBasePath = (path: string) =>
  `${baseAssetPath}${path.startsWith('/') ? path : `/${path}`}`;
const RSVP_BACKGROUND_SRC = withBasePath(encodeURI('/images/envelope.png'));
const RSVP_CTA_SRC = withBasePath(encodeURI('/images/the golden button.png'));
const RSVP_INTRO_FADE_MS = 900;
const RSVP_INTRO_OPEN_MS = 1100;

type IntroPhase = 'visible' | 'opening' | 'hidden';

interface RsvpIntroGateProps {
  children: ReactNode;
}

export function RsvpIntroGate({ children }: RsvpIntroGateProps) {
  const [phase, setPhase] = useState<IntroPhase>('visible');
  const fadeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const handleDismiss = useCallback(() => {
    if (phase !== 'visible') return;
    setPhase('opening');
    fadeTimeoutRef.current = window.setTimeout(() => {
      setPhase('hidden');
    }, RSVP_INTRO_OPEN_MS);
  }, [phase]);

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
          <div className="rsvp-intro__doors" aria-hidden="true">
            <span
              className="rsvp-intro__door rsvp-intro__door--left"
              style={{ backgroundImage: `url(${RSVP_BACKGROUND_SRC})` }}
            />
            <span
              className="rsvp-intro__door rsvp-intro__door--right"
              style={{ backgroundImage: `url(${RSVP_BACKGROUND_SRC})` }}
            />
          </div>
          <div className="rsvp-intro__light" aria-hidden="true" />
          <div className="rsvp-intro__stack">
            <p className="rsvp-intro__monogram">JD</p>
            <button
              type="button"
              className="rsvp-intro__cta"
              onClick={handleDismiss}
              aria-label="Open RSVP"
            >
              <img className="rsvp-intro__cta-image" src={RSVP_CTA_SRC} alt="Open RSVP" />
            </button>
            <p className="rsvp-intro__invite">
              You are Invited.
            </p>
          </div>
        </div>
      )}

      <div className="rsvp-intro__content">{children}</div>
    </div>
  );
}
