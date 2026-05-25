import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import './AboutCampus.css';

/* ── SVG Icon components ── */
const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
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

const IconBuildingEmpty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/>
  </svg>
);

export default function AboutCampus() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');
  const [activeTab, setActiveTab] = useState('education');
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 });

  const [sections, setSections] = useState({
    hero: {
      label: 'Biz haqimizda',
      title: t.about.campus.title,
    },
    education: {
      label: t.about.campus.educationTitle,
      icon: <IconBook />,
      desc: t.about.campus.educationDesc,
      images: [],
    },
    houses: {
      label: "Dars jarayonlari",
      icon: <IconHome />,
      desc: "Dars jarayonlari",
      images: [],
    },
    sports: {
      label: t.about.campus.sportsTitle,
      icon: <IconTrophy />,
      desc: t.about.campus.sportsDesc,
      images: [],
    },
  });

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'about-campus' });
        if (data && data.length > 0) {
          const loadedSections = {};
          data.forEach(section => {
            try {
              const contentField = `content_${lang}`;
              let content = section[contentField];
              if (typeof content === 'string') content = JSON.parse(content);
              if (content && Object.keys(content).length > 0)
                loadedSections[section.section_id] = { ...content };
              if (section.images && section.images.length > 0) {
                if (!loadedSections[section.section_id]) loadedSections[section.section_id] = {};
                loadedSections[section.section_id].images = section.images.sort((a, b) => a.order - b.order);
              }
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
  }, [branchId, lang, t]);

  /* Close lightbox when switching tabs */
  useEffect(() => {
    setLightbox({ open: false, idx: 0 });
  }, [activeTab]);

  /* Keyboard navigation */
  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e) => {
      if (e.key === 'Escape')      setLightbox(lb => ({ ...lb, open: false }));
      if (e.key === 'ArrowLeft')   setLightbox(lb => ({ open: true, idx: (lb.idx - 1 + currentImages.length) % currentImages.length }));
      if (e.key === 'ArrowRight')  setLightbox(lb => ({ open: true, idx: (lb.idx + 1) % currentImages.length }));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox.open]);

  const tabs = [
    { key: 'education', ...sections.education },
    { key: 'houses',    ...sections.houses    },
    { key: 'sports',    ...sections.sports    },
  ];

  const current       = tabs.find(tb => tb.key === activeTab);
  const currentImages = current?.images || [];
  const lightboxImg   = currentImages[lightbox.idx];

  const openLightbox = (idx) => setLightbox({ open: true, idx });
  const closeLightbox = () => setLightbox(lb => ({ ...lb, open: false }));
  const goPrev = (e) => {
    e?.stopPropagation();
    setLightbox(lb => ({ open: true, idx: (lb.idx - 1 + currentImages.length) % currentImages.length }));
  };
  const goNext = (e) => {
    e?.stopPropagation();
    setLightbox(lb => ({ open: true, idx: (lb.idx + 1) % currentImages.length }));
  };

  return (
    <div className="page cp-page">
      {/* ── Hero ── */}
      <div className="cp-hero">
        <div className="container">
          <span className="section-label">{sections.hero.label}</span>
          <h1 className="section-title">{sections.hero.title}</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* ── Tabs ── */}
          <div className="campus-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`campus-tab ${activeTab === tab.key ? 'active' : ''}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* ── Description ── */}
          <div className="campus-content">
            <div className="campus-desc">
              <h2 className="campus-desc-title">{current.label}</h2>
              <p>{current.desc}</p>
            </div>

            {/* ── Gallery grid ── */}
            {currentImages.length > 0 ? (
              <motion.div
                className="campus-photo-grid"
                key={activeTab}
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              >
                {currentImages.map((img, i) => (
                  <motion.div
                    key={img.id}
                    className="campus-photo"
                    variants={{
                      hidden:  { opacity: 0, scale: 0.94, y: 16 },
                      visible: { opacity: 1, scale: 1,    y: 0, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } },
                    }}
                    onClick={() => openLightbox(i)}
                    whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
                  >
                    <img src={img.image} alt={`Campus ${i + 1}`} />
                    <div className="photo-hover-overlay">
                      <div className="photo-zoom-btn">
                        <ZoomIn size={20} />
                      </div>
                    </div>
                    <div className="photo-num">{i + 1}</div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="gallery-empty">
                <span><IconBuildingEmpty /></span>
                <p>Rasmlar mavjud emas</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox.open && lightboxImg && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Yopish">
              <X size={20} />
            </button>

            {/* Prev */}
            {currentImages.length > 1 && (
              <button className="lightbox-nav lightbox-prev" onClick={goPrev} aria-label="Oldingi">
                <ChevronLeft size={26} />
              </button>
            )}

            {/* Image frame */}
            <motion.div
              className="lightbox-frame"
              initial={{ scale: 0.86, opacity: 0, y: 24 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{    scale: 0.86, opacity: 0, y: 24 }}
              transition={{ duration: 0.30, ease: [0.23, 1, 0.32, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightbox.idx}
                  src={lightboxImg.image}
                  alt={`Campus ${lightbox.idx + 1}`}
                  className="lightbox-img"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0  }}
                  exit={{    opacity: 0, x: -40 }}
                  transition={{ duration: 0.20, ease: 'easeOut' }}
                  draggable={false}
                />
              </AnimatePresence>
            </motion.div>

            {/* Next */}
            {currentImages.length > 1 && (
              <button className="lightbox-nav lightbox-next" onClick={goNext} aria-label="Keyingi">
                <ChevronRight size={26} />
              </button>
            )}

            {/* Counter */}
            <div className="lightbox-counter">
              {lightbox.idx + 1} / {currentImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
