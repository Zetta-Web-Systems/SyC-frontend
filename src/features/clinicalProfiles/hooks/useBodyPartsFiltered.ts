import { useMemo } from "react";
import type { ExtendedBodyPart } from "@shared/types/bodyHighlighter.types";
import {
  PAIN_HIGH_MAX,
  PAIN_LOW_MAX,
  PAIN_MID_MAX,
  PAIN_VERY_LOW_MAX,
  TOP_PAIN_ZONES_COUNT,
} from "../constants";
import { useClinicalProfileBodyParts } from "./useClinicalProfileBodyParts";

export interface BodyPartsFiltered {
  bodyParts: ExtendedBodyPart[];
  withIntensity: ExtendedBodyPart[];
  withoutIntensity: ExtendedBodyPart[];
  none: ExtendedBodyPart[];
  veryLow: ExtendedBodyPart[];
  low: ExtendedBodyPart[];
  mid: ExtendedBodyPart[];
  high: ExtendedBodyPart[];
  veryHigh: ExtendedBodyPart[];
  topZones: ExtendedBodyPart[];
}

export function useBodyPartsFiltered(): BodyPartsFiltered {
  const bodyParts = useClinicalProfileBodyParts();

  return useMemo(() => {
    const withIntensity = bodyParts.filter((p) => p.intensity !== undefined);
    const withoutIntensity = bodyParts.filter((p) => p.intensity === undefined);

    const none = withIntensity.filter((p) => (p.intensity ?? 0) === 0);
    const veryLow = withIntensity.filter((p) => {
      const i = p.intensity ?? 0;
      return i >= 1 && i <= PAIN_VERY_LOW_MAX;
    });
    const low = withIntensity.filter((p) => {
      const i = p.intensity ?? 0;
      return i > PAIN_VERY_LOW_MAX && i <= PAIN_LOW_MAX;
    });
    const mid = withIntensity.filter((p) => {
      const i = p.intensity ?? 0;
      return i > PAIN_LOW_MAX && i <= PAIN_MID_MAX;
    });
    const high = withIntensity.filter((p) => {
      const i = p.intensity ?? 0;
      return i > PAIN_MID_MAX && i <= PAIN_HIGH_MAX;
    });
    const veryHigh = withIntensity.filter(
      (p) => (p.intensity ?? 0) > PAIN_HIGH_MAX,
    );

    const topZones = [...withIntensity]
      .sort((a, b) => (b.intensity ?? 0) - (a.intensity ?? 0))
      .slice(0, TOP_PAIN_ZONES_COUNT);

    return {
      bodyParts,
      withIntensity,
      withoutIntensity,
      none,
      veryLow,
      low,
      mid,
      high,
      veryHigh,
      topZones,
    };
  }, [bodyParts]);
}
