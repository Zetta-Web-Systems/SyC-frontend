import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_admin/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  return <Outlet />;
}
