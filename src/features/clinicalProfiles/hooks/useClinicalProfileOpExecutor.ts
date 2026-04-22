import { useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ClinicalProfileOp } from "../lib/clinicalProfileDiff";
import { applyOpToSnapshot } from "../lib/snapshotMutations";
import type {
  ClinicalProfileFormSchema,
  CurrentStatusFormSchema,
} from "../schemas/clinicalProfile.schema";
import type { ClinicalProfile } from "../types";
import { useAddCurrentStatusMutation } from "./mutations/useAddCurrentStatusMutation";
import { useAddMemberRiskFlagMutation } from "./mutations/useAddMemberRiskFlagMutation";
import { useDeleteMemberRiskFlagMutation } from "./mutations/useDeleteMemberRiskFlagMutation";
import { useRestoreMemberRiskFlagMutation } from "./mutations/useRestoreMemberRiskFlagMutation";
import { useUpdateClinicalProfileMutation } from "./mutations/useUpdateClinicalProfileMutation";
import { useUpdateCurrentStatusMutation } from "./mutations/useUpdateCurrentStatusMutation";
import { useUpdateMemberRiskFlagMutation } from "./mutations/useUpdateMemberRiskFlagMutation";

interface ExecCtx {
  snapshot: ClinicalProfile;
  form: UseFormReturn<ClinicalProfileFormSchema>;
}

export function useClinicalProfileOpExecutor({
  memberId,
}: {
  memberId: string;
}) {
  const updateClinicalProfile = useUpdateClinicalProfileMutation();
  const updateMemberRiskFlag = useUpdateMemberRiskFlagMutation();
  const deleteMemberRiskFlag = useDeleteMemberRiskFlagMutation();
  const restoreMemberRiskFlag = useRestoreMemberRiskFlagMutation();
  const updateCurrentStatus = useUpdateCurrentStatusMutation();
  const addCurrentStatus = useAddCurrentStatusMutation();
  const addMemberRiskFlag = useAddMemberRiskFlagMutation();

  return useCallback(
    async (op: ClinicalProfileOp, { snapshot, form }: ExecCtx) => {
      switch (op.kind) {
        case "updateClinicalProfile": {
          await updateClinicalProfile.mutateAsync({
            clinicalProfileId: op.clinicalProfileId,
            memberId,
            dto: op.dto,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "updateMemberRiskFlag": {
          await updateMemberRiskFlag.mutateAsync({
            memberRiskFlagId: op.memberRiskFlagId,
            memberId,
            dto: op.dto,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "deleteMemberRiskFlag": {
          await deleteMemberRiskFlag.mutateAsync({
            memberRiskFlagId: op.memberRiskFlagId,
            memberId,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "restoreMemberRiskFlag": {
          await restoreMemberRiskFlag.mutateAsync({
            memberRiskFlagId: op.memberRiskFlagId,
            memberId,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "updateCurrentStatus": {
          await updateCurrentStatus.mutateAsync({
            currentStatusId: op.currentStatusId,
            memberId,
            dto: op.dto,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "addCurrentStatus": {
          const created = await addCurrentStatus.mutateAsync({
            memberRiskFlagId: op.memberRiskFlagId,
            memberId,
            dto: op.dto,
          });
          form.setValue(
            `memberRiskFlags.${op.flagIndex}.currentStatus.${op.statusIndex}.id`,
            created.id,
            { shouldDirty: false },
          );
          applyOpToSnapshot(op, snapshot, { status: created });
          return;
        }
        case "addMemberRiskFlag": {
          const created = await addMemberRiskFlag.mutateAsync({
            clinicalProfileId: snapshot.id,
            memberId,
            dto: op.dto,
          });
          form.setValue(`memberRiskFlags.${op.flagIndex}.id`, created.id, {
            shouldDirty: false,
          });
          const formStatuses = form.getValues(
            `memberRiskFlags.${op.flagIndex}.currentStatus`,
          ) as CurrentStatusFormSchema[];
          created.currentStatus.forEach((cs, i) => {
            const matching =
              formStatuses[i] ??
              formStatuses.find(
                (fs) => fs.bodyZone === cs.bodyZone && fs.side === cs.side,
              );
            if (matching) {
              const idx = formStatuses.indexOf(matching);
              form.setValue(
                `memberRiskFlags.${op.flagIndex}.currentStatus.${idx}.id`,
                cs.id,
                { shouldDirty: false },
              );
            }
          });
          applyOpToSnapshot(op, snapshot, { flag: created });
          return;
        }
      }
    },
    [
      addMemberRiskFlag,
      addCurrentStatus,
      deleteMemberRiskFlag,
      memberId,
      restoreMemberRiskFlag,
      updateMemberRiskFlag,
      updateClinicalProfile,
      updateCurrentStatus,
    ],
  );
}
