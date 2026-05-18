import {
  BODY_ZONE_GROUPS,
  BODY_ZONE_TO_GROUP_LABEL,
} from "@shared/constants/bodyZones";
import type { AffectedGroup, BodyZone } from "@shared/types/bodyZone.types";

export function getAffectedGroups(
  zones: BodyZone[] | undefined,
): AffectedGroup[] {
  return BODY_ZONE_GROUPS.map((group) => ({
    label: group.label,
    zones: (zones ?? []).filter(
      (zone) => BODY_ZONE_TO_GROUP_LABEL[zone] === group.label,
    ),
  }));
}
