import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption, FilterSchema } from "@shared/types/filters.types";
import type { Slug } from "@shared/types/bodyHighlighter.types";

export const RISK_FLAGS_KEYS = {
  all: ["riskFlags"] as const,
  list: (params: PaginatedParams) =>
    [...RISK_FLAGS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...RISK_FLAGS_KEYS.all, "detail", id] as const,
} as const;

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { label: "Activos", value: "1" },
  { label: "Inactivos", value: "0" },
];

export const RISK_FLAGS_FILTER_SCHEMA = {
  status: { apiKey: "isActive", initial: ["1"] },
} as const satisfies FilterSchema;

export type BodyZone = Exclude<Slug, "hair">;

export const BODY_ZONE_LABELS: Record<BodyZone, string> = {
  head: "Cabeza",
  neck: "Cuello",
  trapezius: "Trapecio",
  deltoids: "Hombros",
  chest: "Pecho",
  biceps: "Bíceps",
  triceps: "Tríceps",
  forearm: "Antebrazos",
  hands: "Manos",
  abs: "Abdomen",
  obliques: "Oblicuos",
  "upper-back": "Espalda alta",
  "lower-back": "Zona lumbar",
  gluteal: "Glúteos",
  quadriceps: "Cuádriceps",
  hamstring: "Isquiotibiales",
  adductors: "Aductores",
  calves: "Pantorrillas",
  tibialis: "Tibial",
  knees: "Rodillas",
  ankles: "Tobillos",
  feet: "Pies",
};

export interface BodyZoneGroup {
  label: string;
  zones: BodyZone[];
}

export const BODY_ZONE_GROUPS: BodyZoneGroup[] = [
  {
    label: "Tren superior",
    zones: [
      "head",
      "neck",
      "trapezius",
      "deltoids",
      "chest",
      "biceps",
      "triceps",
      "forearm",
      "hands",
    ],
  },
  {
    label: "Core",
    zones: ["abs", "obliques", "upper-back", "lower-back"],
  },
  {
    label: "Tren inferior",
    zones: [
      "gluteal",
      "quadriceps",
      "hamstring",
      "adductors",
      "calves",
      "tibialis",
      "knees",
      "ankles",
      "feet",
    ],
  },
];

export const ALL_BODY_ZONES: BodyZone[] = BODY_ZONE_GROUPS.flatMap(
  (g) => g.zones,
);

export const BODY_ZONE_GROUP_INTENT: Record<
  string,
  "info" | "warning" | "error"
> = {
  "Tren superior": "info",
  Core: "warning",
  "Tren inferior": "error",
};

export const BODY_ZONE_TO_GROUP_LABEL: Record<BodyZone, string> =
  BODY_ZONE_GROUPS.reduce(
    (acc, group) => {
      for (const zone of group.zones) acc[zone] = group.label;
      return acc;
    },
    {} as Record<BodyZone, string>,
  );

export const GROUP_DOT_CLASS: Record<string, string> = {
  "Tren superior": "bg-blue-800",
  Core: "bg-orange-500",
  "Tren inferior": "bg-red-500",
};
