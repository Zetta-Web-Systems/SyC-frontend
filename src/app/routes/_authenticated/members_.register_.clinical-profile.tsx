import { createFileRoute } from "@tanstack/react-router";
import { ClinicalProfileDraftPage } from "@features/clinicalProfiles";

export const Route = createFileRoute(
  "/_authenticated/members_/register_/clinical-profile",
)({
  component: ClinicalProfileDraftPage,
});
