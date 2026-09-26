// SEO ma'lumotlari — ham brauzerdagi <Seo> komponenti, ham build paytidagi domen bo'yicha
// statik HTML/robots/sitemap generatori (scripts/seo-per-domain.mjs) shu yerdan oladi.
// Faqat oddiy JS (JSX va brauzer API'larisiz) — Node'da ham import qilinadi.
import { BRANCH_INFO } from '../config/branchInfo.js';

export const DOMAINS = {
  chorvoq: { host: 'chorvoq.tisedu.uz', branch: 6 },
  chirchiq: { host: 'chirchiq.tisedu.uz', branch: 8 },
  sergeli: { host: 'sergeli.tisedu.uz', branch: 9 },
  nurafshon: { host: 'nurafshon.tisedu.uz', branch: 10 },
};

export const OG_IMAGE = 'https://tisedu.uz/og-image.png';
export const MAIN_SITE = 'https://tisedu.uz';
export const OG_LOCALE = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' };

// {N} — filial nomi. Tavsiflar 110–160 belgi atrofida.
export const PAGES = [
  {
    path: '/', priority: '1.0',
    title: {
      uz: "Turon Xalqaro Maktabi — {N} filiali | Cambridge STEAM ta'limi",
      ru: 'Международная школа Turon — филиал {N} | Cambridge и STEAM',
      en: 'Turon International School — {N} campus | Cambridge STEAM education',
    },
    desc: {
      uz: "Turon Xalqaro Maktabi {N} filiali: inglizcha STEAM ta'limi, Cambridge dasturi, sun'iy intellekt va amaliy texnologiyalar. Qabul ochiq — hoziroq ariza qoldiring.",
      ru: 'Международная школа Turon, филиал {N}: обучение на английском по программе Cambridge и STEAM, ИИ и практические технологии. Приём открыт — оставьте заявку.',
      en: 'Turon International School, {N} campus: English-medium STEAM education, Cambridge curriculum, AI and applied technology. Admissions are open — apply today.',
    },
  },
  {
    path: '/about/vision', priority: '0.8',
    title: { uz: 'Missiya va qadriyatlar | TIS {N}', ru: 'Миссия и ценности | TIS {N}', en: 'Mission and values | TIS {N}' },
    desc: {
      uz: "Turon Xalqaro Maktabi {N} filialining missiyasi, qadriyatlari va ta'lim falsafasi: to'liq rivojlangan, mustaqil fikrlaydigan o'quvchilarni tarbiyalash.",
      ru: 'Миссия, ценности и образовательная философия филиала {N} международной школы Turon: воспитание всесторонне развитых, самостоятельно мыслящих учеников.',
      en: 'Mission, values and educational philosophy of Turon International School {N}: raising well-rounded, independent thinkers.',
    },
  },
  {
    path: '/about/campus', priority: '0.7',
    title: { uz: 'Kampus hayoti | TIS {N}', ru: 'Жизнь кампуса | TIS {N}', en: 'Campus life | TIS {N}' },
    desc: {
      uz: "TIS {N} kampusi: sinf xonalari, o'quvchi uylari, sport va tadbirlar. Maktab hayotidan suratlar va batafsil ma'lumot.",
      ru: 'Кампус TIS {N}: классы, дома учеников, спорт и мероприятия. Фотографии и подробности школьной жизни.',
      en: 'The TIS {N} campus: classrooms, student houses, sports and events. Photos and details of school life.',
    },
  },
  {
    path: '/about/leadership', priority: '0.7',
    title: { uz: 'Rahbariyat va jamoa | TIS {N}', ru: 'Руководство и команда | TIS {N}', en: 'Leadership and team | TIS {N}' },
    desc: {
      uz: "Turon Xalqaro Maktabi {N} filiali rahbariyati, maktab direktori murojaati va maslahat kengashi a'zolari.",
      ru: 'Руководство филиала {N} международной школы Turon: обращение директора и члены консультативного совета.',
      en: 'Leadership of Turon International School {N}: message from the director and advisory board members.',
    },
  },
  {
    path: '/about/why-tis', priority: '0.7',
    title: { uz: 'Nima uchun TIS | TIS {N}', ru: 'Почему TIS | TIS {N}', en: 'Why TIS | TIS {N}' },
    desc: {
      uz: "Nima uchun Turon Xalqaro Maktabi? Arzon xalqaro ta'lim, STEAM, o'quvchi markazli falsafa, kuchli pedagoglar va isbotlangan natijalar.",
      ru: 'Почему Turon International School? Доступное международное образование, STEAM, ученикоцентрированный подход, сильные педагоги и доказанные результаты.',
      en: 'Why Turon International School? Affordable international education, STEAM, student-centred philosophy, outstanding educators and proven results.',
    },
  },
  {
    path: '/education', priority: '0.8',
    title: { uz: "Ta'lim dasturi va ko'nikmalar | TIS {N}", ru: 'Образовательная программа и навыки | TIS {N}', en: 'Curriculum and skills | TIS {N}' },
    desc: {
      uz: "TIS {N} ta'lim dasturi: Cambridge, STEAM, sun'iy intellekt va kelajak ko'nikmalari — tanqidiy fikrlash, hamkorlik, ijodkorlik.",
      ru: 'Образовательная программа TIS {N}: Cambridge, STEAM, ИИ и навыки будущего — критическое мышление, сотрудничество, креативность.',
      en: 'The TIS {N} curriculum: Cambridge, STEAM, AI and future skills — critical thinking, collaboration and creativity.',
    },
  },
  {
    path: '/partnerships', priority: '0.6',
    title: { uz: 'Hamkorlik | TIS {N}', ru: 'Партнёрство | TIS {N}', en: 'Partnerships | TIS {N}' },
    desc: {
      uz: "Turon Xalqaro Maktablari bilan hamkorlik: xalqaro tarmoq, o'quvchilar uchun imkoniyatlar va hamkor bo'lish tartibi.",
      ru: 'Партнёрство со школами Turon: международная сеть, возможности для учеников и порядок сотрудничества.',
      en: 'Partner with Turon International Schools: our international network, opportunities for students and how to collaborate.',
    },
  },
  {
    path: '/careers', priority: '0.6',
    title: { uz: "Ish o'rinlari va vakansiyalar | TIS {N}", ru: 'Вакансии и карьера | TIS {N}', en: 'Careers and vacancies | TIS {N}' },
    desc: {
      uz: "TIS {N} jamoasiga qo'shiling: ochiq vakansiyalar, ishga qabul bosqichlari va CV yuborish. Kasbiy o'sish imkoniyatlari.",
      ru: 'Присоединяйтесь к команде TIS {N}: открытые вакансии, этапы найма и отправка резюме. Возможности профессионального роста.',
      en: 'Join the TIS {N} team: open vacancies, hiring steps and CV submission. Professional growth opportunities.',
    },
  },
  {
    path: '/news', priority: '0.7',
    title: { uz: "Yangiliklar va e'lonlar | TIS {N}", ru: 'Новости и объявления | TIS {N}', en: 'News and announcements | TIS {N}' },
    desc: {
      uz: "Turon Xalqaro Maktabi {N} filialining so'nggi yangiliklari, tadbirlari va e'lonlari.",
      ru: 'Последние новости, мероприятия и объявления филиала {N} международной школы Turon.',
      en: 'Latest news, events and announcements from Turon International School {N}.',
    },
  },
  {
    path: '/admissions', priority: '0.9',
    title: { uz: "Qabul — ariza qoldiring | TIS {N}", ru: 'Приём — подать заявку | TIS {N}', en: 'Admissions — apply now | TIS {N}' },
    desc: {
      uz: "TIS {N} ga qabul: ariza topshirish tartibi, bosqichlar va kerakli hujjatlar. Onlayn ariza qoldiring — jamoamiz 24 soat ichida bog'lanadi.",
      ru: 'Приём в TIS {N}: порядок подачи заявки, этапы и документы. Оставьте онлайн-заявку — команда свяжется в течение 24 часов.',
      en: 'Admissions at TIS {N}: how to apply, steps and documents. Submit an online application — we will contact you within 24 hours.',
    },
  },
  {
    path: '/contact', priority: '0.8',
    title: { uz: 'Aloqa — manzil va telefon | TIS {N}', ru: 'Контакты — адрес и телефон | TIS {N}', en: 'Contact — address and phone | TIS {N}' },
    desc: {
      uz: "TIS {N} bilan bog'lanish: manzil, telefon, xarita va murojaat formasi.",
      ru: 'Связаться с TIS {N}: адрес, телефон, карта и форма обращения.',
      en: 'Contact TIS {N}: address, phone, map and enquiry form.',
    },
  },
  {
    path: '/policies', priority: '0.3',
    title: { uz: 'Siyosatlar va shartlar | TIS {N}', ru: 'Политики и условия | TIS {N}', en: 'Policies and terms | TIS {N}' },
    desc: {
      uz: "Maxfiylik siyosati, bolalarni himoya qilish siyosati va foydalanish shartlari — Turon Xalqaro Maktabi.",
      ru: 'Политика конфиденциальности, защита детей и условия использования — международная школа Turon.',
      en: 'Privacy policy, safeguarding policy and terms of use — Turon International School.',
    },
  },
];

export const fill = (s, name) => s.replace(/\{N\}/g, name);

export const pageFor = (pathname) => {
  const p = (pathname || '/').replace(/^\/editable/, '') || '/';
  const clean = p.length > 1 ? p.replace(/\/+$/, '') : p;
  return PAGES.find((x) => x.path === clean) || null;
};

export const branchOf = (branchId) => BRANCH_INFO[branchId] || null;

export const buildJsonLd = (branchId, host) => {
  const bi = BRANCH_INFO[branchId] || {};
  const same = Object.values(bi.social || {}).filter(Boolean);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: `Turon International School — ${bi.name || ''}`.trim(),
    url: `https://${host}/`,
    logo: `${MAIN_SITE}/og-image.png`,
    image: OG_IMAGE,
    email: bi.email || 'info@tisedu.uz',
    parentOrganization: { '@type': 'Organization', name: 'Turon International School', url: `${MAIN_SITE}/` },
    address: { '@type': 'PostalAddress', streetAddress: bi.address || '', addressCountry: 'UZ' },
  };
  if (bi.phone) ld.telephone = bi.phone.replace(/\s+/g, '');
  if (same.length) ld.sameAs = same;
  if (bi.mapUrl) ld.hasMap = bi.mapUrl;
  return ld;
};
