'use client';

import { ThemeProvider as ThemeContextProvider } from '@/lib/theme/ThemeContext';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}
