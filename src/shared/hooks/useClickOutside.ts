import { useEffect } from "react";
import type { RefObject } from "react";

interface UseClickOutsideOptions {
  enabled?: boolean;
}

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent) => void,
  { enabled = true }: UseClickOutsideOptions = {},
): void {
  useEffect(() => {
    if (!enabled) return;

    function onMouseDown(event: MouseEvent) {
      const element = ref.current;
      if (!element) return;
      if (element.contains(event.target as Node)) return;
      handler(event);
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [ref, handler, enabled]);
}
