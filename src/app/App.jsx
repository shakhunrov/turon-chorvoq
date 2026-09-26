import { useEffect, useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LangProvider } from '../shared/i18n';
import { AdminAuthProvider } from '../shared/admin/adminAuth';
import { selectIsAuth } from '../features/auth';
import Navbar from '../widgets/navbar/Navbar';
import Seo from '../shared/seo/Seo';
import Footer from '../widgets/footer/Footer';
import StickyCTA from '../widgets/sticky-cta/StickyCTA';
import Home from '../pages/home/Home';
import EditableHome from '../pages/home/EditableHome';
import AboutCampus from '../pages/about-campus/AboutCampus';
import EditableAboutCampus from '../pages/about-campus/EditableAboutCampus';
import AboutVision from '../pages/about-vision/AboutVision';
import EditableAboutVision from '../pages/about-vision/EditableAboutVision';
import AboutLeadership from '../pages/about-leadership/AboutLeadership';
import EditableAboutLeadership from '../pages/about-leadership/EditableAboutLeadership';
import AboutWhyTis from '../pages/about-why-tis/AboutWhyTis';
import Education from '../pages/education/Education';
import EditableEducation from '../pages/education/EditableEducation';
import Partnerships from '../pages/partnerships/Partnerships';
import EditablePartnerships from '../pages/partnerships/EditablePartnerships';
import Careers from '../pages/careers/Careers';
import EditableCareers from '../pages/careers/EditableCareers';
import News from '../pages/news/News';
import Admissions from '../pages/admissions/Admissions';
import Contact from '../pages/contact/Contact';
import Policies from '../pages/policies/Policies';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { useSmoothScroll } from '../shared/hooks/useSmoothScroll';
import ToastHost from '../shared/toast/ToastHost';
import '../app/globals.css';
import '../pages/admin/AdminDashboard.css';

// Protected route wrapper
function ProtectedAdminRoute({ children }) {
  const isAuth = useSelector(selectIsAuth);
  return isAuth ? children : <Navigate to="/admin" replace />;
}

// Public site layout
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <StickyCTA />
    </>
  );
}

// Sahifadan sahifaga o'tganda tepaga (hash bo'lsa tegmaymiz)
function ScrollToTop() {
  const { key, hash, pathname } = useLocation();
  // Meta Pixel: SPA'da sahifa almashganda PageView (birinchisini index.html'dagi kod yuboradi)
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) { firstRoute.current = false; return; }
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
  }, [pathname]);
  useLayoutEffect(() => {
    if (hash) return;
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto'; // globals.css dagi smooth animatsiya scrollni to'xtatib qo'ymasin
    const toTop = () => {
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      html.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    toTop();
    // sahifa kontenti keyin yuklansa/balandligi o'zgarsa ham tepada qolsin
    const t1 = setTimeout(toTop, 50);
    const t2 = setTimeout(() => { toTop(); html.style.scrollBehavior = prev; }, 250);
    return () => { clearTimeout(t1); clearTimeout(t2); html.style.scrollBehavior = prev; };
  }, [key]);
  return null;
}

export default function App() {
  useSmoothScroll();

  return (
    <LangProvider>
      <AdminAuthProvider>
        <ToastHost />
        <BrowserRouter>
          <ScrollToTop />
          <Seo />
          <Routes>
            {/* Admin routes (no public navbar/footer) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                 </ProtectedAdminRoute>
              }
            />

            {/* Editable routes (admin edit mode) */}
            <Route path="/editable/*" element={
              <ProtectedAdminRoute>
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<EditableHome />} />
                  <Route path="/about" element={<Navigate to="/editable/about/vision" replace />} />
                  <Route path="/about/campus" element={<EditableAboutCampus />} />
                  <Route path="/about/vision" element={<EditableAboutVision />} />
                  <Route path="/about/leadership" element={<EditableAboutLeadership />} />
                  <Route path="/about/why-tis" element={<AboutWhyTis />} />
                  <Route path="/education" element={<EditableEducation />} />
                  <Route path="/partnerships" element={<EditablePartnerships />} />
                  <Route path="/careers" element={<EditableCareers />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/admissions" element={<Admissions />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/policies" element={<Policies />} />
                  <Route path="*" element={<Navigate to="/editable/" replace />} />
                </Routes>
              </PublicLayout>
              </ProtectedAdminRoute>
            } />

            {/* Public routes */}
            <Route path="/*" element={
              <PublicLayout>
                <Routes>

                  <Route path="/" element={<EditableHome />} />
                  <Route path="/about" element={<Navigate to="/about/vision" replace />} />
                  <Route path="/about/campus" element={<EditableAboutCampus />} />
                  <Route path="/about/vision" element={<EditableAboutVision />} />
                  <Route path="/about/leadership" element={<EditableAboutLeadership />} />
                  <Route path="/about/why-tis" element={<AboutWhyTis />} />
                  <Route path="/education" element={<EditableEducation />} />
                  <Route path="/partnerships" element={<EditablePartnerships />} />
                  <Route path="/careers" element={<EditableCareers />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/admissions" element={<Admissions />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/policies" element={<Policies />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </PublicLayout>
            } />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </LangProvider>
  );
}
