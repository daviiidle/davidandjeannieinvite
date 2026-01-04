import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const baseAssetPath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
const withBasePath = (path: string) =>
  `${baseAssetPath}${path.startsWith('/') ? path : `/${path}`}`;
const RSVP_BACKGROUND_SRC = withBasePath(encodeURI('/images/envelope.png'));
const RSVP_CTA_SRC = withBasePath(encodeURI('/images/the golden button.png'));
const RSVP_INTRO_FADE_MS = 900;

type IntroPhase = 'visible' | 'fading' | 'hidden';

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
    setPhase('fading');
    fadeTimeoutRef.current = window.setTimeout(() => {
      setPhase('hidden');
    }, RSVP_INTRO_FADE_MS);
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
          className={
            phase === 'fading'
              ? 'rsvp-intro__overlay rsvp-intro__overlay--fade'
              : 'rsvp-intro__overlay'
          }
          style={{ transitionDuration: `${RSVP_INTRO_FADE_MS}ms` }}
        >
          <img
            className="rsvp-intro__background"
            src={RSVP_BACKGROUND_SRC}
            alt=""
            aria-hidden="true"
          />
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
