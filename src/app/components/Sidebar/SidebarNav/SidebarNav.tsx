import { useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS } from "@app/constants/navigation.constants";
import { SidebarItem } from "./SidebarItem";
import { SidebarGroup } from "./SidebarGroup";

interface SidebarNavProps {
  collapsed: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const { location } = useRouterState();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        if (item.children) {
          return (
            <SidebarGroup
              key={item.label}
              item={item}
              pathname={location.pathname}
              collapsed={collapsed}
            />
          );
        }
        return (
          <SidebarItem
            key={item.to}
            item={item}
            pathname={location.pathname}
            collapsed={collapsed}
          />
        );
      })}
    </nav>
  );
}
