import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLang } from '../../shared/i18n';
import { selectIsAuth } from '../../features/auth';
import { Phone, GraduationCap, MapPin } from 'lucide-react';
import './StickyCTA.css';

export default function StickyCTA() {
  const { t } = useLang();

  // Tahrirlash rejimi haqiqiy login holatiga bog'liq
  const isEditableMode = useSelector(selectIsAuth);
  const basePrefix = isEditableMode ? '/editable' : '';

  return (
    <div className="sticky-cta">
      <Link to={basePrefix + "/admissions"} className="sticky-cta-btn primary">
        <GraduationCap size={14} /> {t.sticky.consult}
      </Link>
      <Link to={basePrefix + "/admissions"} className="sticky-cta-btn">
        <GraduationCap size={14} /> {t.sticky.admission}
      </Link>
      <Link to={basePrefix + "/contact"} className="sticky-cta-btn">
        <MapPin size={14} /> {t.sticky.tour}
      </Link>
    </div>
  );
}
