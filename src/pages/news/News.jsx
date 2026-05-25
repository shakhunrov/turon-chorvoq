import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../shared/i18n';
import {
  fetchNews,
  selectNewsList,
  selectNewsLoading,
} from '../../features/news';
import { X } from 'lucide-react';
import { RevealOnScroll } from '../../shared/components/kinetic';
import './News.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80';

/* ── SVG Empty state icon ── */
const IconInbox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);

function estimateReadTime(text = '') {
  const words = String(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function News() {
  const { t } = useLang();
  const title = typeof t.news === 'string' ? t.news : (t.news?.title || 'News & Media');
  const readMoreText = typeof t.news === 'object' ? (t.news?.readMore || 'Read More') : 'Read More';
  const allText = typeof t.news === 'object' ? (t.news?.categories?.[0] || 'All') : 'All';
  const branchId = localStorage.getItem('globalBranchId');
  const dispatch = useDispatch();

  const newsList    = useSelector(selectNewsList);
  const loading     = useSelector(selectNewsLoading);
  const [cat, setCat]             = useState('All');
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    dispatch(fetchNews({ branch: branchId, published: true }));
  }, [dispatch]);

  const allPosts = newsList.filter((p) => p.published !== false);
  const filtered = cat === 'All'
    ? allPosts
    : allPosts.filter((p) => p.category?.id === cat || p.category_id === cat);

  const catsMap = new Map();
  allPosts.forEach((p) => {
    if (p.category?.id) catsMap.set(p.category.id, p.category);
  });
  const categories = [
    { id: 'All', name: allText },
    ...Array.from(catsMap.values()),
  ];

  useEffect(() => {
    document.body.style.overflow = selectedNews ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedNews]);

  const featuredPost = filtered[0];
  const restPosts    = filtered.slice(1);

  return (
    <div className="page nws-page">

      {/* ── Cinematic Hero ── */}
      <div className="news-hero">
        <div className="container">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Latest
          </motion.span>
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
          >
            {title}
          </motion.h1>
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>

      {/* ── Content wrapper with creative background ── */}
      <div className="nws-content-bg">
        <div className="nws-dot-grid" />
        <div className="nws-watermark" aria-hidden="true">NEWS</div>

        <section className="section nws-section">
          <div className="container">

            {/* Category filters */}
            <motion.div
              className="news-filters"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`news-filter-btn ${cat === c.id ? 'active' : ''}`}
                >
                  {c.name}
                </button>
              ))}
            </motion.div>

            {/* ── Loading ── */}
            {loading ? (
              <div className="nws-loading">
                <div className="nws-spinner" />
                <p>Yangiliklar yuklanmoqda…</p>
              </div>

            /* ── Empty ── */
            ) : filtered.length === 0 ? (
              <div className="news-empty">
                <div className="news-empty-icon"><IconInbox /></div>
                <p>Bu bo'limda hozircha yangilik yo'q.</p>
              </div>

            ) : (
              <>
                {/* ══ Editorial Featured Card ══ */}
                <RevealOnScroll variant="fadeUp">
                  <article
                    className="nws-featured"
                    onClick={() => setSelectedNews(featuredPost)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedNews(featuredPost)}
                  >
                    {/* Big decorative number */}
                    <div className="nws-feat-num" aria-hidden="true">01</div>

                    {/* FEATURED ribbon */}
                    <div className="nws-feat-ribbon">FEATURED</div>

                    {/* Full-bleed image */}
                    <div className="nws-feat-img">
                      <img
                        src={featuredPost.image || PLACEHOLDER}
                        alt={featuredPost.title}
                        onError={(e) => { e.target.src = PLACEHOLDER; }}
                      />
                    </div>

                    {/* Editorial gradient overlay */}
                    <div className="nws-feat-overlay" />

                    {/* Text panel (floats left over overlay) */}
                    <div className="nws-feat-body">
                      <div className="nws-feat-meta">
                        {featuredPost.category?.name && (
                          <span className="nws-cat-pill">{featuredPost.category.name}</span>
                        )}
                        <time className="nws-feat-date">{featuredPost.date}</time>
                        <span className="nws-read-time">
                          {estimateReadTime(featuredPost.description || featuredPost.desc)} min read
                        </span>
                      </div>
                      <h2 className="nws-feat-title">{featuredPost.title}</h2>
                      <p className="nws-feat-desc">{featuredPost.description || featuredPost.desc}</p>
                      <span className="nws-feat-cta">
                        {readMoreText}
                        <span className="nws-cta-arrow">→</span>
                      </span>
                    </div>
                  </article>
                </RevealOnScroll>

                {/* ══ Latest Articles section ══ */}
                {restPosts.length > 0 && (
                  <>
                    <div className="nws-divider-row">
                      <span className="nws-divider-line" />
                      <span className="nws-divider-label">Latest Articles</span>
                      <span className="nws-divider-line" />
                    </div>

                    <motion.div
                      className="news-grid"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-40px' }}
                      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                    >
                      {restPosts.map((post, i) => (
                        <motion.article
                          key={post.id}
                          className="news-card"
                          variants={{
                            hidden:  { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] } },
                          }}
                        >
                          {/* Article number badge */}
                          <div className="nws-card-num">{String(i + 2).padStart(2, '0')}</div>

                          <div className="news-card-img">
                            <img
                              src={post.image || PLACEHOLDER}
                              alt={post.title}
                              onError={(e) => { e.target.src = PLACEHOLDER; }}
                            />
                            {post.category?.name && (
                              <span className="news-cat-badge">{post.category.name}</span>
                            )}
                          </div>

                          <div className="news-card-body">
                            <div className="nws-card-meta">
                              <time className="news-date">{post.date}</time>
                              <span className="nws-read-time-card">
                                {estimateReadTime(post.description || post.desc)} min
                              </span>
                            </div>
                            <h3 className="news-card-title">{post.title}</h3>
                            <p className="news-card-desc">{post.description || post.desc}</p>
                            <button
                              className="news-read-more"
                              onClick={(e) => { e.stopPropagation(); setSelectedNews(post); }}
                            >
                              {readMoreText}
                              <span className="nws-arrow">→</span>
                            </button>
                          </div>
                        </motion.article>
                      ))}
                    </motion.div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* ══ News Modal ══ */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            className="news-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              className="news-modal-content"
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{    scale: 0.92, y: 24, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="news-modal-close" onClick={() => setSelectedNews(null)} aria-label="Yopish">
                <X size={20} />
              </button>
              <img
                src={selectedNews.image || PLACEHOLDER}
                alt={selectedNews.title}
                className="news-modal-img"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="news-modal-body">
                <div className="news-modal-meta">
                  {selectedNews.category?.name && (
                    <span className="news-cat-badge" style={{ position: 'static' }}>
                      {selectedNews.category.name}
                    </span>
                  )}
                  <time className="news-date">{selectedNews.date}</time>
                  <span className="nws-read-time-card">
                    {estimateReadTime(selectedNews.description || selectedNews.desc)} min read
                  </span>
                </div>
                <h2 className="news-modal-title">{selectedNews.title}</h2>
                <div className="news-modal-desc">
                  {selectedNews.description || selectedNews.desc}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
