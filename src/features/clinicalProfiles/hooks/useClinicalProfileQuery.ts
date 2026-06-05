import { useQuery } from "@tanstack/react-query";
import { getClinicalProfileByMemberId } from "../services/clinicalProfiles.api";
import { CLINICAL_PROFILES_KEYS } from "../constants";

export function useClinicalProfileQuery(memberId: string | undefined) {
  return useQuery({
    queryKey: CLINICAL_PROFILES_KEYS.detail(memberId ?? ""),
    queryFn: () => getClinicalProfileByMemberId(memberId as string),
    enabled: !!memberId,
  });
}
