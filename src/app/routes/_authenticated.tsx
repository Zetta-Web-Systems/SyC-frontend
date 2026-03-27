import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { AppLayout } from "@app/layouts/AppLayout";
import { Forbidden, GenericError } from "@shared/components/Errors";
import { queryClient } from "@shared/config/queryClient";
import { getMe, useAuthStore, USER_ROLE } from "@features/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    let currentUser = useAuthStore.getState().user;

    if (!context.auth.isAuthenticated && !currentUser) {
      try {
        const user = await queryClient.ensureQueryData({
          queryKey: ["me"],
          queryFn: getMe,
          staleTime: Infinity,
        });
        useAuthStore.getState().setUser(user);
        currentUser = user;
      } catch {
        throw redirect({
          to: "/login",
          search: { redirect: location.href },
        });
      }
    }

    if (currentUser?.role === USER_ROLE.ATTENDANCE) {
      throw redirect({ to: "/attendance" });
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
