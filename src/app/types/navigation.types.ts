import type { LucideIcon } from "lucide-react";

export interface NavChild {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  to?: string;
  icon: LucideIcon;
  color?: string;
  children?: NavChild[];
}
