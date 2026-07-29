export const SETTING_TYPE = {
  NUMBER: "number",
  BOOLEAN: "boolean",
  STRING: "string",
} as const;

export type SettingType = (typeof SETTING_TYPE)[keyof typeof SETTING_TYPE];

export const SETTING_GROUP = {
  SEMAFORO: "SEMAFORO",
  OTHER: "OTHER",
} as const;

export type SettingGroup = (typeof SETTING_GROUP)[keyof typeof SETTING_GROUP];

export interface Setting {
  key: string;
  value: string;
  type: SettingType;
  description: string;
  updatedAt: string;
}
