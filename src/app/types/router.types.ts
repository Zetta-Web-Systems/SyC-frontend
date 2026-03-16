import type { AuthUser } from "@features/auth";

export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    user: AuthUser | null;
  };
}
