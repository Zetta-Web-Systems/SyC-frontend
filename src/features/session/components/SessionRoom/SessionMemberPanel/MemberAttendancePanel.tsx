import { Eye, UserCheck, UserX } from "lucide-react";
import { Button, Card } from "@shared/ui";
import { ATTENDANCE_STATE, MEMBER_AVATAR_SIZE } from "../../../constants";
import type { SessionMember } from "../../../types";
import { MemberAvatar } from "../../common";

interface MemberAttendancePanelProps {
  sessionMember: SessionMember;
  onMarkPresent: () => void;
  onMarkAbsent: () => void;
  onPeek?: () => void;
}

export function MemberAttendancePanel({
  sessionMember,
  onMarkPresent,
  onMarkAbsent,
  onPeek,
}: MemberAttendancePanelProps) {
  const { member, attendanceState, attendance } = sessionMember;
  const isPending = attendanceState === ATTENDANCE_STATE.PENDING;

  return (
    <Card
      surface="panel"
      className="flex flex-col items-center gap-5 px-6 py-10 text-center"
    >
      <MemberAvatar
        member={member}
        state={attendanceState}
        size={MEMBER_AVATAR_SIZE.XL}
      />

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-semibold text-neutral-900">
          {member.name} {member.lastname}
        </h2>
        <p
          className={
            isPending ? "text-neutral-500" : "font-semibold text-error"
          }
        >
          {isPending ? "Todavía no llegó" : "Ausente"}
        </p>
        {attendance?.absentReason && (
          <p className="mt-1 max-w-sm text-sm text-neutral-600 italic">
            “{attendance.absentReason}”
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button
          intent="success"
          size="lg"
          onClick={onMarkPresent}
          className="px-6"
        >
          <UserCheck size={18} aria-hidden="true" />
          Marcar presente
        </Button>
        {isPending && (
          <Button
            variant="outline"
            intent="danger"
            size="lg"
            onClick={onMarkAbsent}
            className="px-6"
          >
            <UserX size={18} aria-hidden="true" />
            Marcar ausente
          </Button>
        )}
      </div>

      {onPeek && (
        <Button variant="ghost" intent="primary" onClick={onPeek}>
          <Eye size={16} aria-hidden="true" />
          Ver su plan igual
        </Button>
      )}
    </Card>
  );
}

MemberAttendancePanel.displayName = "MemberAttendancePanel";
