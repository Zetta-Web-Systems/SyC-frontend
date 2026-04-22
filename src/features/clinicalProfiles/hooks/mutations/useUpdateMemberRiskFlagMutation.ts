import { updateMemberRiskFlag } from "../../services/clinicalProfiles.api";
import type { MemberRiskFlagUpdateSchema } from "../../schemas/clinicalProfile.schema";
import { createClinicalProfileMutation } from "./createClinicalProfileMutation";

interface Vars {
  memberRiskFlagId: string;
  memberId: string;
  dto: MemberRiskFlagUpdateSchema;
}

export const useUpdateMemberRiskFlagMutation = createClinicalProfileMutation<
  Vars,
  Awaited<ReturnType<typeof updateMemberRiskFlag>>
>({
  mutationFn: ({ memberRiskFlagId, dto }) =>
    updateMemberRiskFlag(memberRiskFlagId, dto),
  successMessage: "Notas actualizadas",
  getMemberId: (v) => v.memberId,
});
