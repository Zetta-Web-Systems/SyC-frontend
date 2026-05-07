import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/instructors")({
  component: InstructorsLayout,
});

function InstructorsLayout() {
  return <Outlet />;
}
