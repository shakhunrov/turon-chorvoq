import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Landmark } from 'lucide-react';
import HeroBanner from '../../widgets/hero-banner/HeroBanner';
import WhyChoose from '../../widgets/why-choose/WhyChoose';
import Testimonials from '../../widgets/testimonials/Testimonials';
import NewsSection from '../../widgets/news-section/NewsSection';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import {
  useAnimateOnScroll,
  useCountUp,
  fadeUp,
  slideLeft,
  slideRight,
  staggerContainer,
  staggerChild,
  staggerChildScale,
} from '../../shared/hooks/useScrollAnimation';
import schoolImg from '../../shared/assets/img/school.png';
import './Home.css';

const STAT_THEMES = [
  { Icon: Users,         grad: 'linear-gradient(145deg, #3B82F6, #1D4ED8)', glow: 'rgba(37,99,235,0.40)' },
  { Icon: GraduationCap, grad: 'linear-gradient(145deg, #22C55E, #16A34A)', glow: 'rgba(22,163,74,0.40)' },
  { Icon: BookOpen,      grad: 'linear-gradient(145deg, #A855F7, #7C3AED)', glow: 'rgba(124,58,237,0.40)' },
  { Icon: Landmark,      grad: 'linear-gradient(145deg, #FBBF24, #D97706)', glow: 'rgba(217,119,6,0.40)' },
];

/* ─── Stat card with count-up ─────────────────────────────────────────── */
function AnimatedStatCard({ s, theme }) {
  const { ref, count } = useCountUp(s.val, 1800);
  const { Icon } = theme;
  return (
    <motion.div ref={ref} className="stat-card" variants={staggerChildScale}>
      <div
        className="stat-icon-wrap"
        style={{
          background: theme.grad,
          boxShadow: `0 4px 0 rgba(0,0,0,0.18), 0 10px 24px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.28)`,
        }}
      >
        <Icon size={26} className="stat-icon-svg" />
      </div>
      <div className="stat-val">{count}</div>
      <div className="stat-label">{s.label}</div>
      {s.note && <div className="stat-note">{s.note}</div>}
    </motion.div>
  );
}

