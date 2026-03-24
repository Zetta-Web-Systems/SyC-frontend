import { USER_ROLE } from "@features/auth";
import type { UserRole } from "@features/auth";

export const ROLE_AVATAR_COLOR: Record<UserRole, "primary" | "secondary"> = {
  [USER_ROLE.ADMIN]: "primary",
  [USER_ROLE.INSTRUCTOR]: "secondary",
};
