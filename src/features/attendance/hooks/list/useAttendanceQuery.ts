import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { ATTENDANCE_KEYS } from "../../constants";
import { getAttendancesPaginated } from "../../services/attendance.api";

export function useAttendanceQuery(params: PaginatedParams) {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.list(params),
    queryFn: () => getAttendancesPaginated(params),
    placeholderData: keepPreviousData,
  });
}