/* ─── Animated section label ──────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <motion.span className="section-label" variants={fadeUp}>
      {children}
    </motion.span>
  );
}

export default function Home() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');

  const [sections, setSections] = useState({
    whoWeAre: {
      label: t.nav.about,
      title: t.whoWeAre.title,
      text: t.whoWeAre.text,
      image: schoolImg,
    },
    stats: {
      title: t.stats.title,
      students: { val: t.stats.studentsVal, label: t.stats.students, icon: '👨‍🎓' },
      teachers: { val: t.stats.teachersVal, label: t.stats.teachers, icon: '👩‍🏫', note: t.stats.teachersNote },
      programs: { val: t.stats.programsVal, label: t.stats.programs, icon: '📚' },
      universities: { val: t.stats.universitiesVal, label: t.stats.universities, icon: '🏛️' },
    },
    philosophy: {
      label: 'Falsafa',
      title: t.philosophy.title,
      text: t.philosophy.text,
      tags: ['STEAM', 'AI', 'Cambridge', "Kelajak ko'nikmalari"],
    },
    cta: {
      title: t.cta.title,
      button: t.cta.button,
      consult: t.cta.consult,
    },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'home' });
        if (!data?.length) return;
        const loaded = {};
        data.forEach(section => {
          try {
            let content = section[`content_${lang}`];
            if (typeof content === 'string') content = JSON.parse(content);
            if (content && Object.keys(content).length > 0) {
              loaded[section.section_id] = content;
              if (section.image) loaded[section.section_id].image = section.image;
            }
          } catch (e) { /* skip */ }
        });
        setSections(prev => ({ ...prev, ...loaded }));
      } catch (e) { /* use defaults */ }
    };
    loadSections();
  }, [branchId, lang, t]);

  /* ─── Animation refs ─────────────────────────────────────────────────── */
  const wwa = useAnimateOnScroll(0.15);
  const stats = useAnimateOnScroll(0.10);
  const phil = useAnimateOnScroll(0.15);
  const cta = useAnimateOnScroll(0.20);

  return (
    <div className="page">
      <HeroBanner />

      {/* ── Who We Are ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container who-we-are">
          {/* Text col — slides in from left */}
          <motion.div
            className="wwa-content"
            ref={wwa.ref}
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate={wwa.animate}
          >
            <motion.span className="section-label" variants={fadeUp}>
              {sections.whoWeAre.label}
            </motion.span>
            <motion.h2 className="section-title" variants={fadeUp}>
              {sections.whoWeAre.title}
            </motion.h2>
            <motion.div className="divider" variants={fadeUp} />
            <motion.p className="wwa-text" variants={fadeUp}>
              {sections.whoWeAre.text}
            </motion.p>
            <motion.div variants={fadeUp} style={{ marginTop: 16 }}>
              <Link to="/about/vision" className="btn btn-primary">Batafsil →</Link>
            </motion.div>
          </motion.div>

          {/* Image col — slides in from right */}
          <motion.div
            className="wwa-image-side"
            initial={{ opacity: 0, x: 64, scale: 0.96 }}
            animate={wwa.animate === 'visible' ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.80, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
          >
            <img
              src={typeof sections.whoWeAre.image === 'string' ? sections.whoWeAre.image : schoolImg}
              alt="Turon International School"
              className="wwa-school-img"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="stats-section section">
        <div className="container">
          <motion.div
            className="section-header center"
            ref={stats.ref}
            variants={staggerContainer(0.10)}
            initial="hidden"
            animate={stats.animate}
          >
            <motion.span className="section-label" variants={fadeUp}>
              Ta'sir
            </motion.span>
            <motion.h2 className="section-title" variants={fadeUp}>
              {sections.stats.title}
            </motion.h2>
            <motion.div className="divider center" variants={fadeUp} />
          </motion.div>

          <motion.div
            className="stats-grid"
            variants={staggerContainer(0.12, 0.10)}
            initial="hidden"
            animate={stats.animate}
          >
            {[
              { s: sections.stats.students,     theme: STAT_THEMES[0] },
              { s: sections.stats.teachers,     theme: STAT_THEMES[1] },
              { s: sections.stats.programs,     theme: STAT_THEMES[2] },
              { s: sections.stats.universities, theme: STAT_THEMES[3] },
            ].map(({ s, theme }, idx) => (
              <AnimatedStatCard key={idx} s={s} theme={theme} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Philosophy ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container philosophy-section">
          <motion.div
            className="philosophy-content"
            ref={phil.ref}
            variants={staggerContainer(0.11)}
            initial="hidden"
            animate={phil.animate}
          >
            <motion.span className="section-label" variants={fadeUp}>
              {sections.philosophy.label}
            </motion.span>
            <motion.h2 className="section-title" variants={fadeUp}>
              {sections.philosophy.title}
            </motion.h2>
            <motion.div className="divider" variants={fadeUp} />
            <motion.p className="section-subtitle" variants={fadeUp}>
              {sections.philosophy.text}
            </motion.p>
            <motion.div variants={fadeUp} style={{ marginTop: 24 }}>
              <Link to="/education" className="btn btn-outline">Bizning yondashuvimiz →</Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="philosophy-cards"
            variants={staggerContainer(0.09, 0.20)}
            initial="hidden"
            animate={phil.animate}
          >
            {sections.philosophy.tags.map((tag, idx) => (
              <motion.div key={idx} className="phil-tag" variants={staggerChildScale}>
                {typeof tag === 'object' && tag.icon && (
                  <span style={{ marginRight: '8px' }}>{tag.icon}</span>
                )}
                {typeof tag === 'object' ? tag.name : tag}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WhyChoose />
      <Testimonials />
      <NewsSection />

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      <section className="cta-banner section">
        <div className="container">
          <motion.div
            className="cta-box"
            ref={cta.ref}
            initial={{ opacity: 0, y: 56, scale: 0.96 }}
            animate={cta.animate === 'visible' ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="cta-glow" />
            <motion.h2
              className="cta-title"
              initial={{ opacity: 0, y: 24 }}
              animate={cta.animate === 'visible' ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.20, duration: 0.60, ease: [0.23, 1, 0.32, 1] }}
            >
              {sections.cta.title}
            </motion.h2>
            <motion.div
              className="cta-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={cta.animate === 'visible' ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link to="/admissions" className="btn btn-primary">{sections.cta.button}</Link>
              <Link to="/contact" className="btn btn-outline">{sections.cta.consult}</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
