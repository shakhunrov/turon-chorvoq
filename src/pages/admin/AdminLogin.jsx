import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, selectAuth, clearAuthError } from '../../features/auth';
import { exchangeSiteSso } from '../../shared/api/adminTisApi';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, loading, error } = useSelector(selectAuth);

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  // office.gennis.uz'dagi "<Filial> web site change" tugmasi shu sahifaga
  // `?sso=<token>` bilan yuboradi — parol so'ramasdan avtomatik kirish uchun.
  // Muvaffaqiyatli bo'lsa to'liq sahifa yangilanadi (dashboard'ga o'tadi),
  // shunda Redux/authSlice sessionStorage'dagi yangi tokenni o'qib boshlaydi.
  const [ssoState, setSsoState] = useState(() => (new URLSearchParams(window.location.search).get('sso') ? 'loading' : null));

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('sso');
    if (!token) return;
    let cancelled = false;
    exchangeSiteSso(token)
      .then(() => {
        if (!cancelled) window.location.replace('/admin/dashboard');
      })
      .catch(() => {
        if (!cancelled) setSsoState('error');
      });
    return () => { cancelled = true; };
  }, []);

  // Redirect when already authenticated
  useEffect(() => {
    if (isAuth) navigate('/admin/dashboard');
  }, [isAuth, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk({ username: form.username, password: form.password }));
  };

  if (ssoState === 'loading') {
    return (
      <div className="admin-login-page">
        <div className="admin-login-bg">
          <div className="al-orb al-orb-1" />
          <div className="al-orb al-orb-2" />
          <div className="al-grid" />
        </div>
        <div className="admin-login-card">
          <div className="al-header">
            <div className="al-logo"><Shield size={28} strokeWidth={1.5} /></div>
            <h1 className="al-title">Kirilmoqda…</h1>
            <p className="al-subtitle">Office orqali avtomatik kirish</p>
          </div>
          <span className="al-spinner" style={{ margin: '12px auto' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      {/* Background */}
      <div className="admin-login-bg">
        <div className="al-orb al-orb-1" />
        <div className="al-orb al-orb-2" />
        <div className="al-grid" />
      </div>

      <div className="admin-login-card">
        {/* Header */}
        <div className="al-header">
          <div className="al-logo">
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <h1 className="al-title">Boshqaruv Paneli</h1>
          <p className="al-subtitle">Turon xalqaro maktabi CMS</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="al-form">
          <div className="form-group">
            <label className="form-label">Foydalanuvchi nomi</label>
            <div className="al-input-wrap">
              <User size={16} className="al-input-icon" />
              <input
                className="form-input al-input"
                placeholder="admin"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Parol</label>
            <div className="al-input-wrap">
              <Lock size={16} className="al-input-icon" />
              <input
                className="form-input al-input al-input-pw"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="al-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {ssoState === 'error' && (
            <div className="al-error">Avtomatik kirish muddati o'tgan — office'ga qaytib qayta urinib ko'ring, yoki parol bilan kiring.</div>
          )}
          {error && <div className="al-error">{error}</div>}

          <button type="submit" className="btn btn-primary al-submit" disabled={loading}>
            {loading ? <span className="al-spinner" /> : null}
            {loading ? 'Kirilmoqmoqda…' : 'Tizimga kirish'}
          </button>
        </form>

        <div className="al-hint">
          <Lock size={12} /> Xavfsiz ulanish · TIS Boshqaruv paneli
        </div>
      </div>
    </div>
  );
}
