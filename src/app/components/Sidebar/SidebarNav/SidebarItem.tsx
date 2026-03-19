import { Link } from "@tanstack/react-router";
import { cn } from "@shared/lib/cn";
import type { NavItem } from "@app/types/navigation.types";
import { SidebarTooltip } from "./SidebarTooltip";

interface SidebarItemProps {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}

export function SidebarItem({ item, pathname, collapsed }: SidebarItemProps) {
  const to = item.to ?? "/";
  const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        "group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-white font-medium transition-colors",
        isActive ? "bg-primary-800" : "hover:bg-primary-800",
      )}
    >
      {isActive && (
        <span className="absolute left-0 h-6 w-1 rounded-r bg-primary-500" />
      )}
      <item.icon
        size={18}
        className={cn("shrink-0", item.color ?? "text-neutral-400")}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && <SidebarTooltip label={item.label} />}
    </Link>
  );
}
