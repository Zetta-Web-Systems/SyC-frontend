import { createFileRoute, Outlet } from "@tanstack/react-router";
import { USER_ROLE } from "@features/auth";
import { Forbidden } from "@shared/components/Errors";

export const Route = createFileRoute("/_authenticated/_admin")({
  beforeLoad: ({ context }) => {
    if (context.auth.user?.role !== USER_ROLE.ADMIN) {
      throw new Error("FORBIDDEN");
    }
  },
  errorComponent: () => <Forbidden />,
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
