import type { ScheduleWeek } from "../types";

export interface ScheduleSearchMatches {
  isActive: boolean;
  memberIds: ReadonlySet<string>;
  turnIds: ReadonlySet<string>;
  recoveryIds: ReadonlySet<string>;
  slotIds: ReadonlySet<string>;
}

const NO_MATCHES: ScheduleSearchMatches = {
  isActive: false,
  memberIds: new Set(),
  turnIds: new Set(),
  recoveryIds: new Set(),
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

  const memberIds = new Set<string>();
  const turnIds = new Set<string>();
  const recoveryIds = new Set<string>();
  const slotIds = new Set<string>();

  for (const turn of week.turns) {
    if (!turn.isActive) continue;

    const fullName = normalizeText(
      `${turn.member.name} ${turn.member.lastname}`,
    );
    if (!fullName.includes(needle)) continue;

    memberIds.add(turn.member.id);
    turnIds.add(turn.id);
    slotIds.add(turn.timeSlotId);
  }

  for (const recovery of week.recoveries) {
    const fullName = normalizeText(
      `${recovery.member.name} ${recovery.member.lastname}`,
    );
    if (!fullName.includes(needle)) continue;

    memberIds.add(recovery.member.id);
    recoveryIds.add(recovery.id);
    slotIds.add(recovery.timeSlotId);
  }

  return { isActive: true, memberIds, turnIds, recoveryIds, slotIds };
}
