import { createFileRoute } from "@tanstack/react-router";
import { ClinicalProfilePage } from "@features/clinicalProfiles";

export const Route = createFileRoute(
  "/_authenticated/members_/$memberId/clinical-profile",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { memberId } = Route.useParams();
  return <ClinicalProfilePage memberId={memberId} />;
}
