import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getTrainingPlansPaginated } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";

interface UseTrainingPlansInfiniteQueryParams extends Omit<
  PaginatedParams,
  "page" | "size"
> {
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 10;

export function useTrainingPlansInfiniteQuery(
  params: UseTrainingPlansInfiniteQueryParams,
) {
  const { pageSize = DEFAULT_PAGE_SIZE, ...rest } = params;

  return useInfiniteQuery({
    queryKey: [
      ...TRAINING_PLANS_KEYS.all,
      "infinite",
      { ...rest, size: pageSize },
    ] as const,
    queryFn: ({ pageParam }) =>
      getTrainingPlansPaginated({
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
