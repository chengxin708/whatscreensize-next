'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import type { FilterType } from '@/types/calculator';

interface FilterBarProps {
  filter: FilterType;
  onChange: (filter: FilterType) => void;
}

const filters: FilterType[] = ['all', 'gaming', 'productivity'];

export function FilterBar({ filter, onChange }: FilterBarProps) {
  const { t } = useTranslation();

  const labelMap: Record<FilterType, string> = {
    all: t.filterAll,
    gaming: t.filterGaming,
    productivity: t.filterProductivity,
  };

  return (
    <div className="flex items-center gap-2 py-3">
      {filters.map((f) => {
        const isActive = filter === f;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{
              background: isActive ? 'var(--color-primary)' : 'var(--input-bg)',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              border: isActive
                ? '1px solid var(--color-primary)'
                : '1px solid var(--glass-border)',
              boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
            }}
          >
            {labelMap[f]}
          </button>
        );
      })}
    </div>
  );
}
