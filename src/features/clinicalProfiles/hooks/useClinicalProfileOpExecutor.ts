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
  const updateProfile = useUpdateClinicalProfileMutation();
  const updateFlag = useUpdateMemberRiskFlagMutation();
  const deleteFlag = useDeleteMemberRiskFlagMutation();
  const restoreFlag = useRestoreMemberRiskFlagMutation();
  const updateStatus = useUpdateCurrentStatusMutation();
  const addStatus = useAddCurrentStatusMutation();
  const addFlag = useAddMemberRiskFlagMutation();

  return useCallback(
    async (op: ClinicalProfileOp, { snapshot, form }: ExecCtx) => {
      switch (op.kind) {
        case "updateProfile": {
          await updateProfile.mutateAsync({
            clinicalProfileId: op.clinicalProfileId,
            memberId,
            dto: op.dto,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "updateFlagNotes": {
          await updateFlag.mutateAsync({
            memberRiskFlagId: op.memberRiskFlagId,
            memberId,
            dto: op.dto,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "deleteFlag": {
          await deleteFlag.mutateAsync({
            memberRiskFlagId: op.memberRiskFlagId,
            memberId,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "restoreFlag": {
          await restoreFlag.mutateAsync({
            memberRiskFlagId: op.memberRiskFlagId,
            memberId,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "updateStatus": {
          await updateStatus.mutateAsync({
            currentStatusId: op.currentStatusId,
            memberId,
            dto: op.dto,
          });
          applyOpToSnapshot(op, snapshot);
          return;
        }
        case "addStatus": {
          const created = await addStatus.mutateAsync({
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
        case "addFlag": {
          const created = await addFlag.mutateAsync({
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
      addFlag,
      addStatus,
      deleteFlag,
      memberId,
      restoreFlag,
      updateFlag,
      updateProfile,
      updateStatus,
    ],
  );
}
