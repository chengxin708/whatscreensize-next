'use client';

import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { Language, TranslationKeys } from '@/types/i18n';
import { translations } from './translations';

interface LanguageContextType {
  lang: Language;
  t: TranslationKeys;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: translations.en,
  toggleLanguage: () => {},
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('wss-lang');
    if (saved === 'zh') setLang('zh');
  }, []);

  useEffect(() => {
    localStorage.setItem('wss-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const toggleLanguage = () => setLang((prev) => (prev === 'en' ? 'zh' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage, setLanguage: setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
