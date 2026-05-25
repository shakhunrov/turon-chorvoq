import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIReveal.css';

const MIN_SHOW_MS = 1400; // always show the AI effect for at least this long

/**
 * AI-style content reveal.
 * While `loading` is true (or during the minimum show window):
 *   • content is rendered but blurred (blur 10px)
 *   • a gold scanline sweeps top → bottom
 *   • "AI tahlil qilinmoqda…" label pulses in the corner
 * After reveal:
 *   • blur fades to 0, scanline exits, content sharpens
 */
export function AIReveal({ children, loading = false, label = 'AI tahlil qilinmoqda...' }) {
  const [revealed, setRevealed] = useState(false);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    // Reset when loading starts again
    if (loading) {
      setRevealed(false);
      mountTime.current = Date.now();
      return;
    }
    // Ensure the effect is visible for at least MIN_SHOW_MS
    const elapsed  = Date.now() - mountTime.current;
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
    const t = setTimeout(() => setRevealed(true), remaining);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className="ai-reveal-outer">
      {/* ── Overlay (scanline + label) ── */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="ai-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeOut' } }}
          >
            <div className="ai-scanline" />
            <div className="ai-scan-dots">
              <span /><span /><span />
            </div>
            <div className="ai-label">
              <span className="ai-label-dot" />
              {label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content (blurred → sharp) ── */}
      <motion.div
        className="ai-reveal-content"
        animate={{ filter: revealed ? 'blur(0px)' : 'blur(10px)', opacity: revealed ? 1 : 0.55 }}
        transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
