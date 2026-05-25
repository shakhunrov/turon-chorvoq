import { useLang } from '../../shared/i18n';
import {
  TextSplit,
  GradientBlob,
  StaggerGrid,
  staggerItem,
  RevealOnScroll,
  TiltCard,
  TimelineRail,
} from '../../shared/components/kinetic';
import { motion } from 'framer-motion';
import './AboutWhyTis.css';

export default function AboutWhyTis() {
  const { t } = useLang();
  const w = t.about.whyTis;

  const unifiedSteps = w.unifiedItems.map((item) => ({
    title: item.title,
    text:  item.desc,
  }));

  return (
    <div className="page wt-page">
      {/* ── Hero ── */}
      <div className="wt-hero">
        <GradientBlob position="top-right" color="blue" size={380} opacity={0.14} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Biz haqimizda
          </motion.span>
          <TextSplit text={w.title} as="h1" className="section-title" style={{ marginTop: 12 }} />
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>

      <section className="section">
        <div className="container">

          {/* ── Differentiators intro ── */}
          <RevealOnScroll variant="fadeUp">
            <div className="differ-intro glass-card">
              <h2 className="differ-title">{w.differTitle}</h2>
              <p className="differ-text">{w.differText}</p>
            </div>
          </RevealOnScroll>

          {/* ── Differ grid with TiltCard ── */}
          <StaggerGrid className="differ-grid" stagger={0.08}>
            {w.differItems.map((item, i) => (
              <motion.div key={i} variants={staggerItem}>
                <TiltCard className="differ-card glass-card" intensity={6}>
                  <div className="differ-num">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="differ-card-title">{item.title}</h3>
                  <ul className="differ-list">
                    {item.items.map((p, j) => (
                      <li key={j}><span className="differ-dot" />{p}</li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            ))}
          </StaggerGrid>

          {/* ── Pedagogical Strengths ── */}
          <div className="ped-section">
            <RevealOnScroll>
              <h2 className="section-title">{w.pedTitle}</h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: 32 }}>{w.pedText}</p>
            </RevealOnScroll>
            <StaggerGrid className="ped-grid" stagger={0.06}>
              {w.pedItems.map((p, i) => (
                <motion.div key={i} className="ped-card glass-card" variants={staggerItem}>
                  <div className="ped-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="ped-text">{p}</div>
                </motion.div>
              ))}
            </StaggerGrid>
          </div>

          {/* ── Unified Academic Approach → Timeline ── */}
          <div className="unified-section">
            <RevealOnScroll>
              <h2 className="section-title">{w.unifiedTitle}</h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: 32 }}>{w.unifiedText}</p>
            </RevealOnScroll>
            <TimelineRail steps={unifiedSteps} />
          </div>

        </div>
      </section>
    </div>
  );
}
