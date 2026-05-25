import './MarqueeRow.css';

/**
 * Infinite horizontal marquee.
 * Items are duplicated so the loop is seamless.
 */
export function MarqueeRow({
  items = [],
  speed = '40s',
  reverse = false,
  className = '',
  gap = 20,
}) {
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div className={`marquee-wrapper ${className}`} aria-hidden="true">
      <div
        className={`marquee-track${reverse ? ' marquee-reverse' : ''}`}
        style={{ '--marquee-speed': speed, '--marquee-gap': `${gap}px` }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="marquee-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
