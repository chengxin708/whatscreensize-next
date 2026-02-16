'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useScrollCompression } from '@/lib/hooks/useScrollCompression';
import { calculateMonitorSpecs } from '@/lib/calculators';
import { usePageTracking } from '@/lib/hooks/usePageTracking';
import { AdjustButton } from '@/components/shared/AdjustButton';
import { RangeSlider } from '@/components/shared/RangeSlider';
import { MonitorStickyHeader } from '@/components/monitor/MonitorStickyHeader';
import { PPIDisplay } from '@/components/monitor/PPIDisplay';
import { FilterBar } from '@/components/monitor/FilterBar';
import { MonitorCategoryComponent } from '@/components/monitor/MonitorCategory';
import type { UnitType, CategoryKey, FilterType } from '@/types/calculator';
import type { MonitorProductsBySpec } from '@/types/product';

export default function MonitorPage() {
  const { t } = useTranslation();
  usePageTracking('monitor');
  const compressed = useScrollCompression(100);

  // State: canonical distance in cm
  const [unit, setUnit] = useState<UnitType>('imperial');
  const [distanceCm, setDistanceCm] = useState(61);
  const minCm = 30;
  const maxCm = 107;

  // Filter
  const [filter, setFilter] = useState<FilterType>('all');

  // Show not-ideal toggles per category
  const [showNotIdeal, setShowNotIdeal] = useState<Record<CategoryKey, boolean>>({
    standard: false,
    ultrawide: false,
    superwide: false,
  });

  // Expanded monitor product panel
  const [expandedMonitorKey, setExpandedMonitorKey] = useState<string | null>(null);

  // Products from API
  const [monitorProducts, setMonitorProducts] = useState<MonitorProductsBySpec>({});
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    fetch('/api/monitor-products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setMonitorProducts(data.products))
      .catch(() => setProductsError(true));
  }, []);

  // Display value in current unit
  const displayValueNum = useMemo(() => {
    if (unit === 'imperial') {
      return Math.round(distanceCm / 2.54);
    }
    return distanceCm;
  }, [unit, distanceCm]);

  // Slider min/max in display unit
  const sliderMin = useMemo(
    () => (unit === 'imperial' ? Math.round(minCm / 2.54) : minCm),
    [unit]
  );
  const sliderMax = useMemo(
    () => (unit === 'imperial' ? Math.round(maxCm / 2.54) : maxCm),
    [unit]
  );

  // Clamp in cm
  const clampCm = useCallback(
    (v: number) => Math.min(maxCm, Math.max(minCm, v)),
    []
  );

  // Handle display value changes (convert back to cm)
  const handleDisplayValueChange = useCallback(
    (displayVal: number) => {
      if (unit === 'imperial') {
        setDistanceCm(clampCm(Math.round(displayVal * 2.54)));
      } else {
        setDistanceCm(clampCm(displayVal));
      }
    },
    [unit, clampCm]
  );

  // Unit switch
  const handleUnitChange = useCallback((newUnit: UnitType) => {
    setUnit(newUnit);
  }, []);

  // Adjust buttons: increment/decrement in display unit, then convert to cm
  const handleIncrement = useCallback(() => {
    setDistanceCm((prev) => {
      if (unit === 'imperial') {
        const inchNow = Math.round(prev / 2.54);
        return clampCm(Math.round((inchNow + 1) * 2.54));
      }
      return clampCm(prev + 1);
    });
  }, [unit, clampCm]);

  const handleDecrement = useCallback(() => {
    setDistanceCm((prev) => {
      if (unit === 'imperial') {
        const inchNow = Math.round(prev / 2.54);
        return clampCm(Math.round((inchNow - 1) * 2.54));
      }
      return clampCm(prev - 1);
    });
  }, [unit, clampCm]);

  // Calculate monitor specs
  const result = useMemo(
    () => calculateMonitorSpecs(distanceCm),
    [distanceCm]
  );

  // Display value for range slider
  const rangeDisplayValue = useMemo(() => {
    if (unit === 'imperial') {
      const totalInches = Math.round(distanceCm / 2.54);
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;
      return inches > 0 ? `${feet} ft ${inches} in` : `${feet} ft`;
    }
    return `${distanceCm} cm`;
  }, [unit, distanceCm]);

  // Unit badge
  const unitBadge = unit === 'imperial' ? 'in' : 'cm';

  // Compact distance display
  const compactDistDisplay = useMemo(() => {
    if (unit === 'imperial') {
      return `${Math.round(distanceCm / 2.54)} in`;
    }
    return `${distanceCm} cm`;
  }, [unit, distanceCm]);

  // Toggle not-ideal for a category
  const handleToggleNotIdeal = useCallback((key: CategoryKey) => {
    setShowNotIdeal((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Toggle product expansion
  const handleToggleProducts = useCallback((specKey: string) => {
    setExpandedMonitorKey((prev) => (prev === specKey ? null : specKey));
  }, []);

  const categoryKeys: CategoryKey[] = ['standard', 'ultrawide', 'superwide'];

  return (
    <div className="pt-6">
      <div className="glass-panel overflow-hidden">
        {/* Panel Header */}
        <div className="px-6 pt-6 pb-2">
          <h2
            className="font-heading font-bold text-2xl"
            style={{ color: 'var(--text-main)' }}
          >
            {t.monitorCalcTitle}
          </h2>
        </div>

        {/* Sticky Header */}
        <MonitorStickyHeader compressed={compressed}>
          <div className="px-6 py-4">
            {/* Standard View (shown when not compressed) */}
            {!compressed && (
              <div className="space-y-4">
                {/* Label + Unit Toggle */}
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {t.labelDistance}
                  </label>
                  <div
                    className="flex rounded-full overflow-hidden"
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <button
                      onClick={() => handleUnitChange('imperial')}
                      className="px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        background:
                          unit === 'imperial'
                            ? 'var(--color-primary)'
                            : 'transparent',
                        color:
                          unit === 'imperial' ? '#ffffff' : 'var(--text-muted)',
                      }}
                    >
                      ft/in
                    </button>
                    <button
                      onClick={() => handleUnitChange('metric')}
                      className="px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        background:
                          unit === 'metric'
                            ? 'var(--color-primary)'
                            : 'transparent',
                        color:
                          unit === 'metric' ? '#ffffff' : 'var(--text-muted)',
                      }}
                    >
                      cm
                    </button>
                  </div>
                </div>

                {/* Number Input with +/- */}
                <div className="flex items-center justify-center gap-3">
                  <AdjustButton
                    onClick={handleDecrement}
                    direction="decrement"
                    longPressCallback={handleDecrement}
                  />
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-2"
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <input
                      type="number"
                      value={displayValueNum}
                      min={sliderMin}
                      max={sliderMax}
                      onChange={(e) =>
                        handleDisplayValueChange(Number(e.target.value))
                      }
                      className="w-16 text-center text-2xl font-heading font-bold bg-transparent outline-none"
                      style={{ color: 'var(--text-main)' }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      {unitBadge}
                    </span>
                  </div>
                  <AdjustButton
                    onClick={handleIncrement}
                    direction="increment"
                    longPressCallback={handleIncrement}
                  />
                </div>

                {/* Range Slider */}
                <RangeSlider
                  min={sliderMin}
                  max={sliderMax}
                  value={displayValueNum}
                  onChange={handleDisplayValueChange}
                  displayValue={rangeDisplayValue}
                />

                {/* PPI Display */}
                <PPIDisplay ppi={result.idealPPI} />
              </div>
            )}

            {/* Compact View (shown when compressed/scrolled) */}
            {compressed && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      {t.labelDistance}:
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-main)' }}
                    >
                      {compactDistDisplay}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      Ideal PPI:
                    </span>
                    <span className="text-sm font-bold gradient-text">
                      {result.idealPPI}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDecrement}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium transition-colors duration-150 cursor-pointer"
                    style={{
                      background: 'var(--input-bg)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={handleIncrement}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium transition-colors duration-150 cursor-pointer"
                    style={{
                      background: 'var(--input-bg)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <FilterBar filter={filter} onChange={setFilter} />
          </div>
        </MonitorStickyHeader>

        {/* Results Area */}
        <div className="px-6 pb-6 space-y-8">
          {/* Product load error */}
          {productsError && (
            <p
              className="text-sm text-center py-4"
              style={{ color: 'var(--text-dim)' }}
            >
              Unable to load product recommendations.
            </p>
          )}

          {categoryKeys.map((key) => (
            <MonitorCategoryComponent
              key={key}
              categoryKey={key}
              category={result.categories[key]}
              filter={filter}
              showNotIdeal={showNotIdeal[key]}
              onToggleNotIdeal={() => handleToggleNotIdeal(key)}
              expandedMonitorKey={expandedMonitorKey}
              onToggleProducts={handleToggleProducts}
              monitorProducts={monitorProducts}
            />
          ))}

          {/* Affiliate Disclosure */}
          {Object.keys(monitorProducts).length > 0 && (
            <p
              className="text-xs mt-4 pt-4"
              style={{
                color: 'var(--text-dim)',
                borderTop: '1px solid var(--glass-border)',
              }}
            >
              {t.affiliateDisclosure}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
