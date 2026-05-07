import { addCurrentStatus } from "../../services/clinicalProfiles.api";
import type { CurrentStatusCreateSchema } from "../../schemas/clinicalProfile.schema";
import { createClinicalProfileMutation } from "./createClinicalProfileMutation";

interface Vars {
  memberRiskFlagId: string;
  memberId: string;
  dtos: CurrentStatusCreateSchema[];
}

export const useAddCurrentStatusMutation = createClinicalProfileMutation<
  Vars,
  Awaited<ReturnType<typeof addCurrentStatus>>
>({
  mutationFn: ({ memberRiskFlagId, dtos }) =>
    addCurrentStatus(memberRiskFlagId, dtos),
  successMessage: "Estados agregados",
  getMemberId: (v) => v.memberId,
});
