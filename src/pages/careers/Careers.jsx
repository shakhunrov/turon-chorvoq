import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../shared/i18n';
import {
  fetchPositions,
  selectPositions,
  selectPositionsLoading,
  applyForPosition,
  resetApplyStatus,
  selectApplySuccess,
  selectApplicationsLoading,
} from '../../features/careers';
import { Briefcase, Calendar, CheckCircle, Send, X } from 'lucide-react';
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
import './Careers.css';

/* ── SVG Icon components ── */
const IconFileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

const IconBriefcaseEmpty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function Careers() {
  const { t } = useLang();
  const c = t.careers;
  const dispatch = useDispatch();

  const positions        = useSelector(selectPositions);
  const positionsLoading = useSelector(selectPositionsLoading);
  const applySuccess     = useSelector(selectApplySuccess);
  const applyLoading     = useSelector(selectApplicationsLoading);
  const branchId = localStorage.getItem('globalBranchId');

  const [applyModal, setApplyModal] = useState(null);
  const [applyForm, setApplyForm]   = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    dispatch(fetchPositions({ branch: branchId }));
  }, [dispatch]);

  useEffect(() => {
    if (applySuccess) {
      const timer = setTimeout(() => {
        setApplyModal(null);
        dispatch(resetApplyStatus());
        setApplyForm({ name: '', email: '', phone: '' });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [applySuccess, dispatch]);

  const handleApply = (e) => {
    e.preventDefault();
    if (!applyModal) return;
    dispatch(applyForPosition({ ...applyForm, position: applyModal.id }));
  };

  const openApplyModal = (pos) => {
    setApplyModal(pos);
    dispatch(resetApplyStatus());
    setApplyForm({ name: '', email: '', phone: '' });
  };

  const activePositions = positions.filter((p) => p.is_active);
  const pathwaySteps    = c.pathway.split(' → ');
  const processSteps    = c.process.map((step) => ({ text: step }));

  const introStats = [
    { to: 50,  suffix: '+', label: 'Team Members' },
    { to: 12,  suffix: '+', label: 'Nationalities' },
    { to: 5,   suffix: '+', label: 'Years Strong' },
  ];

  return (
    <div className="page car-page">

      {/* ── Cinematic Hero ── */}
      <div className="car-hero">
        <GradientBlob position="top-right"  color="gold"  size={380} opacity={0.16} />
        <GradientBlob position="bottom-left" color="blue" size={260} opacity={0.10} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Biz bilan ishlang
          </motion.span>
          <TextSplit text={c.title} as="h1" className="section-title" style={{ marginTop: 12 }} />
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            style={{ marginTop: 16 }}
          >
            {c.subtitle}
          </motion.p>
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.55 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>

      {/* ── Content wrapper with grid background ── */}
      <div className="car-content-bg">
        <div className="car-cross-grid" />
        <div className="car-bg-watermark" aria-hidden="true">CAREERS</div>

        <section className="section car-section">
          <div className="container">

            {/* ── Intro + Stats ── */}
            <RevealOnScroll variant="fadeUp">
              <div className="car-intro-block">
                <p className="car-intro-text">{c.intro}</p>
                <div className="car-intro-stats">
                  {introStats.map((s, i) => (
                    <div key={i} className="car-istat">
                      <div className="car-istat-num">
                        <AnimatedCounter to={s.to} suffix={s.suffix} duration={1400} />
                      </div>
                      <div className="car-istat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* ══ Why Work With Us ══ */}
            <div className="car-why-section">
              <RevealOnScroll>
                <h2 className="section-title">{c.whyTitle}</h2>
                <div className="divider" style={{ marginBottom: 28 }} />
              </RevealOnScroll>

              <div className="car-why-list">
                {c.whyItems.map((item, i) => (
                  <motion.div
                    key={i}
                    className="car-why-item"
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.50, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="car-why-index">{String(i + 1).padStart(2, '0')}</div>
                    <div className="car-why-icon">{item.icon}</div>
                    <p className="car-why-text">{item.text}</p>
                    <div className="car-why-arrow"><IconArrowRight /></div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ══ Career Pathway — dark visual steps ══ */}
            <RevealOnScroll variant="scaleUp">
              <div className="car-pathway-hero">
                {/* Mesh overlay */}
                <div className="car-path-mesh" />
                {/* Gold orb */}
                <div className="car-path-orb" />

                <div className="car-path-header">
                  <span className="car-path-eyebrow">Your Journey</span>
                  <h3 className="car-path-title">{c.pathwayTitle}</h3>
                </div>

                <div className="car-path-steps">
                  {pathwaySteps.map((step, i) => (
                    <div key={i} className="car-path-step">
                      <div className="car-path-dot">
                        <span className="car-path-num">{i + 1}</span>
                      </div>
                      {i < pathwaySteps.length - 1 && (
                        <div className="car-path-connector" />
                      )}
                      <p className="car-path-label">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* ══ Open Positions ══ */}
            <div className="positions-section">
              <RevealOnScroll>
                <div className="car-pos-heading-row">
                  <div>
                    <h2 className="section-title">{c.rolesTitle || 'Open Positions'}</h2>
                    <div className="divider" />
                  </div>
                  {!positionsLoading && activePositions.length > 0 && (
                    <div className="car-pos-count-badge">
                      <span className="car-pos-count-dot" />
                      {activePositions.length} Open {activePositions.length === 1 ? 'Role' : 'Roles'}
                    </div>
                  )}
                </div>
              </RevealOnScroll>

              {positionsLoading ? (
                <div className="car-pos-loading">
                  <div className="car-spinner" />
                  <p>Loading positions…</p>
                </div>

              ) : activePositions.length === 0 ? (
                <RevealOnScroll>
                  <div className="car-pos-empty">
                    <div className="car-pos-empty-icon"><IconBriefcaseEmpty /></div>
                    <h4>No open positions right now</h4>
                    <p>We're always looking for talent. Check back soon!</p>
                  </div>
                </RevealOnScroll>

              ) : (
                <StaggerGrid className="positions-grid" stagger={0.08}>
                  {activePositions.map((pos) => (
                    <motion.div
                      key={pos.id}
                      className={`car-pos-card ${pos.type === 'Academic' ? 'pos-academic' : 'pos-non-academic'}`}
                      variants={staggerItem}
                    >
                      {/* Colored top accent */}
                      <div className="car-pos-accent" />

                      <div className="car-pos-body">
                        {/* Header row */}
                        <div className="car-pos-header">
                          <h3 className="car-pos-title">{pos.title}</h3>
                          <span className={`position-type-badge ${pos.type === 'Academic' ? 'academic' : 'non-academic'}`}>
                            {pos.type}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="car-pos-desc">{pos.description}</p>

                        {/* Meta info */}
                        <div className="car-pos-meta">
                          <span className="car-pos-meta-item">
                            <Briefcase size={13} />
                            {pos.employment_type}
                          </span>
                          {pos.deadline && (
                            <span className="car-pos-meta-item">
                              <Calendar size={13} />
                              Deadline: {pos.deadline}
                            </span>
                          )}
                        </div>

                        {/* Requirements */}
                        {pos.requirements?.length > 0 && (
                          <div className="position-card-requirements">
                            {pos.requirements.map((req, i) => (
                              <span key={i} className="requirement-tag">{req}</span>
                            ))}
                          </div>
                        )}

                        {/* Apply button */}
                        <button
                          className="car-apply-btn"
                          onClick={() => openApplyModal(pos)}
                        >
                          <Send size={14} />
                          Apply Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </StaggerGrid>
              )}
            </div>

            {/* ══ Recruitment Process → Timeline ══ */}
            <div className="process-section">
              <RevealOnScroll>
                <h2 className="section-title">{c.processTitle}</h2>
                <div className="divider" style={{ marginBottom: 32 }} />
              </RevealOnScroll>
              <TimelineRail steps={processSteps} />
            </div>

            {/* ══ CTA Banner ══ */}
            <RevealOnScroll variant="scaleUp">
              <div className="careers-cta">
                <div className="careers-cta-mesh" />
                <div className="careers-cta-orb" />
                <div className="careers-cta-inner">
                  <h2 className="careers-cta-title">{c.joinTitle}</h2>
                  <p className="careers-cta-sub">{c.joinSubtitle}</p>
                  <button
                    className="car-cta-btn"
                    onClick={() => document.querySelector('.positions-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Open Positions
                    <span className="car-cta-arrow">→</span>
                  </button>
                </div>
              </div>
            </RevealOnScroll>

          </div>
        </section>
      </div>

      {/* ══ Apply Modal ══ */}
      <AnimatePresence>
        {applyModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => { setApplyModal(null); dispatch(resetApplyStatus()); }}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.92, y: 24, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{    scale: 0.92, y: 24, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => { setApplyModal(null); dispatch(resetApplyStatus()); }}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="modal-header">
                <div className="modal-icon"><IconFileText /></div>
                <div>
                  <div className="modal-eyebrow">Applying for</div>
                  <h2 className="modal-title">{applyModal.title}</h2>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {applySuccess ? (
                  <motion.div
                    key="success"
                    className="modal-success"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.40, ease: [0.34,1.56,0.64,1] }}
                  >
                    <div className="success-icon">
                      <CheckCircle size={48} strokeWidth={1.5} style={{ color: '#10B981' }} />
                    </div>
                    <h3 className="modal-success-title">Application Sent!</h3>
                    <p>Thank you! We'll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className="modal-form"
                    onSubmit={handleApply}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-input"
                        placeholder="Your full name"
                        value={applyForm.name}
                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        className="form-input"
                        type="email"
                        placeholder="your@email.com"
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-input"
                        type="tel"
                        placeholder="+998 __ ___ ____"
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="car-apply-btn car-apply-btn-full"
                      disabled={applyLoading}
                    >
                      {applyLoading ? (
                        <>
                          <div className="car-spinner-sm" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Submit Application
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
