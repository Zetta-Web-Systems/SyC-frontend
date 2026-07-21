import { useQuery } from "@tanstack/react-query";
import { getInstructorNames } from "../services/instructors.api";
import { INSTRUCTORS_KEYS } from "../constants/instructors.constants";

export function useInstructorNamesQuery(enabled = true) {
  return useQuery({
    queryKey: INSTRUCTORS_KEYS.names(),
    queryFn: getInstructorNames,
    enabled,
  });
}
