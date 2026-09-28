import { createContext, useContext, useState } from 'react';
import en from './en';
import ru from './ru';
import uz from './uz';

const translations = { en, ru, uz };
const LangContext = createContext(null);

// Til URL orqali: uz — prefiksiz (/about), ruscha — /ru/about, inglizcha — /en/about.
// BrowserRouter `basename`i shu prefiksga o'rnatiladi (App.jsx), shuning uchun barcha
// ichki havola va marshrutlar prefiksiz yoziladi va o'zi to'g'ri prefiks bilan ishlaydi.
const LANG_RE = /^\/(ru|en)(?=\/|$)/;
export const langFromPath = () => {
  if (typeof window === 'undefined') return 'uz';
  const m = window.location.pathname.match(LANG_RE);
  return m ? m[1] : 'uz';
};
export const prefixOf = (l) => (l === 'uz' ? '' : `/${l}`);

export function LangProvider({ children }) {
  const [lang] = useState(langFromPath);
  // Til almashtirish — tegishli prefiksli manzilga o'tish (sahifa qayta yuklanadi)
  const setLang = (next) => {
    if (next === lang || !translations[next]) return;
    const rest = window.location.pathname.replace(LANG_RE, '') || '/';
    window.location.assign(`${prefixOf(next)}${rest}${window.location.search}${window.location.hash}`);
  };
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
