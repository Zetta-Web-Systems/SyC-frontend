import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getExercisesPaginated } from "../services/exercises.api";
import { EXERCISES_KEYS } from "../constants";

export function useExercisesQuery(params: PaginatedParams) {
  return useQuery({
    queryKey: EXERCISES_KEYS.list(params),
    queryFn: () => getExercisesPaginated(params),
    placeholderData: keepPreviousData,
  });
}
