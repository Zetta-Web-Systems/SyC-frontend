import type { RegisterTrainingPlanFormSchema } from "../schemas/registerTrainingPlan.schema";
import type {
  RegisterPlannedExercise,
  RegisterTrainingDay,
  RegisterTrainingPlan,
  RegisterTrainingPlanTemplate,
} from "../types";
import { sortDays } from "./dayOrder";

export function toRegisterTrainingDays(
  values: RegisterTrainingPlanFormSchema,
): RegisterTrainingDay[] {
  const sorted = sortDays(values.trainingDays);
  return sorted.map((d, i) => ({
    order: i,
    dayName: d.dayName,
    trainingDayLabel: d.trainingDayLabel || undefined,
    plannedExercises: d.plannedExercises.map<RegisterPlannedExercise>(
      (pe, j) => ({
        exerciseId: pe.exerciseId,
        order: j,
        exerciseExecutions: pe.exerciseExecutions.map((e, k) => ({
          weekNumber: k + 1,
          sets: e.sets,
          reps: e.reps,
          rir: e.rir || undefined,
        })),
      }),
    ),
  }));
}

export type BuildRegisterTrainingPlanResult =
  | { kind: "plan"; memberId: string; dto: RegisterTrainingPlan }
  | { kind: "template"; dto: RegisterTrainingPlanTemplate };

export function buildRegisterTrainingPlanPayload(
  values: RegisterTrainingPlanFormSchema,
): BuildRegisterTrainingPlanResult {
  const trainingDays = toRegisterTrainingDays(values);
  const baseDto = {
    startDate: values.startDate,
    durationInWeeks: values.durationInWeeks,
    daysPerWeek: values.daysPerWeek,
    mobilityBlock: values.mobilityBlock,
    preparatoryBlock: values.preparatoryBlock,
    aerobicBlock: values.aerobicBlock,
    trainingDays,
  };

  if (values.mode === "plan") {
    return { kind: "plan", memberId: values.memberId, dto: baseDto };
  }

  return {
    kind: "template",
    dto: { ...baseDto, templateName: values.templateName },
  };
}
