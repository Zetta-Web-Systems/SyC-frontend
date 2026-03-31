import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getInstructorsPaginated } from "../services/instructors.api";
import { INSTRUCTORS_KEYS } from "@features/instructors/constants/instructors.constants";

export function useInstructorsQuery(params: PaginatedParams) {
  return useQuery({
    queryKey: INSTRUCTORS_KEYS.list(params),
    queryFn: () => getInstructorsPaginated(params),
    placeholderData: keepPreviousData,
  });
}
