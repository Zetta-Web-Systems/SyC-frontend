import { Menu } from "lucide-react";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useSidebarStore } from "@shared/stores/sidebar.store";
import { Button } from "@shared/ui";
import { SidebarLogo } from "../SidebarLogo/SidebarLogo";

export function MobileHeader() {
  const openMobile = useSidebarStore((s) => s.openMobile);
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!isMobile) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4">
      <div className="flex items-center gap-2">
        <SidebarLogo />
      </div>

      <Button
        variant="ghost"
        intent="neutral"
        size="icon"
        onClick={openMobile}
        className="h-8 w-8"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </Button>
    </header>
  );
}
