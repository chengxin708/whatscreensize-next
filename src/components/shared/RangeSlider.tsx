'use client';

import { useRef, useCallback, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  displayValue: string;
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  displayValue,
}: RangeSliderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const updateProgress = useCallback(
    (val: number) => {
      if (inputRef.current) {
        const progress = ((val - min) / (max - min)) * 100;
        inputRef.current.style.setProperty(
          '--range-progress',
          `${progress}%`
        );
      }
    },
    [min, max]
  );

  useEffect(() => {
    updateProgress(value);
  }, [value, updateProgress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
    updateProgress(newValue);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full cursor-pointer"
      />
      <p
        className="text-center text-sm mt-2"
        style={{ color: 'var(--text-muted)' }}
      >
        {displayValue}
      </p>
    </div>
  );
}
