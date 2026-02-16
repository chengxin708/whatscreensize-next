'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { QualityBadge } from '@/components/shared/QualityBadge';
import type { ProcessedMonitor } from '@/types/calculator';

interface MonitorCardProps {
  monitor: ProcessedMonitor;
  hasProducts: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export function MonitorCard({
  monitor,
  hasProducts,
  isExpanded,
  onClick,
}: MonitorCardProps) {
  const { t } = useTranslation();

  // Determine quality status
  const quality: 'best' | 'acceptable' | 'not-ideal' = monitor.isBest
    ? 'best'
    : monitor.isAcceptable
      ? 'acceptable'
      : 'not-ideal';

  const qualityLabel = monitor.isBest
    ? t.retinaLevel
    : monitor.isAcceptable
      ? t.comfortable
      : t.notRecommended;

  // Card border / shadow styling based on quality
  const cardStyle: React.CSSProperties = {
    background: 'var(--glass-surface)',
    border:
      quality === 'best'
        ? '1px solid rgba(99, 102, 241, 0.3)'
        : quality === 'acceptable'
          ? '1px solid rgba(99, 102, 241, 0.15)'
          : '1px solid var(--glass-border)',
    boxShadow:
      quality === 'best' ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
    opacity: quality === 'not-ideal' ? 0.6 : 1,
    cursor: hasProducts ? 'pointer' : 'default',
  };

  return (
    <div
      onClick={hasProducts ? onClick : undefined}
      className="rounded-2xl p-4 transition-all duration-200 hover:scale-[1.01]"
      style={cardStyle}
    >
      {/* Size Badge */}
      <div className="flex items-start justify-between mb-2">
        <span
          className="font-heading font-bold text-2xl"
          style={{ color: 'var(--text-main)' }}
        >
          {monitor.size}"
        </span>
        <QualityBadge quality={quality} label={qualityLabel} />
      </div>

      {/* Resolution Info */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider"
          style={{
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}
        >
          {monitor.res}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {monitor.resolution}
        </span>
      </div>

      {/* PPI Badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {monitor.ppi} PPI
        </span>

        {/* Expand Arrow */}
        {hasProducts && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: 'var(--text-dim)',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>

      {/* Notes */}
      <p
        className="text-xs mt-2 leading-relaxed"
        style={{ color: 'var(--text-dim)' }}
      >
        {monitor.notes}
      </p>
    </div>
  );
}
