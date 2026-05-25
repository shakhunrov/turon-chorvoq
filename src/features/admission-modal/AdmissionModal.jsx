import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLang } from '../../shared/i18n';
import {
  submitAdmission,
  resetAdmissionStatus,
  selectAdmissionsLoading,
  selectAdmissionSubmitSuccess,
  selectAdmissionsError,
} from '../../features/admissions';
import { X } from 'lucide-react';
import './AdmissionModal.css';

const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11'];

export default function AdmissionModal({ onClose }) {
  const { t } = useLang();
  const m = t.admissions.modal;
  const dispatch = useDispatch();

  const loading = useSelector(selectAdmissionsLoading);
  const submitSuccess = useSelector(selectAdmissionSubmitSuccess);
  const error = useSelector(selectAdmissionsError);

  const [form, setForm] = useState({ name: '', phone: '', grade: '' });

  useEffect(() => {
    return () => dispatch(resetAdmissionStatus());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitAdmission({
      student_name: form.name,
      phone: form.phone,
      grade: form.grade,
      branch: localStorage.getItem("globalBranchId") || 9,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div className="modal-header">
          <div className="modal-icon">🎓</div>
          <h2 className="modal-title">{m.title}</h2>
        </div>
        {submitSuccess ? (
          <div className="modal-success">
            <div className="success-icon-wrap">
              <span className="success-icon">✅</span>
            </div>
            <div>
              <strong>Muvaffaqiyatli!</strong>
              <p>{m.success}</p>
            </div>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{m.namePlaceholder}</label>
              <input
                className="form-input"
                placeholder={m.namePlaceholder}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{m.phonePlaceholder}</label>
              <input
                className="form-input"
                placeholder="+998 __ ___ __ __"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                type="tel"
              />
            </div>
            <div className="form-group">
              <label className="form-label">{m.gradePlaceholder}</label>
              <select
                className="form-input"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                required
              >
                <option value="">{m.gradePlaceholder}</option>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {error && (
              <div className="modal-error">
                {typeof error === 'string' ? error : "Xatolik yuz berdi. Qaytadan urinib ko'ring."}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Yuborilmoqda…' : m.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
