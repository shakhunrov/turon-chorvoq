import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useLang } from '../../shared/i18n';
import {
  createContact,
  resetContactStatus,
  selectContactLoading,
  selectContactError,
  selectSubmitSuccess,
} from '../../features/contact';
import { RevealOnScroll, StaggerGrid, staggerItem } from '../../shared/components/kinetic';
import './Contact.css';

/* ── SVG Icon components ── */
const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
);

const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" x2="9" y1="3" y2="18"/>
    <line x1="15" x2="15" y1="6" y2="21"/>
  </svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const IconExternalLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M15 3h6v6"/>
    <path d="M10 14 21 3"/>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  </svg>
);

export default function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const dispatch = useDispatch();

  const loading       = useSelector(selectContactLoading);
  const error         = useSelector(selectContactError);
  const submitSuccess = useSelector(selectSubmitSuccess);
  const branchId      = localStorage.getItem('globalBranchId');

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState({});

  useEffect(() => {
    return () => dispatch(resetContactStatus());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createContact({ ...form, branch: branchId }));
  };

  const infoItems = [
    { Icon: IconLocation, label: c.address,  color: '#F59E0B' },
    { Icon: IconMail,     label: c.email,    color: '#2563EB' },
    { Icon: IconPhone,    label: c.phone,    color: '#10B981' },
  ];

  return (
    <div className="page con-page">

      {/* ── Cinematic Hero ── */}
      <div className="con-hero">
        <div className="con-hero-mesh" />
        <div className="con-hero-orb-1" />
        <div className="con-hero-orb-2" />
        <div className="container con-hero-inner">
          <motion.span
            className="con-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Bog'lanish
          </motion.span>
          <motion.h1
            className="con-hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23,1,0.32,1] }}
          >
            {c.title}
          </motion.h1>
          <motion.div
            className="con-hero-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.45 }}
            style={{ transformOrigin: 'left' }}
          />
          <motion.p
            className="con-hero-sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55 }}
          >
            Savollaringiz bormi? Biz har doim yordam berishga tayyormiz.
          </motion.p>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="section">
        <div className="container con-grid">

          {/* ── Left: info + map ── */}
          <div className="con-left">

            {/* School name */}
            <RevealOnScroll variant="fadeRight">
              <div className="con-school-badge">
                <span className="con-school-dot" />
                {c.schoolName || 'Turon International School'}
              </div>
              <h2 className="con-section-heading">Manzil va aloqa</h2>
            </RevealOnScroll>

            {/* Info cards */}
            <StaggerGrid stagger={0.10} margin="-10px">
              {infoItems.map(({ Icon, label, color }) => (
                <motion.div key={label} className="con-info-card" variants={staggerItem}
                  style={{ '--info-color': color }}>
                  <div className="con-info-icon">
                    <Icon />
                  </div>
                  <span className="con-info-text">{label}</span>
                  <div className="con-info-glow" />
                </motion.div>
              ))}
            </StaggerGrid>

            {/* Map card */}
            <RevealOnScroll variant="fadeUp" delay={0.25}>
              <div className="con-map-card">
                <div className="con-map-visual">
                  <div className="con-map-grid" />
                  <div className="con-map-icon-wrap">
                    <IconMap />
                  </div>
                  {/* Decorative pin pulse */}
                  <div className="con-map-pin">
                    <div className="con-pin-dot" />
                    <div className="con-pin-ring" />
                  </div>
                </div>
                <div className="con-map-footer">
                  <div>
                    <div className="con-map-title">{c.mapTitle || 'Chorvoq, Tashkent Region'}</div>
                    <div className="con-map-sub">Uzbekistan</div>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/PgHEEa95VYGmd5ow7"
                    target="_blank"
                    rel="noreferrer"
                    className="con-map-btn"
                  >
                    {c.openMap || 'Xaritada ko\'rish'}
                    <IconExternalLink />
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* ── Right: form ── */}
          <div className="con-right">
            <RevealOnScroll variant="fadeLeft">
              <div className="con-form-header">
                <h2 className="con-section-heading">{c.partnershipTitle}</h2>
                <p className="con-form-sub">{c.partnershipDesc}</p>
              </div>
            </RevealOnScroll>

            {submitSuccess ? (
              <RevealOnScroll variant="scaleUp">
                <div className="con-success">
                  <div className="con-success-ring">
                    <div className="con-success-icon"><IconCheck /></div>
                  </div>
                  <h3 className="con-success-title">Xabar yuborildi!</h3>
                  <p className="con-success-text">
                    {c.form.success || "Rahmat! Tez orada siz bilan bog'lanamiz."}
                  </p>
                </div>
              </RevealOnScroll>
            ) : (
              <RevealOnScroll variant="fadeUp" delay={0.1}>
                <form className="con-form" onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className={`con-field ${focused.name || form.name ? 'active' : ''}`}>
                    <label className="con-field-label" htmlFor="cf-name">{c.form.name}</label>
                    <input
                      id="cf-name"
                      className="con-field-input"
                      placeholder={c.form.name}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocused(f => ({ ...f, name: true }))}
                      onBlur={() => setFocused(f => ({ ...f, name: false }))}
                      required
                    />
                    <div className="con-field-bar" />
                  </div>

                  {/* Email */}
                  <div className={`con-field ${focused.email || form.email ? 'active' : ''}`}>
                    <label className="con-field-label" htmlFor="cf-email">{c.form.email}</label>
                    <input
                      id="cf-email"
                      type="email"
                      className="con-field-input"
                      placeholder={c.form.email}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused(f => ({ ...f, email: true }))}
                      onBlur={() => setFocused(f => ({ ...f, email: false }))}
                      required
                    />
                    <div className="con-field-bar" />
                  </div>

                  {/* Message */}
                  <div className={`con-field con-field-textarea ${focused.message || form.message ? 'active' : ''}`}>
                    <label className="con-field-label" htmlFor="cf-message">{c.form.message}</label>
                    <textarea
                      id="cf-message"
                      className="con-field-input"
                      placeholder={c.form.message}
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      onFocus={() => setFocused(f => ({ ...f, message: true }))}
                      onBlur={() => setFocused(f => ({ ...f, message: false }))}
                      required
                    />
                    <div className="con-field-bar" />
                  </div>

                  {error && (
                    <div className="con-error">
                      {typeof error === 'string' ? error : "Xatolik yuz berdi. Qaytadan urinib ko'ring."}
                    </div>
                  )}

                  <button type="submit" className="con-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="con-btn-loading">
                        <span className="con-spinner" />
                        Yuborilmoqda…
                      </span>
                    ) : (
                      <>
                        <IconSend />
                        {c.form.submit}
                      </>
                    )}
                  </button>
                </form>
              </RevealOnScroll>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
