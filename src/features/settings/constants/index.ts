import { SETTING_GROUP, type SettingGroup } from "../types";

export const SETTINGS_KEYS = {
  all: ["settings"] as const,
  list: () => [...SETTINGS_KEYS.all, "list"] as const,
} as const;

export const SETTING_KEY = {
  PAIN_TOLERANCE_LEVEL_1: "PAIN_TOLERANCE_LEVEL_1",
  PAIN_TOLERANCE_LEVEL_2: "PAIN_TOLERANCE_LEVEL_2",
  PAIN_TOLERANCE_LEVEL_3: "PAIN_TOLERANCE_LEVEL_3",
  MEMBER_PLAN_1_DAY_PER_WEEK: "MEMBER_PLAN_1_DAY_PER_WEEK",
  MEMBER_PLAN_2_DAYS_PER_WEEK: "MEMBER_PLAN_2_DAYS_PER_WEEK",
  MEMBER_PLAN_3_DAYS_PER_WEEK: "MEMBER_PLAN_3_DAYS_PER_WEEK",
  MEMBER_PLAN_4_DAYS_PER_WEEK: "MEMBER_PLAN_4_DAYS_PER_WEEK",
  MEMBER_PLAN_5_DAYS_PER_WEEK: "MEMBER_PLAN_5_DAYS_PER_WEEK",
} as const;

export type SettingKey = (typeof SETTING_KEY)[keyof typeof SETTING_KEY];

interface SettingGroupMeta {
  group: SettingGroup;
  title: string;
  description: string;
}

export const SETTING_GROUPS_META: SettingGroupMeta[] = [
  {
    group: SETTING_GROUP.SEMAFORO,
    title: "Semáforo de dolor",
    description: "Umbrales usados para calcular el semáforo de los ejercicios.",
  },
];
