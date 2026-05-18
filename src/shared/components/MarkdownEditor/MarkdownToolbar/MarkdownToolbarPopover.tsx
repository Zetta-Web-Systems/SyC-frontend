import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@shared/lib/cn";
import {
  ME_SHORTCUTS,
  ME_POPOVER,
} from "@shared/constants/markdownEditor.constants";
import { Portal } from "@shared/ui/Portal/Portal";

interface MarkdownToolbarPopoverProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

export function MarkdownToolbarPopover({
  anchorRef,
  onClose,
}: MarkdownToolbarPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  }>({ top: 0, left: 0, width: ME_POPOVER.MAX_WIDTH, maxHeight: 400 });

  useLayoutEffect(() => {
    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const width = Math.min(
        ME_POPOVER.MAX_WIDTH,
        window.innerWidth - ME_POPOVER.VP_MARGIN * 2,
      );
      const top = rect.bottom + ME_POPOVER.GAP;
      const maxLeft = window.innerWidth - width - ME_POPOVER.VP_MARGIN;
      const preferredLeft = rect.right - width;
      const left = Math.max(
        ME_POPOVER.VP_MARGIN,
        Math.min(preferredLeft, maxLeft),
      );
      const maxHeight = window.innerHeight - top - ME_POPOVER.VP_MARGIN;
      setPosition({ top, left, width, maxHeight });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef]);

  const requestClose = useEffectEvent(() => {
    onClose();
  });

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      requestClose();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [anchorRef]);

  return (
    <Portal>
      <div
        ref={ref}
        role="dialog"
        aria-label="Atajos de teclado"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          maxHeight: position.maxHeight,
        }}
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg",
        )}
      >
        <p className="border-b border-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-700">
          Atajos de teclado
        </p>
        <ul className="flex flex-col gap-1 overflow-y-auto p-3">
          {ME_SHORTCUTS.map((s) => (
            <li
              key={s.keys}
              className="flex items-center justify-between gap-2 text-xs text-neutral-600"
            >
              <span>{s.action}</span>
              <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10px] text-neutral-700">
                {s.keys}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </Portal>
  );
}
