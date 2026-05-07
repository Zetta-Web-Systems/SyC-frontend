export const mockMembership = {
  planName: "3 veces por semana",
  status: "active",
  startDate: "2026-04-01",
  endDate: "2026-05-15",
  remainingDays: 23,
} as const;

export const mockTrainingPlans = {
  current: {
    name: "Fuerza Hipertrofia 3x/sem",
    since: "2025-03-10",
  },
  previous: {
    name: "Full Body inicial",
    until: "2025-03-09",
  },
} as const;
