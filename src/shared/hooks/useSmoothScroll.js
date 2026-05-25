import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Initialises Lenis smooth-scroll for the entire page.
 * - smoothWheel: true  → buttery mouse-wheel on desktop
 * - smoothTouch: false → keeps native momentum on mobile (iOS/Android already feel smooth)
 * Automatically destroyed when the component that calls this unmounts.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
