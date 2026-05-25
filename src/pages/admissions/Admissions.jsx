import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../shared/i18n';
import AdmissionModal from '../../features/admission-modal/AdmissionModal';
import {
  TextSplit,
  GradientBlob,
  RevealOnScroll,
  TimelineRail,
  StaggerGrid,
  staggerItem,
} from '../../shared/components/kinetic';
import './Admissions.css';

/* ── SVG Icon components ── */
const IconClipboard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="4" x="8" y="2" rx="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const IconSchool = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
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

const IconGraduationCap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" x2="22" y1="12" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/>
  </svg>
);

const IconAward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

export default function Admissions() {
  const { t } = useLang();
  const a = t.admissions;
  const [showModal, setShowModal] = useState(false);

  const heroChips = [
    { icon: <IconClipboard />, text: '5-step process' },
    { icon: <IconClock />,     text: 'Apply in 10 min' },
    { icon: <IconCalendar />,  text: 'Fall 2026 open' },
  ];

  const timelineSteps = a.steps.map((step) => ({ text: step }));

  const benefits = [
    { icon: <IconGraduationCap />, title: 'IB Curriculum',  desc: 'Internationally recognised qualification' },
    { icon: <IconGlobe />,         title: 'Native Teachers', desc: 'World-class educators from 12+ countries' },
    { icon: <IconBuilding />,      title: 'Modern Campus',   desc: 'State-of-the-art facilities in Chorvoq' },
    { icon: <IconAward />,         title: 'Scholarships',    desc: 'Merit-based financial support available' },
  ];

  return (
    <div className="page adm-page">
      {/* ── Hero ── */}
      <div className="adm-page-hero">
        <GradientBlob position="top-right"  color="purple" size={360} opacity={0.14} />
        <GradientBlob position="bottom-left" color="blue"  size={240} opacity={0.09} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Ro'yxatdan o'tish
          </motion.span>
          <TextSplit text={a.title} as="h1" className="section-title" style={{ marginTop: 12 }} />
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
            {a.subtitle}
          </motion.p>
          {/* Hero chips */}
          <motion.div
            className="adm-hero-chips"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.65 }}
          >
            {heroChips.map((chip, i) => (
              <span key={i} className="adm-hero-chip">
                {chip.icon}
                {chip.text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <section className="section">
        <div className="container admissions-center">

          {/* ── School card ── */}
          <RevealOnScroll variant="scaleUp">
            <div className="school-card glass-card">
              <div className="school-card-img">
                <IconSchool />
              </div>
              <div className="school-card-body">
                <h2 className="school-card-name">{a.schoolCard.name}</h2>
                <div className="school-card-infos">
                  <div className="school-card-info">
                    <span className="info-icon"><IconMapPin /></span>
                    <span>{a.schoolCard.location}</span>
                  </div>
                  <div className="school-card-info">
                    <span className="info-icon"><IconUsers /></span>
                    <span>{a.schoolCard.ageRange}</span>
                  </div>
                  <div className="school-card-info">
                    <span className="info-icon"><IconBookOpen /></span>
                    <span>{a.schoolCard.curriculum}</span>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                  onClick={() => setShowModal(true)}
                >
                  {a.applyBtn} →
                </button>
              </div>
            </div>
          </RevealOnScroll>

          {/* ── How to apply → Timeline ── */}
          <div className="admission-steps">
            <RevealOnScroll>
              <h2 className="section-title">{a.howToApply}</h2>
              <div className="divider" style={{ marginBottom: 32 }} />
            </RevealOnScroll>
            <TimelineRail steps={timelineSteps} />
          </div>

          {/* ── Benefits grid ── */}
          {/*<div className="adm-benefits-section">*/}
          {/*  <RevealOnScroll>*/}
          {/*    <h2 className="section-title">What You'll Get</h2>*/}
          {/*    <div className="divider" style={{ marginBottom: 32 }} />*/}
          {/*  </RevealOnScroll>*/}
          {/*  <StaggerGrid className="adm-benefits-grid" stagger={0.08}>*/}
          {/*    {benefits.map((b, i) => (*/}
          {/*      <motion.div key={i} className="adm-benefit-card glass-card" variants={staggerItem}>*/}
          {/*        <div className="adm-benefit-icon">{b.icon}</div>*/}
          {/*        <h3 className="adm-benefit-title">{b.title}</h3>*/}
          {/*        <p className="adm-benefit-desc">{b.desc}</p>*/}
          {/*      </motion.div>*/}
          {/*    ))}*/}
          {/*  </StaggerGrid>*/}
          {/*</div>*/}

        </div>
      </section>

      {showModal && <AdmissionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
