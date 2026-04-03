import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type {
  AttendanceResponse,
  AttendanceInstructorResponse,
} from "../types";

export async function registerAttendance(dni: string) {
  const { data } = await api.post<AttendanceResponse>("/attendances", { dni });
  return data;
}

export async function getAttendancesPaginated(params: PaginatedParams) {
  const { data } = await api.get<
    PaginatedResponse<AttendanceInstructorResponse>
  >("attendances/list/paginated", {
    params: buildPaginatedParams(params),
  });
  return data;
}
