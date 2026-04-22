import { useQuery } from "@tanstack/react-query";
import { getMemberById } from "../services/members.api";
import { MEMBERS_KEYS } from "../constants";

export function useMemberQuery(id: string | undefined) {
  return useQuery({
    queryKey: MEMBERS_KEYS.detail(id ?? ""),
    queryFn: () => getMemberById(id as string),
    enabled: !!id,
  });
}
