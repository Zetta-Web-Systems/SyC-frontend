import { NON_PAIRED_DEFAULT_SIDE } from "../constants";
import type { ClinicalProfileFormSchema } from "../schemas/clinicalProfile.schema";
import type { ClinicalProfile } from "../types";

export function isDomainProfile(
  profile: ClinicalProfile | ClinicalProfileFormSchema,
): profile is ClinicalProfile {
  if (!("memberRiskFlags" in profile) || profile.memberRiskFlags.length === 0) {
    return "id" in profile && typeof profile.id === "string";
  }
  return "riskFlag" in profile.memberRiskFlags[0];
}

export function buildDefaults(
  profile: ClinicalProfile | ClinicalProfileFormSchema | null,
): ClinicalProfileFormSchema {
  if (!profile) {
    return { generalObservations: "", memberRiskFlags: [] };
  }
  if (isDomainProfile(profile)) {
    return {
      generalObservations: profile.generalObservations ?? "",
      memberRiskFlags: profile.memberRiskFlags.map((mrf) => ({
        id: mrf.id,
        riskFlagId: mrf.riskFlag.id,
        notes: mrf.notes ?? "",
        isActive: mrf.isActive,
        currentStatus: mrf.currentStatus.map((cs) => ({
          id: cs.id,
          painLevel: cs.painLevel,
          bodyZone: cs.bodyZone,
          movementPhase: cs.movementPhase ?? undefined,
          side: cs.side ?? NON_PAIRED_DEFAULT_SIDE,
        })),
      })),
    };
  }
  return profile;
}
