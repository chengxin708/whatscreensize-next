import { useCallback, useRef } from 'react';

export function useLongPress(callback: () => void, delay = 500, interval = 100) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const intervalTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const start = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      intervalTimer.current = setInterval(callback, interval);
    }, delay);
  }, [callback, delay, interval]);

  const stop = useCallback(() => {
    if (pressTimer.current !== undefined) clearTimeout(pressTimer.current);
    if (intervalTimer.current !== undefined) clearInterval(intervalTimer.current);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
