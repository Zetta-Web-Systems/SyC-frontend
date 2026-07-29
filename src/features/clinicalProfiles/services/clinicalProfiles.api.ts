import { api } from "@shared/api/api";
import type { ClinicalProfile, CurrentStatus, MemberRiskFlag } from "../types";
import type {
  ClinicalProfileUpdateSchema,
  CurrentStatusCreateSchema,
  CurrentStatusUpdateSchema,
  MemberRiskFlagRegisterSchema,
  MemberRiskFlagUpdateSchema,
} from "../schemas/clinicalProfile.schema";

export async function getClinicalProfileByMemberId(memberId: string) {
  const { data } = await api.get<ClinicalProfile>(
    `/clinical-profile/member/${memberId}`,
  );
  return data;
}

export async function updateClinicalProfile(
  id: string,
  dto: ClinicalProfileUpdateSchema,
) {
  const { data } = await api.patch<ClinicalProfile>(
    `/clinical-profile/${id}`,
    dto,
  );
  return data;
}

export async function addMemberRiskFlag(
  clinicalProfileId: string,
  dto: MemberRiskFlagRegisterSchema,
) {
  const { data } = await api.post<MemberRiskFlag>(
    `/clinical-profile/${clinicalProfileId}/member-risk-flags`,
    dto,
  );
  return data;
}

export async function updateMemberRiskFlag(
  memberRiskFlagId: string,
  dto: MemberRiskFlagUpdateSchema,
) {
  const { data } = await api.patch<MemberRiskFlag>(
    `/clinical-profile/member-risk-flags/${memberRiskFlagId}`,
    dto,
  );
  return data;
}

export async function deleteMemberRiskFlag(memberRiskFlagId: string) {
  await api.delete(`/clinical-profile/member-risk-flags/${memberRiskFlagId}`);
}

export async function restoreMemberRiskFlag(memberRiskFlagId: string) {
  const { data } = await api.patch<MemberRiskFlag>(
    `/clinical-profile/member-risk-flags/restore/${memberRiskFlagId}`,
  );
  return data;
}

export async function addCurrentStatus(
  memberRiskFlagId: string,
  dtos: CurrentStatusCreateSchema[],
) {
  const { data } = await api.post<MemberRiskFlag>(
    `/clinical-profile/member-risk-flags/${memberRiskFlagId}/current-status`,
    dtos,
  );
  return data;
}

export async function updateCurrentStatus(
  currentStatusId: string,
  dto: CurrentStatusUpdateSchema,
) {
  const { data } = await api.patch<CurrentStatus>(
    `/clinical-profile/member-risk-flags/current-status/${currentStatusId}`,
    dto,
  );
  return data;
}
