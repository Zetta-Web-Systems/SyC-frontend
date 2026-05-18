import { useMemo } from "react";
import type { BodyZone } from "@shared/types/bodyZone.types";
import {
  getActiveBlocks,
  getActiveSides,
  getBodyData,
} from "../utils/groupExerciseCard.utils";

export function useGroupExerciseCardZones(zones: BodyZone[] | undefined) {
  const blocks = useMemo(() => getActiveBlocks(zones), [zones]);
  const sides = useMemo(() => getActiveSides(zones), [zones]);
  const bodyData = useMemo(() => getBodyData(zones), [zones]);

  return { blocks, sides, bodyData };
}
