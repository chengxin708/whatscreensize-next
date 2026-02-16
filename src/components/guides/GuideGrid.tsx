'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GuideCard } from './GuideCard';
import { GuideDrawer } from './GuideDrawer';
import type { Guide, GuideListResponse } from '@/types/guide';

export function GuideGrid() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetch('/api/guides')
      .then((res) => res.json())
      .then((data: GuideListResponse) => setGuides(data.guides || []))
      .catch((err) => console.error('Failed to load guides:', err));
  }, []);

  const openGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  if (guides.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 mt-16">
      {/* Section Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2
          className="font-heading font-bold text-2xl mb-2"
          style={{ color: 'var(--text-main)' }}
        >
          Guides & Resources
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Expert guides to help you make the best screen choice
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {guides.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <GuideCard guide={guide} onClick={() => openGuide(guide)} />
          </motion.div>
        ))}
      </div>

      {/* Drawer */}
      <GuideDrawer
        guide={selectedGuide}
        isOpen={drawerOpen}
        onClose={closeDrawer}
      />
    </section>
  );
}
