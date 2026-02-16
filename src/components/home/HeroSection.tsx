'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="text-center pt-16 pb-10 md:pt-24 md:pb-14 px-4">
      <h1
        className="font-heading font-bold text-4xl md:text-6xl leading-tight tracking-tight"
        style={{ color: 'var(--text-main)' }}
      >
        {t.heroTitlePrefix}
        <br />
        <span className="gradient-text">{t.heroTitleSuffix}</span>
      </h1>
      <p
        className="mt-4 md:mt-6 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
        style={{ color: 'var(--text-muted)' }}
      >
        {t.heroSubtitle}
      </p>
    </section>
  );
}
