export const PAIN_EVOLUTION_PERIOD_OPTIONS = [
  { value: "7", label: "Últimos 7 días", days: 7 },
  { value: "30", label: "Últimos 30 días", days: 30 },
  { value: "90", label: "Últimos 90 días", days: 90 },
] as const;

export type PainEvolutionPeriodValue =
  (typeof PAIN_EVOLUTION_PERIOD_OPTIONS)[number]["value"];

export const PAIN_EVOLUTION_DEFAULT_PERIOD: PainEvolutionPeriodValue = "90";

export const PAIN_EVOLUTION_Y_DOMAIN = [0, 10] as const;
export const PAIN_EVOLUTION_Y_TICKS = [0, 2.5, 5, 7.5, 10] as const;

export const PAIN_EVOLUTION_SERIES_PALETTE: readonly string[] = [
  "var(--color-red-500)",
  "var(--color-orange-500)",
  "var(--color-blue-500)",
  "var(--color-emerald-500)",
  "var(--color-violet-500)",
  "var(--color-pink-500)",
  "var(--color-amber-500)",
  "var(--color-cyan-500)",
  "var(--color-lime-500)",
  "var(--color-fuchsia-500)",
];
