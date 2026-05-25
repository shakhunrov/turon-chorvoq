import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import directorImg from '../../shared/assets/img/director.png';
import { AIReveal, StaggerGrid, staggerItem, RevealOnScroll, AnimatedCounter } from '../../shared/components/kinetic';
import './AboutLeadership.css';

/* ── Single teacher card ── */
function TeacherCard({ member, index }) {
  const avatarColors = [
    'linear-gradient(135deg,#0F172A 0%,#1E3A8A 100%)',
    'linear-gradient(135deg,#1a0e00 0%,#78350F 100%)',
    'linear-gradient(135deg,#0F172A 0%,#4C1D95 100%)',
    'linear-gradient(135deg,#052e16 0%,#065F46 100%)',
    'linear-gradient(135deg,#1a0e00 0%,#B45309 100%)',
    'linear-gradient(135deg,#0c1e3d 0%,#1E40AF 100%)',
  ];
  const bg = avatarColors[index % avatarColors.length];

  return (
    <motion.div className="ls-teacher-card" variants={staggerItem}>
      {/* Photo area */}
      <div className="ls-teacher-photo" style={{ '--card-bg': bg }}>
        {/* Decorative grid overlay */}
        <div className="ls-teacher-photo-grid" />
        {/* Glow orb */}
        <div className="ls-teacher-glow" />
        {/* Avatar */}
        <div className="ls-teacher-avatar-ring">
          {typeof member.avatar === 'string' && member.avatar.startsWith('http') ? (
            <img src={member.avatar} alt={member.name} className="ls-teacher-real-img" />
          ) : (
            <span className="ls-teacher-emoji">
              {typeof member.avatar === 'string' && !member.avatar.startsWith('http') ? member.avatar : '👤'}
            </span>
          )}
        </div>
        {/* Gold corner accent */}
        <div className="ls-teacher-corner-badge">
          <span>✦</span>
        </div>
      </div>

      {/* Info area */}
      <div className="ls-teacher-info">
        <div className="ls-teacher-index">
          {String(index + 1).padStart(2, '0')}
        </div>
        <h3 className="ls-teacher-name">{member.name}</h3>
        <div className="ls-teacher-role">{member.role}</div>
        <div className="ls-teacher-divider" />
        <div className="ls-teacher-dept">
          Advisory Board • Turon International School
        </div>
      </div>

      {/* Hover glow border */}
      <div className="ls-teacher-hover-border" />
    </motion.div>
  );
}

