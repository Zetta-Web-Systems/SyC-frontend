import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getExercisesPaginated } from "../services/exercises.api";
import { EXERCISES_KEYS } from "../constants";

interface UseExercisesInfiniteQueryParams
  extends Omit<PaginatedParams, "page" | "size"> {
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 20;

export function useExercisesInfiniteQuery(
  params: UseExercisesInfiniteQueryParams,
) {
  const { pageSize = DEFAULT_PAGE_SIZE, ...rest } = params;

  return useInfiniteQuery({
    queryKey: [
      ...EXERCISES_KEYS.all,
      "infinite",
      { ...rest, size: pageSize },
    ] as const,
    queryFn: ({ pageParam }) =>
      getExercisesPaginated({
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
