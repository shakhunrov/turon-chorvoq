import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import {
  TextSplit,
  GradientBlob,
  AnimatedCounter,
  StaggerGrid,
  staggerItem,
  RevealOnScroll,
  TiltCard,
  TimelineRail,
} from '../../shared/components/kinetic';
import './Partnerships.css';

/* ── SVG Icon components ── */
const IconGraduationCap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const IconFactory = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
    <path d="M17 18h1"/>
    <path d="M12 18h1"/>
    <path d="M7 18h1"/>
  </svg>
);

const IconGlobePrt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" x2="22" y1="12" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconPartners = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconSparkles = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);

export default function Partnerships() {
  const { t, lang } = useLang();
  const p = t.partnerships;
  const branchId = localStorage.getItem('globalBranchId');

  const [sections, setSections] = useState({
    hero:          { label: 'Global tarmoq', title: p.title, subtitle: p.subtitle },
    stats:         { stats: p.stats },
    network:       { title: p.networkTitle, subtitle: p.networkSubtitle, categories: p.categories },
    opportunities: { title: p.oppTitle, opps: p.opps },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'partnerships' });
        if (data && data.length > 0) {
          const loadedSections = {};
          data.forEach(section => {
            try {
              const contentField = `content_${lang}`;
              let content = section[contentField];
              if (typeof content === 'string') content = JSON.parse(content);
              if (content && Object.keys(content).length > 0)
                loadedSections[section.section_id] = content;
            } catch (e) {
              console.error(`Section ${section.section_id} parse error:`, e);
            }
          });
          setSections(prev => ({ ...prev, ...loadedSections }));
        }
      } catch (error) {
        console.error("Section ma'lumotlarini yuklashda xatolik:", error);
      }
    };
    loadSections();
  }, [branchId, lang, p]);

  const catIconFallbacks = [
    <IconGraduationCap />,
    <IconFactory />,
    <IconGlobePrt />,
    <IconPartners />,
  ];

  const oppSteps = sections.opportunities.opps.map((o) => ({ text: o, icon: <IconSparkles /> }));

  return (
    <div className="page prt-page">
      {/* ── Hero ── */}
      <div className="prt-hero">
        <GradientBlob position="top-right"  color="cyan"  size={380} opacity={0.16} />
        <GradientBlob position="bottom-left" color="blue" size={260} opacity={0.10} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {sections.hero.label}
          </motion.span>
          <TextSplit text={sections.hero.title} as="h1" className="section-title" style={{ marginTop: 12 }} />
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            style={{ transformOrigin: 'left' }}
          />
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
          >
            {sections.hero.subtitle}
          </motion.p>
        </div>
      </div>

      <section className="section">
        <div className="container">

          {/* ── Stats with AnimatedCounter ── */}
          <StaggerGrid className="partner-stats" stagger={0.09}>
            {sections.stats.stats.map((s, idx) => (
              <motion.div key={idx} className="partner-stat glass-card" variants={staggerItem}>
                <div className="partner-stat-val">
                  <AnimatedCounter
                    to={parseInt(s.val) || 0}
                    suffix={s.val?.replace(/[0-9]/g, '') || ''}
                    duration={1800}
                  />
                </div>
                <div className="partner-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </StaggerGrid>

          {/* ── Network categories ── */}
          <div className="partner-network">
            <RevealOnScroll>
              <h2 className="section-title">{sections.network.title}</h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: 48 }}>{sections.network.subtitle}</p>
            </RevealOnScroll>
            <StaggerGrid className="partner-grid" stagger={0.08}>
              {sections.network.categories.map((cat, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <TiltCard className="partner-card glass-card" intensity={7}>
                    <div className="partner-card-icon">
                      {cat.icon || catIconFallbacks[i] || <IconSparkles />}
                    </div>
                    <h3 className="partner-card-title">{cat.title}</h3>
                    <p className="partner-card-desc">{cat.desc}</p>
                  </TiltCard>
                </motion.div>
              ))}
            </StaggerGrid>
          </div>

          {/* ── Opportunities → Timeline ── */}
          <div className="opp-section">
            <RevealOnScroll>
              <h2 className="section-title">{sections.opportunities.title}</h2>
              <div className="divider" style={{ marginBottom: 32 }} />
            </RevealOnScroll>
            <TimelineRail steps={oppSteps} />
          </div>

        </div>
      </section>
    </div>
  );
}
