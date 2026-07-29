import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../services/settings.api";
import { SETTINGS_KEYS } from "../constants";

export function useSettingsQuery() {
  return useQuery({
    queryKey: SETTINGS_KEYS.list(),
    queryFn: getSettings,
  });
}
