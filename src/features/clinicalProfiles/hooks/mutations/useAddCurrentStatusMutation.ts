import { addCurrentStatus } from "../../services/clinicalProfiles.api";
import type { CurrentStatusCreateSchema } from "../../schemas/clinicalProfile.schema";
import { createClinicalProfileMutation } from "./createClinicalProfileMutation";

interface Vars {
  memberRiskFlagId: string;
  memberId: string;
  dto: CurrentStatusCreateSchema;
}

export const useAddCurrentStatusMutation = createClinicalProfileMutation<
  Vars,
  Awaited<ReturnType<typeof addCurrentStatus>>
>({
  mutationFn: ({ memberRiskFlagId, dto }) =>
    addCurrentStatus(memberRiskFlagId, dto),
  successMessage: "Estado agregado",
  getMemberId: (v) => v.memberId,
});
