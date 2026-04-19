import { useMemberQuery } from "@features/members/hooks/useMemberQuery";
import { useRiskFlagsQuery } from "@features/riskFlags";
import type { RiskFlag } from "@features/riskFlags";
import { EMPTY_PROFILE_ID_PLACEHOLDER } from "../constants";
import type { ClinicalProfile } from "../types";

interface UseClinicalProfilePageDataResult {
  isLoading: boolean;
  isError: boolean;
  member: ReturnType<typeof useMemberQuery>["data"];
  memberFullName: string;
  availableRiskFlags: RiskFlag[];
  profile: ClinicalProfile | null;
  profileForForm: ClinicalProfile | null;
}

export function useClinicalProfilePageData(
  memberId?: string,
): UseClinicalProfilePageDataResult {
  const memberQuery = useMemberQuery(memberId);
  const riskFlagsQuery = useRiskFlagsQuery({ page: 1, size: 200 });

  const member = memberQuery.data;
  const profile = member?.clinicalProfile ?? null;
  const memberFullName = member ? `${member.name} ${member.lastname}` : "";
  const availableRiskFlags = riskFlagsQuery.data?.data ?? [];

  const profileForForm: ClinicalProfile | null =
    profile ??
    (member
      ? {
          id: EMPTY_PROFILE_ID_PLACEHOLDER,
          generalObservations: null,
          memberRiskFlags: [],
        }
      : null);

  const isLoading =
    (!!memberId && memberQuery.isLoading) || riskFlagsQuery.isLoading;
  const isError = (!!memberId && memberQuery.isError) || riskFlagsQuery.isError;

  return {
    isLoading,
    isError,
    member,
    memberFullName,
    availableRiskFlags,
    profile,
    profileForForm,
  };
}
