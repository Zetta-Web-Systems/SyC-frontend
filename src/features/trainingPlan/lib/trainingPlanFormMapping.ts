import { formatDateToISO } from "@shared/utils/date.utils";
import type { RegisterTrainingPlanFormSchema } from "../schemas/registerTrainingPlan.schema";
import { DayName, PlanState } from "../constants";
import type { TrainingPlan } from "../types";

export function trainingPlanToFormValues(
  plan: TrainingPlan,
): RegisterTrainingPlanFormSchema {
  const trainingDays = [...plan.trainingDays]
    .sort((a, b) => a.order - b.order)
    .map((day, dayIndex) => ({
      id: day.id,
      order: dayIndex,
      dayName: (day.dayName ?? DayName.MONDAY) as DayName,
      trainingDayLabel: day.trainingDayLabel ?? "",
      plannedExercises: [...day.plannedExercises]
        .sort((a, b) => a.order - b.order)
        .map((pe, peIndex) => ({
          id: pe.id,
          exerciseId: pe.exercise.id,
          order: peIndex,
          exerciseExecutions: [...pe.exerciseExecutions]
            .sort((a, b) => a.weekNumber - b.weekNumber)
            .map((exec) => ({
              id: exec.id,
              weekNumber: exec.weekNumber,
              sets: exec.sets,
              reps: exec.reps,
              rir: exec.rir ?? "",
            })),
        })),
    }));

  const base = {
    startDate: plan.startDate ?? formatDateToISO(new Date()),
    durationInWeeks: plan.durationInWeeks,
    daysPerWeek: plan.daysPerWeek,
    mobilityBlock: plan.mobilityBlock,
    preparatoryBlock: plan.preparatoryBlock,
    aerobicBlock: plan.aerobicBlock,
    trainingDays,
  };

  if (plan.state === PlanState.TEMPLATE) {
    return {
      mode: "template",
      templateName: plan.templateName ?? "",
      ...base,
    };
  }

  return {
    mode: "plan",
    memberId: plan.member?.id ?? "",
    ...base,
  };
}
