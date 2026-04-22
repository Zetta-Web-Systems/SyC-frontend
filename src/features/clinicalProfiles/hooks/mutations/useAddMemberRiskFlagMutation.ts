import { addMemberRiskFlag } from "../../services/clinicalProfiles.api";
import type { MemberRiskFlagRegisterSchema } from "../../schemas/clinicalProfile.schema";
import { createClinicalProfileMutation } from "./createClinicalProfileMutation";

interface Vars {
  clinicalProfileId: string;
  memberId: string;
  dto: MemberRiskFlagRegisterSchema;
}

export const useAddMemberRiskFlagMutation = createClinicalProfileMutation<
  Vars,
  Awaited<ReturnType<typeof addMemberRiskFlag>>
>({
  mutationFn: ({ clinicalProfileId, dto }) =>
    addMemberRiskFlag(clinicalProfileId, dto),
  successMessage: "Bandera de riesgo agregada",
  getMemberId: (v) => v.memberId,
});
