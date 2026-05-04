import {
  BODY_ZONE_LABELS,
  PAIRED_BODY_ZONES,
} from "@shared/constants/bodyZones";
import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";
import type { MemberRiskFlag } from "@features/clinicalProfiles";
import { PAIN_EVOLUTION_SERIES_PALETTE } from "../constants/painEvolution";
import type {
  FlagOption,
  PainChartRow,
  PainPoint,
  PainSeries,
  PainSeriesTrend,
  PainTrendDirection,
} from "../types";

const REAL_MARKER_PREFIX = "__real_";

export function realMarkerKey(seriesKey: string): string {
  return `${REAL_MARKER_PREFIX}${seriesKey}`;
}

export function isRealPoint(
  row: PainChartRow | undefined,
  seriesKey: string,
): boolean {
  return row?.[realMarkerKey(seriesKey)] === true;
}

export function flattenStatuses(
  memberRiskFlags: MemberRiskFlag[] | undefined,
): PainPoint[] {
  if (!memberRiskFlags) return [];

  const points: PainPoint[] = [];
  for (const flag of memberRiskFlags) {
    for (const status of flag.currentStatus) {
      if (!status.createdAt) continue;
      points.push({
        bodyZone: status.bodyZone,
        side: status.side,
        painLevel: status.painLevel,
        createdAt: status.createdAt,
        flagId: flag.id,
        flagName: flag.riskFlag.name,
        flagIsActive: flag.isActive,
      });
    }
  }
  return points;
}

export function getFlagOptions(
  memberRiskFlags: MemberRiskFlag[] | undefined,
): FlagOption[] {
  if (!memberRiskFlags) return [];
  const seen = new Map<string, FlagOption>();
  for (const flag of memberRiskFlags) {
    if (seen.has(flag.id)) continue;
    seen.set(flag.id, {
      id: flag.id,
      name: flag.riskFlag.name,
      isActive: flag.isActive,
    });
  }
  return Array.from(seen.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "es"),
  );
}

export function filterByFlags(
  points: PainPoint[],
  selectedFlagIds: string[],
  includeInactive: boolean,
): PainPoint[] {
  const hasSelection = selectedFlagIds.length > 0;
  const selectedSet = new Set(selectedFlagIds);
  return points.filter((p) => {
    if (!includeInactive && !p.flagIsActive) return false;
    if (hasSelection && !selectedSet.has(p.flagId)) return false;
    return true;
  });
}

export function getSeriesKey(zone: BodyZone, side: BodyLaterality): string {
  return PAIRED_BODY_ZONES.has(zone) ? `${zone}-${side}` : zone;
}

export function getSeriesLabel(zone: BodyZone, side: BodyLaterality): string {
  const base = BODY_ZONE_LABELS[zone];
  if (!PAIRED_BODY_ZONES.has(zone)) return base;
  const sideShort = side === "left" ? "Izq" : "Der";
  return `${base} (${sideShort})`;
}

export function filterByRange(
  points: PainPoint[],
  days: number | null,
  now: Date = new Date(),
): PainPoint[] {
  if (days === null) return points;
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return points.filter((p) => new Date(p.createdAt).getTime() >= cutoff);
}

function pickColor(index: number): string {
  return PAIN_EVOLUTION_SERIES_PALETTE[
    index % PAIN_EVOLUTION_SERIES_PALETTE.length
  ];
}

function dayKey(createdAt: string): string {
  const d = new Date(createdAt);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function keepLastPerDay(points: PainPoint[]): PainPoint[] {
  const lastByDay = new Map<string, PainPoint>();
  for (const point of points) {
    const key = dayKey(point.createdAt);
    const existing = lastByDay.get(key);
    if (
      !existing ||
      new Date(point.createdAt).getTime() >
        new Date(existing.createdAt).getTime()
    ) {
      lastByDay.set(key, point);
    }
  }
  return Array.from(lastByDay.values());
}

export function buildSeries(points: PainPoint[]): PainSeries[] {
  const map = new Map<string, PainSeries>();

  for (const point of points) {
    const key = getSeriesKey(point.bodyZone, point.side);
    let series = map.get(key);
    if (!series) {
      series = {
        key,
        label: getSeriesLabel(point.bodyZone, point.side),
        color: "",
        points: [],
      };
      map.set(key, series);
    }
    series.points.push(point);
  }

  const ordered = Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "es"),
  );

  return ordered.map((series, index) => {
    const deduped = keepLastPerDay(series.points);
    deduped.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return { ...series, points: deduped, color: pickColor(index) };
  });
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function buildChartRows(series: PainSeries[]): PainChartRow[] {
  if (series.length === 0) return [];

  let minTs = Infinity;
  let maxTs = -Infinity;
  for (const s of series) {
    for (const point of s.points) {
      const ts = new Date(point.createdAt).getTime();
      if (ts < minTs) minTs = ts;
      if (ts > maxTs) maxTs = ts;
    }
  }

  if (!Number.isFinite(minTs) || !Number.isFinite(maxTs)) return [];

  // Si todos los puntos tienen la misma fecha, expandimos el rango un día a cada lado para que se vea la línea horizontal en el gráfico.
  if (minTs === maxTs) {
    minTs -= ONE_DAY_MS;
    maxTs += ONE_DAY_MS;
  }

  const byTimestamp = new Map<number, PainChartRow>();
  const ensureRow = (ts: number): PainChartRow => {
    let row = byTimestamp.get(ts);
    if (!row) {
      row = { timestamp: ts };
      byTimestamp.set(ts, row);
    }
    return row;
  };

  for (const s of series) {
    if (s.points.length === 0) continue;

    for (const point of s.points) {
      const ts = new Date(point.createdAt).getTime();
      const row = ensureRow(ts);
      row[s.key] = point.painLevel;
      row[realMarkerKey(s.key)] = true;
    }

    // Si la serie solo tiene un punto, añadimos un punto extra al inicio y otro al final para que se vea la línea horizontal en el gráfico.
    if (s.points.length === 1) {
      const value = s.points[0].painLevel;
      const minRow = ensureRow(minTs);
      if (minRow[s.key] === undefined) minRow[s.key] = value;
      const maxRow = ensureRow(maxTs);
      if (maxRow[s.key] === undefined) maxRow[s.key] = value;
    }
  }

  return Array.from(byTimestamp.values()).sort(
    (a, b) => a.timestamp - b.timestamp,
  );
}

export function computeSeriesTrends(series: PainSeries[]): PainSeriesTrend[] {
  return series.map((s) => {
    if (s.points.length === 0) {
      return {
        key: s.key,
        label: s.label,
        color: s.color,
        current: 0,
        delta: 0,
        direction: "flat",
      };
    }

    const first = s.points[0].painLevel;
    const current = s.points[s.points.length - 1].painLevel;
    const delta = current - first;
    const direction: PainTrendDirection =
      delta > 0 ? "up" : delta < 0 ? "down" : "flat";

    return {
      key: s.key,
      label: s.label,
      color: s.color,
      current,
      delta,
      direction,
    };
  });
}
