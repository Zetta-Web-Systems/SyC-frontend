import type { BodyLaterality } from "@shared/types/bodyZone.types";

export const CLINICAL_PROFILES_KEYS = {
  all: ["clinicalProfiles"] as const,
  detail: (memberId: string) =>
    [...CLINICAL_PROFILES_KEYS.all, "detail", memberId] as const,
} as const;

export const PAIN_LEVEL_MIN = 1;
export const PAIN_LEVEL_UPDATE_MIN = 0;
export const PAIN_LEVEL_MAX = 10;
export const PAIN_LEVEL_DEFAULT = 6;

export const MOVEMENT_PHASE_MAX_LENGTH = 255;
export const NOTES_MAX_LENGTH = 2000;
export const GENERAL_OBSERVATIONS_MAX_LENGTH = 5000;

export const SIDE_LABELS: Record<BodyLaterality, string> = {
  left: "Izquierda",
  right: "Derecha",
};

// Curita del Side (mando right como default)
export const NON_PAIRED_DEFAULT_SIDE: BodyLaterality = "right";

export const MAX_VISIBLE_ZONES = 3;
export const TOP_PAIN_ZONES_COUNT = 5;
export const BODY_PREVIEW_FILL = "#e5e7eb";

export const EMPTY_PROFILE_ID_PLACEHOLDER = "";

export const BODY_ZONE_GROUP_ACCENT_CLASS: Record<string, string> = {
  "Tren superior": "border-l-info",
  Core: "border-l-warning",
  "Tren inferior": "border-l-error",
};

export const PAIN_VERY_LOW_MAX = 2;
export const PAIN_LOW_MAX = 4;
export const PAIN_MID_MAX = 6;
export const PAIN_HIGH_MAX = 8;

export const PAIN_PHASES = [
  "none",
  "veryLow",
  "low",
  "mid",
  "high",
  "veryHigh",
] as const;
export type PainPhase = (typeof PAIN_PHASES)[number];

export const PAIN_TRACK_CLASS: Record<PainPhase, string> = {
  none: "accent-clinical-none",
  veryLow: "accent-clinical-very-low",
  low: "accent-clinical-low",
  mid: "accent-clinical-mid",
  high: "accent-clinical-high",
  veryHigh: "accent-clinical-very-high",
};

export const PAIN_TEXT_CLASS: Record<PainPhase, string> = {
  none: "text-clinical-none",
  veryLow: "text-clinical-very-low",
  low: "text-clinical-low",
  mid: "text-clinical-mid",
  high: "text-clinical-high",
  veryHigh: "text-clinical-very-high",
};

export const PAIN_BG_CLASS: Record<PainPhase, string> = {
  none: "bg-clinical-none",
  veryLow: "bg-clinical-very-low",
  low: "bg-clinical-low",
  mid: "bg-clinical-mid",
  high: "bg-clinical-high",
  veryHigh: "bg-clinical-very-high",
};

export const WIZARD_STEP = {
  ZONES: "zones",
  NOTES: "notes",
} as const;
export type WizardStep = (typeof WIZARD_STEP)[keyof typeof WIZARD_STEP];
