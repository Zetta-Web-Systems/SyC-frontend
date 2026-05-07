import type { WeightHistoricalPoint } from "../types";

function daysAgoIsoDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const mockWeightEvolution: WeightHistoricalPoint[] = [
  { id: "w-1", weight: 78.4, measuredAt: daysAgoIsoDate(1) },
  { id: "w-2", weight: 78.9, measuredAt: daysAgoIsoDate(7) },
  { id: "w-3", weight: 79.6, measuredAt: daysAgoIsoDate(15) },
  { id: "w-4", weight: 80.1, measuredAt: daysAgoIsoDate(25) },
  { id: "w-5", weight: 80.8, measuredAt: daysAgoIsoDate(40) },
  { id: "w-6", weight: 81.5, measuredAt: daysAgoIsoDate(55) },
  { id: "w-7", weight: 82.0, measuredAt: daysAgoIsoDate(70) },
  { id: "w-8", weight: 82.3, measuredAt: daysAgoIsoDate(85) },
  { id: "w-9", weight: 83.0, measuredAt: daysAgoIsoDate(120) },
  { id: "w-10", weight: 84.2, measuredAt: daysAgoIsoDate(180) },
];
