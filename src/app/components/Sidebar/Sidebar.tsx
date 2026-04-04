import { useEffect } from "react";
import { cn } from "@shared/lib/cn";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { useSidebarStore } from "@shared/stores/sidebar.store";
import { SidebarHeader } from "./SidebarHeader/SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserMenu } from "./SidebarUserMenu";
import { SidebarOverlay } from "./SidebarOverlay/SidebarOverlay";

export function Sidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const toggle = useSidebarStore((s) => s.toggle);
  const collapse = useSidebarStore((s) => s.collapse);
  const closeMobile = useSidebarStore((s) => s.closeMobile);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1280px)");

  useEffect(() => {
    if (isTablet) collapse();
    if (!isMobile) closeMobile();
  }, [isTablet, isMobile, collapse, closeMobile]);

  if (!isMobile) {
    return (
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-neutral-200 bg-neutral-50 transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <SidebarHeader collapsed={collapsed} onToggle={toggle} />
        <SidebarNav collapsed={collapsed} />
        <SidebarUserMenu collapsed={collapsed} />
      </aside>
    );
  }

  return (
    <>
      <SidebarOverlay visible={mobileOpen} onClose={closeMobile} />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-neutral-50 shadow-xl transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarHeader collapsed={false} onToggle={closeMobile} />
        <SidebarNav collapsed={false} />
        <SidebarUserMenu collapsed={false} />
      </aside>
    </>
  );
}
