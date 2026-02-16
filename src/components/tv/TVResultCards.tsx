import type { TranslationKeys } from '@/types/i18n';

interface TVResultCardsProps {
  best: number;
  good: number;
  t: TranslationKeys;
}

export function TVResultCards({ best, good, t }: TVResultCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Best (IMAX) Card */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'var(--results-bg)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: 'var(--shadow-glow)',
        }}
      >
        <p
          className="text-sm font-medium mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          {t.tvBestLabel}
        </p>
        <p
          className="font-heading font-bold text-5xl gradient-text mb-2"
        >
          {best}"
        </p>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {t.tvRatioDesc}: 0.6
        </p>
      </div>

      {/* Good Card */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'var(--results-bg)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <p
          className="text-sm font-medium mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          {t.tvGoodLabel}
        </p>
        <p
          className="font-heading font-bold text-5xl mb-2"
          style={{ color: 'var(--text-main)' }}
        >
          {good}"
        </p>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {t.tvRatioDesc}: 0.5
        </p>
      </div>
    </div>
  );
}
