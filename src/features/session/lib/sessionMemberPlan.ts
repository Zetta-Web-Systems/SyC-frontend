import type {
  PlanDayPosition,
  SessionDayOverride,
  SessionMember,
  SessionMemberDto,
  SessionMemberPlan,
} from "../types";

export function getSessionMemberPlan(dto: SessionMemberDto): SessionMemberPlan {
  if (dto.planDaysPerWeek == null || dto.planDurationInWeeks == null) {
    return { kind: "none" };
  }

  const size = {
    weeks: dto.planDurationInWeeks,
    daysPerWeek: dto.planDaysPerWeek,
  };

  if (dto.currentWeek == null) return { kind: "outOfRange", ...size };

  if (!dto.currentTrainingDay) {
    return { kind: "weekDone", week: dto.currentWeek, ...size };
  }

  return {
    kind: "current",
    week: dto.currentWeek,
    day: dto.currentTrainingDay.order,
    dayLabel: dto.currentTrainingDay.trainingDayLabel ?? null,
    ...size,
  };
}

export function getPlanDestination(
  plan: SessionMemberPlan,
): PlanDayPosition | null {
  switch (plan.kind) {
    case "none":
      return null;
    case "outOfRange":
      return { week: 1, day: 1 };
    case "weekDone":
      return { week: plan.week, day: 1 };
    case "current":
      return { week: plan.week, day: plan.day };
  }
}

export function getSuggestedPosition(
  plan: SessionMemberPlan | undefined,
): { week: number; day: number | null } | null {
  if (!plan) return null;
  if (plan.kind === "current") return { week: plan.week, day: plan.day };
  if (plan.kind === "weekDone") return { week: plan.week, day: null };
  return null;
}

export function applyDayOverrides(
  members: SessionMember[],
  overrides: Record<string, SessionDayOverride>,
): SessionMember[] {
  return members.map((sessionMember) => {
    const override = overrides[sessionMember.member.id];
    const { plan } = sessionMember;
    if (!override || plan.kind === "none" || plan.kind === "outOfRange")
      return sessionMember;

    return {
      ...sessionMember,
      plan: {
        kind: "current",
        week: override.week,
        day: override.day,
        dayLabel: override.dayLabel,
        weeks: plan.weeks,
        daysPerWeek: plan.daysPerWeek,
      },
    };
  });
}
