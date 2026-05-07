import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { BodyZone } from "@shared/types/bodyZone.types";
import { toast } from "@shared/stores/toast.store";
import { findFirstZoneMissingSides } from "../lib/pairedSides";
import { memberRiskFlagPaths } from "../lib/pathBuilders";
import type {
  ClinicalProfileFormSchema,
  CurrentStatusFormSchema,
} from "../schemas/clinicalProfile.schema";

interface UseValidateZonesStepParams {
  riskFlagIndex: number;
  affectedZones: BodyZone[] | undefined;
}

export function useValidateZonesStep({
  riskFlagIndex,
  affectedZones,
}: UseValidateZonesStepParams) {
  const { trigger, getValues } = useFormContext<ClinicalProfileFormSchema>();

  return useCallback(async (): Promise<boolean> => {
    const ok = await trigger(
      memberRiskFlagPaths.currentStatusPath(riskFlagIndex),
    );
    if (!ok) return false;

    const statuses = (getValues(
      memberRiskFlagPaths.currentStatusArray(riskFlagIndex),
    ) ?? []) as CurrentStatusFormSchema[];

    const missing = findFirstZoneMissingSides(affectedZones, statuses);
    if (missing) {
      toast.error("Seleccioná al menos un lado en cada zona afectada");
      return false;
    }
    return true;
  }, [trigger, getValues, riskFlagIndex, affectedZones]);
}
