'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { Guide } from '@/types/guide';

interface Props {
  guide: Guide | null;
  isOpen: boolean;
  onClose: () => void;
}

// In-memory cache for loaded markdown
const contentCache = new Map<string, string>();

export function GuideDrawer({ guide, isOpen, onClose }: Props) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load markdown content
  useEffect(() => {
    if (!guide || !isOpen) return;

    const slug = guide.slug;

    // Check cache
    if (contentCache.has(slug)) {
      setContent(contentCache.get(slug)!);
      return;
    }

    // Fetch from API
    setLoading(true);
    fetch(`/api/guides/${slug}/content`)
      .then((res) => res.json())
      .then((data: { slug: string; title: string; content: string }) => {
        const text = data.content || '';
        contentCache.set(slug, text);
        setContent(text);
      })
      .catch((err) => {
        console.error('Failed to load guide:', err);
        setContent('# Error\n\nFailed to load guide content.');
      })
      .finally(() => setLoading(false));
  }, [guide, isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && guide && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[700px] lg:w-[800px] z-50 overflow-y-auto"
            style={{
              background: 'var(--bg-main)',
              borderLeft: '1px solid var(--glass-border)',
              boxShadow: '-4px 0 30px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
              style={{
                background: 'var(--bg-main)',
                borderBottom: '1px solid var(--glass-border)',
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    background: `${guide.gradient_from}20`,
                    color: guide.gradient_from,
                  }}
                >
                  {guide.category}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  {guide.reading_time} min read
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--text-muted)',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div
                    className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: 'var(--glass-border)',
                      borderTopColor: 'var(--color-primary)',
                    }}
                  />
                </div>
              ) : (
                <MarkdownRenderer content={content} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
