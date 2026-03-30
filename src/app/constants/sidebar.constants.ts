import { USER_ROLE } from "@features/auth";
import type { UserRole } from "@features/auth";

export const ROLE_AVATAR_COLOR: Record<
  UserRole,
  "primary" | "secondary" | "neutral"
> = {
  [USER_ROLE.ADMIN]: "primary",
  [USER_ROLE.INSTRUCTOR]: "secondary",
  [USER_ROLE.ATTENDANCE]: "neutral",
};

export const ROLE_DISPLAY_LABEL: Record<UserRole, string> = {
  [USER_ROLE.ADMIN]: "Administrador",
  [USER_ROLE.INSTRUCTOR]: "Profesor",
  [USER_ROLE.ATTENDANCE]: "Asistencia",
};
