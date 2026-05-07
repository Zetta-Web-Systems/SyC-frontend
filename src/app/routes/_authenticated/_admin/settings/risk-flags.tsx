import { createFileRoute } from "@tanstack/react-router";
import { RiskFlagsPage } from "@features/riskFlags";

export const Route = createFileRoute(
  "/_authenticated/_admin/settings/risk-flags",
)({
  component: RiskFlagsPage,
});
