import {
  BODY_ZONE_GROUP_INTENT,
  BODY_ZONE_TO_GROUP_LABEL,
} from "@shared/constants/bodyZones";
import type { BodyZoneIntent } from "@shared/constants/bodyZones";
import type {
  BodySide,
  ExtendedBodyPart,
} from "@shared/types/bodyHighlighter.types";
import type { BodyZone } from "@shared/types/bodyZone.types";
import {
  BACK_ONLY_BODY_ZONES,
  BODY_ZONE_BLOCK_ORDER,
  BODY_ZONE_INTENT_HEX,
} from "../constants";

export function getActiveBlocks(zones: BodyZone[] | undefined): string[] {
  if (!zones?.length) return [];
  const present = new Set(zones.map((z) => BODY_ZONE_TO_GROUP_LABEL[z]));
  return BODY_ZONE_BLOCK_ORDER.filter((label) => present.has(label));
}

export function getActiveSides(zones: BodyZone[] | undefined): BodySide[] {
  if (!zones?.length) return ["front"];
  const back = zones.some((z) => BACK_ONLY_BODY_ZONES.has(z));
  const front = zones.some((z) => !BACK_ONLY_BODY_ZONES.has(z));
  if (back && front) return ["front", "back"];
  return back ? ["back"] : ["front"];
}

export function getBodyData(zones: BodyZone[] | undefined): ExtendedBodyPart[] {
  return (zones ?? []).map((slug) => {
    const intent =
      BODY_ZONE_GROUP_INTENT[BODY_ZONE_TO_GROUP_LABEL[slug]] ?? "info";
    return { slug, color: BODY_ZONE_INTENT_HEX[intent] };
  });
}

export function getIntentForBlock(label: string): BodyZoneIntent {
  return BODY_ZONE_GROUP_INTENT[label] ?? "info";
}

export function getExercisesCountLabel(count: number): string {
  if (count === 0) return "Sin ejercicios";
  return `${count} ${count === 1 ? "ejercicio" : "ejercicios"}`;
}
