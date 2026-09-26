import { useEffect, useState, useCallback } from 'react';
import { getBranchInfo } from './branchInfo';
import { getPageSections, savePageSection } from '../api/pageSections';
import { showToast } from '../toast/toast';

// Filial aloqa ma'lumotlari (manzil, telefon, email, xarita, ijtimoiy tarmoqlar) admin
// panelda ("site" sahifasi, "contact" bo'limi) tahrirlanadi. Til'ga bog'liq emas —
// uz/ru/en uchun bir xil saqlanadi. Saqlangan qiymat bo'lmasa branchInfo.js dagi
// boshlang'ich ma'lumot ko'rsatiladi. Footer va Contact sahifasi bir-biri bilan sinxron.
const PAGE = 'site';
const SECTION = 'contact';
const EVENT = 'branch-info-changed';
const FIELDS = ['address', 'phone', 'email', 'mapUrl'];
const SOCIALS = ['instagram', 'telegram', 'facebook', 'youtube'];

const merge = (base, saved) => {
  const info = { ...(base || {}), social: { ...(base?.social || {}) } };
  if (!saved) return info;
  FIELDS.forEach((k) => { if (typeof saved[k] === 'string') info[k] = saved[k]; });
  SOCIALS.forEach((k) => { if (typeof saved[k] === 'string') info.social[k] = saved[k]; });
  return info;
};

let cache = null; // { branchId, saved }

export function useBranchInfo() {
  const branchId = localStorage.getItem('globalBranchId');
  const [saved, setSaved] = useState(cache?.branchId === branchId ? cache.saved : null);

  useEffect(() => {
    let alive = true;
    const onChange = () => { if (alive && cache) setSaved(cache.saved); };
    window.addEventListener(EVENT, onChange);
    if (branchId && cache?.branchId !== branchId) {
      getPageSections({ branch: branchId, page: PAGE })
        .then((data) => {
          const row = (data || []).find((s) => s.section_id === SECTION);
          let content = row?.content_uz;
          if (typeof content === 'string') content = JSON.parse(content);
          cache = { branchId, saved: content && Object.keys(content).length ? content : null };
          if (alive) setSaved(cache.saved);
        })
        .catch(() => {});
    }
    return () => { alive = false; window.removeEventListener(EVENT, onChange); };
  }, [branchId]);

  const save = useCallback(async (patch) => {
    const current = merge(getBranchInfo(), cache?.saved);
    const flat = { ...FIELDS.reduce((a, k) => ({ ...a, [k]: current[k] || '' }), {}), ...SOCIALS.reduce((a, k) => ({ ...a, [k]: current.social[k] || '' }), {}), ...patch };
    const content = JSON.stringify(flat);
    try {
      await savePageSection({ branch: branchId, page: PAGE, section_id: SECTION, content_uz: content, content_ru: content, content_en: content });
      cache = { branchId, saved: flat };
      window.dispatchEvent(new Event(EVENT));
    } catch (e) {
      console.error(e);
      showToast("Saqlashda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
  }, [branchId]);

  return { info: merge(getBranchInfo(), saved), save };
}
