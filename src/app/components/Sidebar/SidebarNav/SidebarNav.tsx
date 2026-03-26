import { useRouterState } from "@tanstack/react-router";
import { cn } from "@shared/lib/cn";
import { NAV_GROUPS } from "@app/constants/navigation.constants";
import { SidebarItem } from "./SidebarItem";

interface SidebarNavProps {
  collapsed: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const { location } = useRouterState();

  return (
    <nav className={cn("flex-1 py-4", collapsed ? "overflow-hidden" : "overflow-y-auto")}>
      {NAV_GROUPS.map((group, groupIndex) => (
        <div key={group.title} className={cn(groupIndex > 0 && "mt-6")}>
          {!collapsed && (
            <h6 className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {group.title}
            </h6>
          )}

          {collapsed && groupIndex > 0 && (
            <div className="mx-3 mb-3 border-t border-neutral-200" />
          )}

          <div className="space-y-0.5 px-2">
            {group.items.map((item) => (
              <SidebarItem
                key={item.to}
                item={item}
                pathname={location.pathname}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
