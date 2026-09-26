import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useLang } from '../../shared/i18n';
import { selectIsAuth } from '../../features/auth';
import LanguageSwitcher from '../../features/language-switcher/LanguageSwitcher';
import { ChevronUp, ChevronDown, MessageCircle, ExternalLink, Play, ThumbsUp, MapPin, Mail, Phone } from 'lucide-react';
import { useAnimateOnScroll, staggerContainer, fadeUp } from '../../shared/hooks/useScrollAnimation';
import { useBranchInfo } from '../../shared/config/useBranchInfo';
import { EditableText, EditableList, EditableImage } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './Footer.css';
import logo from "../../shared/assets/logo/turonLogo.png"

const CONTACT_KEYS = ['address', 'email', 'phone'];
const SOCIAL_KEYS = ['instagram', 'telegram', 'facebook', 'youtube'];

// Tartibni saqlangan massiv bo'yicha chiqaradi (yangi/yo'qolgan kalitlar oxiriga qo'shiladi)
const ordered = (saved, all) => [...(saved || []).filter((k) => all.includes(k)), ...all.filter((k) => !(saved || []).includes(k))];

// Edit rejimida element yonidagi yuqoriga/pastga tugmalari
function MoveButtons({ index, total, onMove }) {
  const btn = { display: 'inline-flex', width: 22, height: 22, alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 6, background: 'rgba(255,255,255,0.16)', color: '#fff', cursor: 'pointer', padding: 0 };
  return (
    <span style={{ display: 'inline-flex', gap: 4, marginLeft: 6 }}>
      <button type="button" style={{ ...btn, opacity: index === 0 ? 0.3 : 1 }} disabled={index === 0} title="Yuqoriga" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMove(-1); }}><ChevronUp size={14} /></button>
      <button type="button" style={{ ...btn, opacity: index === total - 1 ? 0.3 : 1 }} disabled={index === total - 1} title="Pastga" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMove(1); }}><ChevronDown size={14} /></button>
    </span>
  );
}

