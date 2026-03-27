import { cn } from "@shared/lib/cn";
import { Button } from "@shared/ui";

interface SidebarOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function SidebarOverlay({ visible, onClose }: SidebarOverlayProps) {
  return (
    <Button
      variant="ghost"
      intent="neutral"
      aria-label="Cerrar menú"
      inert={!visible || undefined}
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-40 h-full w-full rounded-none bg-black/40 transition-opacity duration-300 hover:bg-black/40 active:scale-100",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
