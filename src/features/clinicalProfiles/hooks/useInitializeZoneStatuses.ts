import { useEffect } from "react";
import type { UseFieldArrayAppend } from "react-hook-form";
import { PAIRED_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";
import { buildStatus } from "../lib/memberRiskFlagFactory";
import type {
  ClinicalProfileFormSchema,
  CurrentStatusFormSchema,
} from "../schemas/clinicalProfile.schema";

interface UseInitializeZoneStatusesParams {
  affectedZones: BodyZone[] | undefined;
  getCurrent: () => CurrentStatusFormSchema[] | undefined;
  append: UseFieldArrayAppend<ClinicalProfileFormSchema>;
}

export function useInitializeZoneStatuses({
  affectedZones,
  getCurrent,
  append,
}: UseInitializeZoneStatusesParams) {
  useEffect(() => {
    const zones = affectedZones ?? [];
    const current = getCurrent() ?? [];
    for (const zone of zones) {
      if (PAIRED_BODY_ZONES.has(zone)) continue;
      const already = current.some((s) => s.bodyZone === zone);
      if (!already) append(buildStatus(zone));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
