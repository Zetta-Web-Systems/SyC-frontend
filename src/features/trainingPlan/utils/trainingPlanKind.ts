import type { Member, MemberSimple } from "@features/members";

export const TRAINING_PLAN_KIND = {
  REGULAR: "regular",
  MEMBER_TEMPLATE: "memberTemplate",
  TEMPLATE: "template",
} as const;

export type TrainingPlanKind =
  (typeof TRAINING_PLAN_KIND)[keyof typeof TRAINING_PLAN_KIND];

interface TrainingPlanKindInput {
  isTemplate?: boolean | null;
  member?: Member | MemberSimple;
  templateName?: string | null;
}

export function getTrainingPlanKind(
  plan: TrainingPlanKindInput,
): TrainingPlanKind {
  if (!plan.isTemplate) return TRAINING_PLAN_KIND.REGULAR;
  if (plan.member) return TRAINING_PLAN_KIND.MEMBER_TEMPLATE;
  return TRAINING_PLAN_KIND.TEMPLATE;
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
    case TRAINING_PLAN_KIND.MEMBER_TEMPLATE:
      return `plantilla "${templateName}" de ${memberName}`;
    case TRAINING_PLAN_KIND.TEMPLATE:
      return `plantilla "${templateName}"`;
  }
}
