import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@app/layouts/AuthLayout";
import { USER_ROLE } from "@features/auth";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      const destination =
        context.auth.user?.role === USER_ROLE.ATTENDANCE
          ? "/attendance"
          : "/";
      throw redirect({ to: destination });
    }
  },
  component: AuthLayoutRoute,
});

function AuthLayoutRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
