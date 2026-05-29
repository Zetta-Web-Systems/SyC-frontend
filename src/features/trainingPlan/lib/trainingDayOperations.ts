import type {
  RegisterPlannedExerciseFormSchema,
  RegisterTrainingDayFormSchema,
} from "../schemas/registerTrainingPlan.schema";
import type { DayName } from "../constants";
import { sortDays } from "./dayOrder";
import { defaultExecs, syncExecsToDuration } from "./defaultExecs";

export function recomputeDayOrders(
  days: RegisterTrainingDayFormSchema[],
): RegisterTrainingDayFormSchema[] {
  const sorted = sortDays(days);
  return days.map((d) => ({
    ...d,
    order: sorted.findIndex((s) => s.dayName === d.dayName),
  }));
}

export function appendDay(
  days: RegisterTrainingDayFormSchema[],
  dayName: DayName,
): RegisterTrainingDayFormSchema[] {
  const newDay: RegisterTrainingDayFormSchema = {
    order: 0,
    dayName,
    trainingDayLabel: "",
    plannedExercises: [],
  };
  return [...days, newDay];
}

export function removeDayByName(
  days: RegisterTrainingDayFormSchema[],
  dayName: DayName,
): RegisterTrainingDayFormSchema[] {
  return days.filter((d) => d.dayName !== dayName);
}

export function renameDay(
  days: RegisterTrainingDayFormSchema[],
  from: DayName,
  to: DayName,
): RegisterTrainingDayFormSchema[] {
  if (from === to) return days;
  if (days.some((d) => d.dayName === to)) return days;
  return days.map((d) => (d.dayName === from ? { ...d, dayName: to } : d));
}

export function setDayLabel(
  days: RegisterTrainingDayFormSchema[],
  dayName: DayName,
  label: string,
): RegisterTrainingDayFormSchema[] {
  return days.map((d) =>
    d.dayName === dayName ? { ...d, trainingDayLabel: label } : d,
  );
}

export function duplicateDayInto(
  days: RegisterTrainingDayFormSchema[],
  sourceDayName: DayName,
  targetDayName: DayName,
  durationInWeeks: number,
): RegisterTrainingDayFormSchema[] {
  const source = days.find((d) => d.dayName === sourceDayName);
  if (!source) return days;
  const copy: RegisterTrainingDayFormSchema = {
    order: 0,
    dayName: targetDayName,
    trainingDayLabel: source.trainingDayLabel ?? "",
    plannedExercises: source.plannedExercises.map((pe) => ({
      ...pe,
      exerciseExecutions: syncExecsToDuration(
        pe.exerciseExecutions.map((e) => ({ ...e })),
        durationInWeeks,
      ),
    })),
  };
  return [...days, copy];
}

export function appendExerciseToDay(
  days: RegisterTrainingDayFormSchema[],
  dayName: DayName,
  exerciseId: string,
  durationInWeeks: number,
): RegisterTrainingDayFormSchema[] {
  return days.map((d) => {
    if (d.dayName !== dayName) return d;
    const nextEx: RegisterPlannedExerciseFormSchema = {
      exerciseId,
      order: d.plannedExercises.length,
      exerciseExecutions: defaultExecs(durationInWeeks),
    };
    return { ...d, plannedExercises: [...d.plannedExercises, nextEx] };
  });
}

export function replaceExerciseInDay(
  days: RegisterTrainingDayFormSchema[],
  dayName: DayName,
  exerciseOrder: number,
  next: RegisterPlannedExerciseFormSchema,
): RegisterTrainingDayFormSchema[] {
  return days.map((d) => {
    if (d.dayName !== dayName) return d;
    return {
      ...d,
      plannedExercises: d.plannedExercises.map((pe) =>
        pe.order === exerciseOrder ? { ...next, order: exerciseOrder } : pe,
      ),
    };
  });
}

export function removeExerciseFromDay(
  days: RegisterTrainingDayFormSchema[],
  dayName: DayName,
  exerciseOrder: number,
): RegisterTrainingDayFormSchema[] {
  return days.map((d) => {
    if (d.dayName !== dayName) return d;
    const filtered = d.plannedExercises
      .filter((pe) => pe.order !== exerciseOrder)
      .map((pe, i) => ({ ...pe, order: i }));
    return { ...d, plannedExercises: filtered };
  });
}

export function reorderExercisesInDay(
  days: RegisterTrainingDayFormSchema[],
  dayName: DayName,
  fromOrder: number,
  toOrder: number,
): RegisterTrainingDayFormSchema[] {
  if (fromOrder === toOrder) return days;
  return days.map((d) => {
    if (d.dayName !== dayName) return d;
    const fromIdx = d.plannedExercises.findIndex(
      (pe) => pe.order === fromOrder,
    );
    const toIdx = d.plannedExercises.findIndex((pe) => pe.order === toOrder);
    if (fromIdx < 0 || toIdx < 0) return d;
    const next = [...d.plannedExercises];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    return {
      ...d,
      plannedExercises: next.map((pe, i) => ({ ...pe, order: i })),
    };
  });
}

export function duplicateExerciseInDay(
  days: RegisterTrainingDayFormSchema[],
  dayName: DayName,
  exerciseOrder: number,
): RegisterTrainingDayFormSchema[] {
  return days.map((d) => {
    if (d.dayName !== dayName) return d;
    const idx = d.plannedExercises.findIndex(
      (pe) => pe.order === exerciseOrder,
    );
    if (idx < 0) return d;
    const source = d.plannedExercises[idx];
    const copy: RegisterPlannedExerciseFormSchema = {
      ...source,
      exerciseExecutions: source.exerciseExecutions.map((e) => ({ ...e })),
    };
    const next = [...d.plannedExercises];
    next.splice(idx + 1, 0, copy);
    return {
      ...d,
      plannedExercises: next.map((pe, i) => ({ ...pe, order: i })),
    };
  });
}
