import { createFileRoute } from "@tanstack/react-router";
import { SystemParametersPage } from "@features/settings";

export const Route = createFileRoute(
  "/_authenticated/_admin/settings/parameters",
)({
  component: SystemParametersPage,
});
