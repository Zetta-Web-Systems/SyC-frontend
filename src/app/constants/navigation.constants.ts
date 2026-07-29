import {
  LayoutDashboard,
  CalendarDays,
  Play,
  Users,
  UserRoundCheck,
  ClipboardList,
  Dumbbell,
  Receipt,
  CreditCard,
  UserCog,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { USER_ROLE } from "@features/auth";
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
        to: "/members",
        icon: Users,
        color: "text-pink-400",
        roles: [USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR],
      },
      {
        label: "Profesores",
        to: "/instructors",
        icon: UserRoundCheck,
        color: "text-amber-400",
        roles: [USER_ROLE.ADMIN],
      },
    ],
  },
  {
    title: "Planificación",
    items: [
      {
        label: "Planificaciones",
        to: "/training-plans",
        icon: ClipboardList,
        color: "text-emerald-400",
        roles: [USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR],
      },
      {
        label: "Ejercicios",
        to: "/exercises",
        icon: Dumbbell,
        color: "text-orange-400",
        roles: [USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR],
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
        roles: [USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR],
      },
      {
        label: "Membresías",
        to: "/memberships",
        icon: CreditCard,
        color: "text-violet-400",
        roles: [USER_ROLE.ADMIN],
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
        roles: [USER_ROLE.ADMIN],
      },
      {
        label: "Auditoría",
        to: "/audit",
        icon: ShieldCheck,
        color: "text-rose-400",
        roles: [USER_ROLE.ADMIN],
      },
      {
        label: "Configuración",
        to: "/settings",
        icon: Settings,
        color: "text-purple-400",
        roles: [USER_ROLE.ADMIN],
      },
    ],
  },
];
