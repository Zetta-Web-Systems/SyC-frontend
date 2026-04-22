import { ALL_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";
import type { RiskFlag } from "@features/riskFlags";
import { PAIN_LEVEL_DEFAULT } from "../constants";
import type {
  CurrentStatusFormSchema,
  MemberRiskFlagFormSchema,
} from "../schemas/clinicalProfile.schema";

export function buildStatus(
  bodyZone: BodyZone,
  side?: BodyLaterality,
): CurrentStatusFormSchema {
  return {
    painLevel: PAIN_LEVEL_DEFAULT,
    bodyZone,
    movementPhase: undefined,
    side,
  };
}

export function buildMemberRiskFlag(
  riskFlag: RiskFlag,
): MemberRiskFlagFormSchema {
  const zones = (riskFlag.affectedZones ?? []) as BodyZone[];
  const hasZones = zones.length > 0;

  return {
    riskFlagId: riskFlag.id,
    notes: undefined,
    isActive: true,
    currentStatus: hasZones
      ? zones.map((zone) => buildStatus(zone))
      : [buildStatus(ALL_BODY_ZONES[0] as BodyZone)],
  };
}
