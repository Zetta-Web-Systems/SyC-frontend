import { useAuthStore } from "@features/auth";
import type { UserRole } from "@features/auth";

export function useAuthorize() {
  const role = useAuthStore((s) => s.user?.role ?? null);

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!role) return false;
    return Array.isArray(roles) ? roles.includes(role) : role === roles;
  };

  return { role, hasRole } as const;
}
