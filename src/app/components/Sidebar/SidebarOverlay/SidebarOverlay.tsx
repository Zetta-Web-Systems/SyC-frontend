import { cn } from "@shared/lib/cn";

interface SidebarOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function SidebarOverlay({ visible, onClose }: SidebarOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
      aria-hidden={!visible}
      onClick={onClose}
    />
  );
}
