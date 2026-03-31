import { api } from "@shared/api/api";
import type { AttendanceResponse } from "../types";

export async function registerAttendance(dni: string) {
  const { data } = await api.post<AttendanceResponse>("/attendance", { dni });
  return data;
}
