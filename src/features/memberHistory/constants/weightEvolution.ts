export const WEIGHT_EVOLUTION_PERIOD_OPTIONS = [
  { value: "7", label: "Últimos 7 días", days: 7 },
  { value: "30", label: "Últimos 30 días", days: 30 },
  { value: "90", label: "Últimos 90 días", days: 90 },
  { value: "all", label: "Historial completo", days: null },
] as const;

export type WeightEvolutionPeriodValue =
  (typeof WEIGHT_EVOLUTION_PERIOD_OPTIONS)[number]["value"];

export const WEIGHT_EVOLUTION_DEFAULT_PERIOD: WeightEvolutionPeriodValue = "30";

export const WEIGHT_EVOLUTION_Y_PADDING = 2;

export const WEIGHT_EVOLUTION_LINE_COLOR = "var(--color-blue-500)";
