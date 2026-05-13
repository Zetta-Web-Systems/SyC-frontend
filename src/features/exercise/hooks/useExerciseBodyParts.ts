import { useMemo } from "react";
import type { ExtendedBodyPart } from "@shared/types/bodyHighlighter.types";
import type { BodyZone } from "@shared/types/bodyZone.types";

const AFFECTED_ZONE_FILL = "#dc2626";

export function useExerciseBodyParts(
  affectedZones: BodyZone[] | undefined,
): ExtendedBodyPart[] {
  return useMemo(() => {
    if (!affectedZones || affectedZones.length === 0) return [];
    return affectedZones.map((slug) => ({
      slug,
      color: AFFECTED_ZONE_FILL,
    }));
  }, [affectedZones]);
}
