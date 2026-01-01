import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const INTRO_STORAGE_KEY = 'save-the-date:intro:seen';
const baseAssetPath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
const withBasePath = (path: string) =>
  `${baseAssetPath}${path.startsWith('/') ? path : `/${path}`}`;
const INTRO_VIDEO_SOURCES = [
  { src: withBasePath('/videos/save-the-date-intro.mp4'), type: 'video/mp4' },
  { src: withBasePath('/videos/save-the-date-intro.webm'), type: 'video/webm' },
  { src: withBasePath('/videos/save-the-date-intro.mov'), type: 'video/quicktime' },
];
const INTRO_POSTER_SRC = withBasePath('/images/ceremony.jpg');
const OVERLAY_FADE_DURATION_MS = 1500;
const CONTENT_REVEAL_DURATION_MS = 1500;
const VIDEO_DURATION_FALLBACK_SEC = 5;

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
  const [videoReady, setVideoReady] = useState(!shouldPlayIntro);
  const fadeTimeoutRef = useRef<number | null>(null);
  const hasMarkedViewRef = useRef(!shouldPlayIntro);
  const hasStartedPlaybackRef = useRef(!shouldPlayIntro);
  const revealStartedRef = useRef(!shouldPlayIntro);
  const videoDurationRef = useRef<number>(VIDEO_DURATION_FALLBACK_SEC);
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
    revealStartedRef.current = true;
    setContentVisible(true);
    setVideoPhase('hidden');
  }, [markIntroSeen]);

  useEffect(() => {
    if (!shouldPlayIntro) return;
    if (typeof document === 'undefined') return;
    const probe = document.createElement('video');
    const hasSupportedSource = INTRO_VIDEO_SOURCES.some((source) =>
      source.type ? probe.canPlayType(source.type) !== '' : true,
    );
    if (!hasSupportedSource) {
      skipIntro();
    }
  }, [shouldPlayIntro, skipIntro]);

  const startFadeOut = useCallback(() => {
    if (videoPhase !== 'playing') {
      setVideoPhase('hidden');
      return;
    }
    setVideoPhase('fading');
    fadeTimeoutRef.current = window.setTimeout(() => {
      setVideoPhase('hidden');
    }, OVERLAY_FADE_DURATION_MS);
  }, [videoPhase]);

  const beginReveal = useCallback(() => {
    if (revealStartedRef.current) return;
    revealStartedRef.current = true;
    setContentVisible(true);
    startFadeOut();
  }, [startFadeOut]);

  const handleVideoEnd = useCallback(() => {
    markIntroSeen();
    beginReveal();
    const node = videoRef.current;
    if (node) {
      node.pause();
      if (Number.isFinite(node.duration)) {
        node.currentTime = node.duration;
      }
    }
  }, [markIntroSeen, beginReveal]);

  const handleVideoPlay = useCallback(() => {
    markIntroSeen();
    hasStartedPlaybackRef.current = true;
    setVideoReady(true);
  }, [markIntroSeen]);

  const handleLoadedMetadata = useCallback(() => {
    const node = videoRef.current;
    if (!node) return;
    if (Number.isFinite(node.duration) && node.duration > 0) {
      videoDurationRef.current = node.duration;
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!shouldPlayIntro) return;
    if (revealStartedRef.current) return;
    const node = videoRef.current;
    if (!node) return;
    const durationSec =
      Number.isFinite(node.duration) && node.duration > 0
        ? node.duration
        : videoDurationRef.current;
    const threshold = Math.max(durationSec - CONTENT_REVEAL_DURATION_MS / 1000, 0);
    if (node.currentTime >= threshold) {
      beginReveal();
    }
  }, [shouldPlayIntro, beginReveal]);

  useEffect(() => {
    if (!shouldPlayIntro) return;
    if (autoplayBlocked) return;
    const node = videoRef.current;
    if (!node) return;
    node.muted = true;
    node.defaultMuted = true;
    node.playsInline = true;
    node.setAttribute('playsinline', '');
    node.setAttribute('webkit-playsinline', '');
    node.setAttribute('muted', '');
    node.setAttribute('autoplay', '');
    const playPromise = node.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        setAutoplayBlocked(true);
      });
    }
  }, [shouldPlayIntro, autoplayBlocked]);

  useEffect(() => {
    if (!shouldPlayIntro) return;
    if (hasStartedPlaybackRef.current) return;
    if (autoplayBlocked) return;
    const timeout = window.setTimeout(() => {
      if (!hasStartedPlaybackRef.current) {
        setAutoplayBlocked(true);
      }
    }, 1500);
    return () => window.clearTimeout(timeout);
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
            className={
              videoReady
                ? 'save-date-intro__video save-date-intro__video--visible'
                : 'save-date-intro__video'
            }
            playsInline
            muted
            autoPlay
            preload="auto"
            poster={INTRO_POSTER_SRC}
            tabIndex={-1}
            onEnded={handleVideoEnd}
            onError={skipIntro}
            onPlay={handleVideoPlay}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            disablePictureInPicture
            controls={false}
            aria-hidden="true"
            disableRemotePlayback
          >
            {INTRO_VIDEO_SOURCES.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
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
