import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getUnassignedMembers } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

const PAGE_SIZE = 20;

export function useUnassignedMembersQuery(search?: string) {
  return useInfiniteQuery({
    queryKey: SCHEDULE_KEYS.unassigned(search),
    queryFn: ({ pageParam }) =>
      getUnassignedMembers({
        page: pageParam,
        size: PAGE_SIZE,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });
}
