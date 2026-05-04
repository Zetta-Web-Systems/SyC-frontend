import { ALL_BODY_ZONES, PAIRED_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";
import type { RiskFlag } from "@features/riskFlags";
import { NON_PAIRED_DEFAULT_SIDE, PAIN_LEVEL_DEFAULT } from "../constants";
import type {
  CurrentStatusFormSchema,
  MemberRiskFlagFormSchema,
} from "../schemas/clinicalProfile.schema";

export function buildStatus(
  bodyZone: BodyZone,
  side?: BodyLaterality,
): CurrentStatusFormSchema {
  const resolvedSide =
    side ??
    (PAIRED_BODY_ZONES.has(bodyZone) ? undefined : NON_PAIRED_DEFAULT_SIDE);
  return {
    painLevel: PAIN_LEVEL_DEFAULT,
    bodyZone,
    movementPhase: undefined,
    side: resolvedSide as BodyLaterality,
  };
}

export function buildMemberRiskFlag(
  riskFlag: RiskFlag,
): MemberRiskFlagFormSchema {
  const zones = (riskFlag.affectedZones ?? []) as BodyZone[];
  const nonPairedZones = zones.filter((z) => !PAIRED_BODY_ZONES.has(z));

  return {
    riskFlagId: riskFlag.id,
    notes: undefined,
    isActive: true,
    currentStatus:
      nonPairedZones.length > 0
        ? nonPairedZones.map((zone) => buildStatus(zone))
        : zones.length === 0
          ? [buildStatus(ALL_BODY_ZONES[0] as BodyZone)]
          : [],
  };
}
