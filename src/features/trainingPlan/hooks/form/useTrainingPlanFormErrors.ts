import { useMemo } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import type { DayName } from "../../constants";
import type { RegisterTrainingPlanFormSchema } from "../../schemas/registerTrainingPlan.schema";

interface MetaErrors {
  startDate?: string;
  durationInWeeks?: string;
  daysPerWeek?: string;
  memberId?: string;
  templateName?: string;
  mobilityBlock?: string;
  preparatoryBlock?: string;
  aerobicBlock?: string;
}

interface ExerciseErrorBucket {
  exerciseId?: string;
  executions?: string;
}

interface DayErrorBucket {
  root?: string;
  exercises: Map<number, ExerciseErrorBucket>;
}

interface FirstErrorLocation {
  dayName?: DayName;
  exerciseOrder?: number;
}

export interface TrainingPlanFormErrors {
  meta: MetaErrors;
  trainingDaysRoot?: string;
  byDay: Map<DayName, DayErrorBucket>;
  hasAnyError: boolean;
  firstErrorLocation?: FirstErrorLocation;
}

function readMessage(err: unknown): string | undefined {
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return undefined;
}

export function useTrainingPlanFormErrors(): TrainingPlanFormErrors {
  const { control, getValues } =
    useFormContext<RegisterTrainingPlanFormSchema>();
  const { errors } = useFormState({ control });

  return useMemo(() => {
    const typedErrors = errors as FieldErrors<RegisterTrainingPlanFormSchema>;
    const meta: MetaErrors = {
      startDate: readMessage(typedErrors.startDate),
      durationInWeeks: readMessage(typedErrors.durationInWeeks),
      daysPerWeek: readMessage(typedErrors.daysPerWeek),
      mobilityBlock: readMessage(typedErrors.mobilityBlock),
      preparatoryBlock: readMessage(typedErrors.preparatoryBlock),
      aerobicBlock: readMessage(typedErrors.aerobicBlock),
    };

    if ("memberId" in typedErrors) {
      meta.memberId = readMessage(
        (typedErrors as { memberId?: unknown }).memberId,
      );
    }
    if ("templateName" in typedErrors) {
      meta.templateName = readMessage(
        (typedErrors as { templateName?: unknown }).templateName,
      );
    }

    const trainingDaysRaw = typedErrors.trainingDays as unknown;
    let trainingDaysRoot: string | undefined;
    if (trainingDaysRaw && typeof trainingDaysRaw === "object") {
      trainingDaysRoot =
        readMessage((trainingDaysRaw as { root?: unknown }).root) ??
        readMessage(trainingDaysRaw);
    }

    const byDay = new Map<DayName, DayErrorBucket>();
    const currentDays = getValues("trainingDays") ?? [];

    const indexedErrors = Array.isArray(trainingDaysRaw)
      ? (trainingDaysRaw as Array<Record<string, unknown> | undefined>)
      : [];

    indexedErrors.forEach((dayErr, dayIndex) => {
      if (!dayErr) return;
      const day = currentDays[dayIndex];
      if (!day) return;

      const bucket: DayErrorBucket = byDay.get(day.dayName) ?? {
        exercises: new Map(),
      };

      const plannedExercisesErr = dayErr.plannedExercises as
        | { root?: unknown; message?: unknown }
        | Array<Record<string, unknown> | undefined>
        | undefined;

      const dayLevelMessage =
        readMessage(dayErr) ??
        (plannedExercisesErr && !Array.isArray(plannedExercisesErr)
          ? (readMessage((plannedExercisesErr as { root?: unknown }).root) ??
            readMessage(plannedExercisesErr))
          : undefined);

      if (dayLevelMessage) bucket.root = dayLevelMessage;

      if (Array.isArray(plannedExercisesErr)) {
        plannedExercisesErr.forEach((peErr, peIndex) => {
          if (!peErr) return;
          const planned = day.plannedExercises[peIndex];
          if (!planned) return;

          const exBucket: ExerciseErrorBucket =
            bucket.exercises.get(planned.order) ?? {};

          const exerciseIdMessage = readMessage(
            (peErr as { exerciseId?: unknown }).exerciseId,
          );
          if (exerciseIdMessage) exBucket.exerciseId = exerciseIdMessage;

          const execsErr = (peErr as { exerciseExecutions?: unknown })
            .exerciseExecutions;
          let execsMessage: string | undefined;
          if (execsErr && typeof execsErr === "object") {
            execsMessage =
              readMessage((execsErr as { root?: unknown }).root) ??
              readMessage(execsErr);

            if (!execsMessage && Array.isArray(execsErr)) {
              for (const item of execsErr) {
                if (!item) continue;
                const weekMsg = readMessage(
                  (item as { weekNumber?: unknown }).weekNumber,
                );
                const setsMsg = readMessage((item as { sets?: unknown }).sets);
                const repsMsg = readMessage((item as { reps?: unknown }).reps);
                execsMessage = weekMsg ?? setsMsg ?? repsMsg;
                if (execsMessage) break;
              }
            }
          }
          if (execsMessage) exBucket.executions = execsMessage;

          if (exBucket.exerciseId || exBucket.executions) {
            bucket.exercises.set(planned.order, exBucket);
          }
        });
      }

      if (bucket.root || bucket.exercises.size > 0) {
        byDay.set(day.dayName, bucket);
      }
    });

    let firstErrorLocation: FirstErrorLocation | undefined;
    if (
      meta.memberId ||
      meta.templateName ||
      meta.startDate ||
      meta.durationInWeeks ||
      meta.daysPerWeek ||
      meta.mobilityBlock ||
      meta.preparatoryBlock ||
      meta.aerobicBlock
    ) {
      firstErrorLocation = {};
    } else if (trainingDaysRoot && currentDays.length === 0) {
      firstErrorLocation = {};
    } else {
      for (const day of currentDays) {
        const bucket = byDay.get(day.dayName);
        if (!bucket) continue;
        if (bucket.root) {
          firstErrorLocation = { dayName: day.dayName };
          break;
        }
        const firstExOrder = [...bucket.exercises.keys()].sort(
          (a, b) => a - b,
        )[0];
        if (firstExOrder !== undefined) {
          firstErrorLocation = {
            dayName: day.dayName,
            exerciseOrder: firstExOrder,
          };
          break;
        }
      }
      if (!firstErrorLocation && trainingDaysRoot) {
        firstErrorLocation = {};
      }
    }

    const hasAnyError =
      Boolean(meta.startDate) ||
      Boolean(meta.durationInWeeks) ||
      Boolean(meta.daysPerWeek) ||
      Boolean(meta.memberId) ||
      Boolean(meta.templateName) ||
      Boolean(meta.mobilityBlock) ||
      Boolean(meta.preparatoryBlock) ||
      Boolean(meta.aerobicBlock) ||
      Boolean(trainingDaysRoot) ||
      byDay.size > 0;

    return {
      meta,
      trainingDaysRoot,
      byDay,
      hasAnyError,
      firstErrorLocation,
    };
  }, [errors, getValues]);
}
