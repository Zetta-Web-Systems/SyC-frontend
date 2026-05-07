import { createFileRoute } from "@tanstack/react-router";
import RegisterRiskFlagPage from "@features/riskFlags/pages/RegisterRiskFlagPage";

export const Route = createFileRoute(
  "/_authenticated/_admin/settings/risk-flags_/register",
)({
  component: RegisterRiskFlagPage,
});
