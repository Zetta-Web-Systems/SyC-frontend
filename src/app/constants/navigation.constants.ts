import { LayoutDashboard, Settings, GraduationCap } from "lucide-react";
import type { NavItem } from "@app/types/navigation.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    color: "text-blue-400",
  },
  {
    label: "Profesores",
    to: "/instructors",
    icon: GraduationCap,
    color: "text-amber-400",
  },
  {
    label: "Configuración",
    to: "/settings",
    icon: Settings,
    color: "text-purple-400",
  },
];
