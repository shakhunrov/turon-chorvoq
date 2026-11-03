import { Link } from 'react-router-dom';
import { EditableText, EditableImage } from '../editable';
import { useLang } from '../i18n';
import defaultPhoto from '../assets/img/counselor.webp';
import './Counselor.css';

const Icon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICONS = [
  <Icon key="a" d={<><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>} />,
  <Icon key="b" d={<><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></>} />,
  <Icon key="c" d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>} />,
];

export default function Counselor({ data, onSave, compact = false, moreTo = '/admissions' }) {
  const { t } = useLang();
  const d = { ...t.counselor, ...(data || {}) };
  const set = (k) => (v) => onSave({ ...d, [k]: v });
  const photo = typeof d.image === 'string' && d.image
    ? d.image
    : d.image instanceof File ? URL.createObjectURL(d.image) : defaultPhoto;

  return (
    <section className={`section counselor-section ${compact ? 'counselor-compact' : ''}`}>
      <div className="container">
        <div className="counselor-card glass-card">
          <div className="counselor-photo-wrap">
            <EditableImage overlay onSave={(file) => onSave({ ...d, image: file })} />
            <img src={photo} alt={d.name} className="counselor-photo" loading="lazy" />
          </div>
          <div className="counselor-body">
            <span className="section-label"><EditableText value={d.label} onSave={set('label')} label="Yorliq" /></span>
            <h2 className="counselor-title"><EditableText value={d.title} onSave={set('title')} label="Sarlavha" /></h2>
            <h3 className="counselor-name"><EditableText value={d.name} onSave={set('name')} label="Ism" /></h3>
            <p className="counselor-role"><EditableText value={d.role} onSave={set('role')} label="Lavozim" /></p>
            <p className="counselor-text"><EditableText value={d.text} onSave={set('text')} label="Matn" multiline /></p>
            {!compact && (
              <ul className="counselor-points">
                {[1, 2, 3].map((n, i) => (
                  <li key={n}>{ICONS[i]}<EditableText value={d[`point${n}`]} onSave={set(`point${n}`)} label="Punkt" /></li>
                ))}
              </ul>
            )}
            <div className="counselor-actions">
              {compact ? (
                <Link to={moreTo} className="btn btn-primary">{d.more} →</Link>
              ) : (
                <>
                  <a className="btn btn-primary" href={`mailto:${d.email}`}>
                    <EditableText value={d.cta} onSave={set('cta')} label="Tugma matni" />
                  </a>
                  <span className="counselor-email"><EditableText value={d.email} onSave={set('email')} label="Email" /></span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
