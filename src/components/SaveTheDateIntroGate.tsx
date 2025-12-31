import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const INTRO_STORAGE_KEY = 'save-the-date:intro:seen';
const INTRO_VIDEO_SRC = '/videos/save-the-date-intro.mov';
const INTRO_POSTER_SRC = '/images/ceremony.jpg';
const FADE_DURATION_MS = 600;

type IntroPhase = 'playing' | 'fading' | 'hidden';

interface SaveTheDateIntroGateProps {
  children: ReactNode;
}

const shouldRespectReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
};

const shouldPlayIntroVideo = () => {
  if (typeof window === 'undefined') return false;
  try {
    if (sessionStorage.getItem(INTRO_STORAGE_KEY) === 'true') {
      return false;
    }
  } catch {
    // Ignore storage read errors and default to playing the intro.
  }
  return !shouldRespectReducedMotion();
};

export function SaveTheDateIntroGate({ children }: SaveTheDateIntroGateProps) {
  const [shouldPlayIntro] = useState(() => shouldPlayIntroVideo());
  const [videoPhase, setVideoPhase] = useState<IntroPhase>(
    shouldPlayIntro ? 'playing' : 'hidden',
  );
  const [contentVisible, setContentVisible] = useState(!shouldPlayIntro);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const fadeTimeoutRef = useRef<number | null>(null);
  const hasMarkedViewRef = useRef(!shouldPlayIntro);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const markIntroSeen = useCallback(() => {
    if (hasMarkedViewRef.current) return;
    hasMarkedViewRef.current = true;
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage write failures (private browsing, etc).
    }
  }, []);

  const skipIntro = useCallback(() => {
    markIntroSeen();
    setContentVisible(true);
    setVideoPhase('hidden');
  }, [markIntroSeen]);

  const startFadeOut = useCallback(() => {
    if (videoPhase !== 'playing') {
      setVideoPhase('hidden');
      return;
    }
    setVideoPhase('fading');
    fadeTimeoutRef.current = window.setTimeout(() => {
      setVideoPhase('hidden');
    }, FADE_DURATION_MS);
  }, [videoPhase]);

  const handleVideoEnd = useCallback(() => {
    markIntroSeen();
    setContentVisible(true);
    startFadeOut();
  }, [markIntroSeen, startFadeOut]);

  const handleVideoPlay = useCallback(() => {
    markIntroSeen();
  }, [markIntroSeen]);

  useEffect(() => {
    if (!shouldPlayIntro) return;
    if (autoplayBlocked) return;
    const node = videoRef.current;
    if (!node) return;
    const playPromise = node.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        setAutoplayBlocked(true);
      });
    }
  }, [shouldPlayIntro, autoplayBlocked]);

  const isOverlayVisible = videoPhase !== 'hidden';

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (isOverlayVisible) {
      root.setAttribute('data-save-date-intro', 'active');
      return () => {
        root.removeAttribute('data-save-date-intro');
      };
    }
    root.removeAttribute('data-save-date-intro');
  }, [isOverlayVisible]);

  return (
    <div className="save-date-intro" data-intro-active={isOverlayVisible}>
      {isOverlayVisible && (
        <div
          className={
            videoPhase === 'fading'
              ? 'save-date-intro__overlay save-date-intro__overlay--fade'
              : 'save-date-intro__overlay'
          }
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            className="save-date-intro__video"
            src={INTRO_VIDEO_SRC}
            playsInline
            muted
            autoPlay
            preload="auto"
            poster={INTRO_POSTER_SRC}
            tabIndex={-1}
            onEnded={handleVideoEnd}
            onError={skipIntro}
            onPlay={handleVideoPlay}
            disablePictureInPicture
          />
          {autoplayBlocked && (
            <button
              type="button"
              className="save-date-intro__manual-cta"
              onClick={() => {
                setAutoplayBlocked(false);
                const node = videoRef.current;
                if (!node) return;
                node.muted = true;
                node.playsInline = true;
                node.play().catch(() => {
                  skipIntro();
                });
              }}
            >
              Tap to play the intro
            </button>
          )}
        </div>
      )}

      <div
        className={
          contentVisible
            ? 'save-date-intro__content save-date-intro__content--visible'
            : 'save-date-intro__content'
        }
        aria-hidden={!contentVisible}
      >
        {children}
      </div>
    </div>
  );
}
