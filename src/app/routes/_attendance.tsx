import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getMe, useAuthStore, USER_ROLE } from "@features/auth";
import { queryClient } from "@shared/config/queryClient";
import { getIsLoggingOut } from "@shared/api/api";
import { AttendanceLayout } from "@app/layouts/AttendanceLayout";

export const Route = createFileRoute("/_attendance")({
  beforeLoad: async ({ context }) => {
    // Si se está cerrando sesión, redirigir sin intentar re-hidratar
    if (getIsLoggingOut()) {
      throw redirect({ to: "/login" });
    }

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
        throw redirect({ to: "/login" });
      }
    }

    if (currentUser?.role !== USER_ROLE.ATTENDANCE) {
      throw redirect({ to: "/" });
    }
  },
  component: AttendanceLayoutRoute,
});

function AttendanceLayoutRoute() {
  return (
    <AttendanceLayout>
      <Outlet />
    </AttendanceLayout>
  );
}
