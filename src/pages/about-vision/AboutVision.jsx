import { useState, useEffect } from 'react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import {
  TextSplit,
  GradientBlob,
  AnimatedCounter,
  StaggerGrid,
  staggerItem,
  RevealOnScroll,
  TimelineRail,
  TiltCard,
} from '../../shared/components/kinetic';
import { motion } from 'framer-motion';
import './AboutVision.css';

/* ── SVG Icon components ── */
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const IconGlobeVis = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" x2="22" y1="12" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconLightbulb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconBookOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
  </svg>
);

const outcomeIconComponents = [
  <IconTarget />,
  <IconGlobeVis />,
  <IconLightbulb />,
  <IconUsers />,
  <IconBookOpen />,
  <IconTrophy />,
];

export default function AboutVision() {
  const { t, lang } = useLang();
  const v = t.about.vision;
  const branchId = localStorage.getItem('globalBranchId');

  const [sections, setSections] = useState({
    hero:     { label: 'Biz haqimizda', title: v.title },
    vision:   { title: v.vision, text: v.visionText },
    values:   { title: v.valuesTitle, values: v.values },
    outcomes: { title: v.outcomesTitle, outcomes: v.outcomes },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'about-vision' });
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
  }, [branchId, lang, v]);

  const kpis = [
    { to: 500, suffix: '+', label: 'Graduates' },
    { to: 4,   suffix: '',  label: 'Languages' },
    { to: 12,  suffix: '+', label: 'Programs' },
    { to: 5,   suffix: '+', label: 'Years' },
  ];

  const outcomeSteps = sections.outcomes.outcomes.map((o, i) => ({
    text: o,
    icon: outcomeIconComponents[i] ?? <IconStar />,
  }));

  return (
    <div className="page vis-page">
      {/* ── Hero ── */}
      <div className="vis-hero">
        <GradientBlob position="top-right" color="blue" size={460} opacity={0.18} />
        <GradientBlob position="bottom-left" color="gold"  size={300} opacity={0.12} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {sections.hero.label}
          </motion.span>
          <TextSplit text={sections.hero.title} as="h1" className="section-title" style={{ marginTop: 12 }} />
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>

      <section className="section">
        <div className="container">

          {/* ── Vision block ── */}
          <RevealOnScroll variant="scaleUp">
            <div className="vision-block glass-card">
              <div className="vision-icon"><IconStar /></div>
              <h2 className="vision-block-title">{sections.vision.title}</h2>
              <p className="vision-text">{sections.vision.text}</p>
            </div>
          </RevealOnScroll>

          {/* ── KPI counters ── */}
          <RevealOnScroll variant="fadeUp" delay={0.1}>
            <div className="vision-kpi-row">
              {kpis.map((k, i) => (
                <div key={i} className="vision-kpi-card">
                  <div className="vision-kpi-num">
                    <AnimatedCounter to={k.to} suffix={k.suffix} duration={1600} />
                  </div>
                  <div className="vision-kpi-label">{k.label}</div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* ── Values ── */}
          <div className="vision-values-section">
            <RevealOnScroll>
              <h2 className="section-title">{sections.values.title}</h2>
              <div className="divider" />
            </RevealOnScroll>
            <StaggerGrid className="values-grid" stagger={0.07}>
              {sections.values.values.map((val, i) => (
                <motion.div key={i} className="value-tag glass-card" variants={staggerItem}>
                  <TiltCard style={{ width: '100%' }}>
                    <span className="value-dot" />
                    {val}
                  </TiltCard>
                </motion.div>
              ))}
            </StaggerGrid>
          </div>

          {/* ── Student Outcomes → Timeline ── */}
          <div className="outcomes-section">
            <RevealOnScroll>
              <h2 className="section-title">{sections.outcomes.title}</h2>
              <div className="divider" />
            </RevealOnScroll>
            <div style={{ marginTop: 32 }}>
              <TimelineRail steps={outcomeSteps} />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
