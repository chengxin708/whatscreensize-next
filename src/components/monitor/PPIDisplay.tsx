'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

interface PPIDisplayProps {
  ppi: number;
}

export function PPIDisplay({ ppi }: PPIDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-2">
      <div
        className="font-heading font-extrabold leading-none gradient-text"
        style={{ fontSize: '4rem' }}
      >
        {ppi}
      </div>
      <div
        className="text-sm font-medium mt-1"
        style={{ color: 'var(--text-muted)' }}
      >
        Ideal PPI
      </div>
      <div
        className="text-xs mt-0.5"
        style={{ color: 'var(--text-dim)' }}
      >
        {t.visualAcuity}
      </div>
    </div>
  );
}
