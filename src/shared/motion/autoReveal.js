import './autoReveal.css';

/**
 * Avtomatik "scroll-reveal" animatsiyasi — sayt bo'ylab hamma sahifadagi sarlavha, matn, karta,
 * rasm va tugmalar ekranga kirganda pastdan yumshoq paydo bo'ladi (bir qatordagilar ketma-ket).
 *
 * Xavfsizlik qoidalari:
 *  - `prefers-reduced-motion` yoqilgan bo'lsa yoki prerender paytida (window.__NO_REVEAL__) ishlamaydi;
 *  - o'z animatsiyasi bor elementlarga tegmaydi (framer-motion inline opacity/transform, CSS animation,
 *    hero, karusel, modal, navbar, fixed/sticky elementlar);
 *  - element ichidagi elementlar alohida animatsiyalanmaydi (faqat eng tashqi blok).
 */
const SELECTOR = [
    'h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'table', 'form', 'figure', 'img',
    '.btn', '.section-label', '.divider',
    '[class*="card"]', '[class*="Card"]', '[class*="box"]', '[class*="Box"]',
    '[class*="grid"] > *', '[class*="Grid"] > *', '[class*="wrapper"] > *', '[class*="__wrapper"] > *',
].join(',');

const SKIP_ANCESTORS = [
    'nav', 'header', '.navbar', '.sticky-cta', '.edit-modal-overlay', '.edit-modal', '.ant-modal-root', '.ant-select-dropdown',
    '.react-multi-carousel-list', '.swiper', '[class*="hero"]', '[class*="Hero"]', '.hero', '[data-no-reveal]',
    '.toast', '.editable-image-overlay',
].join(',');

const io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('rv-in');
            io.unobserve(e.target);
        });
    }, {threshold: 0.08, rootMargin: '0px 0px -6% 0px'})
    : null;

const hasOwnMotion = (el) => {
    if (el.closest('[style*="opacity"], [style*="transform"]')) return true;
    const cs = getComputedStyle(el);
    if (cs.animationName && cs.animationName !== 'none') return true;
    if (cs.position === 'fixed' || cs.position === 'sticky' || cs.position === 'absolute') return true;
    if (cs.transform && cs.transform !== 'none') return true; // o'z transformi bor (markazlash va h.k.)
    if (parseFloat(cs.opacity) < 1) return true; // ataylab xira qilingan
    return false;
};

function scan(root) {
    if (!io) return;
    const list = root.querySelectorAll ? root.querySelectorAll(SELECTOR) : [];
    const perParent = new Map();
    list.forEach((el) => {
        if (el.dataset.rv || el.classList.contains('rv')) return;
        if (el.closest(SKIP_ANCESTORS)) return;
        if (el.parentElement && el.parentElement.closest('.rv')) return; // ichma-ich animatsiya yo'q
        if (hasOwnMotion(el)) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return; // ko'rinmaydigan (yopiq tab va h.k.) — keyinroq MutationObserver ushlaydi
        el.dataset.rv = '1';
        el.classList.add('rv');
        const n = perParent.get(el.parentElement) || 0;
        perParent.set(el.parentElement, n + 1);
        el.style.setProperty('--rv-d', `${Math.min(n, 6) * 70}ms`);
        io.observe(el);
    });
}

export function initAutoReveal() {
    if (typeof window === 'undefined' || window.__NO_REVEAL__ || window.__REVEAL_ON__) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.__REVEAL_ON__ = true;
    let timer = null;
    const schedule = () => {
        clearTimeout(timer);
        timer = setTimeout(() => scan(document.body), 120);
    };
    new MutationObserver(schedule).observe(document.body, {childList: true, subtree: true});
    schedule();
}
