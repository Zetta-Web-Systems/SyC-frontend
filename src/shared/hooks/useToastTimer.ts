import { useRef, useState, useCallback, useEffect } from "react";

export function useToastTimer(
  id: string,
  duration: number,
  onDismiss: (id: string) => void,
) {
  const [isPaused, setIsPaused] = useState(false);
  const remainingRef = useRef(duration);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(id);
    }, remainingRef.current);
  }, [id, onDismiss]);

  const onMouseEnter = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  return { isPaused, onMouseEnter, onMouseLeave };
}
