'use client';

import { motion } from 'framer-motion';
import { GuideIcon } from './GuideIcon';
import type { Guide } from '@/types/guide';

interface Props {
  guide: Guide;
  onClick: () => void;
}

export function GuideCard({ guide, onClick }: Props) {
  return (
    <motion.div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="rounded-2xl p-6 cursor-pointer overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${guide.gradient_from}20, ${guide.gradient_to}10)`,
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
      whileHover={{
        y: -4,
        boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
        style={{
          background: `linear-gradient(135deg, ${guide.gradient_from}, ${guide.gradient_to})`,
          color: '#ffffff',
        }}
      >
        <GuideIcon name={guide.icon_name} />
      </div>

      {/* Category badge */}
      <span
        className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 uppercase tracking-wider"
        style={{
          background: `${guide.gradient_from}20`,
          color: guide.gradient_from,
        }}
      >
        {guide.category}
      </span>

      {/* Title */}
      <h3
        className="font-heading font-semibold text-base mb-1.5 line-clamp-2"
        style={{ color: 'var(--text-main)' }}
      >
        {guide.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed line-clamp-2 mb-3"
        style={{ color: 'var(--text-muted)' }}
      >
        {guide.description}
      </p>

      {/* Reading time */}
      <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
        {guide.reading_time} min read
      </span>
    </motion.div>
  );
}
