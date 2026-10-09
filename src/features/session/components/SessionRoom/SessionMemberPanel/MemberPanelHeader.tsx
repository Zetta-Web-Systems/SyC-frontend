import type { ReactNode } from "react";
import { Card } from "@shared/ui";
import { formatDayMonth } from "@shared/utils/date.utils";
import { AttendanceMoodBadge } from "@features/attendance";
import { TRAINING_GOAL_LABELS } from "@features/members";
import type {
  MemberDayProgress,
  SessionMember,
  SessionPlanDay,
} from "../../../types";
import { MemberAvatar } from "../../common";

interface MemberPanelHeaderProps {
  sessionMember: SessionMember;
  plan?: SessionPlanDay;
  progress?: MemberDayProgress;
  actions: ReactNode;
  children?: ReactNode;
}

export function MemberPanelHeader({
  sessionMember,
  plan,
  progress,
  actions,
  children,
}: MemberPanelHeaderProps) {
  const { member, attendanceState, attendance } = sessionMember;
  const profile = plan?.member;

  return (
    <Card surface="panel" className="flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <MemberAvatar
          member={member}
          state={attendanceState}
          progress={progress}
        />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold tracking-tight text-neutral-900">
            {member.name} {member.lastname}
          </h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {attendance?.arrivalTime && (
              <span className="font-medium tabular-nums text-success">
                Llegó {attendance.arrivalTime}
              </span>
            )}
            {attendance?.mood && <AttendanceMoodBadge mood={attendance.mood} />}
            {profile && (
              <span className="text-neutral-500">
                {profile.age && <>{profile.age} años · </>}
                {profile.trainingGoal
                  ? TRAINING_GOAL_LABELS[profile.trainingGoal]
                  : "Sin objetivo"}
              </span>
            )}
          </div>
          {plan && (
            <p className="mt-0.5 text-sm text-neutral-400">
              {progress && (
                <span className="font-semibold tabular-nums text-success">
                  {progress.done} de {progress.total} hechos ·{" "}
                </span>
              )}
              Plan #{plan.planNumber} · Prof. {plan.instructor ?? "Sin asignar"}
              {plan.startDate && plan.endDate && (
                <>
                  {" "}
                  · {formatDayMonth(plan.startDate)} –{" "}
                  {formatDayMonth(plan.endDate)}
                </>
              )}
            </p>
          )}
        </div>

        <div className="shrink-0">{actions}</div>
      </div>

      {children}
    </Card>
  );
}

MemberPanelHeader.displayName = "MemberPanelHeader";
