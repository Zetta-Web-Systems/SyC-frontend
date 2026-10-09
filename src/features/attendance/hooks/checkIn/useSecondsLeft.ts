import { useEffect, useState } from "react";
import type { CheckInTimer } from "../../types";

const TICK_MS = 250;

export function useSecondsLeft(timer: CheckInTimer | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, [timer]);

  if (!timer) return 0;
  const left = Math.ceil((timer.endsAt - now) / 1000);
  return Math.min(timer.seconds, Math.max(0, left));
}
