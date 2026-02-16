'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { calculateTVSize, AVAILABLE_TV_SIZES } from '@/lib/calculators';
import { usePageTracking } from '@/lib/hooks/usePageTracking';
import { AdjustButton } from '@/components/shared/AdjustButton';
import { RangeSlider } from '@/components/shared/RangeSlider';
import { DistanceGuide } from '@/components/tv/DistanceGuide';
import { TVResultCards } from '@/components/tv/TVResultCards';

import { TVProductSection } from '@/components/tv/TVProductSection';
import type { UnitType } from '@/types/calculator';
import type { TVProduct, TVProductsBySize } from '@/types/product';

export default function TVPage() {
  const { t } = useTranslation();
  usePageTracking('tv');

  // Unit and distance state
  const [unit, setUnit] = useState<UnitType>('imperial');
  const [value, setValue] = useState(98); // inches when imperial, cm when metric
  const [showGuide, setShowGuide] = useState(true);

  // Product data
  const [tvProducts, setTvProducts] = useState<TVProductsBySize>({});
  const [productsError, setProductsError] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetch('/api/tv-products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setTvProducts(data.products))
      .catch(() => setProductsError(true));
  }, []);

  // Min / max based on unit
  const min = unit === 'imperial' ? 36 : 91;
  const max = unit === 'imperial' ? 240 : 610;

  // Switch unit handler
  const handleUnitChange = useCallback(
    (newUnit: UnitType) => {
      if (newUnit === unit) return;
      if (newUnit === 'metric') {
        // inches -> cm
        setValue(Math.round(value * 2.54));
      } else {
        // cm -> inches
        setValue(Math.round(value / 2.54));
      }
      setUnit(newUnit);
    },
    [unit, value]
  );

  // Clamp helper
  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max]
  );

  const handleValueChange = useCallback(
    (v: number) => setValue(clamp(v)),
    [clamp]
  );

  const handleIncrement = useCallback(
    () => setValue((prev) => clamp(prev + 1)),
    [clamp]
  );

  const handleDecrement = useCallback(
    () => setValue((prev) => clamp(prev - 1)),
    [clamp]
  );

  // Convert to meters for calculation
  const distanceMeters = useMemo(() => {
    return unit === 'imperial'
      ? (value * 2.54) / 100
      : value / 100;
  }, [unit, value]);

  // Calculate TV sizes
  const result = useMemo(
    () => calculateTVSize(distanceMeters),
    [distanceMeters]
  );

  // Display value for the range slider
  const displayValue = useMemo(() => {
    if (unit === 'imperial') {
      const feet = Math.floor(value / 12);
      const inches = value % 12;
      return inches > 0 ? `${feet} ft ${inches} in` : `${feet} ft`;
    }
    return `${value} cm`;
  }, [unit, value]);

  // Unit badge
  const unitBadge = unit === 'imperial' ? 'in' : 'cm';

  // Gather products for recommended sizes
  // Show sizes between good and best (inclusive), sorted descending
  const recommendedSizes = useMemo(() => {
    const goodIdx = AVAILABLE_TV_SIZES.indexOf(result.good);
    const bestIdx = AVAILABLE_TV_SIZES.indexOf(result.best);
    const lo = Math.min(goodIdx, bestIdx);
    const hi = Math.max(goodIdx, bestIdx);
    return AVAILABLE_TV_SIZES.slice(lo, hi + 1).sort((a, b) => b - a);
  }, [result]);

  // Map sizes to their products
  const sizeProducts = useMemo(() => {
    const map: Record<number, TVProduct[]> = {};
    for (const size of recommendedSizes) {
      const key = String(size);
      if (tvProducts[key]) {
        map[size] = tvProducts[key].sort(
          (a, b) => a.sort_order - b.sort_order
        );
      }
    }
    return map;
  }, [recommendedSizes, tvProducts]);

  return (
    <div className="pt-6">
      <div className="glass-panel overflow-hidden">
        {/* Panel Header */}
        <div className="px-6 pt-6 pb-4">
          <h2
            className="font-heading font-bold text-2xl"
            style={{ color: 'var(--text-main)' }}
          >
            {t.tvCalcTitle}
          </h2>
        </div>

        {/* Distance Guide */}
        <DistanceGuide
          isOpen={showGuide}
          onToggle={() => setShowGuide((prev) => !prev)}
        />

        {/* Controls Area */}
        <div className="px-6 py-6 space-y-4">
          {/* Label + Unit Toggle Row */}
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
                    unit === 'imperial' ? 'var(--color-primary)' : 'transparent',
                  color: unit === 'imperial' ? '#ffffff' : 'var(--text-muted)',
                }}
              >
                {t.unitImperial}
              </button>
              <button
                onClick={() => handleUnitChange('metric')}
                className="px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background:
                    unit === 'metric' ? 'var(--color-primary)' : 'transparent',
                  color: unit === 'metric' ? '#ffffff' : 'var(--text-muted)',
                }}
              >
                {t.unitMetric}
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
                value={value}
                min={min}
                max={max}
                onChange={(e) => handleValueChange(Number(e.target.value))}
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
            min={min}
            max={max}
            value={value}
            onChange={handleValueChange}
            displayValue={displayValue}
          />
        </div>

        {/* Results Area */}
        <div
          className="px-6 pb-6 space-y-6"
          style={{ background: 'var(--results-bg)' }}
        >
          <div className="pt-6">
            <h3
              className="font-heading font-semibold text-lg mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              {t.tvResultTitle}
            </h3>

            <TVResultCards best={result.best} good={result.good} t={t} />
          </div>

          {/* Product load error */}
          {productsError && (
            <p
              className="text-sm text-center py-4"
              style={{ color: 'var(--text-dim)' }}
            >
              Unable to load product recommendations.
            </p>
          )}

          {/* Product Recommendations */}
          {recommendedSizes.map((size) => {
            const products = sizeProducts[size];
            if (!products || products.length === 0) return null;

            const label =
              size === result.best
                ? t.tvBestLabel
                : size === result.good
                  ? t.tvGoodLabel
                  : `${result.good}"-${result.best}"`;

            return (
              <TVProductSection
                key={size}
                size={size}
                products={products}
                label={label}
                t={t}
              />
            );
          })}

          {/* Affiliate Disclosure */}
          {Object.keys(sizeProducts).length > 0 && (
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
