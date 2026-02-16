'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

function TVIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export function FeatureCards() {
  const router = useRouter();
  const { t } = useTranslation();

  const cards = [
    {
      title: t.cardTvTitle,
      description: t.cardTvDesc,
      icon: <TVIcon />,
      path: '/tv',
    },
    {
      title: t.cardMonitorTitle,
      description: t.cardMonitorDesc,
      icon: <MonitorIcon />,
      path: '/monitor',
    },
  ] as const;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto px-4">
      {cards.map((card) => (
        <motion.div
          key={card.path}
          onClick={() => router.push(card.path)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              router.push(card.path);
            }
          }}
          className="rounded-2xl p-8 cursor-pointer text-center
                     transition-colors duration-200"
          style={{
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
          whileHover={{
            y: -4,
            boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--color-primary)',
            }}
          >
            {card.icon}
          </div>
          <h2
            className="font-heading font-semibold text-xl mb-2"
            style={{ color: 'var(--text-main)' }}
          >
            {card.title}
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {card.description}
          </p>
        </motion.div>
      ))}
    </section>
  );
}
