import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import { fetchNews, selectNewsList } from '../../features/news';
import {
  useAnimateOnScroll,
  fadeUp,
  staggerContainer,
  staggerChild,
} from '../../shared/hooks/useScrollAnimation';
import './NewsSection.css';

export default function NewsSection() {
  const { t, lang } = useLang();
  const dispatch = useDispatch();
  const location = useLocation();
  const isEditableMode = location.pathname.startsWith('/editable');
  const basePrefix = isEditableMode ? '/editable' : '';
  const branchId = localStorage.getItem('globalBranchId');

  const newsList = useSelector(selectNewsList);

  const [section, setSection] = useState({
    label: "So'nggi",
    title: t.news.title,
  });

  // Backend'dan section ma'lumotlarini yuklash
  useEffect(() => {
    const loadSection = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'news-section' });
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
              console.error('NewsSection parse error:', e);
            }
          }
        }
      } catch (error) {
        console.error('NewsSection ma\'lumotlarini yuklashda xatolik:', error);
      }
    };
    loadSection();
  }, [branchId, lang, t]);

  // Backend'dan yangiliklar ma'lumotlarini yuklash
  useEffect(() => {
    dispatch(fetchNews({ branch: branchId }));
  }, [dispatch, branchId]);

  const latestNews = newsList.slice(0, 3);

  const header = useAnimateOnScroll(0.15);
  const grid = useAnimateOnScroll(0.10);
  const cta = useAnimateOnScroll(0.20);

  return (
    <section className="news-section section">
      <div className="container">
        <motion.div
          className="section-header"
          ref={header.ref}
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate={header.animate}
        >
          <motion.span className="section-label" variants={fadeUp}>{section.label}</motion.span>
          <motion.h2 className="section-title" variants={fadeUp}>{section.title}</motion.h2>
          <motion.div className="divider" variants={fadeUp} />
        </motion.div>

        <motion.div
          className="news-grid"
          ref={grid.ref}
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          animate={grid.animate}
        >
          {latestNews.map((item, i) => (
            <motion.article key={i} className="news-card glass-card" variants={staggerChild}>
              <div className="news-img-placeholder" style={{ background: `var(--vibrant-grad)`, opacity: 0.9 }}>
                  { !item?.image ? <Newspaper size={48} className="news-placeholder-icon" /> :
                  <img src={`${item?.image}`} alt=""/>
                }              </div>
              <div className="news-body">
                <time className="news-date">
                  <Calendar size={12} style={{ marginRight: 6 }} /> {item.date}
                </time>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-desc">{item.desc}</p>
                <Link to={`${basePrefix}/news`} className="news-read-more">
                  {t.news.readMore} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          ref={cta.ref}
          style={{ textAlign: 'center', marginTop: 40 }}
          initial={{ opacity: 0, y: 20 }}
          animate={cta.animate === 'visible' ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <Link to={`${basePrefix}/news`} className="btn btn-outline">{t.news.allNews || 'Barcha yangiliklar'}</Link>
        </motion.div>
      </div>
    </section>
  );
}

