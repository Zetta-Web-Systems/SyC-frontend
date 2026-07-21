import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ClinicalProfilePage } from "@features/clinicalProfiles";

const clinicalProfileSearchSchema = z.object({
  from: z.enum(["profile", "update", "training-plan"]).optional(),
});

export const Route = createFileRoute(
  "/_authenticated/members_/$memberId/clinical-profile",
)({
  validateSearch: clinicalProfileSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { memberId } = Route.useParams();
  const { from } = Route.useSearch();
  return <ClinicalProfilePage memberId={memberId} from={from} />;
}
