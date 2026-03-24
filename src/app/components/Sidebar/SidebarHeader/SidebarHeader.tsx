import { PanelLeft } from "lucide-react";
import { SidebarLogo } from "../SidebarLogo/SidebarLogo";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      {!collapsed && (
        <div className="flex items-center gap-3">
          <SidebarLogo />
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white"
      >
        <PanelLeft size={18} />
      </button>
    </div>
  );
}
