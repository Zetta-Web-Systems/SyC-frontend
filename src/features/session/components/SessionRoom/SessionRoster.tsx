import { SectionLabel } from "@shared/components/SectionLabel";
import { cn } from "@shared/lib/cn";
import {
  ATTENDANCE_GROUP_LABELS,
  ATTENDANCE_STATE,
  MEMBER_AVATAR_SIZE,
} from "../../constants";
import { groupByAttendanceState } from "../../lib/sessionSummary";
import type { MembersProgress } from "../../hooks/queries/useSessionMembersProgress";
import type { MemberDayProgress, SessionMember } from "../../types";
import { MemberAvatar } from "../common";

function getRosterDetail(
  sessionMember: SessionMember,
  progress: MemberDayProgress | undefined,
): string {
  const { attendanceState, attendance, plan } = sessionMember;

  if (attendanceState === ATTENDANCE_STATE.PENDING) return "Por llegar";
  if (attendanceState === ATTENDANCE_STATE.ABSENT)
    return attendance?.absentReason ?? "Ausente";

  switch (plan.kind) {
    case "current":
      if (!progress) return `Semana ${plan.week} · Día ${plan.day}`;
      return progress.currentExercise
        ? `Ahora: ${progress.currentExercise}`
        : "Día completo";
    case "weekDone":
      return `Semana ${plan.week} completa`;
    case "outOfRange":
      return "Plan fuera de fecha";
    case "none":
      return "Sin plan activo";
  }
}

interface SessionRosterProps {
  members: SessionMember[];
  progress: MembersProgress;
  selectedId: string;
  onSelect: (sessionMember: SessionMember) => void;
}

export function SessionRoster({
  members,
  progress,
  selectedId,
  onSelect,
}: SessionRosterProps) {
  const groups = groupByAttendanceState(members);
  const ordered = groups.flatMap((g) => g.members);

  return (
    <>
      <nav
        aria-label="Alumnos del turno"
        className="hidden min-h-0 flex-col gap-4 overflow-y-auto pr-1 lg:flex"
      >
        {groups.map((group) => (
          <div key={group.state} className="flex flex-col gap-1">
            <SectionLabel
              title={ATTENDANCE_GROUP_LABELS[group.state]}
              trailing={group.members.length}
              className="px-2"
            />
            <ul className="flex flex-col gap-1">
              {group.members.map((sm) => {
                const memberProgress = progress.byMember.get(sm.member.id);
                const selected = sm.member.id === selectedId;
                return (
                  <li key={sm.member.id}>
                    <button
                      type="button"
                      aria-current={selected || undefined}
                      onClick={() => onSelect(sm)}
                      className={cn(
                        "flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors",
                        selected
                          ? "bg-white shadow-sm ring-1 ring-primary-200"
                          : "hover:bg-white/70",
                      )}
                    >
                      <MemberAvatar
                        member={sm.member}
                        state={sm.attendanceState}
                        progress={memberProgress}
                        size={MEMBER_AVATAR_SIZE.MD}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-sm font-semibold",
                            sm.attendanceState === ATTENDANCE_STATE.PRESENT
                              ? "text-neutral-900"
                              : "text-neutral-500",
                          )}
                        >
                          {sm.member.name} {sm.member.lastname}
                        </span>
                        <span className="block truncate text-sm text-neutral-500">
                          {getRosterDetail(sm, memberProgress)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <nav
        aria-label="Alumnos del turno"
        className="scrollbar-hide -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:hidden"
      >
        {ordered.map((sm) => {
          const selected = sm.member.id === selectedId;
          return (
            <button
              key={sm.member.id}
              type="button"
              aria-current={selected || undefined}
              onClick={() => onSelect(sm)}
              className={cn(
                "flex w-19 shrink-0 cursor-pointer flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors",
                selected
                  ? "bg-white shadow-sm ring-1 ring-primary-200"
                  : "hover:bg-white/70",
              )}
            >
              <MemberAvatar
                member={sm.member}
                state={sm.attendanceState}
                progress={progress.byMember.get(sm.member.id)}
                size={MEMBER_AVATAR_SIZE.MD}
              />
              <span className="w-full truncate text-center text-sm font-medium text-neutral-700">
                {sm.member.name}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

SessionRoster.displayName = "SessionRoster";
