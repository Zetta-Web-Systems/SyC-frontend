import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { cn } from "@shared/lib/cn";
import type { NavItem } from "@app/types/navigation.types";
import { SidebarTooltip } from "./SidebarTooltip";

interface SidebarGroupProps {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}

export function SidebarGroup({ item, pathname, collapsed }: SidebarGroupProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
      >
        <item.icon
          size={18}
          className={cn("shrink-0", item.color ?? "text-neutral-400")}
        />

        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>

            <ChevronDown
              size={16}
              className={cn("transition-transform", open && "rotate-180")}
            />
          </>
        )}

        {collapsed && <SidebarTooltip label={item.label} />}
      </button>

      {!collapsed && open && item.children && (
        <div className="ml-7 mt-1 flex flex-col gap-1">
          {item.children.map((child) => {
            const isActive = pathname.startsWith(child.to);

            return (
              <Link
                key={child.to}
                to={child.to}
                className={cn(
                  "flex h-9 items-center rounded-lg px-3 text-sm transition-colors",
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
