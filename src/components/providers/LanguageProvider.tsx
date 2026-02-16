'use client';

import { LanguageProvider as LangContextProvider } from '@/lib/i18n/LanguageContext';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <LangContextProvider>{children}</LangContextProvider>;
}
