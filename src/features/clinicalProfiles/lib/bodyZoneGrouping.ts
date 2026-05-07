import { BODY_ZONE_TO_GROUP_LABEL } from "@shared/constants/bodyZones";

export function getDominantGroup(affectedZones: string[]): string | null {
  const counts: Record<string, number> = {};
  for (const zone of affectedZones) {
    const group =
      BODY_ZONE_TO_GROUP_LABEL[zone as keyof typeof BODY_ZONE_TO_GROUP_LABEL];
    if (group) counts[group] = (counts[group] ?? 0) + 1;
  }
  let dominant: string | null = null;
  let max = 0;
  for (const [group, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      dominant = group;
    }
  }
  return dominant;
}

interface ZoneStatusLike {
  painLevel: number;
  bodyZone: string;
  side?: string;
  movementPhase?: string;
}

export interface ZoneStatusGroup<T extends ZoneStatusLike> {
  zone: string;
  items: T[];
  maxPain: number;
}

export function groupAndSortStatuses<T extends ZoneStatusLike>(
  statuses: T[],
): ZoneStatusGroup<T>[] {
  const map = new Map<string, T[]>();

  for (const status of statuses) {
    const key = status.bodyZone;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(status);
  }

  const grouped = Array.from(map.entries()).map(([zone, items]) => ({
    zone,
    items,
    maxPain: Math.max(...items.map((s) => s.painLevel)),
  }));

  grouped.sort((a, b) => b.maxPain - a.maxPain);

  return grouped;
}
