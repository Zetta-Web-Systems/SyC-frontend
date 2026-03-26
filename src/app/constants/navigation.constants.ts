import {
  LayoutDashboard,
  CalendarDays,
  Play,
  Users,
  GraduationCap,
  ClipboardList,
  Dumbbell,
  Receipt,
  CreditCard,
  UserCog,
  ShieldCheck,
  Settings,
} from "lucide-react";
import type { NavGroup } from "@app/types/navigation.types";

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "General",
    items: [
      {
        label: "Dashboard",
        to: "/",
        icon: LayoutDashboard,
        color: "text-blue-400",
      },
      {
        label: "Turnero",
        to: "/schedule",
        icon: CalendarDays,
        color: "text-teal-400",
      },
      {
        label: "Sesión",
        to: "/session",
        icon: Play,
        color: "text-green-400",
      },
    ],
  },
  {
    title: "Gestión",
    items: [
      {
        label: "Alumnos",
        to: "/students",
        icon: Users,
        color: "text-pink-400",
      },
      {
        label: "Profesores",
        to: "/instructors",
        icon: GraduationCap,
        color: "text-amber-400",
      },
    ],
  },
  {
    title: "Planificación",
    items: [
      {
        label: "Planificaciones",
        to: "/plans",
        icon: ClipboardList,
        color: "text-emerald-400",
      },
      {
        label: "Ejercicios",
        to: "/exercises",
        icon: Dumbbell,
        color: "text-orange-400",
      },
    ],
  },
  {
    title: "Finanzas",
    items: [
      {
        label: "Cuotas",
        to: "/billing",
        icon: Receipt,
        color: "text-emerald-500",
      },
      {
        label: "Planes",
        to: "/memberships",
        icon: CreditCard,
        color: "text-violet-400",
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        label: "Usuarios",
        to: "/users",
        icon: UserCog,
        color: "text-sky-400",
      },
      {
        label: "Auditoría",
        to: "/audit",
        icon: ShieldCheck,
        color: "text-rose-400",
      },
      {
        label: "Configuración",
        to: "/settings",
        icon: Settings,
        color: "text-purple-400",
      },
    ],
  },
];
