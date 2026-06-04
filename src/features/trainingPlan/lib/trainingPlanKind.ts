import type { Member, MemberSimple } from "@features/members";
import { PlanState } from "../constants";

export const TRAINING_PLAN_KIND = {
  REGULAR: "regular",
  TEMPLATE: "template",
} as const;

export type TrainingPlanKind =
  (typeof TRAINING_PLAN_KIND)[keyof typeof TRAINING_PLAN_KIND];

interface TrainingPlanKindInput {
  state: PlanState;
  member?: Member | MemberSimple;
  templateName?: string | null;
}

export function getTrainingPlanKind(
  plan: TrainingPlanKindInput,
): TrainingPlanKind {
  return plan.state === PlanState.TEMPLATE
    ? TRAINING_PLAN_KIND.TEMPLATE
    : TRAINING_PLAN_KIND.REGULAR;
}

export function getTrainingPlanDescription(
  plan: TrainingPlanKindInput,
): string {
  const memberName = plan.member
    ? `${plan.member.name} ${plan.member.lastname}`
    : "";
  const templateName = plan.templateName ?? "";

  switch (getTrainingPlanKind(plan)) {
    case TRAINING_PLAN_KIND.REGULAR:
      return `planificación de ${memberName}`;
    case TRAINING_PLAN_KIND.TEMPLATE:
      return `plantilla "${templateName}"`;
  }
}
