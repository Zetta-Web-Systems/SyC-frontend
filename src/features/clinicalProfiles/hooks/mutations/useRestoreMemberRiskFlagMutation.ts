import { restoreMemberRiskFlag } from "../../services/clinicalProfiles.api";
import { createClinicalProfileMutation } from "./createClinicalProfileMutation";

interface Vars {
  memberRiskFlagId: string;
  memberId: string;
}

export const useRestoreMemberRiskFlagMutation = createClinicalProfileMutation<
  Vars,
  Awaited<ReturnType<typeof restoreMemberRiskFlag>>
>({
  mutationFn: ({ memberRiskFlagId }) => restoreMemberRiskFlag(memberRiskFlagId),
  successMessage: "Bandera de riesgo reactivada",
  getMemberId: (v) => v.memberId,
});
