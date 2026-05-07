import { updateCurrentStatus } from "../../services/clinicalProfiles.api";
import type { CurrentStatusUpdateSchema } from "../../schemas/clinicalProfile.schema";
import { createClinicalProfileMutation } from "./createClinicalProfileMutation";

interface Vars {
  currentStatusId: string;
  memberId: string;
  dto: CurrentStatusUpdateSchema;
}

export const useUpdateCurrentStatusMutation = createClinicalProfileMutation<
  Vars,
  Awaited<ReturnType<typeof updateCurrentStatus>>
>({
  mutationFn: ({ currentStatusId, dto }) =>
    updateCurrentStatus(currentStatusId, dto),
  successMessage: "Estado actualizado",
  getMemberId: (v) => v.memberId,
});
