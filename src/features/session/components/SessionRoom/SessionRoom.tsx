import { Users } from "lucide-react";
import type { MembersProgress } from "../../hooks/queries/useSessionMembersProgress";
import type { PlanDayPosition, SessionMember } from "../../types";
import { SessionEmptyState } from "../common";
import { SessionMemberPanel } from "./SessionMemberPanel/SessionMemberPanel";
import { SessionRoster } from "./SessionRoster";

interface SessionRoomProps {
  members: SessionMember[];
  progress: MembersProgress;
  selected: SessionMember | undefined;
  position: PlanDayPosition;
  onSelect: (sessionMember: SessionMember) => void;
  onPositionChange: (next: Partial<PlanDayPosition>) => void;
  onMarkPresent: (sessionMember: SessionMember) => void;
  onMarkAbsent: (sessionMember: SessionMember) => void;
}

export function SessionRoom({
  members,
  progress,
  selected,
  position,
  onSelect,
  onPositionChange,
  onMarkPresent,
  onMarkAbsent,
}: SessionRoomProps) {
  if (!selected) {
    return (
      <SessionEmptyState
        icon={<Users size={22} aria-hidden="true" />}
        message="No hay alumnos en este turno"
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[17rem_minmax(0,1fr)] lg:grid-rows-1 lg:gap-6">
      <SessionRoster
        members={members}
        progress={progress}
        selectedId={selected.member.id}
        onSelect={onSelect}
      />

      <div
        key={selected.member.id}
        className="motion-safe:animate-[session-panel-in_260ms_ease-out] lg:min-h-0 lg:overflow-y-auto lg:pr-1"
      >
        <SessionMemberPanel
          sessionMember={selected}
          position={position}
          onPositionChange={onPositionChange}
          onMarkPresent={() => onMarkPresent(selected)}
          onMarkAbsent={() => onMarkAbsent(selected)}
        />
      </div>
    </div>
  );
}

SessionRoom.displayName = "SessionRoom";
