import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type {
  Instructor,
  RegisterInstructorDto,
  UpdateInstructorDto,
} from "../types";

function dtoToFormData(
  dto: RegisterInstructorDto | UpdateInstructorDto,
): FormData {
  const formData = new FormData();

  formData.append("name", dto.name!);
  formData.append("lastname", dto.lastname!);
  formData.append("dni", dto.dni!);

  if ("email" in dto) {
    formData.append("email", dto.email!);
  }

  if (dto.phone) {
    formData.append("phone", dto.phone);
  }

  if (dto.emergencyPhone) {
    formData.append("emergencyPhone", dto.emergencyPhone);
  }

  if (dto.address) {
    formData.append("address", dto.address);
  }

  if (dto.image instanceof File) {
    formData.append("image", dto.image);
  }

  return formData;
}

export async function getInstructorsPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<Instructor>>(
    "/instructors/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

export async function registerInstructor(dto: RegisterInstructorDto) {
  const formData = dtoToFormData(dto);
  const { data } = await api.post<Instructor>(
    "/instructors/register",
    formData,
  );
  return data;
}

export async function updateInstructor(id: string, dto: UpdateInstructorDto) {
  const formData = dtoToFormData(dto);
  const { data } = await api.patch<Instructor>(`/instructors/${id}`, formData);
  return data;
}

export async function deleteInstructor(id: string) {
  await api.delete(`/instructors/${id}`);
}

export async function restoreInstructor(id: string) {
  await api.patch(`/instructors/restore/${id}`);
}
