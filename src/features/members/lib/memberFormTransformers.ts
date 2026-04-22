import type { DefaultValues } from "react-hook-form";
import type {
  ClinicalProfile,
  ClinicalProfileFormSchema,
} from "@features/clinicalProfiles";
import type { UpdateMemberSchema } from "../schemas/member.schema";
import type { Member, MemberRiskFlagLike } from "../types";

export function buildMemberUpdateDefaults(
  member: Member,
): DefaultValues<UpdateMemberSchema> {
  return {
    name: member.name,
    lastname: member.lastname,
    email: member.email ?? "",
    phone: member.phone ?? "",
    emergencyPhone: member.emergencyPhone ?? "",
    address: member.address ?? "",
    bornDate: member.bornDate ?? "",
    currentWeight: member.currentWeight ?? null,
    trainingGoal: member.trainingGoal ?? null,
  };
}

export function mapClinicalProfileToRiskFlagLikes(
  profile: ClinicalProfile | ClinicalProfileFormSchema | null | undefined,
): MemberRiskFlagLike[] {
  if (!profile) return [];

  return profile.memberRiskFlags.map((mrf, i) => {
    const name = "riskFlag" in mrf ? mrf.riskFlag.name : undefined;

    return {
      id: mrf.id ?? `draft-${i}`,
      name,
      isActive: mrf.isActive,
      currentStatus: mrf.currentStatus.map((cs) => ({
        bodyZone: cs.bodyZone,
        side: cs.side ?? null,
        painLevel: cs.painLevel,
      })),
    };
  });
}
