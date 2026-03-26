import { Link } from "@tanstack/react-router";
import { cn } from "@shared/lib/cn";
import { useSidebarStore } from "@shared/stores/sidebar.store";
import type { NavItem } from "@app/types/navigation.types";
import { SidebarTooltip } from "./SidebarTooltip";

interface SidebarItemProps {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}

export function SidebarItem({ item, pathname, collapsed }: SidebarItemProps) {
  const closeMobile = useSidebarStore((s) => s.closeMobile);
  const isActive =
    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

  return (
    <Link
      to={item.to}
      onClick={closeMobile}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        isActive
          ? "bg-primary-50 text-primary-700"
          : "text-neutral-600 hover:bg-white hover:text-neutral-900 hover:shadow-sm",
        collapsed && "justify-center px-0",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon
        size={18}
        className={cn(
          item.color || "text-neutral-400 group-hover:text-neutral-500",
        )}
      />

      {!collapsed && (
        <>
          <span className="truncate">{item.label}</span>

          {item.badge !== undefined && (
            <span
              className={cn(
                "ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-200 text-neutral-600",
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}

      {collapsed && <SidebarTooltip label={item.label} />}
    </Link>
  );
}
