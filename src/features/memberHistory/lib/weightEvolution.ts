import type {
  WeightChartRow,
  WeightHistoricalPoint,
  WeightTrend,
  WeightTrendDirection,
} from "../types";

export function filterWeightByRange(
  points: WeightHistoricalPoint[],
  days: number | null,
  now: Date = new Date(),
): WeightHistoricalPoint[] {
  if (days === null) return points;
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return points.filter((p) => new Date(p.measuredAt).getTime() >= cutoff);
}

export function buildWeightRows(
  points: WeightHistoricalPoint[],
): WeightChartRow[] {
  return points
    .map((p) => ({
      timestamp: new Date(p.measuredAt).getTime(),
      weight: p.weight,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function computeWeightDomain(
  rows: WeightChartRow[],
  padding: number,
): [number, number] {
  if (rows.length === 0) return [0, 0];
  let min = Infinity;
  let max = -Infinity;
  for (const row of rows) {
    if (row.weight < min) min = row.weight;
    if (row.weight > max) max = row.weight;
  }
  return [Math.max(0, min - padding), max + padding];
}

export function computeWeightTrend(rows: WeightChartRow[]): WeightTrend {
  if (rows.length === 0) {
    return { current: null, initial: null, delta: 0, direction: "flat" };
  }
  const initial = rows[0].weight;
  const current = rows[rows.length - 1].weight;
  const delta = Number((current - initial).toFixed(2));
  const direction: WeightTrendDirection =
    delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return { current, initial, delta, direction };
}
