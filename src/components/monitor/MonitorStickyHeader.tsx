'use client';

import type { ReactNode } from 'react';

interface MonitorStickyHeaderProps {
  compressed: boolean;
  children: ReactNode;
}

export function MonitorStickyHeader({ compressed, children }: MonitorStickyHeaderProps) {
  return (
    <div
      className="sticky top-0 z-40 transition-all duration-300 rounded-t-[2rem]"
      style={{
        background: compressed
          ? 'var(--glass-surface)'
          : 'transparent',
        backdropFilter: compressed ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: compressed ? 'blur(20px)' : 'none',
        boxShadow: compressed ? 'var(--shadow-lg)' : 'none',
        borderBottom: compressed
          ? '1px solid rgba(99, 102, 241, 0.15)'
          : '1px solid transparent',
      }}
    >
      {children}
    </div>
  );
}