const move = (list, i, d) => {
  const next = [...list];
  const j = i + d;
  if (j < 0 || j >= next.length) return list;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export default function Footer() {
  const { t } = useLang();

  const isEditableMode = useSelector(selectIsAuth);
  const basePrefix = isEditableMode ? '/editable' : '';

  const inner = useAnimateOnScroll(0.08);

  const defaultLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.about, href: '/about/vision' },
    { label: t.nav.education, href: '/education' },
    { label: t.nav.partnerships, href: '/partnerships' },
    { label: t.nav.careers, href: '/careers' },
    { label: t.nav.news, href: '/news' },
    { label: t.nav.admissions, href: '/admissions' },
    { label: t.nav.contact, href: '/contact' },
  ];
  const defaultAccred = [
    { icon: '🎓', text: 'Cambridge Assessment International Education' },
    { icon: '🌐', text: 'STEAM Certified' },
    { icon: '🤖', text: 'AI-Integrated Learning' },
  ];

  // Haqiqiy filial ma'lumotlari (branchInfo.js) — topilmasa i18n'dagi zaxira matnlar
  const { info: bi, save: saveInfo } = useBranchInfo();
  const { sections, handleSaveSection } = useEditableSections('footer', { cols: { linksTitle: t.footer.links, accTitle: t.footer.accreditation, rights: t.footer.rights }, links: { items: defaultLinks }, accred: { items: defaultAccred }, brand: { name: 'TURON', sub: `International School · ${bi?.name || 'Chorvoq'}`, tagline: t.footer.tagline } });
  const brandSave = (patch) => handleSaveSection('brand', { ...sections.brand, ...patch });
  const cols = sections.cols || {};
  const linkItems = sections.links?.items || defaultLinks;
  const accredItems = sections.accred?.items || defaultAccred;
  const withPrefix = (h) => (h.startsWith('/') && !h.startsWith('/editable') ? basePrefix + h : h);
  const logoFile = sections.brand?.image;
  const logoSrc = useMemo(() => {
    if (logoFile instanceof File) return URL.createObjectURL(logoFile);
    return typeof logoFile === 'string' && logoFile ? logoFile : logo;
  }, [logoFile]);
  const contactOrder = ordered(bi?.order, CONTACT_KEYS);
  const socialOrder = ordered(bi?.socialOrder, SOCIAL_KEYS);
  const tagline = sections.brand?.tagline || t.footer.tagline;
  const branchName = bi?.name || 'Chorvoq';
  const address = bi?.address || t.contact.address;
  const email = bi?.email || t.contact.email;
  const phone = bi?.phone || t.contact.phone;
  const mapUrl = bi?.mapUrl || 'https://maps.google.com';
  // Eski lucide-react (1.8.0) da brend ikonkalari yo'q — mavjud generic ikonkalar bilan
  const socials = [
    { key: 'instagram', label: 'Instagram', Icon: MessageCircle, href: bi?.social?.instagram },
    { key: 'telegram', label: 'Telegram', Icon: ExternalLink, href: bi?.social?.telegram },
    { key: 'facebook', label: 'Facebook', Icon: ThumbsUp, href: bi?.social?.facebook },
    { key: 'youtube', label: 'YouTube', Icon: Play, href: bi?.social?.youtube },
  ].filter((s) => s.href).sort((a, b) => socialOrder.indexOf(a.key) - socialOrder.indexOf(b.key));


  return (
    <footer className="footer">
      <div className="footer-glow" />
      <motion.div
        className="container footer-inner"
        ref={inner.ref}
        variants={staggerContainer(0.14, 0.05)}
        initial="hidden"
        animate={inner.animate}
      >
        {/* Brand */}
        <motion.div className="footer-brand" variants={fadeUp}>
          <div className="footer-logo">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img width={70} src={logoSrc} alt="" />
              <EditableImage overlay style={{ top: -8, right: -8 }} onSave={(file) => brandSave({ image: file })} />
            </div>
            <div>
              <div className="footer-logo-name"><EditableText value={sections.brand?.name || 'TURON'} onSave={(v) => brandSave({ name: v })} label="Nomi" /></div>
              <div className="footer-logo-sub"><EditableText value={sections.brand?.sub || `International School · ${branchName}`} onSave={(v) => brandSave({ sub: v })} label="Tagnomi" /></div>
            </div>
          </div>
          <p className="footer-tagline">
            <EditableText value={tagline} onSave={(v) => brandSave({ tagline: v })} label="Shior" multiline />
          </p>
          <div className="footer-contact-items">
            {contactOrder.map((k, i) => {
              if (k === 'phone' && !phone && !isEditableMode) return null;
              const cfg = {
                address: { href: mapUrl, Icon: MapPin, value: address, label: 'Manzil', ext: true },
                email: { href: `mailto:${email}`, Icon: Mail, value: email, label: 'Email' },
                phone: { href: `tel:${phone}`, Icon: Phone, value: phone, label: 'Telefon' },
              }[k];
              return (
                <a key={k} href={cfg.href} className="footer-contact-item" {...(cfg.ext ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <cfg.Icon size={14} />
                  <EditableText value={cfg.value} onSave={(v) => saveInfo({ [k]: v })} label={cfg.label} />
                  {isEditableMode && <MoveButtons index={i} total={contactOrder.length} onMove={(d) => saveInfo({ order: move(contactOrder, i, d) })} />}
                </a>
              );
            })}
          </div>
          {isEditableMode && (
            <div className="footer-contact-items" style={{ marginTop: 8 }}>
              {[...socialOrder.map((k) => [k, { instagram: 'Instagram', telegram: 'Telegram', facebook: 'Facebook', youtube: 'YouTube' }[k]]), ['mapUrl', 'Xarita havolasi']].map(([k, lab], idx) => (
                <div key={k} className="footer-contact-item" style={{ gap: 6 }}>
                  <span>{lab}:</span>
                  <EditableText
                    value={k === 'mapUrl' ? (bi?.mapUrl || '') : (bi?.social?.[k] || '')}
                    onSave={(v) => saveInfo({ [k]: v.trim() })}
                    label={`${lab} havolasi`}
                  />
                  {k !== 'mapUrl' && <MoveButtons index={idx} total={socialOrder.length} onMove={(d) => saveInfo({ socialOrder: move(socialOrder, idx, d) })} />}
                </div>
              ))}
            </div>
          )}
          {socials.length > 0 && (
            <div className="footer-social">
              {socials.map(({ key, label, Icon, href }) => (
                <a key={key} href={href} className="social-btn" aria-label={label} target="_blank" rel="noreferrer">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div className="footer-col" variants={fadeUp}>
          <h4 className="footer-col-title">
            <EditableText value={cols.linksTitle} onSave={(v) => handleSaveSection('cols', { ...cols, linksTitle: v })} label="Sarlavha" />
          </h4>
          <div className="footer-links-list">
            <EditableList
              items={linkItems}
              onSave={(items) => handleSaveSection('links', { items })}
              defaultItem={{ label: '', href: '/' }}
              itemName="Havola"
              renderItem={(l) => <Link to={withPrefix(l.href || '/')} className="footer-link">{l.label}</Link>}
            />
          </div>
        </motion.div>

        {/* Accreditations & Lang */}
        <motion.div className="footer-col" variants={fadeUp}>
          <h4 className="footer-col-title">
            <EditableText value={cols.accTitle} onSave={(v) => handleSaveSection('cols', { ...cols, accTitle: v })} label="Sarlavha" />
          </h4>
          <div className="accreditation-badges">
            <EditableList
              items={accredItems}
              onSave={(items) => handleSaveSection('accred', { items })}
              defaultItem={{ icon: '🎓', text: '' }}
              itemName="Akkreditatsiya"
              renderItem={(a) => (
                <div className="accred-badge">
                  <span className="accred-icon">{a.icon}</span>
                  <span>{a.text}</span>
                </div>
              )}
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <LanguageSwitcher />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <EditableText value={cols.rights} onSave={(v) => handleSaveSection('cols', { ...cols, rights: v })} label="Matn" />
          <div className="footer-policy-links">
            <Link to="/policies#privacy">{t.footer.policies}</Link>
            <Link to="/policies#safeguarding">{t.footer.safeguarding}</Link>
            <Link to="/policies#terms">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
