import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

/* ─── Shared Framer Motion variants ─────────────────────────────────────── */

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.70, ease: [0.23, 1, 0.32, 1] },
  },
};

export const slideRight = {
  hidden: { opacity: 0, x: 56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.70, ease: [0.23, 1, 0.32, 1] },
  },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.90 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
  },
};

/** Container that staggers its direct children */
export const staggerContainer = (stagger = 0.10, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

/** Individual stagger child — rises up */
export const staggerChild = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.60, ease: [0.23, 1, 0.32, 1] },
  },
};

/** Individual stagger child — scales in */
export const staggerChildScale = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
  },
};

/* ─── Hook: trigger Framer Motion variants once when in view ────────────── */
export function useAnimateOnScroll(threshold = 0.15) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, animate: isInView ? 'visible' : 'hidden' };
}

/* ─── Hook: count up a number when element enters viewport ──────────────── */
export function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    // Extract numeric part and suffix (e.g. "500+" → 500 & "+")
    const numericTarget = parseInt(String(target).replace(/\D/g, ''), 10) || 0;
    const suffix = String(target).replace(/[\d,]/g, '');

    if (numericTarget === 0) {
      setCount(target);
      return;
    }

    const startTime = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOut(progress) * numericTarget);
      setCount(current + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return { ref, count: hasStarted.current ? count : '0' };
}

/* ─── Hook: split text into word spans for staggered reveal ─────────────── */
export function splitWords(text) {
  if (!text) return [];
  return String(text).split(' ').filter(Boolean);
}
