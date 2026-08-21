import type { ScheduleWeek } from "../types";

export interface ScheduleSearchMatches {
  isActive: boolean;
  turnIds: ReadonlySet<string>;
  slotIds: ReadonlySet<string>;
}

const NO_MATCHES: ScheduleSearchMatches = {
  isActive: false,
  turnIds: new Set(),
  slotIds: new Set(),
};

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function findScheduleMatches(
  week: ScheduleWeek | undefined,
  search: string,
): ScheduleSearchMatches {
  const needle = normalizeText(search.trim());
  if (!week || needle.length === 0) return NO_MATCHES;

  const turnIds = new Set<string>();
  const slotIds = new Set<string>();

  for (const turn of week.turns) {
    if (!turn.isActive) continue;

    const fullName = normalizeText(
      `${turn.member.name} ${turn.member.lastname}`,
    );
    if (!fullName.includes(needle)) continue;

    turnIds.add(turn.id);
    slotIds.add(turn.timeSlotId);
  }

  return { isActive: true, turnIds, slotIds };
}
