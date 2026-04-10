import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption, FilterSchema } from "@shared/types/filters.types";

export const RISK_FLAGS_KEYS = {
  all: ["riskFlags"] as const,
  list: (params: PaginatedParams) =>
    [...RISK_FLAGS_KEYS.all, "list", params] as const,
} as const;

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { label: "Activos", value: "1" },
  { label: "Inactivos", value: "0" },
];

export const RISK_FLAGS_FILTER_SCHEMA = {
  status: { apiKey: "isActive", initial: ["1"] },
} as const satisfies FilterSchema;

export const BodyZone = {
  // Tren Superior
  HEAD: "HEAD",
  NECK: "NECK",
  SHOULDERS: "SHOULDERS",
  CHEST: "CHEST",
  UPPER_BACK: "UPPER_BACK",
  LOWER_BACK: "LOWER_BACK",
  ABDOMEN: "ABDOMEN",
  ARMS: "ARMS",
  ELBOWS: "ELBOWS",
  WRISTS: "WRISTS",
  HANDS: "HANDS",

  // Tren Inferior
  HIPS: "HIPS",
  GLUTES: "GLUTES",
  LEGS: "LEGS",
  KNEES: "KNEES",
  ANKLES: "ANKLES",
  FEET: "FEET",

  // General
  FULL_BODY: "FULL_BODY",
  OTHER: "OTHER",
} as const;

export type BodyZone = (typeof BodyZone)[keyof typeof BodyZone];

export const BODY_ZONE_LABELS: Record<BodyZone, string> = {
  [BodyZone.HEAD]: "Cabeza",
  [BodyZone.NECK]: "Cuello",
  [BodyZone.SHOULDERS]: "Hombros",
  [BodyZone.CHEST]: "Pecho",
  [BodyZone.UPPER_BACK]: "Espalda alta",
  [BodyZone.LOWER_BACK]: "Zona lumbar",
  [BodyZone.ABDOMEN]: "Abdomen",
  [BodyZone.ARMS]: "Brazos",
  [BodyZone.ELBOWS]: "Codos",
  [BodyZone.WRISTS]: "Muñecas",
  [BodyZone.HANDS]: "Manos",
  [BodyZone.HIPS]: "Cadera",
  [BodyZone.GLUTES]: "Glúteos",
  [BodyZone.LEGS]: "Piernas",
  [BodyZone.KNEES]: "Rodillas",
  [BodyZone.ANKLES]: "Tobillos",
  [BodyZone.FEET]: "Pies",
  [BodyZone.FULL_BODY]: "Cuerpo completo",
  [BodyZone.OTHER]: "Otro",
};
