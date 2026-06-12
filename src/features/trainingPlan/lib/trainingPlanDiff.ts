import type {
  RegisterExerciseExecutionFormSchema,
  RegisterPlannedExerciseFormSchema,
  RegisterTrainingDayFormSchema,
  RegisterTrainingPlanFormSchema,
} from "../schemas/registerTrainingPlan.schema";
import type { DayName } from "../constants";
import type {
  UpdateExerciseExecution,
  UpdateTrainingDay,
  UpdateTrainingPlan,
} from "../types";

export type DayRef = { dayId: string } | { newDayName: DayName };

export type TrainingPlanOp =
  | { kind: "updatePlan"; dto: UpdateTrainingPlan }
  | { kind: "updateDay"; dayId: string; dto: UpdateTrainingDay }
  | { kind: "addDay"; dayName: DayName; trainingDayLabel?: string }
  | { kind: "deleteDay"; dayId: string }
  | { kind: "deleteExercise"; plannedExerciseId: string }
  | {
      kind: "addExercise";
      dayRef: DayRef;
      exerciseId: string;
      executions: RegisterExerciseExecutionFormSchema[];
    }
  | {
      kind: "updateExecution";
      executionId: string;
      dto: UpdateExerciseExecution;
    };

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function buildMetaDto(
  snapshot: RegisterTrainingPlanFormSchema,
  next: RegisterTrainingPlanFormSchema,
): UpdateTrainingPlan | null {
  const dto: UpdateTrainingPlan = {};

  if (snapshot.startDate !== next.startDate) dto.startDate = next.startDate;
  if (snapshot.mobilityBlock !== next.mobilityBlock)
    dto.mobilityBlock = next.mobilityBlock;
  if (snapshot.preparatoryBlock !== next.preparatoryBlock)
    dto.preparatoryBlock = next.preparatoryBlock;
  if (snapshot.aerobicBlock !== next.aerobicBlock)
    dto.aerobicBlock = next.aerobicBlock;

  if (next.mode === "template" && snapshot.mode === "template") {
    if (
      normalizeText(snapshot.templateName) !== normalizeText(next.templateName)
    ) {
      dto.templateName = normalizeText(next.templateName);
    }
  }

  return Object.keys(dto).length === 0 ? null : dto;
}

function buildDayUpdateDto(
  snapshotDay: RegisterTrainingDayFormSchema,
  nextDay: RegisterTrainingDayFormSchema,
): UpdateTrainingDay | null {
  const dto: UpdateTrainingDay = {};
  if (snapshotDay.dayName !== nextDay.dayName) dto.dayName = nextDay.dayName;
  if (
    normalizeText(snapshotDay.trainingDayLabel) !==
    normalizeText(nextDay.trainingDayLabel)
  ) {
    dto.trainingDayLabel = normalizeText(nextDay.trainingDayLabel);
  }
  return Object.keys(dto).length === 0 ? null : dto;
}

function buildExecutionDto(
  snapshotExec: RegisterExerciseExecutionFormSchema,
  nextExec: RegisterExerciseExecutionFormSchema,
): UpdateExerciseExecution | null {
  const dto: UpdateExerciseExecution = {};
  if (snapshotExec.sets !== nextExec.sets) dto.sets = nextExec.sets;
  if (snapshotExec.reps !== nextExec.reps) dto.reps = nextExec.reps;
  if (normalizeText(snapshotExec.rir) !== normalizeText(nextExec.rir)) {
    dto.rir = normalizeText(nextExec.rir);
  }
  return Object.keys(dto).length === 0 ? null : dto;
}

function dayRefFor(day: RegisterTrainingDayFormSchema): DayRef {
  return day.id ? { dayId: day.id } : { newDayName: day.dayName };
}

function diffExistingDayExercises(
  snapshotDay: RegisterTrainingDayFormSchema,
  nextDay: RegisterTrainingDayFormSchema,
  ops: TrainingPlanOp[],
): void {
  const snapshotPeById = new Map<string, RegisterPlannedExerciseFormSchema>(
    snapshotDay.plannedExercises
      .filter((pe) => pe.id)
      .map((pe) => [pe.id as string, pe]),
  );
  const nextPeIds = new Set(
    nextDay.plannedExercises.filter((pe) => pe.id).map((pe) => pe.id as string),
  );

  for (const snapshotPe of snapshotDay.plannedExercises) {
    if (snapshotPe.id && !nextPeIds.has(snapshotPe.id)) {
      ops.push({ kind: "deleteExercise", plannedExerciseId: snapshotPe.id });
    }
  }

  for (const nextPe of nextDay.plannedExercises) {
    if (!nextPe.id) {
      ops.push({
        kind: "addExercise",
        dayRef: dayRefFor(nextDay),
        exerciseId: nextPe.exerciseId,
        executions: nextPe.exerciseExecutions,
      });
      continue;
    }

    const snapshotPe = snapshotPeById.get(nextPe.id);
    if (!snapshotPe) continue;

    const snapshotExecById = new Map<
      string,
      RegisterExerciseExecutionFormSchema
    >(
      snapshotPe.exerciseExecutions
        .filter((e) => e.id)
        .map((e) => [e.id as string, e]),
    );

    for (const nextExec of nextPe.exerciseExecutions) {
      if (!nextExec.id) continue;
      const snapshotExec = snapshotExecById.get(nextExec.id);
      if (!snapshotExec) continue;
      const dto = buildExecutionDto(snapshotExec, nextExec);
      if (dto) {
        ops.push({ kind: "updateExecution", executionId: nextExec.id, dto });
      }
    }
  }
}

export function buildTrainingPlanOps(
  snapshot: RegisterTrainingPlanFormSchema,
  next: RegisterTrainingPlanFormSchema,
): TrainingPlanOp[] {
  const ops: TrainingPlanOp[] = [];

  const metaDto = buildMetaDto(snapshot, next);
  if (metaDto) ops.push({ kind: "updatePlan", dto: metaDto });

  const snapshotDayById = new Map<string, RegisterTrainingDayFormSchema>(
    snapshot.trainingDays.filter((d) => d.id).map((d) => [d.id as string, d]),
  );
  const nextDayIds = new Set(
    next.trainingDays.filter((d) => d.id).map((d) => d.id as string),
  );

  for (const nextDay of next.trainingDays) {
    if (!nextDay.id) continue;
    const snapshotDay = snapshotDayById.get(nextDay.id);
    if (!snapshotDay) continue;

    const dayDto = buildDayUpdateDto(snapshotDay, nextDay);
    if (dayDto) ops.push({ kind: "updateDay", dayId: nextDay.id, dto: dayDto });

    diffExistingDayExercises(snapshotDay, nextDay, ops);
  }

  for (const snapshotDay of snapshot.trainingDays) {
    if (snapshotDay.id && !nextDayIds.has(snapshotDay.id)) {
      ops.push({ kind: "deleteDay", dayId: snapshotDay.id });
    }
  }

  for (const nextDay of next.trainingDays) {
    if (nextDay.id) continue;
    ops.push({
      kind: "addDay",
      dayName: nextDay.dayName,
      trainingDayLabel: normalizeText(nextDay.trainingDayLabel) || undefined,
    });
    for (const nextPe of nextDay.plannedExercises) {
      ops.push({
        kind: "addExercise",
        dayRef: { newDayName: nextDay.dayName },
        exerciseId: nextPe.exerciseId,
        executions: nextPe.exerciseExecutions,
      });
    }
  }

  return ops;
}
