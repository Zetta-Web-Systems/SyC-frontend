const USER_ROLE = {
  ADMIN: "ADMIN",
  INSTRUCTOR: "INSTRUCTOR",
} as const;

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

interface AuthUser {
  id: string;
  email: string;
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
