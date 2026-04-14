import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import { getMemberById } from "../services/members.api";
import { MEMBERS_KEYS } from "../constants";
import type { Member } from "../types";

export function useMemberQuery(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: MEMBERS_KEYS.detail(id ?? ""),
    queryFn: () => getMemberById(id as string),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      const lists = queryClient.getQueriesData<PaginatedResponse<Member>>({
        queryKey: MEMBERS_KEYS.all,
      });
      for (const [, page] of lists) {
        const cached = page?.data.find((m) => m.id === id);
        if (cached) return cached;
      }
      return undefined;
    },
  });
}
