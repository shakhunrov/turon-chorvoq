// Filial bo'yicha haqiqiy aloqa ma'lumotlari (manzil, telefon, ijtimoiy tarmoqlar).
// Domen filialni avtomatik aniqlaydi (src/shared/admin/adminAuth.jsx bilan bir xil
// mantiq: chorvoq=6, sergeli=9, chirchiq=8, nurafshon=10), shuning uchun bu yerda ham branchId
// bo'yicha ajratilgan — Contact/Footer shu yerdan o'qiydi, i18n fayllaridagi
// (uz/ru/en.js) contact.address/phone/email endi FAQAT "ma'lumot topilmasa"gi
// zaxira (fallback) sifatida ishlatiladi.
//
// Manba: "turon sayt malumot.xlsx" (Chirchiq) va "turon_sayt_chek-list_uz_sodda.xlsx"
// (Sergeli) — 2026-09-22 da foydalanuvchi tomonidan yuborilgan.
// Chorvoq: "turon_sayt_chek-list_uz_sodda (2) (2).ods" (2026-09-25).

const DEFAULT_EMAIL = 'info@tisedu.uz';

export const BRANCH_INFO = {
  // Chirchiq
  8: {
    name: 'Chirchiq',
    address: "Toshkent viloyati, Chirchiq shahar, Temiryo'lovchilar ko'chasi 128A",
    phone: '+998 99 792 03 33',
    email: DEFAULT_EMAIL,
    mapUrl: 'https://maps.apple/p/oVUgH2MQUJSm9E',
    social: {
      instagram: 'https://www.instagram.com/turonschool_chirchiq',
      telegram: 'https://t.me/tis_chirchiq_info',
      facebook: 'https://www.facebook.com/share/1Bunwgo3zb/?mibextid=wwXIfr',
      youtube: '',
    },
  },
  // Sergeli
  9: {
    name: 'Sergeli',
    address: 'Toshkent shahar, Yangi Sergeli, 9/13',
    phone: '+998 94 310 33 33',
    email: DEFAULT_EMAIL,
    mapUrl: 'https://yandex.ru/navi?text=41.229213,69.218142',
    social: {
      instagram: 'https://www.instagram.com/turon_international_school',
      telegram: 'https://t.me/turon_international_school',
      facebook: 'https://www.facebook.com/share/1DDi5L5Ak5/',
      youtube: '',
    },
  },
  // Chorvoq
  6: {
    name: 'Chorvoq',
    address: "Toshkent viloyati, Bo'stonliq tumani, Besh-tut mahallasi, 16-maktab yonida",
    phone: '+998 94 310 33 33',
    email: DEFAULT_EMAIL,
    mapUrl: 'https://maps.app.goo.gl/zHSkKn2jud4St5B4A',
    social: {
      instagram: 'https://www.instagram.com/tis_chorvoq',
      telegram: 'https://t.me/+HiwBiPHPPl9iZGQy',
      facebook: '',
      youtube: '',
    },
  },
  // Nurafshon (NTA): "nta.xlsx1.xlsx" (2026-09-25). Telefon, Facebook, YouTube hali berilmagan.
  10: {
    name: 'Nurafshon',
    mapTitle: 'Nurafshon, Tashkent Region',
    address: "Toshkent viloyati, Nurafshon shahar, Toshkent yo'li ko'chasi 60-uy",
    phone: '',
    email: DEFAULT_EMAIL,
    mapUrl: 'https://maps.app.goo.gl/TstXjfPLQ3RH4MFV7',
    social: {
      instagram: '',
      telegram: 'https://t.me/nta_qabulxona',
      facebook: '',
      youtube: '',
    },
  },
};

// Joriy filial ma'lumotini oladi (branchId — localStorage'dagi 'globalBranchId').
// Chirchiq/Sergeli uchun bo'sh maydon bo'lsa yoki filial umuman topilmasa (Chorvoq
// yoki noma'lum), fallback qiymatlarga (i18n contact obyekti) tayanish uchun `null`
// qaytaradi — chaqiruvchi joyida `branchInfo?.field || fallback` shaklida ishlatiladi.
export function getBranchInfo() {
  const branchId = Number(localStorage.getItem('globalBranchId'));
  return BRANCH_INFO[branchId] || null;
}
