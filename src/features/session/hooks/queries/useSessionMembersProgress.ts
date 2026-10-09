import { useQueries } from "@tanstack/react-query";
import {
  ATTENDANCE_STATE,
  SESSION_BACKEND_READY,
  SESSION_KEYS,
} from "../../constants";
import { getSessionPlanDay } from "../../services/session.api";
import { warnBackendTodo } from "../../lib/sessionBackendTodo";
import { getDayProgress } from "../../lib/sessionProgress";
import type { MemberDayProgress, SessionMember } from "../../types";

export interface MembersProgress {
  byMember: Map<string, MemberDayProgress>;
  loading: Set<string>;
}

function getProgressFromBoard(members: SessionMember[]): MembersProgress {
  const byMember = new Map<string, MemberDayProgress>();
  for (const m of members) {
    if (m.dayProgress) byMember.set(m.member.id, m.dayProgress);
  }
  return { byMember, loading: new Set() };
}

export function useSessionMembersProgress(
  members: SessionMember[],
): MembersProgress {
  const targets = SESSION_BACKEND_READY.dayProgress
    ? []
    : members.flatMap((m) =>
        m.attendanceState === ATTENDANCE_STATE.PRESENT &&
        m.plan.kind === "current"
          ? [{ memberId: m.member.id, week: m.plan.week, day: m.plan.day }]
          : [],
      );

  const fromPlanDays = useQueries({
    queries: targets.map((t) => ({
      queryKey: SESSION_KEYS.planDay(t.memberId, t.week, t.day),
      queryFn: () => {
        warnBackendTodo(
          "2C",
          "GET /session/list/members no trae dayProgress: el 'Ahora' sale de pedir el día del plan de cada presente.",
          true,
        );
        return getSessionPlanDay(t.memberId, t.week, t.day);
      },
    })),
    combine: (results): MembersProgress => {
      const byMember = new Map<string, MemberDayProgress>();
      const loading = new Set<string>();
      results.forEach((result, i) => {
        const { memberId } = targets[i];
        if (result.data) byMember.set(memberId, getDayProgress(result.data));
        else if (result.isPending) loading.add(memberId);
      });
      return { byMember, loading };
    },
  });

  return SESSION_BACKEND_READY.dayProgress
    ? getProgressFromBoard(members)
    : fromPlanDays;
}
