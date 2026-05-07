import { createFileRoute } from "@tanstack/react-router";
import UpdateRiskFlagPage from "@features/riskFlags/pages/UpdateRiskFlagPage";

export const Route = createFileRoute(
  "/_authenticated/_admin/settings/risk-flags_/update/$riskFlagId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { riskFlagId } = Route.useParams();
  return <UpdateRiskFlagPage riskFlagId={riskFlagId} />;
}
