import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getMembersPaginated } from "../services/members.api";
import { MEMBERS_KEYS } from "../constants";

interface UseMembersInfiniteQueryParams
  extends Omit<PaginatedParams, "page" | "size"> {
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 20;

export function useMembersInfiniteQuery(params: UseMembersInfiniteQueryParams) {
  const { pageSize = DEFAULT_PAGE_SIZE, ...rest } = params;

  return useInfiniteQuery({
    queryKey: [
      ...MEMBERS_KEYS.all,
      "infinite",
      { ...rest, size: pageSize },
    ] as const,
    queryFn: ({ pageParam }) =>
      getMembersPaginated({
        ...rest,
        size: pageSize,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });
}
