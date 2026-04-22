import type { BodyZone } from "@shared/types/bodyZone.types";

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

export const PAIRED_BODY_ZONES: ReadonlySet<BodyZone> = new Set<BodyZone>([
  "deltoids",
  "biceps",
  "triceps",
  "forearm",
  "hands",
  "quadriceps",
  "hamstring",
  "adductors",
  "calves",
  "tibialis",
  "knees",
  "ankles",
  "feet",
]);
