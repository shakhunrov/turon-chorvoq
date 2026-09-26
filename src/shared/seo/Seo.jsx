import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../i18n';
import { PAGES, OG_IMAGE, OG_LOCALE, fill, pageFor, branchOf, buildJsonLd } from './seoData';

const upsert = (selector, create, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};
const meta = (key, content, prop = false) =>
  upsert(`meta[${prop ? 'property' : 'name'}="${key}"]`, 'meta', { [prop ? 'property' : 'name']: key, content });

/**
 * Har sahifada <title>, description, canonical, Open Graph/Twitter, robots va JSON-LD (School)
 * ni domen (filial), sahifa va til bo'yicha yangilaydi. Statik boshlang'ich meta'lar
 * (index.html) domen bo'yicha deploy paytida qo'yiladi — bu komponent sahifa almashganda
 * ularni to'g'rilaydi (Google JavaScript'ni ishga tushiradi).
 */
export default function Seo() {
  const { pathname } = useLocation();
  const { lang } = useLang();

  useEffect(() => {
    const host = window.__PRERENDER_HOST__ || window.location.hostname;
    const branchId = Number(localStorage.getItem('globalBranchId')) || 6;
    const name = branchOf(branchId)?.name || 'Chorvoq';
    const l = ['uz', 'ru', 'en'].includes(lang) ? lang : 'uz';
    const isPrivate = /^\/(admin|editable)/.test(pathname);
    const page = pageFor(pathname);
    const home = PAGES[0];
    const title = fill((page || home).title[l], name);
    const desc = fill((page || home).desc[l], name);
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    const canonical = `https://${host}${isPrivate || !page ? '/' : path}`;

    document.documentElement.lang = l;
    document.title = isPrivate ? `Admin | TIS ${name}` : title;
    meta('description', desc);
    meta('robots', isPrivate ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    upsert('link[rel="canonical"]', 'link', { rel: 'canonical', href: canonical });

    meta('og:type', 'website', true);
    meta('og:site_name', `Turon International School — ${name}`, true);
    meta('og:title', title, true);
    meta('og:description', desc, true);
    meta('og:url', canonical, true);
    meta('og:image', OG_IMAGE, true);
    meta('og:image:width', '1200', true);
    meta('og:image:height', '630', true);
    meta('og:locale', OG_LOCALE[l], true);
    meta('twitter:card', 'summary_large_image');
    meta('twitter:title', title);
    meta('twitter:description', desc);
    meta('twitter:image', OG_IMAGE);

    const ld = upsert('script[data-seo="ld"]', 'script', { type: 'application/ld+json', 'data-seo': 'ld' });
    ld.textContent = JSON.stringify(buildJsonLd(branchId, host));
  }, [pathname, lang]);

  return null;
}
