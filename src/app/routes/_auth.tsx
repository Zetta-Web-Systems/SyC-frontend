import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@app/layouts/AuthLayout";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
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
