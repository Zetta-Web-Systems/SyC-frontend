import {
  PAIN_HIGH_MAX,
  PAIN_LOW_MAX,
  PAIN_MID_MAX,
  PAIN_VERY_LOW_MAX,
  type PainPhase,
} from "../../../../constants";

export function getPainPhase(level: number): PainPhase {
  if (level <= 0) return "none";
  if (level <= PAIN_VERY_LOW_MAX) return "veryLow";
  if (level <= PAIN_LOW_MAX) return "low";
  if (level <= PAIN_MID_MAX) return "mid";
  if (level <= PAIN_HIGH_MAX) return "high";
  return "veryHigh";
}

const PAIN_LABELS: Record<PainPhase, string> = {
  none: "Sin dolor",
  veryLow: "Muy leve",
  low: "Leve",
  mid: "Moderado",
  high: "Alto",
  veryHigh: "Muy alto",
};

export function getPainLabel(level: number): string {
  return PAIN_LABELS[getPainPhase(level)];
}
