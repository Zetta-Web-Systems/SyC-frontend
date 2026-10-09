import {
  ATTENDANCE_STATE,
  ATTENDANCE_STATE_LABELS,
  ATTENDANCE_STATE_ORDER,
  ATTENDANCE_STATE_PLURAL_LABELS,
  type AttendanceState,
} from "../constants";
import type { SessionMember } from "../types";

const NAME_LIST_FORMAT = new Intl.ListFormat("es", {
  style: "long",
  type: "conjunction",
});

export interface AttendanceGroup {
  state: AttendanceState;
  members: SessionMember[];
}

export function countByAttendanceState(
  members: SessionMember[],
): Record<AttendanceState, number> {
  const counts: Record<AttendanceState, number> = {
    [ATTENDANCE_STATE.PRESENT]: 0,
    [ATTENDANCE_STATE.PENDING]: 0,
    [ATTENDANCE_STATE.ABSENT]: 0,
  };

  for (const m of members) counts[m.attendanceState] += 1;

  return counts;
}

export function formatStateCount(
  state: AttendanceState,
  count: number,
): string {
  const label =
    count === 1
      ? ATTENDANCE_STATE_LABELS[state]
      : ATTENDANCE_STATE_PLURAL_LABELS[state];
  return `${count} ${label.toLowerCase()}`;
}

export function formatMemberNames(members: SessionMember[]): string {
  return NAME_LIST_FORMAT.format(
    members.map(({ member }) => `${member.name} ${member.lastname}`),
  );
}

export function groupByAttendanceState(
  members: SessionMember[],
): AttendanceGroup[] {
  return ATTENDANCE_STATE_ORDER.map((state) => ({
    state,
    members: members.filter((m) => m.attendanceState === state),
  })).filter((group) => group.members.length > 0);
}

export function pickDefaultMember(
  members: SessionMember[],
): SessionMember | undefined {
  const ordered = groupByAttendanceState(members).flatMap(
    (group) => group.members,
  );
  const present = ordered.filter(
    (m) => m.attendanceState === ATTENDANCE_STATE.PRESENT,
  );

  return (
    present.find((m) => m.plan.kind === "current") ?? present[0] ?? ordered[0]
  );
}
