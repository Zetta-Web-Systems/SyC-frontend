import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/members")({
  component: MembersLayout,
});

function MembersLayout() {
  return <Outlet />;
}
