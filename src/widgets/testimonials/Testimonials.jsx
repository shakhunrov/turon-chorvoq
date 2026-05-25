import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import {
  useAnimateOnScroll,
  fadeUp,
  staggerContainer,
} from '../../shared/hooks/useScrollAnimation';
import './Testimonials.css';

export default function Testimonials() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');
  const [idx, setIdx] = useState(0);

  const [section, setSection] = useState({
    label: 'Jamiyat',
    title: t.testimonials.title,
    items: t.testimonials.items,
  });

  useEffect(() => {
    const loadSection = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'testimonials' });
        if (data && data.length > 0) {
          const mainSection = data.find(s => s.section_id === 'main');
          if (mainSection) {
            try {
              const contentField = `content_${lang}`;
              let content = mainSection[contentField];

              if (typeof content === 'string') {
                content = JSON.parse(content);
              }

              if (content && Object.keys(content).length > 0) {
                setSection(prev => ({ ...prev, ...content }));
              }
            } catch (e) {
              console.error('Testimonials section parse error:', e);
            }
          }
        }
      } catch (error) {
        console.error('Testimonials ma\'lumotlarini yuklashda xatolik:', error);
      }
    };
    loadSection();
  }, [branchId, lang, t]);

  const items = section.items;
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  /* ── Touch swipe ── */
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const header = useAnimateOnScroll(0.15);
  const card = useAnimateOnScroll(0.12);

  return (
    <section className="testimonials section">
      <div className="container">
        <motion.div
          className="section-header center"
          ref={header.ref}
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate={header.animate}
        >
          <motion.span className="section-label" variants={fadeUp}>{section.label}</motion.span>
          <motion.h2 className="section-title" variants={fadeUp}>{section.title}</motion.h2>
          <motion.div className="divider center" variants={fadeUp} />
        </motion.div>

        <motion.div
          className="testimonial-wrapper"
          ref={card.ref}
          initial={{ opacity: 0, y: 40 }}
          animate={card.animate === 'visible' ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.70, ease: [0.23, 1, 0.32, 1], delay: 0.10 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="testi-nav prev" onClick={prev}><ChevronLeft size={20} /></button>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="testimonial-card glass-card"
              initial={{ opacity: 0, x: 32, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -32, scale: 0.97 }}
              transition={{ duration: 0.40, ease: [0.23, 1, 0.32, 1] }}
            >
              <Quote size={36} className="testi-quote-icon" />
              {/* 5-star rating */}
              <div className="testi-stars">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="star">★</span>
                ))}
              </div>
              <p className="testi-text">{items[idx]?.text}</p>
              <div className="testi-divider" />
              <div className="testi-author">
                <div className="testi-avatar">{items[idx]?.name?.[0]}</div>
                <div>
                  <div className="testi-name">{items[idx]?.name}</div>
                  <div className="testi-role">{items[idx]?.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button className="testi-nav next" onClick={next}><ChevronRight size={20} /></button>
        </motion.div>

        <div className="testi-dots">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`testi-dot ${i === idx ? 'active' : ''}`} />
          ))}
        </div>
        <div className="testi-swipe-hint">swipe</div>
      </div>
    </section>
  );
}
