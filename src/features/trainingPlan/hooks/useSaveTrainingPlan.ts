import { useCallback, useState } from "react";
import type { RefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import type { MutationLike } from "@shared/types/mutations.types";
import { toast } from "@shared/stores/toast.store";
import { executeTrainingPlanSave } from "../lib/trainingPlanSave";
import { TRAINING_PLANS_KEYS } from "../constants";
import type { RegisterTrainingPlanFormSchema } from "../schemas/registerTrainingPlan.schema";

interface UseSaveTrainingPlanParams {
  planId: string;
  snapshotRef: RefObject<RegisterTrainingPlanFormSchema>;
  onSuccess: () => void;
  onError?: () => void;
}

interface UseSaveTrainingPlanResult {
  save: (
    data: RegisterTrainingPlanFormSchema,
    form: UseFormReturn<RegisterTrainingPlanFormSchema>,
  ) => Promise<void>;
  isSaving: boolean;
  mutation: MutationLike;
}

export function useSaveTrainingPlan({
  planId,
  snapshotRef,
  onSuccess,
  onError,
}: UseSaveTrainingPlanParams): UseSaveTrainingPlanResult {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<unknown>(null);

  const save = useCallback(
    async (
      data: RegisterTrainingPlanFormSchema,
      form: UseFormReturn<RegisterTrainingPlanFormSchema>,
    ) => {
      setIsSaving(true);
      setSaveError(null);
      try {
        const changed = await executeTrainingPlanSave({
          planId,
          snapshot: snapshotRef.current,
          next: data,
        });
        form.reset(data);
        if (changed) {
          toast.success("Planificación actualizada", {
            description: "Los cambios fueron guardados correctamente.",
          });
        }
        onSuccess();
      } catch (err) {
        setSaveError(err);
        toast.error("No se pudieron guardar todos los cambios", {
          description:
            "Algunos cambios pueden haberse aplicado. Volvimos a cargar la planificación.",
        });
        onError?.();
      } finally {
        setIsSaving(false);
        void queryClient.invalidateQueries({
          queryKey: TRAINING_PLANS_KEYS.all,
        });
      }
    },
    [planId, queryClient, onSuccess, onError, snapshotRef],
  );

  return {
    save,
    isSaving,
    mutation: { isError: !!saveError, error: saveError },
  };
}
