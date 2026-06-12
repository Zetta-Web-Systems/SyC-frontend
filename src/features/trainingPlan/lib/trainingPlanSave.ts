import {
  addPlannedExercise,
  addTrainingDay,
  deletePlannedExercise,
  deleteTrainingDay,
  reorderPlannedExercises,
  reorderTrainingDays,
  updateExerciseExecution,
  updateTrainingDay,
  updateTrainingPlan,
} from "../services/trainingPlans.api";
import type {
  RegisterTrainingDayFormSchema,
  RegisterTrainingPlanFormSchema,
} from "../schemas/registerTrainingPlan.schema";
import {
  buildTrainingPlanOps,
  type DayRef,
  type TrainingPlanOp,
} from "./trainingPlanDiff";

type WorkingDays = RegisterTrainingDayFormSchema[];

interface ExecuteSaveParams {
  planId: string;
  snapshot: RegisterTrainingPlanFormSchema;
  next: RegisterTrainingPlanFormSchema;
}

function normalizeRir(rir: string | undefined): string {
  return (rir ?? "").trim();
}

function resolveDayId(ref: DayRef, working: WorkingDays): string | undefined {
  if ("dayId" in ref) return ref.dayId;
  return working.find((d) => d.dayName === ref.newDayName)?.id;
}

function matchWorkingDay(
  working: WorkingDays,
  day: RegisterTrainingDayFormSchema,
): RegisterTrainingDayFormSchema | undefined {
  if (day.id) return working.find((w) => w.id === day.id);
  return working.find((w) => w.dayName === day.dayName);
}

function sameOrder(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

async function runOp(
  planId: string,
  op: TrainingPlanOp,
  working: WorkingDays,
): Promise<void> {
  switch (op.kind) {
    case "updatePlan": {
      await updateTrainingPlan(planId, op.dto);
      return;
    }
    case "updateDay": {
      await updateTrainingDay(op.dayId, op.dto);
      const day = working.find((w) => w.id === op.dayId);
      if (day) {
        if (op.dto.dayName) day.dayName = op.dto.dayName;
        if (op.dto.trainingDayLabel !== undefined) {
          day.trainingDayLabel = op.dto.trainingDayLabel;
        }
      }
      return;
    }
    case "deleteDay": {
      await deleteTrainingDay(op.dayId);
      const index = working.findIndex((w) => w.id === op.dayId);
      if (index >= 0) working.splice(index, 1);
      return;
    }
    case "addDay": {
      const plan = await addTrainingDay(planId, {
        dayName: op.dayName,
        trainingDayLabel: op.trainingDayLabel,
      });
      const created = plan.trainingDays.find((d) => d.dayName === op.dayName);
      working.push({
        id: created?.id,
        order: working.length,
        dayName: op.dayName,
        trainingDayLabel: op.trainingDayLabel ?? "",
        plannedExercises: [],
      });
      return;
    }
    case "deleteExercise": {
      await deletePlannedExercise(op.plannedExerciseId);
      for (const day of working) {
        const index = day.plannedExercises.findIndex(
          (pe) => pe.id === op.plannedExerciseId,
        );
        if (index >= 0) {
          day.plannedExercises.splice(index, 1);
          break;
        }
      }
      return;
    }
    case "addExercise": {
      const dayId = resolveDayId(op.dayRef, working);
      if (!dayId) {
        throw new Error("No se pudo resolver el día del ejercicio a agregar");
      }
      const plan = await addPlannedExercise(dayId, {
        exerciseId: op.exerciseId,
      });
      const day = plan.trainingDays.find((d) => d.id === dayId);
      const createdPe = day?.plannedExercises.find(
        (pe) => pe.exercise.id === op.exerciseId,
      );
      const createdExecs = [...(createdPe?.exerciseExecutions ?? [])].sort(
        (a, b) => a.weekNumber - b.weekNumber,
      );
      const inputs = [...op.executions].sort(
        (a, b) => a.weekNumber - b.weekNumber,
      );

      for (let i = 0; i < createdExecs.length; i++) {
        const exec = createdExecs[i];
        const input = inputs[i];
        if (!input) continue;
        await updateExerciseExecution(exec.id, {
          sets: input.sets,
          reps: input.reps,
          rir: normalizeRir(input.rir),
        });
      }

      const workingDay = working.find((w) => w.id === dayId);
      if (workingDay) {
        workingDay.plannedExercises.push({
          id: createdPe?.id,
          exerciseId: op.exerciseId,
          order: workingDay.plannedExercises.length,
          exerciseExecutions: createdExecs.map((exec, i) => ({
            id: exec.id,
            weekNumber: i + 1,
            sets: inputs[i]?.sets ?? exec.sets,
            reps: inputs[i]?.reps ?? exec.reps,
            rir: normalizeRir(inputs[i]?.rir),
          })),
        });
      }
      return;
    }
    case "updateExecution": {
      await updateExerciseExecution(op.executionId, op.dto);
      for (const day of working) {
        for (const pe of day.plannedExercises) {
          const exec = pe.exerciseExecutions.find(
            (e) => e.id === op.executionId,
          );
          if (exec) {
            if (op.dto.sets !== undefined) exec.sets = op.dto.sets;
            if (op.dto.reps !== undefined) exec.reps = op.dto.reps;
            if (op.dto.rir !== undefined) exec.rir = op.dto.rir;
          }
        }
      }
      return;
    }
  }
}

async function runReorders(
  planId: string,
  working: WorkingDays,
  next: RegisterTrainingPlanFormSchema,
): Promise<boolean> {
  let reordered = false;

  for (const nextDay of next.trainingDays) {
    const workingDay = matchWorkingDay(working, nextDay);
    if (!workingDay?.id) continue;

    const desired: string[] = [];
    for (const pe of nextDay.plannedExercises) {
      const id =
        pe.id ??
        workingDay.plannedExercises.find((w) => w.exerciseId === pe.exerciseId)
          ?.id;
      if (id) desired.push(id);
    }
    const current = workingDay.plannedExercises
      .map((pe) => pe.id)
      .filter((id): id is string => !!id);

    if (
      desired.length === workingDay.plannedExercises.length &&
      desired.length > 1 &&
      !sameOrder(desired, current)
    ) {
      await reorderPlannedExercises(workingDay.id, { exerciseIds: desired });
      workingDay.plannedExercises.sort(
        (a, b) => desired.indexOf(a.id ?? "") - desired.indexOf(b.id ?? ""),
      );
      reordered = true;
    }
  }

  const desiredDays: string[] = [];
  for (const nextDay of next.trainingDays) {
    const workingDay = matchWorkingDay(working, nextDay);
    if (workingDay?.id) desiredDays.push(workingDay.id);
  }
  const currentDays = working
    .map((w) => w.id)
    .filter((id): id is string => !!id);

  if (
    desiredDays.length === working.length &&
    desiredDays.length > 1 &&
    !sameOrder(desiredDays, currentDays)
  ) {
    await reorderTrainingDays(planId, { dayIds: desiredDays });
    reordered = true;
  }

  return reordered;
}

export async function executeTrainingPlanSave({
  planId,
  snapshot,
  next,
}: ExecuteSaveParams): Promise<boolean> {
  const ops = buildTrainingPlanOps(snapshot, next);
  const working: WorkingDays = structuredClone(snapshot.trainingDays);

  for (const op of ops) {
    await runOp(planId, op, working);
  }

  const reordered = await runReorders(planId, working, next);
  return ops.length > 0 || reordered;
}
