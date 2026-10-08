import type { KeyboardEvent } from "react";
import { Card } from "@shared/ui";
import { AttendanceMoodBadge } from "@features/attendance";
import { ATTENDANCE_STATE, MEMBER_AVATAR_SIZE } from "../../../constants";
import type { MemberDayProgress, SessionMember } from "../../../types";
import { MemberAttendanceMenu, MemberAvatar } from "../../common";
import { MemberPlanStatus } from "./MemberPlanStatus";

interface SessionMemberCardProps {
  sessionMember: SessionMember;
  progress?: MemberDayProgress;
  progressLoading?: boolean;
  onOpen: () => void;
  onMarkPresent: () => void;
  onMarkAbsent: () => void;
}

export function SessionMemberCard({
  sessionMember,
  progress,
  progressLoading,
  onOpen,
  onMarkPresent,
  onMarkAbsent,
}: SessionMemberCardProps) {
  const { member, attendanceState, attendance, plan } = sessionMember;
  const fullName = `${member.name} ${member.lastname}`;

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  }

  const buttonProps = {
    interactive: true,
    role: "button",
    tabIndex: 0,
    "aria-label": `Abrir a ${fullName}`,
    onClick: onOpen,
    onKeyDown: handleKeyDown,
  };

  const menu = (
    <div
      className="absolute top-2 right-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <MemberAttendanceMenu
        fullName={fullName}
        attendanceState={attendanceState}
        onMarkPresent={onMarkPresent}
        onMarkAbsent={onMarkAbsent}
      />
    </div>
  );

  if (attendanceState === ATTENDANCE_STATE.PENDING) {
    return (
      <Card
        {...buttonProps}
        className="relative flex items-center gap-3 rounded-xl border-[1.5px] border-dashed border-neutral-300 bg-white/40 p-3 pr-16"
      >
        <MemberAvatar
          member={member}
          state={attendanceState}
          size={MEMBER_AVATAR_SIZE.MD}
        />
        <p className="min-w-0 truncate font-semibold text-neutral-500">
          {fullName}
        </p>
        {menu}
      </Card>
    );
  }

  if (attendanceState === ATTENDANCE_STATE.ABSENT) {
    return (
      <Card
        {...buttonProps}
        className="relative flex items-start gap-3 rounded-xl border border-error/20 bg-error/5 p-3 pr-16"
      >
        <MemberAvatar
          member={member}
          state={attendanceState}
          size={MEMBER_AVATAR_SIZE.MD}
        />
        <div className="min-w-0 pt-1">
          <p className="truncate font-semibold text-neutral-600">{fullName}</p>
          {attendance?.absentReason && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600 italic">
              “{attendance.absentReason}”
            </p>
          )}
        </div>
        {menu}
      </Card>
    );
  }

  return (
    <Card
      surface="panel"
      {...buttonProps}
      className="relative flex h-full flex-col gap-4 p-4 shadow-sm hover:border-primary-300"
    >
      <div className="flex items-start gap-3 pr-12">
        <MemberAvatar
          member={member}
          state={attendanceState}
          progress={progress}
        />
        <div className="min-w-0 flex-1 pt-1">
          <p className="truncate text-base font-semibold text-neutral-900">
            {fullName}
          </p>
          {attendance?.arrivalTime && (
            <p className="text-sm font-medium tabular-nums text-success">
              Llegó {attendance.arrivalTime}
            </p>
          )}
          {attendance?.mood && <AttendanceMoodBadge mood={attendance.mood} />}
        </div>
      </div>

      <div className="mt-auto">
        <MemberPlanStatus
          plan={plan}
          progress={progress}
          progressLoading={progressLoading}
        />
      </div>

      {menu}
    </Card>
  );
}

SessionMemberCard.displayName = "SessionMemberCard";
