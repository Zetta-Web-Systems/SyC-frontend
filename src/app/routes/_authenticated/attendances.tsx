import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/attendances")({
  component: AttendancesLayout,
});

function AttendancesLayout() {
  return <Outlet />;
}
