import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  color?: string;
  badge?: number | string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