export default function AboutLeadership() {
  const { t, lang } = useLang();
  const l = t.about.leadership;
  const branchId = localStorage.getItem('globalBranchId');
  const [apiLoading, setApiLoading] = useState(true);

  const [sections, setSections] = useState({
    hero:     { label: 'Biz haqimizda', title: l.title },
    director: {
      name:    l.directorName,
      title:   l.directorTitle,
      message: l.directorMessage,
      image:   directorImg,
    },
    board: {
      title:   l.boardTitle,
      desc:    l.boardDesc,
      members: [
        { name: 'Board Member 1', role: 'Academic Advisor' },
        { name: 'Board Member 2', role: 'Academic Advisor' },
        { name: 'Board Member 3', role: 'Academic Advisor' },
        { name: 'Board Member 4', role: 'Academic Advisor' },
      ],
    },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'about-leadership' });
        if (data && data.length > 0) {
          const loaded = {};
          data.forEach(section => {
            try {
              const key = `content_${lang}`;
              let content = section[key];
              if (typeof content === 'string') content = JSON.parse(content);
              if (content && Object.keys(content).length > 0) {
                loaded[section.section_id] = content;
                if (section.image) loaded[section.section_id].image = section.image;
              }
            } catch (e) {
              console.error(`Section ${section.section_id} parse error:`, e);
            }
          });
          setSections(prev => ({ ...prev, ...loaded }));
        }
      } catch (err) {
        console.error("Leadership sections load error:", err);
      } finally {
        setApiLoading(false);
      }
    };
    loadSections();
  }, [branchId, lang, l]);

  const directorPhoto = typeof sections.director.image === 'string'
    ? sections.director.image
    : directorImg;

  const kpis = [
    { to: 15, suffix: '+', label: "Yil tajriba" },
    { to: 8,  suffix: '+', label: "Mukofotlar" },
    { to: 12, suffix: '', label: "Mamlakatlar" },
  ];

  return (
    <div className="page ls-page">

      {/* ════════════════════════════════════════
          CINEMATIC HERO
      ════════════════════════════════════════ */}
      <div className="ls-hero">
        {/* Animated background grid */}
        <div className="ls-hero-mesh" />
        {/* Gold ambient orbs */}
        <div className="ls-orb ls-orb-1" />
        <div className="ls-orb ls-orb-2" />

        <div className="container ls-hero-inner">
          {/* Left: director photo */}
          <motion.div
            className="ls-hero-photo-col"
            initial={{ opacity: 0, x: -48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="ls-director-frame">
              {/* Animated gold rings */}
              <div className="ls-ring ls-ring-1" />
              <div className="ls-ring ls-ring-2" />
              <div className="ls-ring ls-ring-3" />
              <img
                src={directorPhoto}
                alt={sections.director.name}
                className="ls-director-photo"
              />
            </div>
            {/* Floating role badge */}
            <motion.div
              className="ls-hero-role-badge"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.55 }}
            >
              <span className="ls-role-dot" />
              {sections.director.title}
            </motion.div>
          </motion.div>

          {/* Right: name + stats */}
          <div className="ls-hero-text-col">
            <motion.span
              className="ls-eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              {sections.hero.label}
            </motion.span>

            <motion.h1
              className="ls-hero-name"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {sections.director.name}
            </motion.h1>

            <motion.div
              className="ls-hero-title-line"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.55 }}
              style={{ transformOrigin: 'left' }}
            />

            <motion.p
              className="ls-hero-subtitle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              {sections.hero.title}
            </motion.p>

            {/* KPI chips */}
            {/*<motion.div*/}
            {/*  className="ls-hero-kpis"*/}
            {/*  initial={{ opacity: 0, y: 20 }}*/}
            {/*  animate={{ opacity: 1, y: 0 }}*/}
            {/*  transition={{ duration: 0.6, delay: 0.8 }}*/}
            {/*>*/}
            {/*  {kpis.map((k, i) => (*/}
            {/*    <div key={i} className="ls-kpi-chip">*/}
            {/*      <span className="ls-kpi-num">*/}
            {/*        <AnimatedCounter to={k.to} suffix={k.suffix} duration={1600} />*/}
            {/*      </span>*/}
            {/*      <span className="ls-kpi-label">{k.label}</span>*/}
            {/*    </div>*/}
            {/*  ))}*/}
            {/*</motion.div>*/}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="ls-scroll-hint"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          ↓
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          DIRECTOR QUOTE SECTION
      ════════════════════════════════════════ */}
      <div className="ls-quote-section">
        <RevealOnScroll variant="scaleUp">
          <div className="ls-quote-card">
            {/* Giant gold quote marks */}
            <div className="ls-giant-quote">"</div>

            <div className="ls-quote-inner">
              <p className="ls-quote-text">
                {sections.director.message}
              </p>
              <div className="ls-quote-sig">
                <div className="ls-sig-line" />
                <div>
                  <div className="ls-sig-name">{sections.director.name}</div>
                  <div className="ls-sig-role">{sections.director.title}</div>
                </div>
              </div>
            </div>

            {/* Bottom gold strip */}
            <div className="ls-quote-bottom-strip" />
          </div>
        </RevealOnScroll>
      </div>

      {/* ════════════════════════════════════════
          BOARD DESCRIPTION
      ════════════════════════════════════════ */}
      <section className="ls-board-intro-section">
        <div className="container">
          <RevealOnScroll variant="fadeUp">
            <div className="ls-board-intro">
              <div className="ls-board-intro-left">
                <span className="ls-section-eyebrow">Bizning Jamoamiz</span>
                <h2 className="ls-board-title">{sections.board.title}</h2>
              </div>
              <p className="ls-board-desc-text">{sections.board.desc}</p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TEACHER CARDS WITH AI REVEAL
      ════════════════════════════════════════ */}
      <section className="ls-teachers-section">
        <div className="container">
          <AIReveal loading={apiLoading} label="O'qituvchilar ma'lumotlari yuklanmoqda...">
            <StaggerGrid className="ls-teachers-grid" stagger={0.10}>
              {sections.board.members.map((member, i) => (
                <TeacherCard key={i} member={member} index={i} />
              ))}
            </StaggerGrid>
          </AIReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <RevealOnScroll variant="scaleUp">
            <div className="ls-cta-banner">
              <div className="ls-cta-mesh" />
              <div className="ls-cta-orb" />
              <div className="ls-cta-inner">
                <h2 className="ls-cta-title">Jamoamiz bilan bog'laning</h2>
                <p className="ls-cta-sub">Savollaringiz bormi? Biz har doim yordam berishga tayyormiz.</p>
                <a href="/contact" className="btn btn-primary ls-cta-btn">
                  Bog'lanish →
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </div>
  );
}
