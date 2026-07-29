import {
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import { getExerciseById } from "../services/exercises.api";
import { EXERCISES_KEYS } from "../constants";
import type { Exercise } from "../types";

export function useExerciseQuery(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: EXERCISES_KEYS.detail(id ?? ""),
    queryFn: () => getExerciseById(id as string),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;

      const lists = queryClient.getQueriesData<PaginatedResponse<Exercise>>({
        queryKey: [...EXERCISES_KEYS.all, "list"],
      });
      for (const [, page] of lists) {
        const cached = page?.data.find((e) => e.id === id);
        if (cached) return cached;
      }

      const infinites = queryClient.getQueriesData<
        InfiniteData<PaginatedResponse<Exercise>>
      >({
        queryKey: [...EXERCISES_KEYS.all, "infinite"],
      });
      for (const [, data] of infinites) {
        if (!data) continue;
        for (const page of data.pages) {
          const cached = page.data.find((e) => e.id === id);
          if (cached) return cached;
        }
      }

      return undefined;
    },
  });
}
