import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@features/auth";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  color?: string;
  badge?: number | string;
  roles?: UserRole[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
