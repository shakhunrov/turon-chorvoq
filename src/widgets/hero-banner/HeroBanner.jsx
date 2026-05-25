import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import { useCountUp, splitWords } from '../../shared/hooks/useScrollAnimation';
import schoolImg from '../../shared/assets/img/school.png';
import AdmissionModal from '../../features/admission-modal/AdmissionModal';
import './HeroBanner.css';

/* Word-by-word reveal for hero title */
function AnimatedTitle({ text }) {
  const words = splitWords(text);
  const midpoint = Math.floor(words.length * 0.55);
  const highlightWords = words.slice(midpoint, midpoint + 3);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
  };
  const wordVariant = {
    hidden: { opacity: 0, y: 48, skewY: 4 },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <motion.h1
      className="hero-title"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => {
        const isHighlight = highlightWords.includes(word) && i >= midpoint && i < midpoint + 3;
        return (
          <motion.span
            key={i}
            variants={wordVariant}
            style={{ display: 'inline-block', marginRight: '0.28em' }}
          >
            {isHighlight
              ? <span className="text-gradient-vibrant">{word}</span>
              : word
            }
          </motion.span>
        );
      })}
    </motion.h1>
  );
}

/* Animated stat with count-up */
function HeroStat({ val, label }) {
  const { ref, count } = useCountUp(val, 1600);
  return (
    <div ref={ref} className="hero-stat">
      <div className="hero-stat-val">{count}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

export default function HeroBanner() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');
    const [showModal, setShowModal] = useState(false);

  const [heroData, setHeroData] = useState({
    subtitle: t.hero.subtitle,
    vision: t.hero.vision,
    text: t.whoWeAre.text,
    cta: t.hero.cta,
    apply: t.hero.apply,
    image: null,
  });

  const [statsData, setStatsData] = useState({
    students: { val: t.stats.studentsVal, label: t.stats.students },
    teachers: { val: t.stats.teachersVal, label: t.stats.teachers },
    universities: { val: t.stats.universitiesVal, label: t.stats.universities },
    languages: { val: '3', label: 'Languages' },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'home' });
        if (!data?.length) return;

        const heroSection = data.find(s => s.section_id === 'hero');
        if (heroSection) {
          try {
            let content = heroSection[`content_${lang}`];
            if (typeof content === 'string') content = JSON.parse(content);
            if (content && Object.keys(content).length > 0)
              setHeroData(prev => ({ ...prev, ...content, image: heroSection.image || null }));
          } catch (e) { /* use defaults */ }
        }

        const statsSection = data.find(s => s.section_id === 'hero-stats');
        if (statsSection) {
          try {
            let content = statsSection[`content_${lang}`];
            if (typeof content === 'string') content = JSON.parse(content);
            if (content && Object.keys(content).length > 0)
              setStatsData(prev => ({
                students: content.students || prev.students,
                teachers: content.teachers || prev.teachers,
                universities: content.universities || prev.universities,
                languages: content.languages || prev.languages,
              }));
          } catch (e) { /* use defaults */ }
        }
      } catch (e) { /* network error, keep defaults */ }
    };
    load();
  }, [branchId, lang, t]);

  const bgStyle = heroData.image
    ? { backgroundImage: `url(${heroData.image})` }
    : { backgroundImage: `url(${schoolImg})` };

  return (
    <section className="hero">
      <div className="hero-bg-container" style={bgStyle}>
        <div className="hero-overlay" />
      </div>

      <div className="container hero-container">
        <div className="hero-content">

          {/* Animated badge */}
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          >
            <Sparkles size={14} className="badge-icon" />
            {heroData.subtitle}
          </motion.div>

          {/* Word-by-word animated title */}
          <AnimatedTitle text={heroData.vision} />

          {/* Subtitle fade up */}
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          >
            {heroData.text}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link to="/about/vision" className="btn btn-primary">
              {heroData.cta} <ArrowRight size={18} />
            </Link>
            <Link onClick={() => setShowModal(!showModal)} className="btn btn-outline">
              {heroData.apply}
            </Link>
          </motion.div>

          {/* Stats row — each slides up with stagger */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.90, duration: 0.60, ease: [0.23, 1, 0.32, 1] }}
          >
            {[
              statsData.students,
              statsData.teachers,
              statsData.universities,
              statsData.languages,
            ].map((s, idx) => (
              <HeroStat key={idx} val={s.val} label={s.label} />
            ))}
          </motion.div>

        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-dot" />
      </div>
        {showModal && <AdmissionModal onClose={() => setShowModal(false)} />}
    </section>
  );
}
