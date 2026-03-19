import { useState } from "react";
import { cn } from "@shared/lib/cn";
import { SidebarHeader } from "./SidebarHeader/SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserMenu } from "./SidebarUserMenu";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-primary-900 p-4 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <SidebarNav collapsed={collapsed} />
      <SidebarUserMenu collapsed={collapsed} />
    </aside>
  );
}
