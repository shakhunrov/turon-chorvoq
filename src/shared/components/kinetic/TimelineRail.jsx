import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './TimelineRail.css';

/** Single animated step — own component so each has its own useInView ref */
function TimelineStep({ step, index, isLast }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const content = typeof step === 'string' ? { text: step } : step;

  return (
    <motion.div
      ref={ref}
      className="tl-step"
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: Math.min(index * 0.07, 0.35) }}
    >
      {/* Rail column */}
      <div className="tl-rail">
        <div className="tl-dot">
          <span className="tl-dot-num">{String(index + 1).padStart(2, '0')}</span>
        </div>
        {!isLast && <div className="tl-connector" />}
      </div>

      {/* Content column */}
      <div className="tl-body">
        {content.icon && <div className="tl-icon">{content.icon}</div>}
        {content.title && <h4 className="tl-title">{content.title}</h4>}
        {content.text  && <p  className="tl-text">{content.text}</p>}
      </div>
    </motion.div>
  );
}

export function TimelineRail({ steps = [] }) {
  return (
    <div className="timeline-rail">
      {steps.map((step, i) => (
        <TimelineStep key={i} step={step} index={i} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}
