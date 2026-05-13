import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type { Exercise, RegisterExercise, UpdateExercise } from "../types";

function hasImageUpload(dto: RegisterExercise | UpdateExercise): boolean {
  return dto.image instanceof File;
}

function dtoToJson(dto: RegisterExercise | UpdateExercise) {
  const { image: _image, ...rest } = dto;
  return rest;
}

function dtoToFormData(dto: RegisterExercise | UpdateExercise): FormData {
  const formData = new FormData();

  if (dto.name !== undefined) {
    formData.append("name", dto.name);
  }

  if (dto.exerciseLevel !== undefined) {
    formData.append("exerciseLevel", dto.exerciseLevel);
  }

  if (dto.affectedZones !== undefined) {
    formData.append("affectedZones", JSON.stringify(dto.affectedZones));
  }

  if (dto.technicalDescription !== undefined) {
    formData.append("technicalDescription", dto.technicalDescription);
  }

  if (dto.links !== undefined) {
    formData.append("links", JSON.stringify(dto.links));
  }

  if (dto.notes !== undefined) {
    formData.append("notes", dto.notes);
  }

  if (dto.image instanceof File) {
    formData.append("image", dto.image);
  }

  if ("deleteImage" in dto && dto.deleteImage === true) {
    formData.append("deleteImage", "true");
  }

  return formData;
}

export async function getExercisesPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<Exercise>>(
    "/exercises/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

export async function getExerciseById(id: string) {
  const { data } = await api.get<Exercise>(`/exercises/${id}`);
  return data;
}

export async function registerExercise(groupId: string, dto: RegisterExercise) {
  const body = hasImageUpload(dto) ? dtoToFormData(dto) : dtoToJson(dto);
  const { data } = await api.post<Exercise>(
    `/exercises/register/${groupId}`,
    body,
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
  const body = hasImageUpload(dto) ? dtoToFormData(dto) : dtoToJson(dto);
  const { data } = await api.patch<Exercise>(`/exercises/${id}`, body);
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
