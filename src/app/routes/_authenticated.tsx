import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { AppLayout } from "@app/layouts/AppLayout";
import { Forbidden, GenericError } from "@shared/components/Errors";

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
  errorComponent: ({ error, reset }) => {
    if (error instanceof AxiosError && error.response?.status === 403) {
      return <Forbidden />;
    }

    return <GenericError error={error} reset={reset} />;
  },
});

function AuthenticatedLayoutRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
