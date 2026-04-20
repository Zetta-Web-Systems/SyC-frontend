import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { ExtendedBodyPart } from "@shared/types/bodyHighlighter.types";
import {
  PAIN_HIGH_MAX,
  PAIN_LOW_MAX,
  PAIN_MID_MAX,
  PAIN_VERY_LOW_MAX,
} from "../constants";
import type { ClinicalProfileFormSchema } from "../schemas/clinicalProfile.schema";

function painColor(level: number): string {
  if (level === 0) return "var(--color-clinical-none)";
  if (level <= PAIN_VERY_LOW_MAX) return "var(--color-clinical-very-low)";
  if (level <= PAIN_LOW_MAX) return "var(--color-clinical-low)";
  if (level <= PAIN_MID_MAX) return "var(--color-clinical-mid)";
  if (level <= PAIN_HIGH_MAX) return "var(--color-clinical-high)";
  return "var(--color-clinical-very-high)";
}

export function useClinicalProfileBodyParts(): ExtendedBodyPart[] {
  const { control } = useFormContext<ClinicalProfileFormSchema>();
  const memberRiskFlags = useWatch({ control, name: "memberRiskFlags" });

  return useMemo<ExtendedBodyPart[]>(() => {
    if (!memberRiskFlags) return [];

    const partMap = new Map<string, ExtendedBodyPart>();

    for (const mrf of memberRiskFlags) {
      if (!mrf.isActive) continue;
      for (const cs of mrf.currentStatus) {
        if (!cs.bodyZone) continue;
        const key = cs.side ? `${cs.bodyZone}-${cs.side}` : cs.bodyZone;
        const existing = partMap.get(key);
        if (!existing || cs.painLevel > (existing.intensity ?? 0)) {
          partMap.set(key, {
            slug: cs.bodyZone,
            color: painColor(cs.painLevel),
            intensity: cs.painLevel,
            side: cs.side,
          });
        }
      }
    }

    return [...partMap.values()];
  }, [memberRiskFlags]);
}
