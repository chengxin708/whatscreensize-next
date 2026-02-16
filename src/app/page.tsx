'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { GuideGrid } from '@/components/guides/GuideGrid';
import { usePageTracking } from '@/lib/hooks/usePageTracking';

export default function HomePage() {
  usePageTracking('home');

  return (
    <>
      <HeroSection />
      <FeatureCards />
      <GuideGrid />
    </>
  );
}
