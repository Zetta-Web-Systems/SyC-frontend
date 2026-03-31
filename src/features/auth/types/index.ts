const USER_ROLE = {
  ADMIN: "ADMIN",
  INSTRUCTOR: "INSTRUCTOR",
  ATTENDANCE: "ATTENDANCE",
} as const;

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LogoutResponse {
  message: string;
}

export { USER_ROLE };
export type { UserRole, AuthUser, LoginCredentials, LogoutResponse };
