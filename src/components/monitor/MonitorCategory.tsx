'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { MonitorCard } from '@/components/monitor/MonitorCard';
import { ProductCard } from '@/components/shared/ProductCard';
import type {
  MonitorCategory as MonitorCategoryType,
  CategoryKey,
  FilterType,
  ProcessedMonitor,
} from '@/types/calculator';
import type { MonitorProductsBySpec } from '@/types/product';

interface MonitorCategoryProps {
  categoryKey: CategoryKey;
  category: MonitorCategoryType;
  filter: FilterType;
  showNotIdeal: boolean;
  onToggleNotIdeal: () => void;
  expandedMonitorKey: string | null;
  onToggleProducts: (key: string) => void;
  monitorProducts: MonitorProductsBySpec;
}

function getMonitorSpecKey(monitor: ProcessedMonitor): string {
  const resNoSpaces = monitor.resolution.replace(/\s+/g, '');
  return `${monitor.size}-${resNoSpaces}`;
}

export function MonitorCategoryComponent({
  categoryKey,
  category,
  filter,
  showNotIdeal,
  onToggleNotIdeal,
  expandedMonitorKey,
  onToggleProducts,
  monitorProducts,
}: MonitorCategoryProps) {
  const { lang, t } = useTranslation();

  // Filter monitors by tag and acceptability
  const filteredMonitors = useMemo(() => {
    return category.monitors.filter((monitor) => {
      // Filter by tag
      if (filter !== 'all' && !monitor.tags.includes(filter)) return false;
      // Hide not-ideal unless toggled on
      if (!monitor.isAcceptable && !showNotIdeal) return false;
      return true;
    });
  }, [category.monitors, filter, showNotIdeal]);

  // Count hidden not-ideal monitors (matching the filter)
  const hiddenCount = useMemo(() => {
    return category.monitors.filter((monitor) => {
      if (filter !== 'all' && !monitor.tags.includes(filter)) return false;
      return !monitor.isAcceptable;
    }).length;
  }, [category.monitors, filter]);

  const categoryName = lang === 'zh' ? category.name.zh : category.name.en;

  return (
    <div className="space-y-4">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: 'var(--color-primary)' }}
          />
          <h3
            className="font-heading font-semibold text-lg"
            style={{ color: 'var(--text-main)' }}
          >
            {categoryName}
          </h3>
        </div>

        {/* Show/Hide Not Ideal Toggle */}
        {hiddenCount > 0 && (
          <button
            onClick={onToggleNotIdeal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer"
            style={{
              background: 'var(--input-bg)',
              color: 'var(--text-dim)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <span>{showNotIdeal ? t.hideNotIdeal : t.showNotIdeal}</span>
            {/* Switch UI */}
            <div
              className="relative w-8 h-4 rounded-full transition-colors duration-200"
              style={{
                background: showNotIdeal
                  ? 'var(--color-primary)'
                  : 'var(--glass-border)',
              }}
            >
              <div
                className="absolute top-0.5 w-3 h-3 rounded-full transition-transform duration-200"
                style={{
                  background: '#ffffff',
                  transform: showNotIdeal
                    ? 'translateX(16px)'
                    : 'translateX(2px)',
                }}
              />
            </div>
          </button>
        )}
      </div>

      {/* Monitor Grid */}
      {filteredMonitors.length === 0 ? (
        <p
          className="text-sm text-center py-8"
          style={{ color: 'var(--text-dim)' }}
        >
          {t.noProductsFilter}
        </p>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          }}
        >
          {filteredMonitors.map((monitor) => {
            const specKey = getMonitorSpecKey(monitor);
            const products = monitorProducts[specKey] || [];
            const hasProducts = products.length > 0;
            const isExpanded = expandedMonitorKey === specKey;

            return (
              <div key={specKey}>
                <MonitorCard
                  monitor={monitor}
                  hasProducts={hasProducts}
                  isExpanded={isExpanded}
                  onClick={() => onToggleProducts(specKey)}
                />

                {/* Product Expansion Panel */}
                <AnimatePresence>
                  {isExpanded && hasProducts && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3">
                        <p
                          className="text-xs font-medium mb-2"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {t.monitorProductsTitle}
                        </p>
                        <div className="product-scroll">
                          {products
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                viewDetailsText={t.productViewDetails}
                              />
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
