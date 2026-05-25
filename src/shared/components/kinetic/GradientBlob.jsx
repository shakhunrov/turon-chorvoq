const COLORS = {
  blue:    'rgba(37,  99,  235, 1)',
  gold:    'rgba(245, 158, 11,  1)',
  purple:  'rgba(168, 85,  247, 1)',
  cyan:    'rgba(14,  165, 233, 1)',
  emerald: 'rgba(16,  185, 129, 1)',
  red:     'rgba(239, 68,  68,  1)',
};

const POS = (size) => ({
  'top-right':    { top: -size * 0.4, right: -size * 0.4 },
  'top-left':     { top: -size * 0.4, left:  -size * 0.4 },
  'bottom-right': { bottom: -size * 0.4, right: -size * 0.4 },
  'bottom-left':  { bottom: -size * 0.4, left:  -size * 0.4 },
  'center-right': { top: '20%', right: -size * 0.3 },
  'center-left':  { top: '20%', left:  -size * 0.3 },
});

/**
 * Decorative ambient blob. Parent must have `position: relative; overflow: hidden`.
 */
export function GradientBlob({
  position = 'top-right',
  color = 'blue',
  size = 400,
  opacity = 0.14,
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        borderRadius: '50%',
        width: size,
        height: size,
        background: `radial-gradient(ellipse, ${COLORS[color] ?? COLORS.blue} 0%, transparent 70%)`,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
        ...POS(size)[position],
      }}
    />
  );
}
