import { LayoutDashboard, Users, CreditCard, Settings } from "lucide-react";
import type { NavItem } from "@app/types/navigation.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    color: "text-blue-400",
  },
  {
    label: "Socios",
    to: "/members",
    icon: Users,
    color: "text-emerald-400",
  },
  {
    label: "Pagos",
    icon: CreditCard,
    color: "text-orange-400",
    children: [
      {
        label: "Ingresos",
        to: "/payments",
      },
      {
        label: "Reembolsos",
        to: "/refunds",
      },
    ],
  },
  {
    label: "Configuración",
    to: "/settings",
    icon: Settings,
    color: "text-purple-400",
  },
];
