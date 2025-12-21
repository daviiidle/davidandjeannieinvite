import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface UseScrollRevealOptions {
  duration?: number;
  delay?: number;
  yOffset?: number;
}

export function useScrollReveal(
  ref: RefObject<HTMLElement>,
  options: UseScrollRevealOptions = {}
) {
  const {
    duration = 0.8,
    delay = 0,
    yOffset = 12,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip animation, show final state immediately
      gsap.set(element, { opacity: 1, y: 0 });
      return;
    }

    // Set initial state
    gsap.set(element, { opacity: 0, y: yOffset });

    // Create scroll-triggered animation
    const animation = gsap.to(element, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%', // Start animation when top of element is 85% down the viewport
        toggleActions: 'play none none none', // Only play once
        once: true, // Animation only happens once
      },
    });

    // Cleanup
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [ref, duration, delay, yOffset]);
}
