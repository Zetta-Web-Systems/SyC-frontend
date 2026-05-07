import { updateClinicalProfile } from "../../services/clinicalProfiles.api";
import type { ClinicalProfileUpdateSchema } from "../../schemas/clinicalProfile.schema";
import { createClinicalProfileMutation } from "./createClinicalProfileMutation";

interface Vars {
  clinicalProfileId: string;
  memberId: string;
  dto: ClinicalProfileUpdateSchema;
}

export const useUpdateClinicalProfileMutation = createClinicalProfileMutation<
  Vars,
  Awaited<ReturnType<typeof updateClinicalProfile>>
>({
  mutationFn: ({ clinicalProfileId, dto }) =>
    updateClinicalProfile(clinicalProfileId, dto),
  successMessage: "Observaciones actualizadas",
  getMemberId: (v) => v.memberId,
});
