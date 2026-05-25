import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function StaggerGrid({
  children,
  className = '',
  stagger = 0.08,
  margin = '-40px',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

/** Apply this to direct children of <StaggerGrid> */
export const staggerItem = {
  hidden:  { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
  },
};
