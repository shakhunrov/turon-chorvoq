import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Wraps children with a subtle 3-D tilt that follows the mouse.
 * On touch devices the tilt is a no-op (springs reset to 0).
 */
export function TiltCard({
  children,
  className = '',
  style = {},
  intensity = 7,
  scaleOnHover = 1.02,
}) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 200, damping: 28, mass: 0.5 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);
  const scaleSpring = useSpring(1, spring);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
    scaleSpring.set(scaleOnHover);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
    scaleSpring.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, scale: scaleSpring, transformStyle: 'preserve-3d', ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
