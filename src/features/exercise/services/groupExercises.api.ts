import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type {
  ExerciseGroup,
  RegisterExerciseGroup,
  UpdateExerciseGroup,
} from "../types";

export async function getGroupExercisesPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<ExerciseGroup>>(
    "/exercises/group/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

// TODO: el endpoint GET /exercises/group/:id todavía no existe en el backend.
export async function getGroupExerciseById(id: string) {
  const { data } = await api.get<ExerciseGroup>(`/exercises/group/${id}`);
  return data;
}

export async function registerGroupExercise(dto: RegisterExerciseGroup) {
  const { data } = await api.post<ExerciseGroup>(
    "/exercises/group/register",
    dto,
  );
  return data;
}

export async function updateGroupExercise(
  id: string,
  dto: UpdateExerciseGroup,
) {
  const { data } = await api.patch<ExerciseGroup>(
    `/exercises/group/${id}`,
    dto,
  );
  return data;
}

export async function deleteGroupExercise(id: string) {
  await api.delete(`/exercises/group/physical/${id}`);
}
