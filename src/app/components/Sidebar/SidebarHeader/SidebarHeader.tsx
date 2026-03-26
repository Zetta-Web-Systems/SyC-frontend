import { Menu, X } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Button } from "@shared/ui";
import { SidebarLogo } from "../SidebarLogo/SidebarLogo";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-3">
      {!collapsed && (
        <div className="flex items-center gap-2">
          <SidebarLogo />
        </div>
      )}

      <Button
        variant="ghost"
        intent="neutral"
        size="icon"
        onClick={onToggle}
        className={cn("h-8 w-8", collapsed && "mx-auto")}
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {collapsed ? <Menu size={18} /> : <X size={18} />}
      </Button>
    </div>
  );
}
