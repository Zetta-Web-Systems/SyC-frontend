import type { ReactNode } from "react";
import { Users } from "lucide-react";
import { Badge } from "@shared/ui";
import { ListState } from "@shared/components/ListState";
import { cn } from "@shared/lib/cn";
import {
  ATTENDANCE_GROUP_GRID,
  ATTENDANCE_GROUP_LABELS,
  ATTENDANCE_STATE_INTENT,
  type AttendanceState,
} from "../../constants";
import { groupByAttendanceState } from "../../lib/sessionSummary";
import type { MembersProgress } from "../../hooks/queries/useSessionMembersProgress";
import type { SessionMember } from "../../types";
import { SessionMemberCard } from "./SessionMemberCard/SessionMemberCard";

interface AttendanceSectionProps {
  state: AttendanceState;
  count: number;
  children: ReactNode;
}

function AttendanceSection({ state, count, children }: AttendanceSectionProps) {
  return (
    <section
      aria-label={ATTENDANCE_GROUP_LABELS[state]}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <Badge
          variant="dot"
          intent={ATTENDANCE_STATE_INTENT[state]}
          size="lg"
          className="px-0"
        >
          {ATTENDANCE_GROUP_LABELS[state]}
        </Badge>
        <span className="text-sm font-bold tabular-nums text-neutral-400">
          {count}
        </span>
      </div>
      <div className={cn("grid grid-cols-1", ATTENDANCE_GROUP_GRID[state])}>
        {children}
      </div>
    </section>
  );
}

interface SessionBoardProps {
  members: SessionMember[];
  progress: MembersProgress;
  onOpen: (sessionMember: SessionMember) => void;
  onMarkPresent: (sessionMember: SessionMember) => void;
  onMarkAbsent: (sessionMember: SessionMember) => void;
}

export function SessionBoard({
  members,
  progress,
  onOpen,
  onMarkPresent,
  onMarkAbsent,
}: SessionBoardProps) {
  if (members.length === 0) {
    return (
      <ListState
        kind="empty"
        variant="dashed-card"
        size="lg"
        icon={<Users size={22} aria-hidden="true" />}
        message="No hay alumnos en este turno"
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-6">
      {groupByAttendanceState(members).map((group) => (
        <AttendanceSection
          key={group.state}
          state={group.state}
          count={group.members.length}
        >
          {group.members.map((sessionMember) => (
            <SessionMemberCard
              key={sessionMember.member.id}
              sessionMember={sessionMember}
              progress={progress.byMember.get(sessionMember.member.id)}
              progressLoading={progress.loading.has(sessionMember.member.id)}
              onOpen={() => onOpen(sessionMember)}
              onMarkPresent={() => onMarkPresent(sessionMember)}
              onMarkAbsent={() => onMarkAbsent(sessionMember)}
            />
          ))}
        </AttendanceSection>
      ))}
    </div>
  );
}

SessionBoard.displayName = "SessionBoard";
