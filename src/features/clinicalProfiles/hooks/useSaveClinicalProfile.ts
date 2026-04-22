import { useCallback, useState } from "react";
import type { MutableRefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { MutationLike } from "@shared/types/mutations.types";
import { toast } from "@shared/stores/toast.store";
import { EMPTY_PROFILE_ID_PLACEHOLDER } from "../constants";
import { buildClinicalProfileOps } from "../lib/clinicalProfileDiff";
import type { ClinicalProfileFormSchema } from "../schemas/clinicalProfile.schema";
import type { ClinicalProfile } from "../types";
import { useClinicalProfileOpExecutor } from "./useClinicalProfileOpExecutor";

interface UseSaveClinicalProfileParams {
  memberId: string;
  snapshotRef: MutableRefObject<ClinicalProfile | null>;
  onSuccess: () => void;
}

interface UseSaveClinicalProfileResult {
  submit: (
    data: ClinicalProfileFormSchema,
    form: UseFormReturn<ClinicalProfileFormSchema>,
  ) => Promise<void>;
  isSaving: boolean;
  mutation: MutationLike;
}

export function useSaveClinicalProfile({
  memberId,
  snapshotRef,
  onSuccess,
}: UseSaveClinicalProfileParams): UseSaveClinicalProfileResult {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<unknown>(null);
  const exec = useClinicalProfileOpExecutor({ memberId });

  const submit = useCallback(
    async (
      data: ClinicalProfileFormSchema,
      form: UseFormReturn<ClinicalProfileFormSchema>,
    ) => {
      const snapshot = snapshotRef.current;
      const ops = snapshot ? buildClinicalProfileOps(snapshot, data) : [];
      if (ops.length === 0) {
        form.reset(data);
        onSuccess();
        return;
      }

      if (!snapshot || snapshot.id === EMPTY_PROFILE_ID_PLACEHOLDER) {
        toast.error("No se pudo cargar el perfil clínico");
        return;
      }

      setIsSaving(true);
      setSaveError(null);

      try {
        for (const op of ops) {
          await exec(op, { snapshot, form });
        }
        form.reset(form.getValues());
        onSuccess();
      } catch (err) {
        setSaveError(err);
        toast.error("Ocurrió un error al guardar el perfil clínico");
      } finally {
        setIsSaving(false);
      }
    },
    [exec, onSuccess, snapshotRef],
  );

  return {
    submit,
    isSaving,
    mutation: { isError: !!saveError, error: saveError },
  };
}
