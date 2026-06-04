import type { ExerciseLevel } from "@features/exercise";

export const PAIN_TOLERANCE_BY_LEVEL: Record<ExerciseLevel, number> = {
  "1": 8,
  "2": 5,
  "3": 3,
};

export const TRAFFIC_LIGHT_TEXT = { caution: "Precaución" } as const;
