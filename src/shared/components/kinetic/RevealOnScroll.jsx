import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const VARIANTS = {
  fadeUp:    { hidden: { opacity: 0, y: 30 },    visible: { opacity: 1, y: 0 } },
  fadeIn:    { hidden: { opacity: 0 },             visible: { opacity: 1 } },
  fadeLeft:  { hidden: { opacity: 0, x: -30 },   visible: { opacity: 1, x: 0 } },
  fadeRight: { hidden: { opacity: 0, x: 30 },    visible: { opacity: 1, x: 0 } },
  scaleUp:   { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  slideDown: { hidden: { opacity: 0, y: -24 },   visible: { opacity: 1, y: 0 } },
};

export function RevealOnScroll({
  children,
  variant = 'fadeUp',
  delay = 0,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      variants={VARIANTS[variant] ?? VARIANTS.fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
