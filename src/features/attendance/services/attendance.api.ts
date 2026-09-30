import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type { Mood } from "../constants";
import type { Attendance, AttendanceCheckIn } from "../types";

export async function registerAttendance(dni: string) {
  const { data } = await api.post<AttendanceCheckIn>("/attendances", { dni });
  return data;
}

export async function setAttendanceMood(id: string, mood: Mood) {
  const { data } = await api.patch<AttendanceCheckIn>(
    `/attendances/${id}/mood`,
    { mood },
  );
  return data;
}

export async function getAttendancesPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<Attendance>>(
    "attendances/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}
