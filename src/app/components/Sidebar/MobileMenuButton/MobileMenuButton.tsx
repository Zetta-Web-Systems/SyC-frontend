import { Menu } from "lucide-react";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useSidebarStore } from "@shared/stores/sidebar.store";
import { Button } from "@shared/ui";

export function MobileMenuButton() {
  const openMobile = useSidebarStore((s) => s.openMobile);
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!isMobile || mobileOpen) return null;

  return (
    <Button
      variant="ghost"
      intent="neutral"
      size="icon"
      onClick={openMobile}
      className="fixed left-3 top-3 z-30 bg-white shadow-md"
      aria-label="Abrir menú"
    >
      <Menu size={20} />
    </Button>
  );
}
