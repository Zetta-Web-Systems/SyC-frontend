import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getGroupExercisesPaginated } from "../services/groupExercises.api";
import { GROUP_EXERCISES_KEYS } from "../constants";

export function useGroupExercisesQuery(params: PaginatedParams) {
  return useQuery({
    queryKey: GROUP_EXERCISES_KEYS.list(params),
    queryFn: () => getGroupExercisesPaginated(params),
    placeholderData: keepPreviousData,
  });
}
