export interface HeroOpenerOptions {
  rootSelector: string;
  nameSelector: string;
  dateSelector?: string;
  dividerSelector?: string;
  backgroundSelector?: string;
  sessionKey?: string;
}

type GSAPTimeline = {
  fromTo: (
    targets: Element | Element[] | NodeListOf<Element>,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>,
    position?: number | string
  ) => GSAPTimeline;
  call: (callback: () => void) => GSAPTimeline;
};

type GlobalWithGSAP = typeof window & {
  gsap?: {
    timeline: (config?: Record<string, unknown>) => GSAPTimeline;
  };
};

export function initHeroOpener(options: HeroOpenerOptions): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const root = document.querySelector<HTMLElement>(options.rootSelector);
  if (!root) return;

  const nameEl = document.querySelector<HTMLElement>(options.nameSelector);
  if (!nameEl) return;

  const dateEl = options.dateSelector
    ? document.querySelector<HTMLElement>(options.dateSelector)
    : null;
  const dividerEl = options.dividerSelector
    ? document.querySelector<HTMLElement>(options.dividerSelector)
    : null;
  const backgroundEl = options.backgroundSelector
    ? document.querySelector<HTMLElement>(options.backgroundSelector)
    : null;

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    .matches ?? false;

  const sessionKey = options.sessionKey ?? 'hero-opener-session';
  const urlParams = new URLSearchParams(window.location.search);
  const wantsReplay = urlParams.get('replay') === '1';
  const hasPlayed = !wantsReplay && window.sessionStorage.getItem(sessionKey) === '1';

  root.classList.add('hero-opener');

  const letters = wrapLetters(nameEl);
  if (dateEl) dateEl.classList.add('hero-opener__date');
  if (dividerEl) dividerEl.classList.add('hero-opener__divider');
  if (backgroundEl) backgroundEl.classList.add('hero-opener__background');

  const complete = () => {
    root.classList.add('hero-opener-complete');
    window.sessionStorage.setItem(sessionKey, '1');
  };

  if (prefersReducedMotion || hasPlayed) {
    root.classList.add('hero-opener-ready');
    complete();
    return;
  }

  root.classList.add('hero-opener-ready');

  const gsap = (window as GlobalWithGSAP).gsap;
  if (gsap) {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (backgroundEl) {
      tl.fromTo(
        backgroundEl,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.6 },
        0
      );
    }

    tl.fromTo(
      letters,
      { y: '1.4em', opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.065 },
      0.15
    );

    if (dividerEl) {
      tl.fromTo(
        dividerEl,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7 },
        '-=0.35'
      );
    }

    if (dateEl) {
      tl.fromTo(
        dateEl,
        { y: '1em', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.2'
      );
    }

    tl.call(complete);
    return;
  }

  const animations: Promise<unknown>[] = [];

  if (backgroundEl) {
    animations.push(
      backgroundEl
        .animate(
          [
            { transform: 'scale(1.05)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 },
          ],
          {
            duration: 1600,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            fill: 'forwards',
          }
        )
        .finished.catch(() => undefined)
    );
  }

  letters.forEach((letter, index) => {
    animations.push(
      letter
        .animate(
          [
            { transform: 'translateY(1.4em)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          {
            duration: 950,
            delay: 200 + index * 60,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            fill: 'forwards',
          }
        )
        .finished.catch(() => undefined)
    );
  });

  if (dividerEl) {
    animations.push(
      dividerEl
        .animate(
          [
            { transform: 'scaleX(0)', opacity: 0 },
            { transform: 'scaleX(1)', opacity: 1 },
          ],
          {
            duration: 700,
            delay: 450,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            fill: 'forwards',
          }
        )
        .finished.catch(() => undefined)
    );
  }

  if (dateEl) {
    animations.push(
      dateEl
        .animate(
          [
            { transform: 'translateY(1em)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          {
            duration: 850,
            delay: 650,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            fill: 'forwards',
          }
        )
        .finished.catch(() => undefined)
    );
  }

  Promise.all(animations).finally(complete);
}

function wrapLetters(element: HTMLElement): HTMLSpanElement[] {
  const original = element.textContent ?? '';
  element.setAttribute('aria-label', original.trim());
  element.textContent = '';

  const spans: HTMLSpanElement[] = [];
  const fragment = document.createDocumentFragment();

  for (const char of original) {
    if (char === '\n') {
      frameBreak(fragment);
      continue;
    }
    const span = document.createElement('span');
    span.className = 'hero-opener__letter';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.setAttribute('aria-hidden', 'true');
    fragment.appendChild(span);
    spans.push(span);
  }

  element.appendChild(fragment);
  return spans;
}

function frameBreak(fragment: DocumentFragment) {
  const br = document.createElement('br');
  fragment.appendChild(br);

  const spacer = document.createElement('span');
  spacer.className = 'hero-opener__line-indent';
  spacer.setAttribute('aria-hidden', 'true');
  spacer.textContent = '\u00A0';
  fragment.appendChild(spacer);
}
