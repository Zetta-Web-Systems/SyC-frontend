import {
  CalendarClock,
  Dumbbell,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";
import type { NavItem } from "@app/types/navigation.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Alumnos",
    to: "/alumnos",
    icon: Users,
  },
  {
    label: "Sesión",
    to: "/sesion",
    icon: CalendarClock,
  },
  {
    label: "Entrenamientos",
    to: "/entrenamientos",
    icon: Dumbbell,
  },
  {
    label: "Profesores",
    to: "/profesores",
    icon: GraduationCap,
  },
];
