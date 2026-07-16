import type { Setting, SettingGroup } from "../types";
import { SETTING_GROUP } from "../types";

export function getSettingGroup(key: string): SettingGroup {
  if (key.startsWith("PAIN_TOLERANCE")) return SETTING_GROUP.SEMAFORO;
  if (key.startsWith("MEMBER_PLAN")) return SETTING_GROUP.MEMBERSHIP_PRICES;
  return SETTING_GROUP.OTHER;
}

export function filterSettingsByGroup(
  settings: Setting[],
  group: SettingGroup,
): Setting[] {
  return settings.filter((setting) => getSettingGroup(setting.key) === group);
}
