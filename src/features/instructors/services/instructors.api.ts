import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type {
  Instructor,
  CreateInstructorDto,
  UpdateInstructorDto,
} from "../types";

export async function getInstructorsPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<Instructor>>(
    "/instructors/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

export async function createInstructor(dto: CreateInstructorDto) {
  const { data } = await api.post<Instructor>("/instructors/register", dto);
  return data;
}

export async function updateInstructor(id: string, dto: UpdateInstructorDto) {
  const { data } = await api.patch<Instructor>(`/instructors/${id}`, dto);
  return data;
}

export async function deleteInstructor(id: string) {
  await api.delete(`/instructors/${id}`);
}

export async function restoreInstructor(id: string) {
  await api.patch(`/instructors/restore/${id}`);
}
