import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Splits `text` into words and staggers each in with a flip animation.
 * Works with any heading tag via the `as` prop.
 */
export function TextSplit({ text = '', as = 'h1', className = '', style = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const words = text.split(' ');

  // framer-motion has motion.h1 … motion.h6, motion.p, etc.
  const MotionTag = motion[as] ?? motion.h1;

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={{ ...style, perspective: 600 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', marginRight: '0.28em', backfaceVisibility: 'hidden' }}
          variants={{
            hidden:  { opacity: 0, y: 18, rotateX: -25 },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
