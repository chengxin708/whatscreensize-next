'use client';

import { useLongPress } from '@/lib/hooks/useLongPress';

interface AdjustButtonProps {
  onClick: () => void;
  direction: 'increment' | 'decrement';
  longPressCallback: () => void;
}

export function AdjustButton({
  onClick,
  direction,
  longPressCallback,
}: AdjustButtonProps) {
  const longPressHandlers = useLongPress(longPressCallback);

  return (
    <button
      onClick={onClick}
      {...longPressHandlers}
      className="w-10 h-10 rounded-xl flex items-center justify-center
                 transition-colors duration-150 cursor-pointer
                 bg-transparent"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = 'var(--hover-bg)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = 'transparent')
      }
      aria-label={direction === 'increment' ? 'Increase' : 'Decrease'}
    >
      {direction === 'increment' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )}
    </button>
  );
}
