import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type { Member, RegisterMember, UpdateMember } from "../types";

function dtoToFormData(dto: RegisterMember | UpdateMember): FormData {
  const formData = new FormData();

  if (dto.name !== undefined) {
    formData.append("name", dto.name);
  }

  if (dto.lastname !== undefined) {
    formData.append("lastname", dto.lastname);
  }

  if ("dni" in dto && dto.dni !== undefined) {
    formData.append("dni", dto.dni);
  }

  if ("email" in dto && dto.email !== undefined) {
    formData.append("email", dto.email);
  }

  if (dto.phone !== undefined) {
    formData.append("phone", dto.phone);
  }

  if (dto.emergencyPhone !== undefined) {
    formData.append("emergencyPhone", dto.emergencyPhone);
  }

  if (dto.address !== undefined) {
    formData.append("address", dto.address);
  }

  if (dto.image instanceof File) {
    formData.append("image", dto.image);
  }

  if ("deleteImage" in dto && dto.deleteImage === true) {
    formData.append("deleteImage", "true");
  }

  if ("bornDate" in dto && dto.bornDate !== undefined) {
    formData.append("bornDate", dto.bornDate);
  }

  if ("currentWeight" in dto && dto.currentWeight !== undefined) {
    formData.append("currentWeight", String(dto.currentWeight));
  }

  if ("trainingGoal" in dto && dto.trainingGoal !== undefined) {
    formData.append("trainingGoal", dto.trainingGoal);
  }

  return formData;
}

export async function getMembersPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<Member>>(
    "/members/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

export async function getMemberById(id: string) {
  const { data } = await api.get<Member>(`/members/${id}`);
  return data;
}

export async function registerMember(dto: RegisterMember) {
  const formData = dtoToFormData(dto);
  const { data } = await api.post<Member>("/members/register", formData);
  return data;
}

export async function updateMember(id: string, dto: UpdateMember) {
  const formData = dtoToFormData(dto);
  const { data } = await api.patch<Member>(`/members/${id}`, formData);
  return data;
}

export async function deleteMember(id: string) {
  await api.delete(`/members/${id}`);
}

export async function restoreMember(id: string) {
  await api.patch(`/members/restore/${id}`);
}
