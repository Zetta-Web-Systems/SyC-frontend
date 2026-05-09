import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import { getGroupExerciseById } from "../services/groupExercises.api";
import { GROUP_EXERCISES_KEYS } from "../constants";
import type { ExerciseGroup } from "../types";

// NOTA: el endpoint GET /exercises/group/:id todavía no existe en el backend.
export function useGroupExerciseQuery(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: GROUP_EXERCISES_KEYS.detail(id ?? ""),
    queryFn: () => getGroupExerciseById(id as string),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      const lists = queryClient.getQueriesData<
        PaginatedResponse<ExerciseGroup>
      >({
        queryKey: GROUP_EXERCISES_KEYS.all,
      });
      for (const [, page] of lists) {
        const cached = page?.data.find((g) => g.id === id);
        if (cached) return cached;
      }
      return undefined;
    },
  });
}
