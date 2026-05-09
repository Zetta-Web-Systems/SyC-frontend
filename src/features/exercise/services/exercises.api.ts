import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type { Exercise, RegisterExercise, UpdateExercise } from "../types";

export async function getExercisesPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<Exercise>>(
    "/exercises/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

// TODO: el endpoint GET /exercises/:id todavía no existe en el backend.
export async function getExerciseById(id: string) {
  const { data } = await api.get<Exercise>(`/exercises/${id}`);
  return data;
}

export async function registerExercise(groupId: string, dto: RegisterExercise) {
  const { data } = await api.post<Exercise>(
    `/exercises/register/${groupId}`,
    dto,
  );
  return data;
}

export async function registerExercisesBulk(
  groupId: string,
  dtos: RegisterExercise[],
) {
  const { data } = await api.post<Exercise[]>(
    `/exercises/register/list/${groupId}`,
    dtos,
  );
  return data;
}

export async function updateExercise(id: string, dto: UpdateExercise) {
  const { data } = await api.patch<Exercise>(`/exercises/${id}`, dto);
  return data;
}

export async function deleteExercise(id: string) {
  await api.delete(`/exercises/${id}`);
}

export async function physicalDeleteExercise(id: string) {
  await api.delete(`/exercises/physical/${id}`);
}

export async function restoreExercise(id: string) {
  await api.patch(`/exercises/restore/${id}`);
}
