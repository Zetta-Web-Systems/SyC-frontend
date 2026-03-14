import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@app/layouts/AppLayout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayoutRoute,
});

function AuthenticatedLayoutRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
