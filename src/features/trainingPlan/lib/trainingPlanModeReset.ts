import type { RegisterTrainingPlanFormSchema } from "../schemas/registerTrainingPlan.schema";

export type RegisterTrainingPlanMode = RegisterTrainingPlanFormSchema["mode"];

export function buildModeResetValues(
  current: RegisterTrainingPlanFormSchema,
  nextMode: RegisterTrainingPlanMode,
): RegisterTrainingPlanFormSchema {
  const baseKeep = {
    startDate: current.startDate,
    durationInWeeks: current.durationInWeeks,
    daysPerWeek: current.daysPerWeek,
    mobilityBlock: current.mobilityBlock,
    preparatoryBlock: current.preparatoryBlock,
    aerobicBlock: current.aerobicBlock,
    trainingDays: current.trainingDays,
  };

  if (nextMode === "template") {
    return {
      ...baseKeep,
      mode: "template",
      templateName: "templateName" in current ? current.templateName : "",
    };
  }

  return {
    ...baseKeep,
    mode: "plan",
    memberId: "memberId" in current ? current.memberId : "",
  };
}
