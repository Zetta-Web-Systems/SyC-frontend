import { deleteMemberRiskFlag } from "../../services/clinicalProfiles.api";
import { createClinicalProfileMutation } from "./createClinicalProfileMutation";

interface Vars {
  memberRiskFlagId: string;
  memberId: string;
}

export const useDeleteMemberRiskFlagMutation = createClinicalProfileMutation<
  Vars,
  Awaited<ReturnType<typeof deleteMemberRiskFlag>>
>({
  mutationFn: ({ memberRiskFlagId }) => deleteMemberRiskFlag(memberRiskFlagId),
  successMessage: "Bandera de riesgo desactivada",
  getMemberId: (v) => v.memberId,
});
