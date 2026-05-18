import { useMemo } from "react";
import type { ExtendedBodyPart } from "@shared/types/bodyHighlighter.types";
import type { BodyZone } from "@shared/types/bodyZone.types";
import { getBodyData } from "../utils/groupExerciseCard.utils";

export function useExerciseBodyParts(
  affectedZones: BodyZone[] | undefined,
): ExtendedBodyPart[] {
  return useMemo(() => getBodyData(affectedZones), [affectedZones]);
}
