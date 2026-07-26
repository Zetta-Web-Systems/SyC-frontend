import { api } from "@shared/api/api";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import type { Setting } from "../types";

const SETTINGS_PAGE_SIZE = 100;

export async function getSettings(): Promise<Setting[]> {
  const { data } = await api.get<PaginatedResponse<Setting>>(
    "/settings/list/paginated",
    { params: { page: 1, size: SETTINGS_PAGE_SIZE } },
  );
  return data.data;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await api.patch(`/settings/${key}`, { value });
}
