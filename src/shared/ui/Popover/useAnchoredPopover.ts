import { useCallback, useRef, useState } from "react";
import type { RefObject } from "react";

const GAP = 6;
const DEFAULT_WIDTH = 190;
const DEFAULT_ESTIMATED_HEIGHT = 190;

export interface AnchoredPopoverPosition {
  top: number;
  left: number;
  width: number;
}

export interface AnchoredPopoverState<T extends HTMLElement = HTMLElement> {
  anchorRef: RefObject<T | null>;
  position: AnchoredPopoverPosition | null;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

interface UseAnchoredPopoverOptions {
  width?: number;
  estimatedHeight?: number;
}

export function useAnchoredPopover<T extends HTMLElement = HTMLButtonElement>({
  width = DEFAULT_WIDTH,
  estimatedHeight = DEFAULT_ESTIMATED_HEIGHT,
}: UseAnchoredPopoverOptions = {}): AnchoredPopoverState<T> {
  const anchorRef = useRef<T>(null);
  const [position, setPosition] = useState<AnchoredPopoverPosition | null>(
    null,
  );

  const close = useCallback(() => setPosition(null), []);

  const toggle = useCallback(() => {
    setPosition((current) => {
      if (current) return null;

      const anchor = anchorRef.current;
      if (!anchor) return null;

      const rect = anchor.getBoundingClientRect();
      const overflowsBottom =
        rect.bottom + GAP + estimatedHeight > window.innerHeight;

      return {
        top: Math.max(
          GAP,
          overflowsBottom
            ? rect.top - GAP - estimatedHeight
            : rect.bottom + GAP,
        ),
        left: Math.max(
          GAP,
          Math.min(rect.left, window.innerWidth - width - GAP),
        ),
        width,
      };
    });
  }, [width, estimatedHeight]);

  return { anchorRef, position, isOpen: position !== null, toggle, close };
}
