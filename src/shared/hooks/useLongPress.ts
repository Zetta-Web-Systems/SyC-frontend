import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_LONG_PRESS_DURATION = 500;

function createProgressLoop(
  startTime: number,
  duration: number,
  onProgress: (value: number) => void,
) {
  let rafId: number | null = null;

  function tick() {
    const elapsed = Date.now() - startTime;
    const next = Math.min(elapsed / duration, 1);
    onProgress(next);

    if (next < 1) {
      rafId = requestAnimationFrame(tick);
    }
  }

  rafId = requestAnimationFrame(tick);

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
}

export function useLongPress(
  onLongPress: () => void,
  duration: number = DEFAULT_LONG_PRESS_DURATION,
) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelLoopRef = useRef<(() => void) | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (cancelLoopRef.current) {
      cancelLoopRef.current();
      cancelLoopRef.current = null;
    }
    setIsPressed(false);
    setProgress(0);
  }, []);

  const onPointerDown = useCallback(() => {
    setIsPressed(true);
    setProgress(0);

    const startTime = Date.now();
    cancelLoopRef.current = createProgressLoop(
      startTime,
      duration,
      setProgress,
    );

    timerRef.current = setTimeout(() => {
      cancel();
      onLongPress();
    }, duration);
  }, [onLongPress, duration, cancel]);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return {
    handlers: {
      onPointerDown,
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
    },
    isPressed,
    progress,
  };
}
